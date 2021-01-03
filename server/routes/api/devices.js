const express = require('express')
const router = express.Router()

const GatewayModel = require('../../models/gateways.model')
const DeviceModel = require('../../models/devices.model')

// @route   DELETE api/v1/gateways/:id/devices/:device
// @desc    Delete A Peripheral Device From A Specified Gateway
// @access  Public
router.delete('/:id', async (req, res) => {
	const _id = req.params.id;

	let device;

	try {
		device = await DeviceModel.findById(_id);
		if (!device) throw new Error()
	}
	catch (err) {
		res.status(404).json({
			success: false,
			msg: `Peripheral device object '${_id}' not found`
		})
	}

	try {
		const { gatewayId } = device
		const gateway = await GatewayModel.findById(gatewayId)
		if (gateway && gateway.devices) {
			gateway.devices = gateway.devices.filter(device => device != _id)
			await gateway.save()
		}
		await device.delete()
		res.status({ success: true, msg: 'Peripheral device deleted successfully' })
	}
	catch (err) {
		res.status(400).json({
			success: false,
			msg: err.message
		});
	}
})

module.exports = router