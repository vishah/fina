import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    allAccountsStatementReport:[],
    allAccountsStatementReportLoading: false,
    allAccountsStatementReportMessage: null,
    allAccountsStatementReportError: null,
};

const allAccountsStatementReportStart = (state, action) => {
    return updateObject(state, {
        allAccountsStatementReportError: null,
        allAccountsStatementReportLoading: true,
        allAccountsStatementReportMessage: null
    });
};

const allAccountsStatementReportSuccess = (state, action) => {
    return updateObject(state, {
        allAccountsStatementReport: action.allAccountsStatementReport,
        allAccountsStatementReportError: null,
        allAccountsStatementReportLoading: false,
        allAccountsStatementReportMessage: null
    });
};

const allAccountsStatementReportFail = (state, action) => {
    return updateObject(state, {
        allAccountsStatementReportError: action.error,
        allAccountsStatementReportLoading: false,
        allAccountsStatementReportMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.ALL_ACCOUNTS_STATEMENT_REPORT_START: return allAccountsStatementReportStart(state, action);
    case actionTypes.ALL_ACCOUNTS_STATEMENT_REPORT_SUCCESS: return allAccountsStatementReportSuccess(state, action);
    case actionTypes.ALL_ACCOUNTS_STATEMENT_REPORT_FAIL: return allAccountsStatementReportFail(state, action);
        default: return state;
    }
}

export default reducer;
