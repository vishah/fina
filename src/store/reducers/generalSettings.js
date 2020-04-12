import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    error:false,
    generalSettings: [],
    editGeneralSettingsLoading: false,
    editGeneralSettingsMessage: null,
    editGeneralSettingsErrors: [],
};

const setGeneralSettings = (state, action) => {
    return updateObject(state, {
        generalSettings: action.generalSettings,
        error: false,
    });
};

const fetchGeneralSettingsFailed = (state, action) => {
    return updateObject(state, { error: true });
};

const editGeneralSettingsStart = (state, action) => {
    return updateObject(state, {
        editGeneralSettingsErrors: [],
        editGeneralSettingsLoading: true,
        editGeneralSettingsMessage: null
    });
};

const editGeneralSettingsSuccess = (state, action) => {

    return updateObject(state, {
        editGeneralSettingsErrors: [],
        editGeneralSettingsLoading: false,
        editGeneralSettingsMessage: action.editGeneralSettingsMessage
    });
};

const editGeneralSettingsFailed = (state, action) => {
    return updateObject(state, {
        editGeneralSettingsErrors: action.editGeneralSettingsErrors,
        editGeneralSettingsLoading: false,
        editGeneralSettingsMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SET_GENERAL_SETTINGS: return setGeneralSettings(state, action);
    case actionTypes.FETCH_GENERAL_SETTINGS_FAILED: return fetchGeneralSettingsFailed();
    case actionTypes.EDIT_GENERAL_SETTINGS_START: return editGeneralSettingsStart(state, action);
    case actionTypes.EDIT_GENERAL_SETTINGS_SUCCESS: return editGeneralSettingsSuccess(state, action);
    case actionTypes.EDIT_GENERAL_SETTINGS_FAILED: return editGeneralSettingsFailed(state, action);
        default: return state;
    }
};

export default reducer;
