import * as actionTypes from './actionTypes';
import axios from 'axios';

export const setGeneralSettings = (generalSettings) => {
    console.log("setgeneralsettings");
    return {
        type: actionTypes.SET_GENERAL_SETTINGS,
        generalSettings: generalSettings,
    };
};

export const fetchGeneralSettingsFailed = () => {
    return {
        type: actionTypes.FETCH_GENERAL_SETTINGS_FAILED
    };
};

export const initGeneralSettings = () => {
    return dispatch => {
        axios.get('http://fina.mv/api/general-settings')
            .then(response => {
                dispatch(setGeneralSettings(response.data.generalSettings));
            })
            .catch(error => {
                dispatch(fetchGeneralSettingsFailed());
            });
    };
};

export const editGeneralSettingsStart = () => {
    return {
        type: actionTypes.EDIT_GENERAL_SETTINGS_START
    };
};

export const editGeneralSettingsSuccess = (message) => {
    return {
        type: actionTypes.EDIT_GENERAL_SETTINGS_SUCCESS,
        editGeneralSettingsMessage: message
    };
};

export const editGeneralSettingsFail = (errors) => {
    console.log('editGeneralSettingsFail:', errors);
    return {
        type: actionTypes.EDIT_GENERAL_SETTINGS_FAILED,
        editGeneralSettingsErrors: errors
    };
};

export const editGeneralSettings = (generalSettings, token) => {
    return dispatch => {
        dispatch(editGeneralSettingsStart());

        let formData = new FormData();
        console.log("wwwww",generalSettings);

        let _logoAttachment = (generalSettings['logo_attachment']) ? generalSettings['logo_attachment'].file : '';
        formData.append('title', generalSettings['title']);
        formData.append('logo_attachment', generalSettings['logo_attachment']);
        formData.append('company_name', generalSettings['company_name']);
        formData.append('company_address', generalSettings['company_address']);
        formData.append('company_phone_no', generalSettings['company_phone_no']);
        formData.append('company_hotline_no', generalSettings['company_hotline_no']);
        formData.append('company_fax_no', generalSettings['company_fax_no']);
        formData.append('company_email', generalSettings['company_email']);

        let url = 'http://fina.mv/api/general-settings/update';

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(url, formData, config)
            .then(response => {
                dispatch(editGeneralSettingsSuccess(response.data["status"]));
            })
            .catch(err => {

                console.log("error:",err);
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
                    dispatch(editGeneralSettingsFail(uniqueErrors));
                }
                else {
                    console.log("error:",err);
                    dispatch(editGeneralSettingsFail({error:"err"}));
                }
            });
    };
};
