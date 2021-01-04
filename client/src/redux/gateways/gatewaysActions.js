import { GET_GATEWAYS, GET_GATEWAY, ADD_GATEWAY, GATEWAYS_LOADING, ERROR_GATEWAYS } from './gatewaysTypes'
import axios from 'axios'

export const getGateways = () => dispatch => {
    dispatch({ type: GATEWAYS_LOADING });

    const page = '/api/v1/gateways'

    axios
        .get(page)
        .then(res => {
            dispatch({
                type: GET_GATEWAYS,
                payload: res.data.gateways
            })
        })
        .catch(err =>
            dispatch({
                type: ERROR_GATEWAYS,
                payload: { msg: err.response.data, status: err.response.status }
            })
        );
}

export const addGateway = gateway => dispatch => {
    const page = '/api/v1/gateways'
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post(page, gateway, config)
        .then(res =>
            dispatch({
                type: ADD_GATEWAY,
                payload: res.data.gateway
            })
        )
        .catch(err =>
            dispatch({
                type: ERROR_GATEWAYS,
                payload: { msg: err.response.data, status: err.response.status }
            })
        );
}


