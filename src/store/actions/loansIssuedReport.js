import * as actionTypes from './actionTypes';
import axios from 'axios';

export const loansIssuedReportStart = () => {
    return {
        type: actionTypes.LOANS_ISSUED_REPORT_START
    };
};

export const loansIssuedReportSuccess = (loansIssuedReport) => {
    return {
        type: actionTypes.LOANS_ISSUED_REPORT_SUCCESS,
        loansIssuedReport: loansIssuedReport
    };
};

export const loansIssuedReportFail = (errors) => {
    console.log('loansIssuedReportFail:', errors);
    return {
        type: actionTypes.LOANS_ISSUED_REPORT_FAIL,
        loansIssuedReportErrors: errors
    };
};

export const initLoansIssuedReport = (token) => {
    return dispatch => {
        dispatch(loansIssuedReportStart());
        let url = 'http://fina.mv/api/loans-issued-report';

        axios.get(url)
            .then(response => {
                dispatch(loansIssuedReportSuccess(response.data["loans"]));
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
                    dispatch(loansIssuedReportFail(uniqueErrors));
                }
                else {
                    dispatch(loansIssuedReportFail("error"));
                }
            });
    };

};
