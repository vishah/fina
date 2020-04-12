import React, { Component } from 'react';
import { Row, Col, Select, Table, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as actions from '../../store/actions/index';

class UsersAllUsers extends Component {

    componentDidMount() {
        this.props.initUsers();
    }

    state = {
        goToUserEdit: false
    }

    onRowClick = (record) => {
        let currUserId = record['id'];
        this.props.setSelectedUserId(currUserId);
        this.setState({
            goToUserEdit: true
        });
    }

    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/login" />
        }

        let userEditRedirect = null;
        if (this.state.goToUserEdit === true) {
            userEditRedirect = <Redirect push={true} to="/users/edit" />;
        }
        else {
            userEditRedirect = null;
        }

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Admin role',
                dataIndex: 'role_admin',
                render:(text,record)=>{
                    if(text=="1"){
                        return <Icon type="check" style={{color:'green'}}/>
                    }
                    else {
                        return <Icon type="close" style={{color:'red'}}/>
                    }
                },
                key: 'role_admin',
            },
            {
                title: 'Moderator role',
                dataIndex: 'role_moderator',
                render:(text,record)=>{
                    if(text=="1"){
                        return <Icon type="check" style={{color:'green'}}/>
                    }
                    else {
                        return <Icon type="close" style={{color:'red'}}/>
                    }
                },
                key: 'role_moderator',
            },
            {
                title: 'Standard role',
                dataIndex: 'role_standard',
                render:(text,record)=>{
                    if(text=="1"){
                        return <Icon type="check" style={{color:'green'}}/>
                    }
                    else {
                        return <Icon type="close" style={{color:'red'}}/>
                    }
                },
                key: 'role_standard',
            },
            {
                title: 'View',
                dataIndex: 'id',
                render: (text, record) =>{
                    if(this.props.userRoleAdmin==1 || this.props.userRoleModerator==1){
                        return <Button shape="circle" icon="select"
                                       onClick={() => this.onRowClick(record)}
                        />
                    }
                    else {
                        return <Button shape="circle" icon="select"
                                       disabled
                        />
                    }

                }
            },


        ];
        return (
            < div >
                {authRedirect}
                {userEditRedirect}
                <Table
                    dataSource={this.props.users}
                    columns={columns}
                />
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        users: state.users.users,
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        userRoleAdmin: state.auth.user_role_admin,
        userRoleModerator: state.auth.user_role_moderator,
        userRoleStandard: state.auth.user_role_standard,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        initUsers: () => dispatch(actions.initUsers()),
        setSelectedUserId: (selectedUserId) => dispatch(actions.setSelectedUserId(selectedUserId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersAllUsers);
