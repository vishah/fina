import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    one_way: [],
    round_trip: [],
    multi_stop: [],
    one_way_fields: [],
    round_trip_fields: [],
    multi_stop_fields: [],
}

const setTrips = (state, action) => {
    switch (action.way) {
        case 'one_way':
            return updateObject(state, {
                one_way: action.trips,
            });
        case 'round_trip':
            return updateObject(state, {
                round_trip: action.trips,
            });
        case 'multi_stop':
            return updateObject(state, {
                multi_stop: action.trips,
            });
        default: return state;
    }
}

const setTripsFields = (state, action) => {
    switch (action.way) {
        case 'one_way':
            return updateObject(state, {
                one_way_fields: updateObject(state.one_way_fields, { ...action.fields }),
            });
        case 'round_trip':
            return updateObject(state, {
                round_trip_fields: action.fields,
            });
        case 'multi_stop':
            let tfms = action.fields
            Object.keys(tfms).forEach((key) => {
                let filtered = { ...tfms[key] };
                for (var propName in filtered) {
                    if (filtered[propName] === null || filtered[propName] === undefined) {
                        delete filtered[propName];
                    }
                }
                console.log("converted to obj", filtered);
                let final = { ...state.multi_stop_fields[key], ...filtered }
                tfms[key] = final;
            });
            console.log("tfms", tfms)
            return updateObject(state, {
                multi_stop_fields: updateObject(state.multi_stop_fields, { ...tfms }),
            });
        default: return state;
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TRIPS: return setTrips(state, action)
        case actionTypes.SET_TRIPS_FIELDS: return setTripsFields(state, action)
        default: return state;
    }
}

export default reducer;
