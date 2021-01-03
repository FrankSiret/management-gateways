const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DeviceModel = require('./devices.model');

const GatewaySchema = new Schema({
    serial_number: {
        type: String,
        required: true,
        unique: true,
        minLength: 1
    },
    readable_name: {
        type: String,
        required: true,
        minLength: 1
    },
    ipv4_address: {
        type: String,
        required: true,
        validate: {
            validator: ip => {
                return /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
            },
            message: ip => `'${ip.value}' is not a valid IPv4 address`
        }
    },
    devices: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    }
});

// GatewaySchema.methods.validateIp = () => {
//     const reg = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/
//     return reg.test(this.ipv4_address)
// }

module.exports = GatewayModel = mongoose.model('Gateway', GatewaySchema);