import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"

import {
    Badge,
    Collapse,
    Button
} from 'reactstrap';
import { deleteDevice } from '../redux/devices/devicesActions';

import './styles/Device.css'

const Gateway = ({ _id, uid, vendor, status, date_created }) => {

    const [isExpanded, setIsExpanded] = useState(false)

    const toggle = () => {
        setIsExpanded(!isExpanded)
    }

    const [date, setDate] = useState(() => {
        let d = new Date(date_created)
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    })

    const dispatch = useDispatch()

    const deleteDeviceClick = () => {
        dispatch(deleteDevice(_id))
    }

    return (
        <div className="device">
            <div onClick={() => toggle()} className={isExpanded ? "device-header expanded" : "device-header"}>
                <div>UID: <span className="item-span">{uid}</span></div>
                <a onClick={deleteDeviceClick} className="device-eraser">&times;</a>
            </div>
            <Collapse isOpen={isExpanded}>
                <li className="device-list">
                    <ul className="device-list-item">Vendor: <span>{vendor}</span></ul>
                    <ul className="device-list-item">Status: <span>{status}</span></ul>
                    <ul className="device-list-item">Date Created: <span>{date}</span></ul>
                </li>
            </Collapse>
        </div>
    )
}

export default Gateway
