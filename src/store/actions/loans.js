import * as actionTypes from './actionTypes';
import axios from 'axios';

export const setLoansForAccountId = (accountId, loans) => {
    return {
        type: actionTypes.SET_LOANS_FOR_ACCOUNT_ID,
        accountId: accountId,
        loans: loans
    };
}

export const fetchLoansFailed = () => {
    return {
        type: actionTypes.FETCH_LOANS_FAILED
    };
}

export const unsetSelectedLoanId = () => {
    return {
        type: actionTypes.UNSET_SELECTED_LOAN_ID
    };
};


export const getLoansForAccountId = (accountId) => {
    return dispatch => {
        axios.get('http://fina.mv/api/loans-by-accountid/' + accountId)
            .then(response => {
                console.log("actions getLoansForAccountId", accountId, response.data);
                dispatch(setLoansForAccountId(accountId, response.data.loans));
            })
            .catch(error => {
                dispatch(fetchLoansFailed());
            });
    };
};

export const setSelectedLoanId = (selectedLoanId, selectedAccountId) => {
    console.log('action>setSelectedLoanId:selectedAccountId', selectedAccountId);
    return {
        type: actionTypes.SET_SELECTED_LOAN_ID,
        selectedLoanId: selectedLoanId,
        selectedAccountId: selectedAccountId
    };
};

export const createLoanStart = () => {
    return {
        type: actionTypes.CREATE_LOAN_START

    };
};

export const createLoanSuccess = (message) => {
    return {
        type: actionTypes.CREATE_LOAN_SUCCESS,
        createLoanMessage: message
    };
};

export const createLoanFail = (errors) => {
    console.log('createLoanFail:', errors);
    return {
        type: actionTypes.CREATE_LOAN_FAIL,
        createLoanErrors: errors
    };
};

export const createLoan = (loan, accountId, token) => {
    return dispatch => {
        dispatch(createLoanStart());
        console.log(loan);

        let formData = new FormData();

        formData.append('account_id', accountId);
        formData.append('loan_duration_days', loan['loan_duration_days']);
        formData.append('date_loan_start', loan['date_loan_start']);
        formData.append('due_date_loan_completion', loan['due_date_loan_completion']);
        // formData.append('due_date_loan_completion_extended', loan['due_date_loan_completion_extended'])
        //formData.append('due_date_next_payment', loan['due_date_next_payment'])
        formData.append('loan_amount', loan['loan_amount']);
        formData.append('balance_due', loan['balance_due']);
        formData.append('currency', loan['currency']);
        //formData.append('interest_rate_percent', loan['interest_rate_percent']);
        formData.append('interest_rate_percent', 0);
        //formData.append('interest_rate_value', loan['interest_rate_value']);
        formData.append('interest_rate_value', 0);
        //formData.append('loan_paid', loan['loan_paid'])
        //formData.append('payment_per_interval', loan['payment_per_interval'])
        formData.append('payment_interval_type', loan['payment_interval_type']);
        if (loan['payment_interval_type'] == 0) {
            formData.append('payment_interval_days', loan['payment_interval_days']);
        }

        formData.append('agreement_no', loan['agreement_no']);

        console.log("aggreement_attachment", loan['agreement_attachment']);

        formData.append('payment_interval_days', loan['payment_interval_days']);
        formData.append('agreement_attachment', loan['agreement_attachment'].file);
        formData.append('guardian_name', loan['guardian_name']);
        formData.append('guardian_phone_no', loan['guardian_phone_no']);
        formData.append('guardian_address', loan['guardian_address']);
        formData.append('guardian_id_card', loan['guardian_id_card']);

        let url = 'http://fina.mv/api/loans/store';

        console.log("[actions/loans.js>createLoan.url]:", url);

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(url, formData, config)
            .then(response => {
                dispatch(createLoanSuccess(response.data["status"]));
            })
            .catch(err => {

                console.log("[actions/loans.js>createLoan.err]:", err);
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
                    dispatch(createLoanFail(uniqueErrors));
                }
                else {
                    dispatch(createLoanFail("error"));
                }
            });
    };
};


export const deleteLoan = (loanId,accountId) => {
    return {
        type: actionTypes.DELETE_LOAN,
        loanId: loanId,
        accountId: accountId
    };
};

export const initDeleteLoan = (loanId, accountId) => {
    return dispatch => {
        axios.delete('http://fina.mv/api/loans/' + loanId)
            .then(response => {
                console.log('[initDeleteLoan Success]',loanId,accountId);
                dispatch(deleteLoan(loanId, accountId));
            })
            .catch(error => {
                dispatch(deleteLoanFailed());
            });
    };
};

export const deleteLoanFailed = () => {
    return {
        type: actionTypes.DELETE_LOAN_FAILED
    };
};



export const editLoanStart = () => {
    return {
        type: actionTypes.EDIT_LOAN_START
    };
};

export const editLoanSuccess = (message) => {
    return {
        type: actionTypes.EDIT_LOAN_SUCCESS,
        editLoanMessage: message
    };
};

export const editLoanFail = (errors) => {
    console.log('editLoanFail:', errors);
    return {
        type: actionTypes.EDIT_LOAN_FAIL,
        editLoanErrors: errors
    };
};

export const editLoan = (loan, accountId, loanId, token) => {
    console.log("sdsdsd")
    return dispatch => {
        dispatch(editLoanStart());
        console.log("mua", loan);

        let formData = new FormData();

        let _aggreementAttachment = (loan['agreement_attachment']) ? loan['agreement_attachment'].file : '';
        formData.append('loan_id', loanId);
        formData.append('account_id', accountId);
        formData.append('loan_duration_days', loan['loan_duration_days']);
        formData.append('date_loan_start', loan['date_loan_start']);
        formData.append('due_date_loan_completion', loan['due_date_loan_completion']);
        formData.append('due_date_loan_completion_extended', loan['due_date_loan_completion_extended'])
        //formData.append('due_date_next_payment', loan['due_date_next_payment'])
        formData.append('loan_amount', loan['loan_amount']);
        formData.append('balance_due', loan['balance_due']);
        formData.append('currency', loan['currency']);
        //formData.append('interest_rate_percent', loan['interest_rate_percent']);
        //formData.append('interest_rate_value', loan['interest_rate_value']);
        formData.append('interest_rate_percent', 0);
        formData.append('interest_rate_value', 0);
        formData.append('loan_paid', loan['loan_paid'])
        //formData.append('payment_per_interval', loan['payment_per_interval'])
        formData.append('payment_interval_type', loan['payment_interval_type']);
        if (loan['payment_interval_type'] == 0) {
            formData.append('payment_interval_days', loan['payment_interval_days']);
        }
        formData.append('payment_interval_days', loan['payment_interval_days']);
        formData.append('agreement_no', loan['agreement_no']);
        formData.append('aggreement_attachment', _aggreementAttachment);
        formData.append('guardian_name', loan['guardian_name']);
        formData.append('guardian_phone_no', loan['guardian_phone_no']);
        formData.append('guardian_address', loan['guardian_address']);
        formData.append('guardian_id_card', loan['guardian_id_card']);

        console.log("setting url")
        let url = 'http://fina.mv/api/loans/update/' + loanId;

        console.log("[actions/loans.js>editLoan.url]:", url);

        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post(url, formData, config)
            .then(response => {
                dispatch(editLoanSuccess(response.data["status"]));
            })
            .catch(err => {

                console.log("[actions/loans.js>editLoan.err]:", err);
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
                    dispatch(editLoanFail(uniqueErrors));
                }
                else {
                    dispatch(editLoanFail("error"));
                }
            });
    };
};

