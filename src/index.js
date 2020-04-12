import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import registerReducer from './store/reducers/register';
import accountsReducer from './store/reducers/accounts';
import usersReducer from './store/reducers/users';
import loansReducer from './store/reducers/loans';
import loanIntervalsReducer from './store/reducers/loanIntervals';
import accountStatementReportReducer from './store/reducers/accountStatementReport';
import allAccountsStatementReportReducer from './store/reducers/allAccountsStatementReport';
import duesReportReducer from './store/reducers/duesReport';
import allAccountsDuesReportReducer from './store/reducers/allAccountsDuesReport';
import loansIssuedReportReducer from './store/reducers/loansIssuedReport';

import generalSettingsReducer from './store/reducers/generalSettings';

import { saveState, loadState } from './localStorage';
import throttle from 'lodash.throttle';
import devToolsEnhancer from 'remote-redux-devtools';
import { composeWithDevTools } from 'remote-redux-devtools';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//const composeEnhancers = composeWithDevTools({ realtime: true, port: 8000 });


const rootReducer = combineReducers({
    auth: authReducer,
    register: registerReducer,
    accounts: accountsReducer,
    users: usersReducer,
    loans: loansReducer,
    loanIntervals: loanIntervalsReducer,
    accountStatementReport: accountStatementReportReducer,
    allAccountsStatementReport: allAccountsStatementReportReducer,
    loansIssuedReport:loansIssuedReportReducer,
    duesReport:duesReportReducer,
    allAccountsDuesReport:allAccountsDuesReportReducer,
    generalSettings:generalSettingsReducer
});

const persistedState = loadState();

const store = createStore(rootReducer,
    persistedState,
    composeEnhancers(
        applyMiddleware(thunk)
    ));

//const store = createStore(rootReducer,
//                      /*persistedState,*/
//composeWithDevTools(
//    applyMiddleware(thunk)
//));


store.subscribe(throttle(() => {
    saveState(store.getState());
}, 1000));


const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
