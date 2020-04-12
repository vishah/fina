import * as actionTypes from './actionTypes';
import axios from 'axios';

export const allAccountsDuesReportStart = () => {
    return {
        type: actionTypes.ALL_ACCOUNTS_DUES_REPORT_START
    };
};

export const allAccountsDuesReportSuccess = (allAccountsDuesReport) => {
    return {
        type: actionTypes.ALL_ACCOUNTS_DUES_REPORT_SUCCESS,
        allAccountsDuesReport: allAccountsDuesReport
    };
};

export const allAccountsDuesReportFail = (errors) => {
    console.log('allAccountsDuesReportFail:', errors);
    return {
        type: actionTypes.ALL_ACCOUNTS_DUES_REPORT_FAIL,
        allAccountsDuesReportErrors: errors
    };
};

export const initAllAccountsDuesReport = (token) => {
    return dispatch => {
        dispatch(allAccountsDuesReportStart());
        let url = 'http://fina.mv/api/dues-per-loan-for-all-accounts-report';

        return axios.get(url)
            .then(response => {
                dispatch(allAccountsDuesReportSuccess(response.data["loans"]));
            })
            .catch(err => {
                console.log("Errrrr:",err);
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
                    dispatch(allAccountsDuesReportFail(uniqueErrors));
                }
                else {
                    dispatch(allAccountsDuesReportFail("error"));
                }
            });
    };

};
