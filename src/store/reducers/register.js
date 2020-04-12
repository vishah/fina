import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    error: null,
    loading: false,
    register_message: null
}
const registerStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true,
        register_message: null
    });
}
const registerSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: false,
        register_message: action.register_message
    })
}
const registerFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
        register_message: null
    })
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_START: return registerStart(state, action)
        case actionTypes.REGISTER_SUCCESS: return registerSuccess(state, action)
        case actionTypes.REGISTER_FAIL: return registerFail(state, action)
        default:
            return state
    }
}
export default reducer;
