import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    loansIssuedReport:[],
    loansIssuedReportLoading: false,
    loansIssuedReportMessage: null,
    loansIssuedReportError: null,
};

const loansIssuedReportStart = (state, action) => {
    return updateObject(state, {
        loansIssuedReportError: null,
        loansIssuedReportLoading: true,
        loansIssuedReportMessage: null
    });
};

const loansIssuedReportSuccess = (state, action) => {
    return updateObject(state, {
        loansIssuedReport: action.loansIssuedReport,
        loansIssuedReportError: null,
        loansIssuedReportLoading: false,
        loansIssuedReportMessage: null
    });
};

const loansIssuedReportFail = (state, action) => {
    return updateObject(state, {
        loansIssuedReportError: action.error,
        loansIssuedReportLoading: false,
        loansIssuedReportMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.LOANS_ISSUED_REPORT_START: return loansIssuedReportStart(state, action);
    case actionTypes.LOANS_ISSUED_REPORT_SUCCESS: return loansIssuedReportSuccess(state, action);
    case actionTypes.LOANS_ISSUED_REPORT_FAIL: return loansIssuedReportFail(state, action);
        default: return state;
    }
}

export default reducer;
