import React, { Component } from 'react';
import { Form, Icon, Input, Button, Result, Typography } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CreateUserForm from './Forms/CreateUserForm';

class UsersCreateUser extends Component {
    state = {}
    render() {
        return (
            <div>
                <CreateUserForm />
            </div>
        );
    }
}

export default UsersCreateUser;
