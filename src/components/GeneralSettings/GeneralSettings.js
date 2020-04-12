import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import GeneralSettingsForm from './Forms/GeneralSettingsForm';

class GeneralSettings extends Component {
    state = {}
    render() {
        return (
            <div>
                <GeneralSettingsForm />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath
    }
}


const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        initAccounts: () => dispatch(actions.initAccounts()),
        setSelectedAccountId: (selectedAccountId) => dispatch(actions.setSelectedAccountId(selectedAccountId)),
        unsetSelectedLoanId: () => dispatch(actions.unsetSelectedLoanId())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings);
