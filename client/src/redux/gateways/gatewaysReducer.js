import {
    GET_GATEWAYS,
    ADD_GATEWAY,
    GATEWAYS_LOADING,
    ERROR_GATEWAYS
} from './gatewaysTypes';

import { DELETE_DEVICE } from '../devices/devicesTypes';

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
        case DELETE_DEVICE:
            const _gateway = state.gateways.map(g => {
                const { devices } = g
                return {
                    ...g,
                    devices: devices.filter(d => d._id !== payload._id)
                };
            })
            return {
                ...state,
                gateways: _gateway,
                error: null
            }
        default:
            return state;
    }
}

export default gatewaysReducer