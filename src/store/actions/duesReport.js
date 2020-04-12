import * as actionTypes from './actionTypes';
import axios from 'axios';

export const duesReportStart = () => {
    return {
        type: actionTypes.DUES_REPORT_START
    };
};

export const duesReportSuccess = (duesReport) => {
    return {
        type: actionTypes.DUES_REPORT_SUCCESS,
        duesReport: duesReport
    };
};

export const duesReportFail = (errors) => {
    console.log('duesReportFail:', errors);
    return {
        type: actionTypes.DUES_REPORT_FAIL,
        duesReportErrors: errors
    };
};

export const initDuesReport = (accountId, token) => {
    return dispatch => {
        dispatch(duesReportStart());
        let url = 'http://fina.mv/api/dues-per-loan-for-account-report/' + accountId;

        axios.get(url)
            .then(response => {
                dispatch(duesReportSuccess(response.data["loans"]));
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
                    dispatch(duesReportFail(uniqueErrors));
                }
                else {
                    dispatch(duesReportFail("error"));
                }
            });
    };
};
