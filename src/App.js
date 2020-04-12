import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
//import SpeedBoatRequest from './components/SpeedBoatRequest/SpeedBoatRequest';
//import SpeedBoatSelect from './components/SpeedBoatSelect/SpeedBoatSelect';
//import VehicleRequest from './components/VehicleRequest/VehicleRequest';
import AccountsOverview from './components/AccountsOverview/AccountsOverview';
import AccountsAccountDetails from './components/AccountsAccountDetails/AccountsAccountDetails';
import AccountsCreateAccount from './components/AccountsCreateAccount/AccountsCreateAccount';
import AccountsMasterSheet from './components/AccountsMasterSheet/AccountsMasterSheet';
import ReportsAccountStatementReport from './components/ReportsAccountStatementReport/ReportsAccountStatementReport';
import ReportsAllAccountsStatementReport from './components/ReportsAllAccountsStatementReport/ReportsAllAccountsStatementReport';

import ReportsDuesReport from './components/ReportsDuesReport/ReportsDuesReport';
import ReportsAllAccountsDuesReport from './components/ReportsAllAccountsDuesReport/ReportsAllAccountsDuesReport';

import ReportsLoansIssuedReport from './components/ReportsLoansIssuedReport/ReportsLoansIssuedReport';
import LoansCreateLoan from './components/LoansCreateLoan/LoansCreateLoan';
import LoansEditLoan from './components/LoansEditLoan/LoansEditLoan';
import AccountsEditAccount from './components/AccountsEditAccount/AccountsEditAccount';
import UsersCreateUser from './components/UsersCreateUser/UsersCreateUser';
import UsersEditUser from './components/UsersEditUser/UsersEditUser';
import UsersAllUsers from './components/UsersAllUsers/UsersAllUsers';


import GeneralSettings from './components/GeneralSettings/GeneralSettings';

