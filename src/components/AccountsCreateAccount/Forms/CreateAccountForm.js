import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Select, Cascader,
         InputNumber, Upload, Typography, Radio,
         PageHeader, notification} from 'antd';
import styles from './CreateAccountForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class CreateAccountForm extends Component {
    state = { idCardAttachment: [] }
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let newAccount = {
                    type: values.type,
                    account_name: values.account_name,
                    account_id_card: values.account_id_card,
                    account_phone_no: values.account_phone_no,
                    id_card_attachment: this.state.idCardAttachment[0],
                    nation_id: 3
                };
                this.props.createAccount(newAccount, 'sdsdsd');
            }
        });
    };


    componentDidUpdate=(prevProps)=> {
        if(
            prevProps.createAccountLoading!==this.props.createAccountLoading &&
            this.props.createAccountLoading === false &&
            prevProps.createAccountMessage!==this.props.createAccountMessage&&
            this.props.createAccountMessage !== null
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

        if (this.props.createAccountMessage != null) {
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

        if (this.props.createAccountErrors.length > 0) {
            let lis =
                this.props.createAccountErrors.map((value, index) => (
                    <li key={index}><Text type="danger">{value}</Text></li>
                ));
            serverErrors = (<ul>{lis}</ul>)
        }
        return (
            <div>
                {/*authRedirect*/}
                {createdAccountRedirect}
                {serverErrors}
                <PageHeader
                    title="Create Account"
                    onBack={() => window.history.back()}
                />
                <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="Name">
                        {getFieldDecorator('account_name', {
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
                            rules: [{ required: true, message: 'Please upload id card!' }],
                        })(

                            <Upload
                                multiple={false}
                                fileList={this.state.idCardAttachment}
                                {...props}>
                                <Button> <Icon type="upload" /> Select File </Button>
                            </Upload>
                        )}
                    </Form.Item>
	            <Form.Item label="Type">
		        {getFieldDecorator('type',{
                            rules: [{ required: true, message: 'Please select account type!' }],
			})(
			     <Radio.Group
			     >
			         <Radio value="0">Organization</Radio>
			         <Radio value="1">Individual</Radio>
			     </Radio.Group>,
			 )}
		   </Form.Item>
                    <Button type="primary"
                        htmlType="submit"
                        className={styles.CreateAccountButton}
                        size="large"
                    >
                        Create Account
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
        createAccountLoading: state.accounts.createAccountLoading,
        createAccountMessage: state.accounts.createAccountMessage,
        createAccountErrors: state.accounts.createAccountErrors
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        createAccount: (account, token) => dispatch(actions.createAccount(account, token))
    }
}
//export default Form.create()(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateAccountForm));
