import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    users: [],
    selectedUserId: null,
    selectedUser: null,
    error: false,
    deleteUserFailed: false,
    createUserLoading: false,
    createUserMessage: null,
    createUserErrors: [],
    editUserLoading: false,
    editUserMessage: null,
    editUserErrors: [],
}

const setUsers = (state, action) => {
    let usersUpdated = action.users.map((val, index) => {
        let x = val;
        x['key'] = val['id'];
        return x
    });
    return updateObject(state, {
        users: usersUpdated,
        error: false,
        deleteUserFailed: false,
        createUserErrors: [],
        createUserLoading: true,
        createUserMessage: null
    });
};

const deleteUser = (state, action) => {
    let newObj = {};
    let newUsers = state.users.filter((val) => {
        return action.userId !== val['id'];
    });

    newObj['users'] = newUsers;
    newObj['deleteUserFailed'] = false;

    if (state.selectedUserId === action.userId) {
        newObj['selectedUserId'] = null;
    }

    return updateObject(state, newObj);
}

const setSelectedUserId = (state, action) => {
    let filteredUser = state.users.filter((user) => {
        return user['id'] == action.selectedUserId;
    });
    return updateObject(state, {
        selectedUserId: action.selectedUserId,
        selectedUser: filteredUser[0],
        deleteUserFailed: false,
        createUserErrors: [],
        createUserLoading: true,
        createUserMessage: null
    });
}

const fetchUsersFailed = (state, action) => {
    return updateObject(state, { error: true });
}

const deleteUserFailed = (state, action) => {
    return updateObject(state, { deleteUserFailed: true });
}

const createUserStart = (state, action) => {
    return updateObject(state, {
        createUserErrors: [],
        createUserLoading: true,
        createUserMessage: null
    });
}

const createUserSuccess = (state, action) => {

    return updateObject(state, {
        createUserErrors: [],
        createUserLoading: false,
        createUserMessage: action.createUserMessage
    });
};
const createUserFail = (state, action) => {
    return updateObject(state, {
        createUserErrors: action.createUserErrors,
        createUserLoading: false,
        createUserMessage: null
    });
};

const editUserStart = (state, action) => {
    return updateObject(state, {
        editUserErrors: [],
        editUserLoading: true,
        editUserMessage: null
    });
};

const editUserSuccess = (state, action) => {

    return updateObject(state, {
        editUserErrors: [],
        editUserLoading: false,
        editUserMessage: action.editUserMessage
    });
};

const editUserFail = (state, action) => {
    return updateObject(state, {
        editUserErrors: action.editUserErrors,
        editUserLoading: false,
        editUserMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SET_USERS: return setUsers(state, action);
    case actionTypes.DELETE_USER: return deleteUser(state, action);
    case actionTypes.DELETE_USER_FAILED: return deleteUserFailed(state, action);
    case actionTypes.FETCH_USERS_FAILED: return fetchUsersFailed(state, action);
    case actionTypes.SET_SELECTED_USER_ID: return setSelectedUserId(state, action);
    case actionTypes.CREATE_USER_START: return createUserStart(state, action);
    case actionTypes.CREATE_USER_SUCCESS: return createUserSuccess(state, action);
    case actionTypes.CREATE_USER_FAIL: return createUserFail(state, action);
    case actionTypes.EDIT_LOAN_START: return editUserStart(state, action);
    case actionTypes.EDIT_LOAN_SUCCESS: return editUserSuccess(state, action);
    case actionTypes.EDIT_LOAN_FAIL: return editUserFail(state, action);
        default: return state;
    }
};

export default reducer;
