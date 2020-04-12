import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import CreateLoanForm from './Forms/EditLoanForm';
import { Redirect } from 'react-router';

class AccountsCreateLoan extends Component {
    state = {}
    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/login" />
        }

        return (
            <div>
                {authRedirect}
                <CreateLoanForm />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedAccountId: state.accounts.selectedAccountId,
        selectedAccount: state.accounts.selectedAccount,
        selectedLoanId: state.loans.selectedLoanId,
        selectedLoan: state.loans.selectedLoan,
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
export default connect(mapStateToProps, mapDispatchToProps)(AccountsCreateLoan);
