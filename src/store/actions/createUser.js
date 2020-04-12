import * as actionTypes from './actionTypes';
import axios from 'axios';

export const createUserStart = () => {
    return {
        type: actionTypes.CREATE_USER_START
    };
};

export const createUserSuccess = (create_user_message) => {
    return {
        type: actionTypes.CREATE_USER_SUCCESS,
        create_user_message: create_user_message
    };
};

export const createUserFail = (error) => {
    console.log(error);
    return {
        type: actionTypes.CREATE_USER_FAIL,
        error: error
    };
};

export const createUser = (name, email, password, c_password) => {
    return dispatch => {
        dispatch(createUserStart());
        const createUserData = {
            name: name,
            email: email,
            password: password,
            c_password: c_password
        };

        let url = 'http://fina.mv/api/create_user';

        axios.post(url,
            createUserData)
            .then(response => {
                dispatch(createUserSuccess(response.data["success"]["message"]));
            })
            .catch(err => {
                dispatch(createUserFail(err.response.data["error"]));
            });
    };
};