import Auth from './components/Auth/Auth';
import Logout from './components/Auth/Logout/Logout';
import LayoutView from './components/DisplayContainers/LayoutView/LayoutView';
import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount = () => {
      this.props.onTryAutoSignup(this.props.access_token, this.props.refresh_token,
                                 this.props.expires_in, this.props.expires_in_seconds,
                                 this.props.user_role_admin, this.props.user_role_moderator,
                                 this.props.user_role_standard
      );
  }

  render() {
    const accountsOverviewView = (
      <LayoutView current="accountsOverview">
        <AccountsOverview />
      </LayoutView>
    );

    const accountsCreateAccountView = (
      <LayoutView current="AccountsCreateAccount">
        <AccountsCreateAccount />
      </LayoutView>
    );

    const accountsGenerateReportsView = (
      <LayoutView current="accountsGenerateReports">
        <h1>Generate Reports</h1>
      </LayoutView>
    );

    const AccountsMasterSheetView = (
      <LayoutView current="accountsMasterSheet">
          <AccountsMasterSheet/>
      </LayoutView>
    );

    const AccountsAccountDetailsView = (
      <LayoutView current="AccountsAccountDetails">
        <AccountsAccountDetails />
      </LayoutView>
    );

    const accountsEditAccountView = (
      <LayoutView current="AccountsEditAccount">
        <AccountsEditAccount />
      </LayoutView>
    );


    const loansCreateLoanView = (
      <LayoutView current="LoansCreateLoan">
        <LoansCreateLoan />
      </LayoutView>
    );

    const loansEditLoanView = (
      <LayoutView current="LoansEditLoan">
        <LoansEditLoan />
      </LayoutView>
    );

      const ReportsAccountStatementReportView = (
          <LayoutView current="ReportsAccountStatement">
              <ReportsAccountStatementReport />
          </LayoutView>
      );

      const ReportsAllAccountsStatementReportView= (
          <LayoutView current="ReportsAllAccountsStatementReport">
              <ReportsAllAccountsStatementReport/>
          </LayoutView>
      );

      const ReportsDuesReportView = (
          <LayoutView current="ReportsDues">
              <ReportsDuesReport />
          </LayoutView>
      );

      const ReportsAllAccountsDuesReportView= (
          <LayoutView current="ReportsAllAccountsDuesReport">
              <ReportsAllAccountsDuesReport/>
          </LayoutView>
      );

      const ReportsLoansIssuedReportView= (
          <LayoutView current="ReportsLoansIssuedReport">
              <ReportsLoansIssuedReport/>
          </LayoutView>
      );


      const reportsReportSettingsView = (
          <LayoutView current="reportsReportSettings">
              <h1>reportsReportSettings</h1>
          </LayoutView>
      );

      const GeneralSettingsView = (
          <LayoutView current="GeneralSettings">
              <GeneralSettings/>
          </LayoutView>
      );

      const UsersAllUsersView = (
          <LayoutView current="UsersAllUsers">
              <UsersAllUsers/>
          </LayoutView>
      );

      const UsersCreateUserView = (
          <LayoutView current="UsersCreateUserView">
              <UsersCreateUser />
          </LayoutView>
      );

      const UsersEditUserView = (
          <LayoutView current="UsersEditUserView">
              <UsersEditUser />
          </LayoutView>
      );



      const authView = (
          <LayoutView current="auth">
              <Auth />
          </LayoutView>
    )

    return (
      <Switch >
        <Route path="/" exact render={renderProps => (accountsOverviewView)} />
        <Route path="/accounts/overview" exact
          render={renderProps => (accountsOverviewView)} />
        <Route path="/accounts/create" exact
          render={renderProps => (accountsCreateAccountView)} />
        <Route path="/accounts/generate-reports" exact
          render={renderProps => (accountsGenerateReportsView)} />
        <Route path="/accounts/master-sheet" exact
          render={renderProps => (AccountsMasterSheetView)} />
        <Route path={'/account/details'} exact
          render={renderProps => (AccountsAccountDetailsView)} />
        <Route path={'/borrowings/create'} exact
          render={renderProps => (loansCreateLoanView)} />
        <Route path={'/borrowings/edit'} exact
          render={renderProps => (loansEditLoanView)} />
        <Route path={'/accounts/edit'} exact
          render={renderProps => (accountsEditAccountView)} />
        <Route path="/reports/account-statement" exact
          render={renderProps => (ReportsAccountStatementReportView)} />
        <Route path="/reports/all-accounts-statement" exact
               render={renderProps => (ReportsAllAccountsStatementReportView)} />

        <Route path="/reports/dues-report" exact
               render={renderProps => (ReportsDuesReportView)} />
        <Route path="/reports/all-accounts-dues-report" exact
               render={renderProps => (ReportsAllAccountsDuesReportView)} />


        <Route path="/reports/borrowings-issued-report" exact
               render={renderProps => (ReportsLoansIssuedReportView)} />
        <Route path="/reports/settings" exact
          render={renderProps => (reportsReportSettingsView)} />

        <Route path="/settings/general" exact
               render={renderProps => (GeneralSettingsView)} />

        <Route path="/users/all" exact
          render={renderProps => (UsersAllUsersView)} />
        <Route path="/users/create" exact
          render={renderProps => (UsersCreateUserView)} />
        <Route path="/users/edit" exact
               render={renderProps => (UsersEditUserView)} />


        <Route path="/login" exact render={renderPros => (authView)} />
        <Route path="/logout" exact component={Logout} />

      </Switch>
    );
  }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        access_token: state.auth.access_token,
        refresh_token: state.auth.refresh_token,
        expires_in: state.auth.expires_in,
        expires_in_seconds: state.auth.expires_in_seconds,
        user_role_admin: state.auth.user_role_admin,
        user_role_moderator: state.auth.user_role_moderator,
        user_role_standard: state.auth.user_role_standard
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: (accessToken, refreshToken, expiresIn, expiresInSeconds, userRoleAdmin, userRoleModerator, userRoleStandard) => dispatch(actions.authCheckState(accessToken, refreshToken, expiresIn, expiresInSeconds, userRoleAdmin, userRoleModerator, userRoleStandard))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

/*
const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}
export default connect(null, mapDispatchToProps)(App);
*/
