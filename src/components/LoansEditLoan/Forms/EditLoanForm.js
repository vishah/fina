import React, { Component } from 'react';
import {
    Form, Icon, Input, DatePicker, Button,
    InputNumber, Upload, Radio, Typography, Select,
    PageHeader,notification
} from 'antd';
import styles from './EditLoanForm.module.css';
import * as actions from '../../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

class EditLoanForm extends Component {
    state = {
        aggreementAttachment: [],
        loanAmount: 0,
        loanDateStart: moment(),
        loanDurationDays: 0,
        dueDateLoanCompletion: moment(),
        interestRateInPercent: 0,
        interestRateValue: 0,
        paymentIntervalType: 0
    }
    handleSubmit = e => {
        e.preventDefault();
        console.log("handle submit edit")
        let editLoan = null;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let _dueDateLoanCompletion = (values.due_date_loan_completion) ? values.due_date_loan_completion.format("YYYY-MM-DD") : '';
                let _dateLoanStart = (values.date_loan_start) ? values.date_loan_start.format("YYYY-MM-DD") : '';
                let _dueDateLoanCompletionExtended = (values.due_date_loan_completion_extended) ? values.due_date_loan_completion_extended.format("YYYY-MM-DD") : '';


                editLoan = {
                    loan_duration_days: values.loan_duration_days,
                    date_loan_start: _dateLoanStart,
                    due_date_loan_completion: _dueDateLoanCompletion,
                    due_date_loan_completion_extended: _dueDateLoanCompletionExtended,
                    //due_date_next_payment: values.due_date_next_payment.format("YYYY-MM-DD"),
                    loan_amount: values.loan_amount,
                    balance_due: values.balance_due,
                   // interest_rate_percent: values.interest_rate_percent,
                   // interest_rate_value: values.interest_rate_value,
                    loan_paid: values.loan_paid,
                    payment_per_interval: values.payment_per_interval,
                    payment_interval_type: values.payment_interval_type,
                    agreement_attachment: values.agreement_attachment,
                    guardian_name: values.guardian_name,
                    guardian_phone_no: values.guardian_phone_no,
                    guardian_address: values.guardian_address,
                    guardian_id_card: values.guardian_id_card,
                    agreement_no: values.agreement_no
                };
                console.log(editLoan)
                console.log("----s---")

                console.log("editLoan Vals:", editLoan)
                console.log("editloan values populated")

                /*
                if (values.interest_rate_value == 0) {
                    editLoan['payment_interval_days'] = values.payment_interval_days
                }
                */

                console.log("calling editLoan");
                this.props.editLoan(
                    editLoan,
                    this.props.selectedAccountId,
                    this.props.selectedLoanId,
                    'sdsdsd'
                );
            }
            else {
                console.log("error")
                console.log(err)
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

    componentDidUpdate=(prevProps)=> {
        if(
            prevProps.editLoanLoading!==this.props.editLoanLoading &&
            this.props.editLoanLoading === false &&
            prevProps.editLoanMessage!==this.props.editLoanMessage&&
            this.props.editLoanMessage !== null
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
        let EditdLoanRedirect = null;

        if (this.props.editLoanMessage != null) {
            EditdLoanRedirect = <Redirect to="/" />
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
        if (this.props.editLoanErrors.length > 0) {
            if (Array.isArray(this.props.editLoanErrors)) {
                let lis =
                    this.props.editLoanErrors.map((value, index) => (
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

        //get selected loan vals
        const selLoan = this.props.selectedLoan;
        let nullSelectedLoanRedirect = null;
        let loanAmount = null;
        let dateLoanStart = null;
        let paymentIntervalType = null;
        let paymentIntervalDays = null;
        let loanDurationDays = null;
        let interestRatePercent = null;
        //let interestRateValue= null;
        //let dueDateLoanCompletion= null;
        let dueDateLoanCompletionExtended = null;
        let balanceDue = null;
        let loanPaid = null;
        let guardianName = null;
        let guardianPhoneNo = null;
        let guardianAddress = null;
        let guardianIdCardNo = null;
        let agreementId = null;

        if (selLoan !== null) {
            loanAmount = (selLoan.loan_amount) ? selLoan.loan_amount : null;
            dateLoanStart = (selLoan.date_loan_start) ? moment(selLoan.date_loan_start) : null;
            paymentIntervalType = (selLoan.payment_interval_type) ? selLoan.payment_interval_type : null;
            console.log("Payment interval type:", paymentIntervalType)

            paymentIntervalDays = (selLoan.payment_interval_days) ? selLoan.payment_interval_days : null;

            loanDurationDays = (selLoan.loan_duration_days) ? selLoan.loan_duration_days : null;
            //interestRatePercent = (selLoan.interest_rate_percent) ? selLoan.interest_rate_percent : null;
            //interestRateValue = (selLoan.interest_rate_value)?selLoan.interest_rate_value:null;
            // dueDateLoanCompletion= (selLoan.due_date_loan_completion)?selLoan.due_date_loan_completion:null;
            dueDateLoanCompletionExtended = (selLoan.due_date_loan_completion_extended) ? selLoan.due_date_loan_completion_extended : null;
            balanceDue = (selLoan.balance_due) ? selLoan.balance_due : null;
            loanPaid = (selLoan.loan_paid !== undefined) ? selLoan.loan_paid : null;
            guardianName = (selLoan.guardian_name) ? selLoan.guardian_name : null;
            guardianPhoneNo = (selLoan.guardian_phone_no) ? selLoan.guardian_phone_no : null;
            guardianAddress = (selLoan.guardian_address) ? selLoan.guardian_address : null;
            guardianIdCardNo = (selLoan.guardian_id_card) ? selLoan.guardian_id_card : null;
            agreementId = (selLoan.agreement_no) ? selLoan.agreement_no : null;
        }
        else {
            nullSelectedLoanRedirect = <Redirect to="/" />
        }
        const { Option } = Select;

        return (
            <div>
                {authRedirect}
                {nullSelectedLoanRedirect}
                {serverErrors}
                <PageHeader
                    title="Edit Borrowing"
                    onBack={() => window.history.back()}
                />
                <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} onSubmit={this.handleSubmit}>
                    <Form.Item label="Borrowing Amount">
                        {getFieldDecorator('loan_amount', {
                            initialValue: loanAmount,
                            rules: [{ required: true, message: 'Please input Borrowing Amount!' }],
                        })(
                            <InputNumber
                                disabled={true}
                                onChange={this.onLoanAmountChange}
                                style={{ width: 171 }}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                    <Form.Item label="Borrowing Date Start">
                        {getFieldDecorator('date_loan_start', {
                            initialValue: dateLoanStart,
                            rules: [{ required: true, message: 'Please input Borrowing Date Start!' }],
                        })(
                            <DatePicker
                                disabled={true}
                                onChange={this.onLoanDateStartChange} />
                        )}
                    </Form.Item>
                    <Form.Item label="Payment Interval Type">
                        {getFieldDecorator('payment_interval_type', {
                            initialValue: paymentIntervalType
                        })(
                            <Radio.Group
                                disabled={true}
                                onChange={this.onPaymentIntervalTypeChange}
                            >
                                <Radio.Button value="0">Daily</Radio.Button>
                                <Radio.Button value="1">Monthly</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    {this.state.paymentIntervalType == 0 && <Form.Item label="Payment Interval Days">
                        {getFieldDecorator('payment_interval_days', {
                            initialValue: paymentIntervalDays
                        })(
                            <InputNumber
                                disabled={true}
                                style={{ width: 171 }}
                                min={1} max={360} />
                        )}
                    </Form.Item>}

                    <Form.Item label="Borrowing Duration Days">
                        {getFieldDecorator('loan_duration_days', {
                            initialValue: loanDurationDays,
                            rules: [{ required: true, message: 'Please input Borrowing Durations Day!' }],
                        })(
                            <InputNumber
                                disabled={true}
                                style={{ width: 171 }}
                                onChange={this.onLoanDurationDaysChange}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                    {/*
                    <Form.Item label="Interest Rate in Percentage">
                        {getFieldDecorator('interest_rate_percent', {
                            initialValue: interestRatePercent,
                            rules: [
                                { type: 'number', message: 'Should be a number!' },
                                { validator: this.validatePercentage },
                                { required: true, message: 'Please input Interest Rate in Percentage!' }
                            ],
                        })(
                            <InputNumber
                                disabled={true}
                                onChange={this.onInterestRateInPercentChange}
                                style={{ width: 171 }}
                                min={0} max={100} />
                        )}
                    </Form.Item>
                    <Form.Item label="Interest Rate Value">
                        {getFieldDecorator('interest_rate_Value', {
                            initialValue: interestRateValue,
                            rules: [{ required: true, message: 'Please input Interest Rate Value!' }],

                        })(
                            <InputNumber
                                disabled={true}
                                style={{ width: 171 }}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>

                      */}
                    <Form.Item label="Due Date Borrowing Completion">
                        {getFieldDecorator('due_date_loan_completion', {
                            initialValue: dueDateLoanCompletion,
                            rules: [{ required: true, message: 'Please input Due Date Borrowing Completion' }],
                        })(
                            <DatePicker
                                disabled={true}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Due Date Borrowing Completion Extended">
                        {getFieldDecorator('due_date_loan_completion_extended', {
                            initialValue: dueDateLoanCompletionExtended
                        })(
                            <DatePicker />
                        )}
                    </Form.Item>
                    {/*
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
                        style={{ width: 171 }}
                        min={0} max={100000000} />
                        )}
                        </Form.Item>
                      */}
                    <Form.Item label="Balance Due">
                        {getFieldDecorator('balance_due', {
                            initialValue: balanceDue,
                            rules: [{ required: true, message: 'Please input Balance Due!' }],

                        })(
                            <InputNumber
                                style={{ width: 171 }}
                                min={0} max={100000000} />
                        )}
                    </Form.Item>
                    <Form.Item label="Borrowing Paid">
                        {getFieldDecorator('loan_paid', {
                            initialValue: "1",
                            rules: [{ required: true, message: 'Please input Borrowing Paid!' }]

                        })(
                            <Select>
                                <Option value="0">Yes</Option>
                                <Option value="1">No</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Agreement ID">
                        {getFieldDecorator('agreement_no', {
                            initialValue: agreementId,
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
                            initialValue: guardianName,
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
                            initialValue: guardianPhoneNo,
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
                            initialValue: guardianAddress,
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
                            initialValue: guardianIdCardNo,
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
                        className={styles.EditLoanButton}
                        size="large"
                    >
                        Update Borrowing
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
        selectedLoanId: state.loans.selectedLoanId,
        selectedLoan: state.loans.selectedLoan,
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        editLoanLoading: state.loans.editLoanLoading,
        editLoanMessage: state.loans.editLoanMessage,
        editLoanErrors: state.loans.editLoanErrors
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        editLoan: (loan, accountId, loanId, token) => dispatch(actions.editLoan(loan, accountId, loanId, token))
    }
}
//export default Form.Edit()(LoginForm);
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditLoanForm));



