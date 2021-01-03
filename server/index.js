const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('morgan')
const cors = require('cors')

const app = express()

// mongoose.Promise = global.Promise

// bodyparser middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: false }))

// connect to mongo
mongoose
    .connect(config.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('mongodb connected...'))
    .catch(err => console.log(err));

// other middleware
app.use(cors());
app.use(logger('dev'))

// use routes
app.use(`${config.API_PREFIX}/gateways`, require('./routes/api/gateways'));
app.use(`${config.API_PREFIX}/devices`, require('./routes/api/devices'));

// handling 404 not found
app.use((req, res, next) => {
    res.status(404).json({ msg: '404 URL not found' });
});

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
        return res.status(500).json({
            code: 500,
            msg: "Invalid data"
        });
    } else {
        next();
    }
});

// serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
if (config.ENV == 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

app.listen(config.PORT, () => console.log(`server started on port ${config.PORT}`));

module.exports = app

// npm install cors uuid mongodb mongoose mongoose-timestamp morgan