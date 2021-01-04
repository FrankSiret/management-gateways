import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { addDevice } from '../redux/devices/devicesActions';

const DeviceModal = ({ gatewayId, modal, setModal }) => {

    const [uid, setUid] = useState('')
    const [vendor, setVendor] = useState('')
    const [status, setStatus] = useState('online')
    const [date_created, setDate_created] = useState('')

    const dispatch = useDispatch()

    const addClick = () => {

        dispatch(addDevice(gatewayId, {
            uid,
            vendor,
            status,
            date_created
        }))

        setUid('')
        setVendor('')
        setStatus('online')
        setDate_created('')

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
                        <Input type="text" name="uid" id="uid" placeholder="UID"
                            value={uid} onChange={(e) => setUid(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input type="text" name="vendor" id="vendor" placeholder="Vendor"
                            value={vendor} onChange={(e) => setVendor(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="status">Status</Label>
                        <Input type="select" name="select" id="status"
                            value={status} onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="online">online</option>
                            <option value="offline">offline</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="date_created">Date</Label>
                        <Input
                            type="date"
                            name="date"
                            id="date_created"
                            placeholder="Date"
                            value={date_created} onChange={(e) => setDate_created(e.target.value)}
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

export default DeviceModal;