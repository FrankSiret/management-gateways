import {
    GET_GATEWAYS,
    ADD_GATEWAY,
    GATEWAYS_LOADING,
    ERROR_GATEWAYS
} from './gatewaysTypes';

import { DELETE_DEVICE, ADD_DEVICE } from '../devices/devicesTypes';

const initialState = {
    gateways: [],
    loading: false,
    error: null
};

const gatewaysReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_GATEWAYS:
            return {
                ...state,
                gateways: [...payload],
                loading: false,
                error: null
            };
        case ADD_GATEWAY:
            return {
                ...state,
                gateways: [...state.gateways, payload],
                error: null
            };
        case GATEWAYS_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ERROR_GATEWAYS:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case ADD_DEVICE:
            const _gateway = state.gateways.map(gateway => {
                let { devices } = gateway
                if (gateway._id == payload.gatewayId) {
                    devices = [...devices, payload]
                }
                return {
                    ...gateway,
                    devices
                };
            })
            return {
                ...state,
                gateways: _gateway,
                error: null
            }
        case DELETE_DEVICE:
            const _gateway2 = state.gateways.map(gateway => {
                const { devices } = gateway
                return {
                    ...gateway,
                    devices: devices.filter(device => device._id !== payload._id)
                };
            })
            return {
                ...state,
                gateways: _gateway2,
                error: null
            }
        default:
            return state;
    }
}

export default gatewaysReducer