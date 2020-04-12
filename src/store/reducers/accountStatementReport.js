import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    accountStatementReport:[],
    accountStatementReportLoading: false,
    accountStatementReportMessage: null,
    accountStatementReportError: null,
};

const accountStatementReportStart = (state, action) => {
    return updateObject(state, {
        accountStatementReportError: null,
        accountStatementReportLoading: true,
        accountStatementReportMessage: null
    });
};

const accountStatementReportSuccess = (state, action) => {
    return updateObject(state, {
        accountStatementReport: action.accountStatementReport,
        accountStatementReportError: null,
        accountStatementReportLoading: false,
        accountStatementReportMessage: null
    });
};

const accountStatementReportFail = (state, action) => {
    return updateObject(state, {
        accountStatementReportError: action.error,
        accountStatementReportLoading: false,
        accountStatementReportMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.ACCOUNT_STATEMENT_REPORT_START: return accountStatementReportStart(state, action);
    case actionTypes.ACCOUNT_STATEMENT_REPORT_SUCCESS: return accountStatementReportSuccess(state, action);
    case actionTypes.ACCOUNT_STATEMENT_REPORT_FAIL: return accountStatementReportFail(state, action);
        default: return state;
    }
}

export default reducer;
