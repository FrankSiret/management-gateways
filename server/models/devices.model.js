const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GatewayModel = require('./gateways.model');

const DeviceSchema = new Schema({
    uid: {
        type: Number,
        required: true,
        unique: true
    },
    vendor: {
        type: String,
        required: true,
        minLength: 1
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        require: true,
        enum: ['online', 'offline']
    },
    gatewayId: {
        type: Schema.Types.ObjectId,
        ref: 'Gateway'
    }
})

module.exports = DeviceModel = mongoose.model('Device', DeviceSchema);