import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, Checkbox, Select,
    Cascader, InputNumber, Upload, Typography,notification,
    PageHeader
} from 'antd';
import styles from './GeneralSettingsForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class GeneralSettingsForm extends Component {
    state = { logoAttachment: [] }
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let settings = {
                    title : values.title,
                    logo_attachment: this.state.logoAttachment[0],
                    company_name : values.company_name,
                    company_address : values.company_address,
                    company_phone_no : values.company_phone_no,
                    company_hotline_no : values.company_hotline_no,
                    company_fax_no : values.company_fax_no,
                    company_email : values.company_email,
                };
                this.props.editGeneralSettings(
                    settings,
                    'sdsdsd');
            }
        });
    };


    componentDidMount=()=>{
    }

    componentDidUpdate=(prevProps)=> {
        if(
           prevProps.editGeneralSettingsLoading!==this.props.editGeneralSettingsLoading &&
           this.props.editGeneralSettingsLoading === false &&
           prevProps.editGeneralSettingsMessage!==this.props.editGeneralSettingsMessage&&
           this.props.editGeneralSettingsMessage !== null
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

        const { logoAttachment } = this.state;
        if (!this.props.isAuthenticated) {
            console.log("yayyy");
            authRedirect = <Redirect to="/login" />
        }
        const props = {
            onRemove: file => {
                this.setState({
                    logoAttachment: []
                });
            },
            beforeUpload: file => {
                this.setState({
                    logoAttachment: [file],
                });
                return false;
            },
            logoAttachment,
        };

        const { getFieldDecorator } = this.props.form;
        const { Text } = Typography;

        let serverErrors = null;

        if (this.props.editGeneralSettingsErrors && this.props.editGeneralSettingsErrors.length > 0) {
            let lis =
                this.props.editGeneralSettingsErrors.map((value, index) => (
                    <li key={index}><Text type="danger">{value}</Text></li>
                ));
            serverErrors = (<ul>{lis}</ul>)
        }

        const generalSettings = this.props.generalSettings;
        let nullGeneralSettingsRedirect = null;
        let title = null;
        let accountIdCard = null;
        let companyName = null;
        let companyAddress = null;
        let companyPhoneNo = null;
        let companyHotlineNo = null;
        let companyFaxNo = null;
        let companyEmail = null;

        if (generalSettings !== null) {
            title = (generalSettings.title !== undefined) ? generalSettings.title : null;
            companyName = (generalSettings.company_name !== undefined) ? generalSettings.company_name : null;
            companyAddress = (generalSettings.company_address !== undefined) ? generalSettings.company_address : null;
            companyPhoneNo = (generalSettings.company_phone_no !== undefined) ? generalSettings.company_phone_no : null;
            companyHotlineNo = (generalSettings.company_hotline_no !== undefined) ? generalSettings.company_hotline_no : null;
            companyFaxNo = (generalSettings.company_fax_no !== undefined) ? generalSettings.company_fax_no : null;
            companyEmail = (generalSettings.company_email !== undefined) ? generalSettings.company_email : null;
        }
        else {
            nullGeneralSettingsRedirect = <Redirect to="/" />
        }


        return (
            <div>
                {authRedirect}
                {nullGeneralSettingsRedirect}
                {serverErrors}
                <PageHeader
                    title="Edit General Settings"
                    onBack={() => window.history.back()}
                />
                <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="Title">
                        {getFieldDecorator('title', {
                            initialValue: title,
                            rules: [{ required: true, message: 'Please input title!' }],
                        })(
                            <Input
                                placeholder="Title"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Logo">
                        {getFieldDecorator('logo_attachment', {

                        })(

                            <Upload
                                multiple={false}
                                fileList={this.state.logoAttachment}
                                {...props}>
                                <Button> <Icon type="upload" /> Select File </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item label="Company Name">
                        {getFieldDecorator('company_name', {
                            initialValue: companyName,
                            rules: [{ required: true, message: 'Please input company name!' }],
                        })(
                            <Input
                                placeholder="Company Name"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Company Address">
                        {getFieldDecorator('company_address', {
                            initialValue: companyAddress,
                            rules: [{ required: true, message: 'Please input company address!' }],
                        })(
                            <Input
                                placeholder="Company Address"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Company Phone No">
                        {getFieldDecorator('company_phone_no', {
                            initialValue: companyPhoneNo,
                            rules: [{ required: true, message: 'Please input company phone number!' }],
                        })(
                            <Input
                                placeholder="Company Phone No"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Company Hotline No">
                        {getFieldDecorator('company_hotline_no', {
                            initialValue: companyHotlineNo,
                            rules: [{ required: true, message: 'Please input company hotline number!' }],
                        })(
                            <Input
                                placeholder="Company Hotline No"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Company Fax No">
                        {getFieldDecorator('company_fax_no', {
                            initialValue: companyFaxNo,
                            rules: [{ required: true, message: 'Please input company fax number!' }],
                        })(
                            <Input
                                placeholder="Company Fax No"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Company Email">
                        {getFieldDecorator('company_email', {
                            initialValue: companyEmail,
                            rules: [{ required: true, message: 'Please input company email address!' }],
                        })(
                            <Input
                                placeholder="Company Email"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Button type="primary"
                        htmlType="submit"
                        className={styles.EditGeneralSettingsButton}
                        size="large"
                    >
                        Update General Settings
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
        editGeneralSettingsLoading: state.generalSettings.editGeneralSettingsLoading,
        editGeneralSettingsMessage: state.generalSettings.editGeneralSettingsMessage,
        editGeneralSettingsErrors: state.generalSettings.editGeneralSettingsErrors,
        generalSettings:state.generalSettings.generalSettings
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        editGeneralSettings: (generalSettings, token) => dispatch(actions.editGeneralSettings(generalSettings, token)),
        initGeneralSettings:()=>dispatch(actions.initGeneralSettings())
    }
}
//export default Form.create()(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(GeneralSettingsForm));
