import React, { Component } from 'react';
import {
    Form, Icon, Input, DatePicker, Button, Checkbox, Select, Cascader,
    InputNumber, Upload, TimePicker, Radio, Typography,
    PageHeader, notification
} from 'antd';
import styles from './CreateLoanForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

class CreateLoanForm extends Component {
    state = {
        aggreementAttachment: [],
        loanAmount: 0,
        loanDateStart: moment(),
        loanDurationDays: 0,
        dueDateLoanCompletion: moment(),
        interestRateInPercent: 0,
        interestRateValue: 0,
        paymentIntervalType: 0,
        currency:'MVR'
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log("handle submit")
        this.props.form.validateFields((err, values) => {
		console.log(values)
            if (!err) {
                let newLoan = {
                    loan_duration_days: values.loan_duration_days,
                    date_loan_start: values.date_loan_start.format("YYYY-MM-DD"),
                    due_date_loan_completion: values.due_date_loan_completion.format("YYYY-MM-DD"),
                    //due_date_loan_completion_extended: values.due_date_loan_completion_extended.format("YYYY-MM-DD"),
                    //due_date_next_payment: values.due_date_next_payment.format("YYYY-MM-DD"),
                    loan_amount: values.loan_amount,
                    //balance_due: values.balance_due,
                    //interest_rate_percent: values.interest_rate_percent,
                    //interest_rate_value: values.interest_rate_value,
                    //loan_paid: values.loan_paid,
                    payment_per_interval: values.payment_per_interval,
                    payment_interval_type: values.payment_interval_type,
                    currency: values.currency,
                    agreement_attachment: values.agreement_attachment,
                    guardian_name: values.guardian_name,
                    guardian_phone_no: values.guardian_phone_no,
                    guardian_address: values.guardian_address,
                    guardian_id_card: values.guardian_id_card,
                    agreement_no: values.agreement_no
                };

                if (values.payment_interval_type == 0) {
                    newLoan['payment_interval_days'] = values.payment_interval_days
                }

                this.props.createLoan(
                    newLoan,
                    this.props.selectedAccountId,
                    'sdsdsd'
                );
            }
        });
    };

    validatePercentage = (rule, value, callback) => {

        if (value >= 0 && value <= 100) {
            callback();
        } else {
            callback('The interest should be a number!');
        }
    };

    onLoanDateStartChange = (val) => {
        let dueDateLoanCompletion = moment(val);
        dueDateLoanCompletion = dueDateLoanCompletion.add(this.state.loanDurationDays, "day");
        this.setState({
            loanDateStart: val,
            dueDateLoanCompletion: dueDateLoanCompletion
        })
    }

    onLoanDurationDaysChange = (val) => {
        if (val) {
            let dueDateLoanCompletion = moment(this.state.loanDateStart);
            dueDateLoanCompletion = dueDateLoanCompletion.add(val, "day");
            this.setState({
                loanDurationDays: val,
                dueDateLoanCompletion: dueDateLoanCompletion
            })
        }
    }

    onLoanAmountChange = (val) => {
        let interestRateValue = val * (this.state.interestRateInPercent / 100)
        this.setState({
            loanAmount: val,
            interestRateValue: interestRateValue
        })
    }

    onInterestRateInPercentChange = (val) => {
        let interestRateValue = this.state.loanAmount * (val / 100)
        this.setState({
            interestRateInPercent: val,
            interestRateValue: interestRateValue
        })
    }

    onPaymentIntervalTypeChange = (e) => {
        console.log(e.target.value)

        this.setState({
            paymentIntervalType: e.target.value
        })
    }

    onCurrencyChange = (e) => {
        this.setState({
            currency: e.target.value
        })
    }


