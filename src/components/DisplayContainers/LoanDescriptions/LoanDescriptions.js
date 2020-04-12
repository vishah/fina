import React, { Component } from 'react';
import { Row, Col, Steps, Descriptions } from 'antd';

class LoanDescriptions extends Component {
    state = {}
    render() {
        let nf = new Intl.NumberFormat();
        let paymentIntervalDays='';
        if(this.props.loan && this.props.loan['payment_interval_type']==0){
            paymentIntervalDays = this.props['paymentIntervalDays'];
        }
        else {
            paymentIntervalDays='Monthly payment';
        }

        return (
            <Descriptions
                key={this.props.loan['id']}
              title={'Amount: ' + nf.format(this.props.loan['loan_amount']) + ' ' + this.props.loan['currency']}
                bordered
                column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 2, xs: 1 }}
                layout="vertical"

            >
                <Descriptions.Item label="Date borrowing start">
                    {this.props.loan['date_loan_start']}
                </Descriptions.Item>
                <Descriptions.Item label="Duration (days)">
                    {this.props.loan['loan_duration_days']}
                </Descriptions.Item>
                <Descriptions.Item label="Completion date">
                    {this.props.loan['due_date_loan_completion']}
                </Descriptions.Item>
                <Descriptions.Item label="Date next payment">
                    {this.props.loan['due_date_next_payment']}
                </Descriptions.Item>

                <Descriptions.Item label="Borrowing amount paid">
                    {this.props.loan['loan_amount']-this.props.loan['balance_due']}
                </Descriptions.Item>
                <Descriptions.Item label="Balance due">
                    {nf.format(this.props.loan['balance_due']) + ' ' + this.props.loan['currency']}
                </Descriptions.Item>

{/*
                <Descriptions.Item label="Interest Rate %">
                    {this.props.loan['interest_rate_percent']}
                </Descriptions.Item>
                <Descriptions.Item label="Interest Rate Value">
                    {this.props.loan['interest_rate_value']}
                </Descriptions.Item>
*/}

                <Descriptions.Item label="Payment per interval">
                    {nf.format(this.props.loan['payment_per_interval']) + ' ' + this.props.loan['currency']}
                </Descriptions.Item>
                <Descriptions.Item label="Payment interval type">
                    {(this.props.loan['payment_interval_type']==0)?"Daywise":"Monthly"}
                </Descriptions.Item>
                <Descriptions.Item label="Payment interval days">
                  {paymentIntervalDays}
                </Descriptions.Item>
                <Descriptions.Item label="Agreement Ref">
                    {this.props.loan['agreement_no']}
                </Descriptions.Item>
                <Descriptions.Item label="Agreement attachment">
                  <a href={"http://fina.mv/api/"+this.props.loan['agreement_attachment']}>
                    Download Aggreement
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Guardian name">
                  {this.props.loan['guardian_name']}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian phone node">
                    {this.props.loan['guardian_phone_no']}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian adress">
                    {this.props.loan['guardian_phone_no']}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian id card">
                    {this.props.loan['guardian_name']}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian phone no">
                    {this.props.loan['guardian_phone_no']}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian address">
                    {this.props.loan['guardian_address']}
                </Descriptions.Item>
                <Descriptions.Item label="Guardian id card">
                    {this.props.loan['guardian_id_card']}
                </Descriptions.Item>
            </Descriptions>
        );
    }
}

export default LoanDescriptions;
