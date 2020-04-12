import * as actionTypes from './actionTypes';
import axios from 'axios';

export const accountStatementReportStart = () => {
    return {
        type: actionTypes.ACCOUNT_STATEMENT_REPORT_START
    };
};

export const accountStatementReportSuccess = (accountStatementReport) => {
    return {
        type: actionTypes.ACCOUNT_STATEMENT_REPORT_SUCCESS,
        accountStatementReport: accountStatementReport
    };
};

export const accountStatementReportFail = (errors) => {
    console.log('accountStatementReportFail:', errors);
    return {
        type: actionTypes.ACCOUNT_STATEMENT_REPORT_FAIL,
        accountStatementReportErrors: errors
    };
};

export const initAccountStatementReport = (accountId, token) => {
    return dispatch => {
        dispatch(accountStatementReportStart());
        let url = 'http://fina.mv/api/account-statement/' + accountId;

        axios.get(url)
            .then(response => {
                dispatch(accountStatementReportSuccess(response.data["account_statement"]));
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
                    dispatch(accountStatementReportFail(uniqueErrors));
                }
                else {
                    dispatch(accountStatementReportFail("error"));
                }
            });
    };

};
