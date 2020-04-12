import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    submitCustomerRequestErrors: [],
    submitCustomerRequestLoading: false,
    availableVessels: [],
    earliestAvailableVessels: []

}
const submitCustomerRequestStart = (state, action) => {
    return updateObject(state, {
        submitCustomerRequestErrors: [],
        submitCustomerRequestLoading: true,
        availableVessels: [],
        earliestAvailableVessels: []
    });
}
const submitCustomerRequestSuccess = (state, action) => {
    return updateObject(state, {
        submitCustomerRequestErrors: [],
        submitCustomerRequestLoading: false,
        availableVessels: action.availableVessels,
        earliestAvailableVessels: action.earliestAvailableVessels
    })
}
const submitCustomerRequestFail = (state, action) => {
    return updateObject(state, {
        submitCustomerRequestErrors: action.errors,
        submitCustomerRequestLoading: false,
        availableVessels: [],
        earliestAvailableVessels: []
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SUBMIT_CUSTOMER_REQUEST_START:
            return submitCustomerRequestStart(state, action)
        case actionTypes.SUBMIT_CUSTOMER_REQUEST_SUCCESS:
            return submitCustomerRequestSuccess(state, action)
        case actionTypes.SUBMIT_CUSTOMER_REQUEST_FAIL:
            return submitCustomerRequestFail(state, action)
        default:
            return state
    }
}
export default reducer;
