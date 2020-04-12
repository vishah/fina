import * as actionTypes from './actionTypes';
import axios from 'axios';

export const setUsers = (users) => {
    return {
        type: actionTypes.SET_USERS,
        users: users
    };
};

export const deleteUser = (userId) => {
    return {
        type: actionTypes.DELETE_USER,
        userId: userId
    };
};

export const initDeleteUser = (userId) => {
    return dispatch => {
        axios.delete('http://fina.mv/api/users/' + userId)
            .then(response => {
                dispatch(deleteUser(userId));
            })
            .catch(error => {
                dispatch(deleteUserFailed());
            });
    };
};

export const deleteUserFailed = () => {
    return {
        type: actionTypes.DELETE_USER_FAILED
    };
};

export const fetchUsersFailed = () => {
    return {
        type: actionTypes.FETCH_USERS_FAILED
    };
};

export const initUsers = () => {
    return dispatch => {
        axios.get('http://fina.mv/api/users')
            .then(response => {
                dispatch(setUsers(response.data.users));
            })
            .catch(error => {
                dispatch(fetchUsersFailed());
            });
    };
};

export const setSelectedUserId = (selectedUserId) => {
    return {
        type: actionTypes.SET_SELECTED_USER_ID,
        selectedUserId: selectedUserId
    };
};

export const createUserStart = () => {
    return {
        type: actionTypes.CREATE_USER_START
    };
};

export const createUserSuccess = (message) => {
    return {
        type: actionTypes.CREATE_USER_SUCCESS,
        createUserMessage: message
    };
};

export const createUserFail = (errors) => {
    return {
        type: actionTypes.CREATE_USER_FAIL,
        createUserErrors: errors
    };
};

export const createUser = (user, token) => {
    console.log('createUser');
    return dispatch => {
        dispatch(createUserStart());
        let formData = new FormData();

        formData.append('name', user['name']);
        formData.append('email', user['email']);
        formData.append('password', user['password']);
        formData.append('c_password', user['c_password']);
        formData.append('role_admin', user['role']==0?1:0);
        formData.append('role_moderator', user['role']==1?1:0);
        formData.append('role_standard', user['role']==2?1:0);

        let url = 'http://fina.mv/api/users/store';


        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(url, formData, config)
            .then(response => {
                dispatch(createUserSuccess(response.data["status"]));
            })
            .catch(err => {

                console.log("[actions/users.js>createUser.err]:", err);
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.validationMessages &&
                    (typeof err.response.data.validationMessages === 'object')
                ) {
                    let validationObj = err.response.data.validationMessages;
                    let combinedErrors = [];
                    let uniqueErrors = [];
                    Object.keys(validationObj).forEach((key) => {
                        validationObj[key].forEach((val) => {
                            combinedErrors.push(val);
                        });
                    });
                    uniqueErrors = [...new Set(combinedErrors)];
                    dispatch(createUserFail(uniqueErrors));
                }
                else {
                    dispatch(createUserFail("error"));
                }
            });
    };
};


export const editUserStart = () => {
    return {
        type: actionTypes.EDIT_USER_START
    };
};

export const editUserSuccess = (message) => {
    return {
        type: actionTypes.EDIT_USER_SUCCESS,
        editUserMessage: message
    };
};

export const editUserFail = (errors) => {
    console.log('editUserFail:', errors);
    return {
        type: actionTypes.EDIT_USER_FAIL,
        editUserErrors: errors
    };
};

export const editUser = (user, userId, token) => {
    return dispatch => {
        dispatch(editUserStart());

        let formData = new FormData();

        formData.append('name', user['name']);
        formData.append('email', user['email']);
        if(user['password']){
            formData.append('password', user['password']);
        }
        if(user['c_password']){
            formData.append('c_password', user['c_password']);
        }
        formData.append('role_admin', user['role']==0?1:0);
        formData.append('role_moderator', user['role']==1?1:0);
        formData.append('role_standard', user['role']==2?1:0);

        let url = 'http://fina.mv/api/users/update/' + userId;

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(url, formData, config)
            .then(response => {
                dispatch(editUserSuccess(response.data["status"]));
            })
            .catch(err => {

                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.validationMessages &&
                    (typeof err.response.data.validationMessages === 'object')
                ) {
                    let validationObj = err.response.data.validationMessages;
                    let combinedErrors = [];
                    let uniqueErrors = [];
                    Object.keys(validationObj).forEach((key) => {
                        validationObj[key].forEach((val) => {
                            combinedErrors.push(val);
                        });
                    });
                    uniqueErrors = [...new Set(combinedErrors)];
                    dispatch(editUserFail(uniqueErrors));
                }
                else {
                    dispatch(editUserFail("error"));
                }
            });
    };
};
