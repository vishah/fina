import * as actionTypes from './actionTypes';
import axios from 'axios';

export const allAccountsStatementReportStart = () => {
    return {
        type: actionTypes.ALL_ACCOUNTS_STATEMENT_REPORT_START
    };
};

export const allAccountsStatementReportSuccess = (allAccountsStatementReport) => {
    return {
        type: actionTypes.ALL_ACCOUNTS_STATEMENT_REPORT_SUCCESS,
        allAccountsStatementReport: allAccountsStatementReport
    };
};

export const allAccountsStatementReportFail = (errors) => {
    console.log('allAccountsStatementReportFail:', errors);
    return {
        type: actionTypes.ALL_ACCOUNTS_STATEMENT_REPORT_FAIL,
        allAccountsStatementReportErrors: errors
    };
};

export const initAllAccountsStatementReport = (token) => {
    return dispatch => {
        dispatch(allAccountsStatementReportStart());
        let url = 'http://fina.mv/api/all-accounts-statement';

        axios.get(url)
            .then(response => {
                dispatch(allAccountsStatementReportSuccess(response.data["all_accounts_statement"]));
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
                    dispatch(allAccountsStatementReportFail(uniqueErrors));
                }
                else {
                    dispatch(allAccountsStatementReportFail("error"));
                }
            });
    };

};
