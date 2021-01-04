import {
    GET_DEVICES,
    ADD_DEVICE,
    DEVICES_LOADING,
    ERROR_DEVICES,
    DELETE_DEVICE
} from './devicesTypes';

const initialState = {
    devices: [],
    loading: false,
    error: null
};

const devicesReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_DEVICES:
            return {
                ...state,
                devices: [...payload],
                loading: false,
                error: null
            };
        case ADD_DEVICE:
            return {
                ...state,
                devices: [...state.devices, payload],
                error: null
            };
        case DEVICES_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ERROR_DEVICES:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case DELETE_DEVICE:
            return {
                ...state,
                devices: state.devices.filter(device => device._id !== payload._id),
                error: null
            }
        default:
            return state;
    }
}

export default devicesReducer