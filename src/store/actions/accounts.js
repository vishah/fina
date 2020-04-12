import * as actionTypes from './actionTypes';
import axios from 'axios';

export const setAccounts = (accounts, totals) => {
    console.log("setAccounts",accounts);
    return {
        type: actionTypes.SET_ACCOUNTS,
        accounts: accounts,
        totals:totals
    };
};

export const deleteAccount = (accountId) => {
    return {
        type: actionTypes.DELETE_ACCOUNT,
        accountId: accountId
    };
};

export const initDeleteAccount = (accountId) => {
    return dispatch => {
        axios.delete('http://fina.mv/api/accounts/' + accountId)
            .then(response => {
                dispatch(deleteAccount(accountId));
            })
            .catch(error => {
                dispatch(deleteAccountFailed());
            });
    };
};

export const deleteAccountFailed = () => {
    return {
        type: actionTypes.DELETE_ACCOUNT_FAILED
    };
};

export const fetchAccountsFailed = () => {
    return {
        type: actionTypes.FETCH_ACCOUNTS_FAILED
    };
};

export const unsetSelectedAccountId = () => {
    return {
        type: actionTypes.UNSET_SELECTED_ACCOUNT_ID
    };
};


export const initAccounts = () => {
    return dispatch => {
        axios.get('http://fina.mv/api/accounts',)
            .then(response => {
                dispatch(setAccounts(response.data.accounts, response.data.totals));
            })
            .catch(error => {
                console.log(error)
                dispatch(fetchAccountsFailed());
            });
    };
};

export const setSelectedAccountId = (selectedAccountId) => {
    return {
        type: actionTypes.SET_SELECTED_ACCOUNT_ID,
        selectedAccountId: selectedAccountId
    };
};

export const createAccountStart = () => {
    return {
        type: actionTypes.CREATE_ACCOUNT_START
    };
};

export const createAccountSuccess = (message) => {
    return {
        type: actionTypes.CREATE_ACCOUNT_SUCCESS,
        createAccountMessage: message
    };
};

export const createAccountFail = (errors) => {
    return {
        type: actionTypes.CREATE_ACCOUNT_FAIL,
        createAccountErrors: errors
    };
};

export const createAccount = (account, token) => {
    return dispatch => {
        dispatch(createAccountStart());
        const createAccountData = {
            type: account['type'],
            account_name: account['account_name'],
            account_id_card: account['account_id_card'],
            account_phone_no: account['account_phone_no'],
            id_card_attachment: account['id_card_attachment'],
            nation_id: account['nation_id']
        };

        let formData = new FormData();

        formData.append('type', account['type']);
        formData.append('account_name', account['account_name']);
        formData.append('account_id_card', account['account_id_card']);
        formData.append('account_phone_no', account['account_phone_no']);
        formData.append('id_card_attachment', account['id_card_attachment']);
        formData.append('nation_id', account['nation_id']);


        let url = 'http://fina.mv/api/accounts/store';


        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(url, formData, config)
            .then(response => {
                dispatch(createAccountSuccess(response.data["status"]));
            })
            .catch(err => {

                console.log("[actions/accounts.js>createAccount.err]:", err);
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
                    dispatch(createAccountFail(uniqueErrors));
                }
                else {
                    dispatch(createAccountFail("error"));
                }
            });
    };
};


export const editAccountStart = () => {
    return {
        type: actionTypes.EDIT_ACCOUNT_START
    };
};

export const editAccountSuccess = (message) => {
    return {
        type: actionTypes.EDIT_ACCOUNT_SUCCESS,
        editAccountMessage: message
    };
};

export const editAccountFail = (errors) => {
    console.log('editAccountFail:', errors);
    return {
        type: actionTypes.EDIT_ACCOUNT_FAIL,
        editAccountErrors: errors
    };
};

export const editAccount = (account, accountId, token) => {
    return dispatch => {
        dispatch(editAccountStart());

        let formData = new FormData();

        let _idCardAttachment = (account['agreement_attachment']) ? account['agreement_attachment'].file : '';
        formData.append('account_id', accountId);
        formData.append('account_name', account['account_name']);
        formData.append('account_id_card', account['account_id_card']);
        formData.append('account_phone_no', account['account_phone_no']);
        formData.append('id_card_attachment', _idCardAttachment);

        let url = 'http://fina.mv/api/accounts/update/' + accountId;

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(url, formData, config)
            .then(response => {
                dispatch(editAccountSuccess(response.data["status"]));
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
                    dispatch(editAccountFail(uniqueErrors));
                }
                else {
                    dispatch(editAccountFail("error"));
                }
            });
    };
};
