import React, { Component } from 'react';
import { Form, Icon, Input, Button, Result, Typography, Radio,
         PageHeader
} from 'antd';
import styles from './CreateUserForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class CreateUserForm extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let newUser = {
                    name:values.name,
                    email:values.email,
                    password:values.password,
                    c_password:values.c_password,
                    role:values.role
                };
                this.props.createUser(newUser,'dfdf')
            }
            else {
                console.log(err)
            }
        });
    };

    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/login" />
        }
        const { getFieldDecorator } = this.props.form;

        let createUserForm = null;

        if (this.props.createUserMessage) {
            createUserForm = (
                <Result
                    status="success"
                    title="Successfully Created User!"
                    subTitle={this.props.createUserMessage}
                />
            );
        }
        else {
            createUserForm = (
                < Form onSubmit={this.handleSubmit} className="login-form" >
                    <Form.Item>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input your name!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Name"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input your email!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="email"
                                placeholder="Email"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('c_password', {
                            rules: [{ required: true, message: 'Retype your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Retype Password"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Roles">
                        {getFieldDecorator('role')(
                            <Radio.Group>
                                <Radio value="0">Admin</Radio>
                                <Radio value="1">Accounts (Moderator)</Radio>
                                <Radio value="2">Cashier (Standard User)</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary"
                            htmlType="submit"
                            className={styles.CreateUserFormButton}
                            size="large"
                        >
                            CreateUser
                    </Button>
                    </Form.Item>
                </Form >
            );
        }

        let errors = null;
        if (this.props.error) {
            errors = Object.keys(this.props.error).map(
                (key) => <Typography.Text key={key} type="danger">{this.props.error[key]}</Typography.Text>
            );
        }
        return (
            <div>
                {authRedirect}
                <PageHeader
                    title="Create User"
                    onBack={() => window.history.back()}
                />
                {errors}
                {createUserForm}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        createUserLoading: state.users.createUserLoading,
        createUserMessage: state.users.createUserMessage,
        createUserErrors: state.users.createUserErrors,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return {
        createUser: (user, token) => dispatch(actions.createUser(user, token)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ '))
    }
}
//export default Form.create()(CreateUserForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateUserForm));
