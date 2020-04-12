import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    islands: [],
    error: false
}

const setIslands = (state, action) => {
    return updateObject(state, {
        islands: action.islands,
        error: false
    })
}
const fetchIslandsFailed = (state, action) => {
    return updateObject(state, { error: true });
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ISLANDS: return setIslands(state, action)
        case actionTypes.FETCH_ISLANDS_FAILED: return fetchIslandsFailed(state, action)
        default: return state;
    }
}

export default reducer;
