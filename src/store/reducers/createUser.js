import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    error: null,
    createUserLoading: false,
    create_user_message: null
}
const registerStart = (state, action) => {
    return updateObject(state, {
        error: null,
        createUserLoading: true,
        create_user_message: null
    });
}
const registerSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        createUserLoading: false,
        create_user_message: action.create_user_message
    })
}
const registerFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        createUserLoading: false,
        create_user_message: null
    })
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_USER_START: return registerStart(state, action)
        case actionTypes.CREATE_USER_SUCCESS: return registerSuccess(state, action)
        case actionTypes.CREATE_USER_FAIL: return registerFail(state, action)
        default:
            return state
    }
}
export default reducer;
