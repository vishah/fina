import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    loanLoanIntervals: {},
    error: false,
    payInstallmentLoading: false,
    payInstallmentMessage: null,
    payInstallmentError: null,


};

const setLoanIntervalsForLoan = (state, action) => {
    let loanLoanIntervals = {};
    let loanId = action.loan.key;
    let loanIntervalsUpdated = action.loanIntervals.map((val, index) => {
        let x = val;
        x['key'] = x['id'];
        return x
    });

    loanLoanIntervals[loanId] = loanIntervalsUpdated;

    return updateObject(state, {
        loanLoanIntervals: updateObject(state.loanLoanIntervals,
            loanLoanIntervals),
        error: false
    });
};


const fetchLoanIntervalsFailed = (state, action) => {
    return updateObject(state, { error: true });
};

const payInstallmentStart = (state, action) => {
    return updateObject(state, {
        payInstallmentError: null,
        payInstallmentLoading: true,
        payInstallmentMessage: null
    });
};

const payInstallmentSuccess = (state, action) => {
    let loanId = action.loanId;
    let loanIntervalId = action.loanIntervalId;
    let dueAmount = action.dueAmount;
    let loanLoanIntervals = state.loanLoanIntervals;
    let paidStatus = action.paidStatus;
    console.log('[loanIntervalReducer>payInstallmentSuccess-paidStatus:' + paidStatus)
    console.log('[loanIntervalReducer>payInstallmentSuccess-loanIntervals[loanId]:' + loanLoanIntervals[loanId])


    loanLoanIntervals[loanId].map((val) => {
        if (val['id'] === loanIntervalId) {
            let currVal = val;
            currVal['paid_status'] = paidStatus;
            currVal['due_amount'] = dueAmount;
            return currVal;
        }
        else {
            return val;
        }
    });

    return updateObject(state, {
        payInstallmentError: null,
        payInstallmentLoading: false,
        payInstallmentMessage: action.payInstallmentMessage,
        loanLoanIntervals: loanLoanIntervals
    });
};

const payInstallmentFail = (state, action) => {
    return updateObject(state, {
        payInstallmentError: action.error,
        payInstallmentLoading: false,
        payInstallmentMessage: null
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LOAN_INTERVALS_FOR_LOAN: return setLoanIntervalsForLoan(state, action)
        case actionTypes.FETCH_LOAN_INTERVALS_FAILED: return fetchLoanIntervalsFailed(state, action)
        case actionTypes.PAY_INSTALLMENT_START: return payInstallmentStart(state, action)
        case actionTypes.PAY_INSTALLMENT_SUCCESS: return payInstallmentSuccess(state, action)
        case actionTypes.PAY_INSTALLMENT_FAIL: return payInstallmentFail(state, action)
        default: return state;
    }
};

export default reducer;
