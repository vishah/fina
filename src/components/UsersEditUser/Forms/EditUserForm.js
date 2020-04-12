import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, Checkbox, Select,
    Cascader, InputNumber, Upload, Typography, Radio,
    PageHeader,Popconfirm,notification
} from 'antd';
import styles from './EditUserForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class EditUserForm extends Component {
    state = { idCardAttachment: [],
              deleteAccountRedirect:false,
    }
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let newUser = {
                    name:values.name,
                    email:values.email,
                    password:values.password,
                    c_password:values.c_password,
                    role:values.role
                };
                this.props.editUser(
                    newUser,
                    this.props.selectedUserId,
                    'sdsdsd');
            }
        });
    };


    componentDidUpdate=(prevProps)=> {
        if(
            prevProps.editUserLoading!==this.props.editUserLoading &&
            this.props.editUserLoading === false &&
            prevProps.editUserMessage!==this.props.editUserMessage&&
            this.props.editUserMessage !== null
        ){
            notification.success({
                message:"Success",
                description:"Successfully updated account.",
                placement:"topRight"
            });
        }
    }


    onDeleteUserConfirm = (e) => {
        this.props.initDeleteUser(this.props.selectedUserId);
        this.setState({
            deleteUserRedirect:true
        })
    }
    onDeleteUserCancel = (e) => {

    }



    render() {
        let authRedirect = null;
        let editedUserRedirect = null;
        let deleteUserRedirect = null;

        if (this.props.editUserMessage != null) {
            editedUserRedirect = <Redirect to="/" />
        }
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/" />
        }

        if (this.state.deleteUserRedirect === true) {
            deleteUserRedirect = <Redirect to="/users/all" />
        }

        const { getFieldDecorator } = this.props.form;
        const { Text } = Typography;

        let serverErrors = null;

        if (this.props.editUserErrors &&
            Array.isArray(this.props.editUserErrors) &&
            this.props.editUserErrors.length > 0) {
            let lis =
                this.props.editUserErrors.map((value, index) => (
                    <li key={index}><Text type="danger">{value}</Text></li>
                ));
            serverErrors = (<ul>{lis}</ul>)
        }

        const selUser = this.props.selectedUser;
        let nullSelectedUserRedirect = null;

        let _name = null;
        let _email = null;
        let _role = null;

        if (selUser !== null) {
            _name = (selUser.name !== undefined) ? selUser.name : null;
            _email = (selUser.email !== undefined) ? selUser.email : null;
            _role = (selUser.role !== undefined) ? selUser.role : null;
        }
        else {
            nullSelectedUserRedirect = <Redirect to="/" />
        }
        let deleteBtn = null;
        if(this.props.userRoleAdmin==1){
            deleteBtn=(<Popconfirm
                title="Are you sure delete this account?"
                onConfirm={this.onDeleteUserConfirm}
                onCancel={this.onDeleteUserCancel}
                okText="Yes"
                cancelText="No"
            >
                <Button key="2">Delete account</Button>
            </Popconfirm>
            );
        }
        return (
            <div>
                {/*authRedirect*/}
                {editedUserRedirect}
                {deleteUserRedirect}
                {nullSelectedUserRedirect}
                {serverErrors}
                <PageHeader
                    title="Edit User"
                    onBack={() => window.history.back()}
                     extra={[
                         deleteBtn
                     ]}
                />
                <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="Name">
                        {getFieldDecorator('name', {
                            initialValue: _name,
                            rules: [{ required: true, message: 'Please input your name!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Name"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Email">
                        {getFieldDecorator('email', {
                            initialValue: _email,
                            rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Type password(to change password)">
                        {getFieldDecorator('password', {
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Retype password">
                        {getFieldDecorator('c_password', {
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Retype Password"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Role">
                        {getFieldDecorator('role', {
                            initialValue: _role,
                            rules: [{ required: true, message: 'Please input Phone Number!' }],
                        })(
                            <Radio.Group>
                                <Radio value="0">Admin</Radio>
                                <Radio value="1">Accounts (Moderator)</Radio>
                                <Radio value="2">Cashier (Standard User)</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>

                    <Button type="primary"
                        htmlType="submit"
                        className={styles.EditUserButton}
                        size="large"
                    >
                        Edit User
                   </Button>

                </Form >
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        editUserLoading: state.users.editUserLoading,
        editUserMessage: state.users.editUserMessage,
        editUserErrors: state.users.editUserErrors,
        selectedUserId: state.users.selectedUserId,
        selectedUser: state.users.selectedUser,
        userRoleAdmin: state.auth.user_role_admin,
        userRoleModerator: state.auth.user_role_moderator,
        userRoleStandard: state.auth.user_role_standard,

    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        editUser: (user, selectedUserId, token) => dispatch(actions.editUser(user, selectedUserId, token)),

        initDeleteUser: (userId) => dispatch(actions.initDeleteUser(userId)),
    }
}
//export default Form.create()(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditUserForm));