    componentDidUpdate=(prevProps)=> {
        if(
            prevProps.createLoanLoading!==this.props.createLoanLoading &&
            this.props.createLoanLoading === false &&
            prevProps.createLoanMessage!==this.props.createLoanMessage&&
            this.props.createLoanMessage !== null
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
        let createdLoanRedirect = null;

        if (this.props.createLoanMessage != null) {
            createdLoanRedirect = <Redirect to="/" />
        }
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/" />
        }
        const { aggreementAttachment } = this.state;
        const props = {
            onRemove: file => {
                this.setState({
                    aggreementAttachment: []
                });
            },
            beforeUpload: file => {
                this.setState({
                    aggreementAttachment: [file],
                });
                return false;
            },
            aggreementAttachment,
        };
        const { getFieldDecorator } = this.props.form;

        let serverErrors = null;

        const { Text } = Typography;
        if (this.props.createLoanErrors.length > 0) {
            if (Array.isArray(this.props.createLoanErrors)) {
                let lis =
                    this.props.createLoanErrors.map((value, index) => (
                        <li key={index}><Text type="danger">{value}</Text></li>
                    ));
                serverErrors = (<ul>{lis}</ul>)
            }
            else {
                serverErrors = (<ul>Error</ul>)
            }
        }
        let dueDateLoanCompletion = this.state.dueDateLoanCompletion;
        let interestRateValue = this.state.interestRateValue
        return (
            <div>
                {authRedirect}
                {serverErrors}
                <PageHeader
                    title="Create Borrowing"
                    onBack={() => window.history.back()}
                />
                <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="Loan Amount">
                        {getFieldDecorator('loan_amount', {
                            rules: [{ required: true, message: 'Please input Loan Amount!' }],
                        })(
                            <InputNumber
                                onChange={this.onLoanAmountChange}
                                style={{ width: 200}}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                    <Form.Item label="Loan Date Start">
                        {getFieldDecorator('date_loan_start', {
                            rules: [{ required: true, message: 'Please input Loan Date Start!' }],
                        })(
                            <DatePicker onChange={this.onLoanDateStartChange} />
                        )}
                    </Form.Item>
                    <Form.Item label="Payment Interval Type">
                        {getFieldDecorator('payment_interval_type')(
                            <Radio.Group
                                onChange={this.onPaymentIntervalTypeChange}
                            >
                                <Radio value="0">Daily</Radio>
                                <Radio value="1">Monthly</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>
                    {this.state.paymentIntervalType == 0 && <Form.Item label="Payment Interval Days">
                        {getFieldDecorator('payment_interval_days', {
                        })(
                            <InputNumber
                                style={{ width: 200 }}
                                min={1} max={360} />

                        )}
                    </Form.Item>}

                    <Form.Item label="Loan Duration Days">
                        {getFieldDecorator('loan_duration_days', {
                            rules: [{ required: true, message: 'Please input Loan Durations Day!' }],
                        })(

                            <InputNumber
                                style={{ width: 200 }}
                                onChange={this.onLoanDurationDaysChange}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                    {/*
                    <Form.Item label="Interest Rate in Percentage">
                        {getFieldDecorator('interest_rate_percent', {
                            rules: [
                                { type: 'number', message: 'Should be a number!' },
                                { validator: this.validatePercentage },
                                { required: true, message: 'Please input Interest Rate in Percentage!' }
                            ],
                        })(
                            <InputNumber
                                onChange={this.onInterestRateInPercentChange}
                                style={{ width: 200 }}
                                min={0} max={100} />
                        )}
                    </Form.Item>
                    <Form.Item label="Interest Rate Value">
                        {getFieldDecorator('interest_rate_Value', {
                            initialValue: interestRateValue,
                            rules: [{ required: true, message: 'Please input Interest Rate Value!' }],

                        })(
                            <InputNumber
                                style={{ width: 200 }}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                      */}

                   <Form.Item label="Currency">
                        {getFieldDecorator('currency')(
                            <Radio.Group
                                onChange={this.onCurrencyChange}
                            >
                                <Radio value="MVR">MVR</Radio>
                                <Radio value="USD">USD</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>

                    <Form.Item label="Due Date Loan Completion">
                        {getFieldDecorator('due_date_loan_completion', {
                            initialValue: dueDateLoanCompletion,
                            rules: [{ required: true, message: 'Please input Due Date Loan Completion' }],
                        })(
                            <DatePicker />
                        )}
                    </Form.Item>
                    {/*
                    <Form.Item label="Due Date Loan Completion Extended">
                        {getFieldDecorator('due_date_loan_completion_extended', {
                        })(
                            <DatePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="Due Date Next Payment">
                        {getFieldDecorator('due_date_next_payment', {
                            rules: [{ required: true, message: 'Please input Due Date Next Payment' }],
                        })(
                            <DatePicker />
                        )}
                    </Form.Item>
                    <Form.Item label="Payment Per Interval">
                        {getFieldDecorator('payment_per_interval', {
                            rules: [{ required: true, message: 'Please input Payment Per Interval!' }],

                        })(
                            <InputNumber
                                style={{ width: 200 }}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>

                    <Form.Item label="Balance Due">
                        {getFieldDecorator('balance_due', {
                            rules: [{ required: true, message: 'Please input Balance Due!' }],

                        })(
                            <InputNumber
                                style={{ width: 200 }}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                    <Form.Item label="Loan Paid Amount">
                        {getFieldDecorator('loan_paid', {
                            rules: [{ required: true, message: 'Please input Loan Paid Amount!' }],

                        })(
                            <InputNumber
                                style={{ width: 200 }}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                     */}
                    <Form.Item label="Agreement ID">
                        {getFieldDecorator('agreement_no', {
                            rules: [{ required: true, message: 'Please input Agreement ID Ref!' }],
                        })(
                            <Input
                                placeholder="Agreement Ref"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Agreement Attachment">
                        {getFieldDecorator('agreement_attachment', {

                        })(
                            <Upload
                                multiple={false}
                                fileList={this.state.aggreementAttachment}
                                {...props}>
                                <Button> <Icon type="upload" /> Select File </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item label="Guardian Name">
                        {getFieldDecorator('guardian_name', {
                            rules: [{ required: true, message: 'Please input Guardian Name!' }],
                        })(
                            <Input
                                placeholder="Guardian Name"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Guardian Phone Number">
                        {getFieldDecorator('guardian_phone_no', {
                            rules: [{ required: true, message: 'Please input Guardian Phone Number!' }],
                        })(
                            <Input
                                placeholder="Guardian Phone Number"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Guardian Address">
                        {getFieldDecorator('guardian_address', {
                            rules: [{ required: true, message: 'Please input Guardian Address!' }],
                        })(
                            <Input
                                placeholder="Guardian Address"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Guardian ID Card No">
                        {getFieldDecorator('guardian_id_card', {
                            rules: [{ required: true, message: 'Please input Guardian ID Card No!' }],
                        })(
                            <Input
                                placeholder="Guardian ID Card No"
                                size="large"
                            />,
                        )}
                    </Form.Item>
                    <Button type="primary"
                        htmlType="submit"
                        className={styles.CreateLoanButton}
                        size="large"
                    >
                        Create Loan
                   </Button>
                </Form >
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedAccountId: state.accounts.selectedAccountId,
        selectedAccount: state.accounts.selectedAccount,
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        createLoanLoading: state.loans.createLoanLoading,
        createLoanMessage: state.loans.createLoanMessage,
        createLoanErrors: state.loans.createLoanErrors
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        createLoan: (account, accountId, token) => dispatch(actions.createLoan(account, accountId, token))
    }
}
//export default Form.create()(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateLoanForm));



