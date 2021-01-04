import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { addGateway } from '../redux/gateways/gatewaysActions';

const GatewayModal = ({ modal, setModal }) => {

	const [serial_number, setSerial_number] = useState('')
	const [readable_name, setReadable_name] = useState('')
	const [ipv4_address, setIpv4_address] = useState('')

	const dispatch = useDispatch()

	const addClick = () => {

		dispatch(addGateway({
			serial_number,
			readable_name,
			ipv4_address
		}))

		setSerial_number('')
		setReadable_name('')
		setIpv4_address('')

		setModal(false)
	}

	const cancelClick = () => {
		setModal(false)
	}

	return (
		<Modal isOpen={modal} toggle={cancelClick} >
			<ModalHeader toggle={cancelClick}>Gateway</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup>
						<Input type="text" name="serial_number" id="serial_number" placeholder="Serial Number"
							value={serial_number} onChange={(e) => setSerial_number(e.target.value)}
						/>
					</FormGroup>
					<FormGroup>
						<Input type="text" name="readable_name" id="readable_name" placeholder="Readable Name"
							value={readable_name} onChange={(e) => setReadable_name(e.target.value)}
						/>
					</FormGroup>
					<FormGroup>
						<Input type="text" name="ipv4_address" id="ipv4_address" placeholder="IPv4 Address"
							value={ipv4_address} onChange={(e) => setIpv4_address(e.target.value)}
						/>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={addClick}>Add</Button>{' '}
				<Button color="secondary" onClick={cancelClick}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
}

export default GatewayModal;