import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    access_token: null,
    refresh_token: null,
    expires_in: null,
    expires_in_seconds: null,
    user_role_admin: null,
    user_role_moderator: null,
    user_role_standard: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
}
const authStart = (state, action) => {
    return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        access_token: action.access_token,
        refresh_token: action.refresh_token,
        expires_in: action.expires_in,
        expires_in_seconds: action.expires_in_seconds,
        user_role_admin: action.user_role_admin,
        user_role_moderator: action.user_role_moderator,
        user_role_standard: action.user_role_standard,
        error: null,
        loading: false
    });
};

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const authLogout = (state, action) => {
    return updateObject(state, {
        access_token: null,
        refresh_token: null,
        expires_in: null,
        expires_in_seconds: null,
        user_role_admin: null,
        user_role_moderator: null,
        user_role_standard: null,
    });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path });
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action)
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action)
        case actionTypes.AUTH_FAIL: return authFail(state, action)
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action)
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action)
        default:
            return state
    }
}
export default reducer;
