import React, { Component } from 'react';
import Logo from '../../../assets/logo.png';
import { Menu, Layout, Icon } from 'antd';
import styles from './LayoutView.module.css';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
const { Header, Content, Sider } = Layout;

class LayoutView extends Component {
    state = {
        current: 'speedboat-request',
    };


    componentDidMount() {

    }

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });

    };

    menuOnClick = (item) => {
        console.log(item.key)
    }

    render() {
        const { SubMenu } = Menu;

        let containerClass = styles.Container;
        let logo="http://fina.mv/storage/logos/logo.png";

        return (
            <Layout className={containerClass}>
                <Header
                    theme="light"
                >
                    <img className={styles.Logo} src={logo} alt="MyBurger"></img>

                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                        onClick={this.handleClick}
                    >
                        {!this.props.isAuthenticated
                        ? <Menu.Item key="login">
                            <NavLink
                                to='/login'
                                exact
                            >
                                Login
                            </NavLink>
                        </Menu.Item>
                        : <Menu.Item key="logout">
                            <NavLink
                                to='/logout'
                                exact
                            >
                                Logout
                            </NavLink>
                        </Menu.Item>
                        }
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={250} collapsible={true} style={{ background: '#AAAAAA' }} breakpoint="lg" collapsedWidth="0">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%' }}
                            onClick={this.menuOnClick}
                        >
                            <SubMenu
                                key="accounts"
                                title={
                                    <span><Icon type="bank" />Accounts</span>
                                }
                            >
                                <Menu.Item key="accountsOverview">
                                    <NavLink to='/accounts/overview' exact >Overview</NavLink>
                                </Menu.Item>
                                {(this.props.userRoleAdmin==1 || this.props.userRoleModerator==1) &&
                                <Menu.Item key="accountsCreateAccount">
                                    <NavLink to='/accounts/create' exact >Create Account</NavLink>
                                </Menu.Item>
                                }
                                <Menu.Item key="accountsMasterSheet">
                                    <NavLink to='/accounts/master-sheet' exact >Master Sheet</NavLink>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="reports"
                                title={
                                    <span><Icon type="container" />Reports</span>
                                }
                            >
                                <Menu.Item key="reportsAccountStatement">
                                    <NavLink to="/reports/account-statement" exact>
                                        Account Statement
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key="reportsAllAccountsStatement">
                                    <NavLink to="/reports/all-accounts-statement" exact>
                                        All Accounts Statement
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key="reportsLoansIssued">
                                    <NavLink to="/reports/borrowings-issued-report" exact>
                                        Borrowings Issued Report
                                    </NavLink>
                                </Menu.Item>

                                <Menu.Item key="reportsDuesReport">
                                    <NavLink to="/reports/dues-report" exact>
                                        Dues Report
                                    </NavLink>
                                </Menu.Item>
                                <Menu.Item key="reportsAllAccountsDuesReport">
                                    <NavLink to="/reports/all-accounts-dues-report" exact>
                                        All Accounts Dues Report
                                    </NavLink>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="users"
                                title={
                                    <span><Icon type="user" />User Management</span>
                                }
                            >
                                <Menu.Item key="UsersAllUsers">
                                    <NavLink to="/users/all" exact>
                                        All Users
                                    </NavLink>
                                </Menu.Item>

                                {(this.props.userRoleAdmin==1 || this.props.userRoleModerator==1) &&
                                <Menu.Item key="UsersCreateUsers">
                                    <NavLink to="/users/create" exact>
                                        Create User
                                    </NavLink>
                                </Menu.Item>
                                }
                            </SubMenu>
                            <SubMenu
                                key="configuration"
                                title={
                                    <span><Icon type="control" />Configuration</span>
                                }
                            >
                                <Menu.Item key="configurationGeneralSettings">
                                    <NavLink to="/settings/general" exact>
                                        General Settings
                                    </NavLink>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>

                    <Content style={{ padding: '50px 50px' }}>
                        {this.props.children}
                    </Content>

                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.access_token !== null,
        generalSettings:state.generalSettings.generalSettings,
        userRoleAdmin: state.auth.user_role_admin,
        userRoleModerator: state.auth.user_role_moderator,
        userRoleStandard: state.auth.user_role_standard,
    }
}
export default connect(mapStateToProps)(LayoutView);
