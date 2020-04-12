import * as actionTypes from './actionTypes';
import axios from 'axios';

export const setLoanIntervalsForLoan = (loan, loanIntervals) => {
    return {
        type: actionTypes.SET_LOAN_INTERVALS_FOR_LOAN,
        loan: loan,
        loanIntervals: loanIntervals
    };
};

export const fetchLoanIntervalsFailed = () => {
    return {
        type: actionTypes.FETCH_LOAN_INTERVALS_FAILED
    };
};
export const getLoanIntervalsForLoan = (loan) => {
    console.log("getLoanIntervalsForLoan,start")
    return dispatch => {
        axios.get('http://fina.mv/api/loan-intervals-by-loanid/' + loan.key)
            .then(response => {
                console.log("getLoanIntervalsForLoan,", response.data.loanIntervals)
                dispatch(setLoanIntervalsForLoan(loan, response.data.loanIntervals))
            })
            .catch(error => {
                dispatch(fetchLoanIntervalsFailed())
            });
    }
};



export const payInstallmentStart = () => {
    return {
        type: actionTypes.PAY_INSTALLMENT_START
    };
};

export const payInstallmentSuccess = (loanId, loanIntervalId, dueAmount, paidStatus, message) => {
    return {
        type: actionTypes.PAY_INSTALLMENT_SUCCESS,
        loanId: loanId,
        loanIntervalId: loanIntervalId,
        dueAmount: dueAmount,
        paidStatus: paidStatus,
        payInstallmentMessage: message
    };
};

export const payInstallmentFail = (error) => {
    console.log(error);
    return {
        type: actionTypes.PAY_INSTALLMENT_FAIL,
        payInstallmentError: error
    };
};

//https://firebase.google.com/docs/reference/rest/payInstallment#section-sign-in-email-password
export const payInstallment = (loanId, loanIntervalId, dueAmount, paidStatus) => {
    return dispatch => {
        dispatch(payInstallmentStart());
        const payInstallmentData = {
            paid_status: paidStatus,
            due_amount: dueAmount
        };

        let url = 'http://fina.mv/api/pay-installment/' + loanIntervalId;

        axios.post(url,
            payInstallmentData)
            .then(response => {
                dispatch(payInstallmentSuccess(loanId, loanIntervalId, dueAmount, paidStatus, response.data["status"]));
            })
            .catch(err => {

                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.validationMessage
                ) {
                    dispatch(payInstallmentFail(err.response.data["validationMessage"]));
                }
                else {
                    dispatch(payInstallmentFail("error"));
                }
            });
    };
};


