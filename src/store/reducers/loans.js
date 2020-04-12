import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    accountLoans: {},
    selectedLoanId: null,
    selectedLoan: null,
    error: false,
    createLoanLoading: false,
    createLoanMessage: null,
    createLoanErrors: [],
    editLoanLoading: false,
    editLoanMessage: null,
    editLoanErrors: [],
};

const setLoansForAccountId = (state, action) => {
    let accountLoans = {};
    let accountId = action.accountId;
    let loansUpdated = action.loans.map((val, index) => {
        let x = val;
        x['key'] = x['id'];
        return x
    });

    accountLoans[accountId] = loansUpdated;

    return updateObject(state, {
        accountLoans: updateObject(state.accountLoans,
            accountLoans),
        error: false
    });
};

const setSelectedLoanId = (state, action) => {
    console.log('reducer>setSelectedLoanId:selectedLoanId', action.selectedLoanId);
    console.log('reducer>setSelectedLoanId:selectedAccountId', action.selectedAccountId);
    let filteredLoan = state.accountLoans[action.selectedAccountId].filter((val) => {
        console.log('valid', val['id']);
        console.log('valselectedloanid', action.selectedAccountId);
        console.log('valval', val);
        return val['id'] == action.selectedLoanId;
    });
    console.log("filteredLoan", filteredLoan[0]);

    return updateObject(state, {
        selectedLoanId: action.selectedLoanId,
        selectedLoan: filteredLoan[0]
    });
};

const unsetSelectedLoanId = (state, action) => {
    return updateObject(state, {
        selectedLoanId: null,
        selectedLoan: null
    });
};

const fetchLoansFailed = (state, action) => {
    return updateObject(state, { error: true });
};

const createLoanStart = (state, action) => {
    return updateObject(state, {
        createLoanErrors: [],
        createLoanLoading: true,
        createLoanMessage: null
    });
};

const createLoanSuccess = (state, action) => {

    return updateObject(state, {
        createLoanErrors: [],
        createLoanLoading: false,
        createLoanMessage: action.createLoanMessage
    });
};

const createLoanFail = (state, action) => {
    return updateObject(state, {
        createLoanErrors: action.createLoanErrors,
        createLoanLoading: false,
        createLoanMessage: null
    });
};

const editLoanStart = (state, action) => {
    return updateObject(state, {
        editLoanErrors: [],
        editLoanLoading: true,
        editLoanMessage: null
    });
};

const editLoanSuccess = (state, action) => {

    return updateObject(state, {
        editLoanErrors: [],
        editLoanLoading: false,
        editLoanMessage: action.editLoanMessage
    });
};

const editLoanFail = (state, action) => {
    return updateObject(state, {
        editLoanErrors: action.editLoanErrors,
        editLoanLoading: false,
        editLoanMessage: null
    });
};

const deleteLoan = (state, action) => {
    let accountId = action.accountId;
    let newObj={};

    let newLoansForAccount = state.accountLoans[accountId].filter((val) => {
        return action.loanId != val['id'];
    });

    console.log('[deleteLoan reducer]',accountId, newLoansForAccount);

    let newAccountLoans=state.accountLoans;
    newAccountLoans[accountId] = newLoansForAccount;

    console.log('[deleteLoan newAccountLoans]',newAccountLoans);

    newObj['accountLoans'] = newAccountLoans;
    newObj['deleteLoanFailed'] = false;

    if (state.selectedLoanId === action.loanId) {
        newObj['selectedLoanId'] = null;
        newObj['selectedLoan'] = null;
    }

    return updateObject(state, newObj);
};

const deleteLoanFailed = (state, action) => {
    return updateObject(state, { deleteLoanFailed: true });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.SET_LOANS_FOR_ACCOUNT_ID: return setLoansForAccountId(state, action);
    case actionTypes.DELETE_LOAN: return deleteLoan(state, action);
    case actionTypes.DELETE_LOAN_FAILED: return deleteLoanFailed(state, action);
    case actionTypes.FETCH_LOANS_FAILED: return fetchLoansFailed(state, action);
    case actionTypes.SET_SELECTED_LOAN_ID: return setSelectedLoanId(state, action);
    case actionTypes.UNSET_SELECTED_LOAN_ID: return unsetSelectedLoanId(state, action);
    case actionTypes.CREATE_LOAN_START: return createLoanStart(state, action);
    case actionTypes.CREATE_LOAN_SUCCESS: return createLoanSuccess(state, action);
    case actionTypes.CREATE_LOAN_FAIL: return createLoanFail(state, action);
    case actionTypes.EDIT_LOAN_START: return editLoanStart(state, action);
    case actionTypes.EDIT_LOAN_SUCCESS: return editLoanSuccess(state, action);
    case actionTypes.EDIT_LOAN_FAIL: return editLoanFail(state, action);
    default: return state;
    }
};

export default reducer;
