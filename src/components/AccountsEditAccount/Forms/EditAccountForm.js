import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, Checkbox, Select,
    Cascader, InputNumber, Upload, Typography,notification,
    PageHeader
} from 'antd';
import styles from './EditAccountForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class EditAccountForm extends Component {
    state = { idCardAttachment: [] }
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let newAccount = {
                    type: '1',
                    account_name: values.account_name,
                    account_id_card: values.account_id_card,
                    account_phone_no: values.account_phone_no,
                    id_card_attachment: this.state.idCardAttachment[0],
                    nation_id: 3
                };
                this.props.editAccount(
                    newAccount,
                    this.props.selectedAccountId,
                    'sdsdsd');
            }
        });
    };


    componentDidUpdate=(prevProps)=> {
        console.log(prevProps.editAccountLoading, this.props.editAccountLoading);
        if(
           prevProps.editAccountLoading!==this.props.editAccountLoading &&
           this.props.editAccountLoading === false &&
           prevProps.editAccountMessage!==this.props.editAccountMessage&&
           this.props.editAccountMessage !== null
        ){
            notification.success({
                message:"Success",
                description:"Successfully updated account.",
                placement:"topRight"
            });
        }
    }

    render() {
        let authRedirect = null;
        let createdAccountRedirect = null;

        if (this.props.editAccountMessage != null) {
            createdAccountRedirect = <Redirect to="/" />
        }
        const { idCardAttachment } = this.state;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/" />
        }
        const props = {
            onRemove: file => {
                this.setState({
                    idCardAttachment: []
                });
            },
            beforeUpload: file => {
                this.setState({
                    idCardAttachment: [file],
                });
                return false;
            },
            idCardAttachment,
        };
        const { getFieldDecorator } = this.props.form;
        const { Text } = Typography;

        let serverErrors = null;

        if (this.props.editAccountErrors.length > 0) {
            let lis =
                this.props.editAccountErrors.map((value, index) => (
                    <li key={index}><Text type="danger">{value}</Text></li>
                ));
            serverErrors = (<ul>{lis}</ul>)
        }

        const selAccount = this.props.selectedAccount;
        let nullSelectedAccountRedirect = null;
        let accountName = null;
        let accountIdCard = null;
        let accountPhoneNo = null;

        if (selAccount !== null) {
            accountName = (selAccount.account_name !== undefined) ? selAccount.account_name : null;
            accountIdCard = (selAccount.account_id_card !== undefined) ? selAccount.account_id_card : null;
            accountPhoneNo = (selAccount.account_phone_no !== undefined) ? selAccount.account_phone_no : null;
        }
        else {
            nullSelectedAccountRedirect = <Redirect to="/" />
        }

        return (
            <div>
                {/*authRedirect*/}
                {nullSelectedAccountRedirect}
                {serverErrors}
                <PageHeader
                    title="Edit Account"
                    onBack={() => window.history.back()}
                />
                <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="Name">
                        {getFieldDecorator('account_name', {
                            initialValue: accountName,
                            rules: [{ required: true, message: 'Please input name!' }],
                        })(
                            <Input
                                placeholder="Name"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="National ID No">
                        {getFieldDecorator('account_id_card', {
                            initialValue: accountIdCard,
                            rules: [{ required: true, message: 'Please input ID Card Number!' }],
                        })(
                            <Input
                                placeholder="National ID No"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Phone Number">
                        {getFieldDecorator('account_phone_no', {
                            initialValue: accountPhoneNo,
                            rules: [{ required: true, message: 'Please input Phone Number!' }],
                        })(
                            <Input
                                placeholder="Phone Number"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="National ID Card">
                        {getFieldDecorator('id_card_attachment', {

                        })(

                            <Upload
                                multiple={false}
                                fileList={this.state.idCardAttachment}
                                {...props}>
                                <Button> <Icon type="upload" /> Select File </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <Button type="primary"
                        htmlType="submit"
                        className={styles.EditAccountButton}
                        size="large"
                    >
                        Update Account
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
        editAccountLoading: state.accounts.editAccountLoading,
        editAccountMessage: state.accounts.editAccountMessage,
        editAccountErrors: state.accounts.editAccountErrors,
        selectedAccountId: state.accounts.selectedAccountId,
        selectedAccount: state.accounts.selectedAccount
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        editAccount: (account, selectedAccountId, token) => dispatch(actions.editAccount(account, selectedAccountId, token))
    }
}
//export default Form.create()(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditAccountForm));
