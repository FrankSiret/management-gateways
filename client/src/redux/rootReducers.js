import { combineReducers } from 'redux';
import gatewaysReducer from './gateways/gatewaysReducer';
import devicesReducer from './devices/devicesReducer';

export default combineReducers({
    gateways: gatewaysReducer,
    devices: devicesReducer
});
