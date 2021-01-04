import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
	Container,
	Alert,
	Row,
	Col,
	Button
} from 'reactstrap';

import { getGateways } from '../redux/gateways/gatewaysActions';
import { getDevices } from '../redux/devices/devicesActions';

import Gateway from './Gateway'
import Device from './Device'

import './styles/GatewayList.css'
import GatewayModal from './GatewayModal';
import DeviceModal from './DeviceModal';

const GatewayList = () => {

	const loading_gw = useSelector(state => state.gateways.loading)
	const gateways = useSelector(state => state.gateways.gateways)
	const error_gw = useSelector(state => state.gateways.error)

	const loading_dv = useSelector(state => state.devices.loading)
	const devices = useSelector(state => state.devices.devices)
	const error_dv = useSelector(state => state.devices.error)

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getGateways())
	}, [])

	const [isActive, setIsActive] = useState(null)

	useEffect(() => {
		gateways.length > 0 && setIsActive(gateways[0]._id)
	}, [loading_gw])

	const [modalOpenGateway, setModalOpenGateway] = useState(false)
	const [modalOpenDevice, setModalOpenDevice] = useState(false)

	const createGateway = () => {
		setModalOpenGateway(!modalOpenGateway)
	}

	const createDevice = () => {
		setModalOpenDevice(!modalOpenDevice)
	}

	useEffect(() => {
		isActive &&
			dispatch(getDevices(isActive))
	}, [isActive])

	const [alerts, onDismissAlert] = useState({
		infoGateway: false,
		errorGateway: false,
		infoDevice: false,
		errorDevice: false
	})

	const setAlerts = (t) => {
		const res = { ...alerts }
		res[t] = false;
		onDismissAlert(res)
	}

	useEffect(() => {
		onDismissAlert(alert => ({ ...alert, infoGateway: true }))
	}, [loading_gw])
	useEffect(() => {
		onDismissAlert(alert => ({ ...alert, errorGateway: true }))
	}, [error_gw])
	useEffect(() => {
		onDismissAlert(alert => ({ ...alert, infoDevice: true }))
	}, [loading_dv])
	useEffect(() => {
		onDismissAlert(alert => ({ ...alert, errorDevice: true }))
	}, [error_dv])

	return (
		<>
			<GatewayModal modal={modalOpenGateway} setModal={setModalOpenGateway} />
			<DeviceModal gatewayId={isActive} modal={modalOpenDevice} setModal={setModalOpenDevice} />

			<Container>
				<Row>
					<Col md={6}>
						{loading_gw && <Alert color="primary" isOpen={alerts.infoGateway} toggle={() => setAlerts('infoGateway')}>Loading...</Alert>}
						{error_gw && <Alert color="danger" isOpen={alerts.errorGateway} toggle={() => setAlerts('errorGateway')}>{`${error_gw.status}: ${error_gw.msg.msg}`}</Alert>}
						<div>
							{
								gateways.map(gw => {
									return <Gateway
										key={gw._id}
										_id={gw._id}
										serial_number={gw.serial_number}
										readable_name={gw.readable_name}
										ipv4_address={gw.ipv4_address}
										devices={gw.devices}
										isActive={isActive}
										setIsActive={setIsActive}
									/>
								})
							}
						</div>
						{!loading_gw && <Button className="create-gateway" color="primary" block onClick={() => createGateway()}>Add new Gateway</Button>}
					</Col>
					<Col md={6}>
						{loading_dv && <Alert color="primary" isOpen={alerts.infoDevice} toggle={() => setAlerts('infoDevice')}>Loading...</Alert>}
						{error_dv && <Alert color="danger" isOpen={alerts.errorDevice} toggle={() => setAlerts('errorDevice')}>{`${error_dv.status}: ${error_dv.msg.msg}`}</Alert>}
						<div>
							{
								!loading_gw && devices.length
									? devices.map(dv => {
										return <Device
											key={dv._id}
											_id={dv._id}
											uid={dv.uid}
											vendor={dv.vendor}
											status={dv.status}
											date_created={dv.date_created}
										/>
									})
									: !loading_gw && !loading_dv &&
									<div className="none-devices">There are not peripheral devices</div>
							}
						</div>
						{!loading_dv && <Button className="create-gateway" color="primary" block onClick={() => createDevice()}>Add new Peripheral Device</Button>}
					</Col>
				</Row>
			</Container>
		</>
	)
}

export default GatewayList