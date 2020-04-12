import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    duesReport:[],
    duesReportLoading: false,
    duesReportMessage: null,
    duesReportError: null,
};

const duesReportStart = (state, action) => {
    return updateObject(state, {
        duesReportError: null,
        duesReportLoading: true,
        duesReportMessage: null
    });
};

const duesReportSuccess = (state, action) => {
    return updateObject(state, {
        duesReport: action.duesReport,
        duesReportError: null,
        duesReportLoading: false,
        duesReportMessage: null
    });
};

const duesReportFail = (state, action) => {
    return updateObject(state, {
        duesReportError: action.error,
        duesReportLoading: false,
        duesReportMessage: null
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.DUES_REPORT_START: return duesReportStart(state, action);
    case actionTypes.DUES_REPORT_SUCCESS: return duesReportSuccess(state, action);
    case actionTypes.DUES_REPORT_FAIL: return duesReportFail(state, action);
        default: return state;
    }
}

export default reducer;
