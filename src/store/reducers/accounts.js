import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    accounts: [],
    selectedAccountId: null,
    selectedAccount: null,
    error: false,
    deleteAccountFailed: false,
    createAccountLoading: false,
    createAccountMessage: null,
    createAccountErrors: [],
    editAccountLoading: false,
    editAccountMessage: null,
    editAccountErrors: [],
}

const setAccounts = (state, action) => {
    let accountsUpdated = action.accounts.map((val, index) => {
        let x = val;
        x['key'] = val['id'];
        return x;
    });
    return updateObject(state, {
        accounts: accountsUpdated,
        totals:action.totals,
        error: false,
        deleteAccountFailed: false,
        createAccountErrors: [],
        createAccountLoading: true,
        createAccountMessage: null,
    });
};

const deleteAccount = (state, action) => {
    let newObj = {};
    let newAccounts = state.accounts.filter((val) => {
        return action.accountId !== val['id'];
    });

    newObj['accounts'] = newAccounts;
    newObj['deleteAccountFailed'] = false;

    if (state.selectedAccountId === action.accountId) {
        newObj['selectedAccountId'] = null;
    }

    return updateObject(state, newObj);
};

const setSelectedAccountId = (state, action) => {
    let filteredAccount = state.accounts.filter((account) => {
        return account['id'] == action.selectedAccountId;
    });
    return updateObject(state, {
        selectedAccountId: action.selectedAccountId,
        selectedAccount: filteredAccount[0],
        deleteAccountFailed: false,
        createAccountErrors: [],
        createAccountLoading: true,
        createAccountMessage: null
    });
};

const unsetSelectedAccountId = (state, action) => {
    return updateObject(state, {
        selectedAccountId: null,
        selectedAccount: null
    });
};

const fetchAccountsFailed = (state, action) => {
    return updateObject(state, { error: true });
};

const deleteAccountFailed = (state, action) => {
    return updateObject(state, { deleteAccountFailed: true });
};

const createAccountStart = (state, action) => {
    return updateObject(state, {
        createAccountErrors: [],
        createAccountLoading: true,
        createAccountMessage: null
    });
};

const createAccountSuccess = (state, action) => {

    return updateObject(state, {
        createAccountErrors: [],
        createAccountLoading: false,
        createAccountMessage: action.createAccountMessage
    });
};

const createAccountFail = (state, action) => {
    return updateObject(state, {
        createAccountErrors: action.createAccountErrors,
        createAccountLoading: false,
        createAccountMessage: null
    });
};

const editAccountStart = (state, action) => {
    return updateObject(state, {
        editAccountErrors: [],
        editAccountLoading: true,
        editAccountMessage: null
    });
};

const editAccountSuccess = (state, action) => {

    return updateObject(state, {
        editAccountErrors: [],
        editAccountLoading: false,
        editAccountMessage: action.editAccountMessage
    });
};

const editAccountFail = (state, action) => {
    return updateObject(state, {
        editAccountErrors: action.editAccountErrors,
        editAccountLoading: false,
        editAccountMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SET_ACCOUNTS: return setAccounts(state, action);
    case actionTypes.DELETE_ACCOUNT: return deleteAccount(state, action);
    case actionTypes.DELETE_ACCOUNT_FAILED: return deleteAccountFailed(state, action);
    case actionTypes.FETCH_ACCOUNTS_FAILED: return fetchAccountsFailed(state, action);
    case actionTypes.SET_SELECTED_ACCOUNT_ID: return setSelectedAccountId(state, action);
    case actionTypes.UNSET_SELECTED_ACCOUNT_ID: return unsetSelectedAccountId(state, action);
    case actionTypes.CREATE_ACCOUNT_START: return createAccountStart(state, action);
    case actionTypes.CREATE_ACCOUNT_SUCCESS: return createAccountSuccess(state, action);
    case actionTypes.CREATE_ACCOUNT_FAIL: return createAccountFail(state, action);
    case actionTypes.EDIT_ACCOUNT_START: return editAccountStart(state, action);
    case actionTypes.EDIT_ACCOUNT_SUCCESS: return editAccountSuccess(state, action);
    case actionTypes.EDIT_ACCOUNT_FAIL: return editAccountFail(state, action);
        default: return state;
    }
};

export default reducer;
