import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"

import {
    Badge,
    Collapse,
    Button
} from 'reactstrap';

import './styles/Gateway.css'

const Gateway = ({ _id, serial_number, readable_name, ipv4_address, devices, isActive, setIsActive }) => {

    const [isExpanded, setIsExpanded] = useState(false)

    const toggle = () => {
        if (isActive == _id)
            setIsExpanded(!isExpanded)
        else if (!isExpanded)
            setIsExpanded(!isExpanded)
        setIsActive(_id)
    }

    return (
        <div className={isActive == _id ? "gateway active" : "gateway"}>
            <div onClick={() => toggle()} className={isExpanded ? "gateway-header expanded" : "gateway-header"}>
                <div>Serial Number: <span className="item-span">{serial_number}</span></div>
            </div>
            <Collapse isOpen={isActive == _id}>
                <li className="gateway-list">
                    <ul className="gateway-list-item">Readable Name: <span className="item-span">{readable_name}</span></ul>
                    <ul className="gateway-list-item">IPv4 Address: <span className="item-span">{ipv4_address}</span></ul>
                    <ul className="gateway-list-item">Devices: <span className="item-span">[<Badge color="primary" pill>{devices.length}</Badge>]</span></ul>
                </li>
            </Collapse>
        </div>
    )
}

export default Gateway
