import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    allAccountsDuesReport:[],
    allAccountsDuesReportLoading: false,
    allAccountsDuesReportMessage: null,
    allAccountsDuesReportError: null,
};

const allAccountsDuesReportStart = (state, action) => {
    return updateObject(state, {
        allAccountsDuesReportError: null,
        allAccountsDuesReportLoading: true,
        allAccountsDuesReportMessage: null
    });
};

const allAccountsDuesReportSuccess = (state, action) => {
    return updateObject(state, {
        allAccountsDuesReport: action.allAccountsDuesReport,
        allAccountsDuesReportError: null,
        allAccountsDuesReportLoading: false,
        allAccountsDuesReportMessage: null
    });
};

const allAccountsDuesReportFail = (state, action) => {
    return updateObject(state, {
        allAccountsDuesReportError: action.error,
        allAccountsDuesReportLoading: false,
        allAccountsDuesReportMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.ALL_ACCOUNTS_DUES_REPORT_START: return allAccountsDuesReportStart(state, action);
    case actionTypes.ALL_ACCOUNTS_DUES_REPORT_SUCCESS: return allAccountsDuesReportSuccess(state, action);
    case actionTypes.ALL_ACCOUNTS_DUES_REPORT_FAIL: return allAccountsDuesReportFail(state, action);
        default: return state;
    }
}

export default reducer;
