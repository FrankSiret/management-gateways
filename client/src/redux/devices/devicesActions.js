import { ADD_DEVICE, GET_DEVICES, DEVICES_LOADING, ERROR_DEVICES, DELETE_DEVICE } from './devicesTypes'
import axios from 'axios'

export const getDevices = (gateway_id) => dispatch => {
    dispatch({ type: DEVICES_LOADING })
    const page = `api/v1/gateways/${gateway_id}`
    axios
        .get(page)
        .then(res =>
            dispatch({
                type: GET_DEVICES,
                payload: res.data.gateway.devices
            })
        )
        .catch(err => {
            console.log(err.response)
            console.log(err.request)
            dispatch({
                type: ERROR_DEVICES,
                payload: { msg: err.response.data, status: err.response.status }
            })
        });
}

export const addDevice = (gateway_id, device) => dispatch => {
    const page = `api/v1/gateways/${gateway_id}/devices`
    console.log(gateway_id, device)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post(page, device, config)
        .then(res =>
            dispatch({
                type: ADD_DEVICE,
                payload: res.data.device
            })
        )
        .catch(err => {
            console.log(err.response)
            console.log(err.request)
            dispatch({
                type: ERROR_DEVICES,
                payload: { msg: err.response.data, status: err.response.status }
            })
        });
}

export const deleteDevice = device_id => dispatch => {
    const page = `api/v1/devices/${device_id}`
    axios
        .delete(page)
        .then(res =>
            dispatch({
                type: DELETE_DEVICE,
                payload: res.data.device
            })
        )
        .catch(err => {
            console.log(err.response)
            console.log(err.request)
            dispatch({
                type: ERROR_DEVICES,
                payload: { msg: err.response.data, status: err.response.status }
            })
        });
}