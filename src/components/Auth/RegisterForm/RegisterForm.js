import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Result, Typography } from 'antd';
import styles from './RegisterForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class RegisterForm extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.register(values.name, values.email, values.password, values.c_password)
            }
        });
    };

    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/" />
        }
        const { getFieldDecorator } = this.props.form;

        let registerForm = null;

        if (this.props.register_message) {
            registerForm = (
                <Result
                    status="success"
                    title="Successfully Registered!"
                    subTitle={this.props.register_message}
                    extra={[
                        <Button type="primary" key="loginButton" onClick={this.props.login}>
                            Go to Login
                        </Button>,
                    ]}
                />
            );
        }
        else {
            registerForm = (
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

                    <Form.Item>
                        <Button type="primary"
                            htmlType="submit"
                            className={styles.RegisterFormButton}
                            size="large"
                        >
                            Register
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
                {errors}
                {registerForm}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.register.loading,
        error: state.register.error,
        register_message: state.register.register_message,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return {
        register: (name, email, password, c_password) => dispatch(actions.register(name, email, password, c_password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ '))
    }
}
//export default Form.create()(RegisterForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RegisterForm));
