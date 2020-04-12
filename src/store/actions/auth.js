import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (accessToken, refreshToken, expiresIn, expiresInSeconds,
                            userRoleAdmin, userRoleModerator, userRoleStandard) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
        expires_in_seconds: expiresInSeconds,
        user_role_admin: userRoleAdmin,
        user_role_moderator: userRoleModerator,
        user_role_standard: userRoleStandard
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};
export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

export const login = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            grant_type: 'password',
            client_id: 2,
            client_secret: "I1dRMtEcJrJPyeW0VAgI9FtsQyz0sWgukHTTj8I9",
            username: email,
            password: password,
            scope: '*'
        };

        let url = 'http://fina.mv/oauth/token';

        axios.post(url,
            authData)
            .then(response => {
                let expires_in_seconds = (new Date().getTime())/1000 + response.data.expires_in;
                console.log("sdsdsdsdsd",response.data);
                dispatch(authSuccess(response.data.access_token,
                                     response.data.refresh_token,
                                     response.data.expires_in,
                                     expires_in_seconds,
                                     response.data.user_role_admin,
                                     response.data.user_role_moderator,
                                     response.data.user_role_standard
                                    ));
                dispatch(checkAuthTimeout(response.data.expires_in));
            })
            .catch(err => {
                console.log("err",err);
                //dispatch(authFail(err.response.data.error))
                dispatch(authFail("Error logging in"));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = (accessToken, refreshToken, expiresIn, expiresInSeconds,
                               userRoleAdmin, userRoleModerator, userRoleStandard) => {
    return dispatch => {
        if (!accessToken) {
            dispatch(logout());
        }

        if (expiresInSeconds > (new Date().getTime())/1000  ) {
            dispatch(authSuccess(accessToken, refreshToken, expiresIn, expiresInSeconds,
                                 userRoleAdmin, userRoleModerator, userRoleStandard));
            dispatch(checkAuthTimeout(expiresInSeconds - (new Date().getTime()/1000) ));
        }
        else {
            dispatch(logout());
        }

    };
};
