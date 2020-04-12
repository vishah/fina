import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import EditUserForm from './Forms/EditUserForm';
import { Redirect } from 'react-router';

class UsersEditUser extends Component {
    state = {}
    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/login" />
        }

        return (
            <div>
                {authRedirect}
                <EditUserForm />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.users.users,
        selectedUserId:state.users.selectedUserId,
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
        initUsers: () => dispatch(actions.initUsers()),
        setSelectedUserId: (selectedUserId) => dispatch(actions.setSelectedUserId(selectedUserId)),
        unsetSelectedLoanId: () => dispatch(actions.unsetSelectedLoanId())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UsersEditUser);
