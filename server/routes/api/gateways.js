const express = require('express')
const router = express.Router()

const GatewayModel = require('../../models/gateways.model')
const DeviceModel = require('../../models/devices.model')

// @route   GET api/v1/gateways
// @desc    Get All Gateways
// @access  Public
router.get('/', (req, res) => {
	GatewayModel.find()
		.select('-__v')
		.populate({ path: 'devices', select: '-__v -gatewayId' })
		.exec()
		.then(gateways => res.json({
			gateways
		}))
		.catch(err => res.status(400).send({
			msg: err.message
		}))
})

// @route   POST api/v1/gateways
// @desc    Create A Gateway
// @access  Public
router.post('/', async (req, res) => {

	try {
		if (!req.is('application/json'))
			throw new Error(`Expect 'application/json'`)

		const { serial_number, readable_name, ipv4_address, devices } = req.body

		if (!serial_number || !readable_name || !ipv4_address)
			throw new Error('Enter all field')

		if (devices && devices instanceof Array)
			throw new Error('Gateway peripheral device must be an Array')

		if (devices && devices.length > 10)
			throw new Error('No more that 10 peripheral devices are allowed for a gateway')

		const newGateway = new GatewayModel({ serial_number, readable_name, ipv4_address });

		let gateway = await newGateway.save();
		const { _id } = gateway;

		let responsesDevices;

		if (devices) {
			const allDevices = devices.map((value) => {
				return new DeviceModel({ ...value, gatewayId: _id });
			})
			responsesDevices = await DeviceModel.insertMany(allDevices)
			gateway.devices.push(...responsesDevices.map(value => value._id))
			gateway = await newGateway.save()
		}

		res.status(201).json({
			success: true,
			gateway
		});
	}
	catch (err) {
		newGateway.delete();
		res.status(400).json({
			success: false,
			msg: err.message
		});
	}
})

// @route   GET api/v1/gateways/:id
// @desc    Get All Information For A Single Gateway
// @access  Public
router.get('/:id', (req, res) => {
	const _id = req.params.id;
	GatewayModel.findById(_id)
		.select('-__v')
		.populate({ path: 'devices', select: '-__v -gatewayId' })
		.exec()
		.then(gateway => res.json({
			gateway
		}))
		.catch(err => res.status(404).send({
			msg: `Gateway object '${_id}' not found`
		}))
})

// @route   POST api/v1/gateways/:id/devices
// @desc    Insert A Peripheral Device In A Specified Gateway
// @access  Public
router.post('/:id/devices', async (req, res) => {

	if (!req.is('application/json'))
		res.status(400).json({
			success: false,
			msg: `Expect 'application/json'`
		})

	const _id = req.params.id;

	let gateway;

	try {
		gateway = await GatewayModel.findById(_id);
		if (!gateway) throw new Error()
	}
	catch (err) {
		res.status(404).json({
			success: false,
			msg: `Gateway object '${_id}' not found`
		})
	}

	try {
		const { _id, devices } = gateway;

		if (devices.length >= 10)
			throw new Error('No more that 10 peripheral devices are allowed for a gateway')

		const { uid, vendor, date_created, status } = req.body

		if (!uid || !vendor || !status)
			throw new Error('Enter all field')

		const data = { uid, vendor, status }
		if (date_created) data.date_created = date_created
		const newDevice = new DeviceModel(data);
		newDevice.gatewayId = _id;
		const device = await newDevice.save();

		gateway.devices.push(device._id);
		gateway = await gateway.save();

		res.status(200).json({
			success: true,
			device
		});
	}
	catch (err) {
		res.status(400).json({
			success: false,
			msg: err.message
		});
	}
})

// @route   DELETE api/v1/gateways/:id/devices/:device
// @desc    Delete A Peripheral Device From A Specified Gateway
// @access  Public
router.delete('/:id/devices/:device', async (req, res) => {
	const _id = req.params.id;
	const _device = req.params.device;

	let gateway;

	try {
		gateway = await GatewayModel.findById(_id);
		if (!gateway) throw new Error()
	}
	catch (err) {
		res.status(404).json({
			success: false,
			msg: `Gateway object '${_id}' not found`
		})
	}

	try {
		const { _id, devices } = gateway;

		if (devices.length >= 10)
			throw new Error('No more that 10 peripheral devices are allowed for a gateway')

		const { uid, vendor, date_created, status } = req.body

		if (!uid || !vendor || !status)
			throw new Error('Enter all field')

		const data = { uid, vendor, status }
		if (date_created) data.date_created = date_created
		const newDevice = new DeviceModel(data);
		newDevice.gatewayId = _id;
		const device = await newDevice.save();

		gateway.devices.push(device._id);
		gateway = await gateway.save();

		res.status(200).json({
			success: true,
			device
		});
	}
	catch (err) {
		res.status(400).json({
			success: false,
			msg: err.message
		});
	}
})

module.exports = router;