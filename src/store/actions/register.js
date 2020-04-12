import * as actionTypes from './actionTypes';
import axios from 'axios';

export const registerStart = () => {
    return {
        type: actionTypes.REGISTER_START
    }
}

export const registerSuccess = (register_message) => {
    return {
        type: actionTypes.REGISTER_SUCCESS,
        register_message: register_message
    }
}

export const registerFail = (error) => {
    console.log(error);
    return {
        type: actionTypes.REGISTER_FAIL,
        error: error
    }
}
//https://firebase.google.com/docs/reference/rest/register#section-sign-in-email-password
export const register = (name, email, password, c_password) => {
    return dispatch => {
        dispatch(registerStart());
        const registerData = {
            name: name,
            email: email,
            password: password,
            c_password: c_password
        }

        let url = 'http://fina.mv/api/register';

        axios.post(url,
            registerData)
            .then(response => {
                dispatch(registerSuccess(response.data["success"]["message"]))
            })
            .catch(err => {
                dispatch(registerFail(err.response.data["error"]))
            })
    };
};
