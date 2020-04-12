import React, { Component } from 'react';
import {
    Row, Col, Button, Menu, Dropdown,
    Card, PageHeader, Descriptions, DatePicker,
    Tabs, Popconfirm, Select,InputNumber,Popover,
    Input
} from 'antd';
import LoanDescriptions from '../DisplayContainers/LoanDescriptions/LoanDescriptions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as actions from '../../store/actions/index';
import moment from 'moment'
import styles from './AccountsAccountDetails.module.css';
class AccountsAccountDetails extends Component {
    state = {
        selectedYear: null,
        selectedMonth: null,
        filteredLoanIntervals: [],
        createLoanRedirect: false,
        editLoanRedirect: false,
        deleteLoanRedirect:true,
        editAccountRedirect: false,
        deleteAccountRedirect:false,
        intervalNewVal:0,
    }

    componentDidMount = () => {
        this.props.getLoansForAccountId(this.props.selectedAccountId)
        this.filterLoansByYearMonth();
    }

    loanMenuClick = (item) => {
        this.props.setSelectedLoanId(item.key, this.props.selectedAccountId);
        this.props.getLoanIntervalsForLoan(item);
    }

    onMonthChange = (val) => {
        this.setState({
            selectedMonth: val
        })
    }

    onYearChange = (val) => {
        this.setState({
            selectedYear: val
        })
    }

    onDeleteAccountConfirm = (e) => {
        this.props.initDeleteAccount(this.props.selectedAccountId);
        this.setState({
            deleteAccountRedirect:true
        })
    }
    onDeleteAccountCancel = (e) => {

    }

    onDeleteLoanConfirm = (e) => {
        this.props.initDeleteLoan(this.props.selectedLoanId,this.props.selectedAccountId);
        this.setState({
            deleteLoanRedirect:true
        })
    }
    onDeleteLoanCancel = (e) => {

    }

    filterLoansByYearMonth = () => {
        if (this.props.selectedLoanId != null && (this.props.selectedLoanId in this.props.loanLoanIntervals)) {
            console.log("inside")
            let loanIntervals = this.props.loanLoanIntervals[this.props.selectedLoanId];
            console.log("loanintervals,", loanIntervals)
            if (loanIntervals.length > 0) {
                let filteredLoanIntervals = loanIntervals.filter((val) => {
                    let intervalDueDate = new Date(val['due_date']);
                    if ((this.state.selectedYear == null &&
                        this.state.selectedMonth == null) ||
                        intervalDueDate == null) {
                        return true
                    } else {
                        if (this.state.selectedYear != null && this.state.selectedMonth != null) {
                            if (parseInt(this.state.selectedMonth) === 100) {
                                return (this.state.selectedYear.year() === intervalDueDate.getFullYear())
                            }
                            else {
                                return (parseInt(this.state.selectedMonth) === (parseInt(intervalDueDate.getMonth()) + 1)) &&
                                    (this.state.selectedYear.year() === intervalDueDate.getFullYear())
                            }
                        }
                        else if (this.state.selectedYear != null) {
                            return this.state.selectedYear.year() === intervalDueDate.getFullYear()
                        }
                        else if (this.state.selectedMonth != null) {
                            if (parseInt(this.state.selectedMonth) === 100) {
                                return true
                            }
                            else {
                                return parseInt(this.state.selectedMonth) === (parseInt(intervalDueDate.getMonth()) + 1)
                            }
                        }
                    }
                    return true;
                });
                this.setState({
                    filteredLoanIntervals: filteredLoanIntervals
                })
            }
            else {
                this.setState({
                    filteredLoanIntervals: []
                })
            }
        }
    }

    loanIntervalCardClick = (loanIntervalId, dueAmount, paidStatus) => {
        let inverseOfPaidStatus = (paidStatus === 0) ? 1 : 0;
        this.props.payInstallment(this.props.selectedLoanId, loanIntervalId, dueAmount, inverseOfPaidStatus)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        console.log("propss", prevProps)
        if ((this.state.selectedMonth !== prevState.selectedMonth) ||
            (this.state.selectedYear !== prevState.selectedYear) ||
            (this.props.selectedLoanId !== prevProps.selectedLoanId) ||
            (this.props.loanLoanIntervals !== prevProps.loanLoanIntervals)
        ) {
            console.log("filtering")
            this.filterLoansByYearMonth();
        }
    }

    onCreateLoan = () => {
        console.log('oncreateLoan')
        this.setState({
            createLoanRedirect: true
        })
    }

    onEditLoan = () => {
        console.log("editing loan")
        this.setState({
            editLoanRedirect: true
        })
    }

    onEditAccount = () => {
        this.setState({
            editAccountRedirect: true
        })
    }



    render() {

        let nullAccountRedirect = null;
        let createLoanRedirect = null;
        let editLoanRedirect = null;
        let editAccountRedirect = null;
        let deleteAccountRedirect = null;
        let currAccount = null;
        let menu = null;
        let loanList = [];
        let loanIntervalsCards = [];
        let loanDescriptions = null;
        let captionLoanSelect = "Select loan"
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/login" />
        }

        if (this.state.createLoanRedirect === true) {
            createLoanRedirect = <Redirect to="/borrowings/create" />
        }
        if (this.state.editLoanRedirect === true) {
            editLoanRedirect = <Redirect to="/borrowings/edit" />
        }
        if (this.state.deleteAccountRedirect === true) {
            deleteAccountRedirect = <Redirect to="/accounts/overview" />
        }
        if (this.state.editAccountRedirect === true) {
            editAccountRedirect = <Redirect to="/accounts/edit" />
        }
        if (this.props.selectedAccountId == null) {
            console.log("curr account is null")
            nullAccountRedirect = <Redirect to="/" />
        } else {
            if (this.props.selectedAccountId !== null) {
                loanList = this.props.accountLoans[this.props.selectedAccountId];
            }

            currAccount = this.props.selectedAccount;

            menu = (
                <Menu onClick={this.loanMenuClick}>
                    {loanList && loanList.map((val) => (
                        <Menu.Item key={val['id']}>
                            {val['date_loan_start']}
                        </Menu.Item>
                    ))}
                </Menu>
            )
            if (this.props.selectedLoanId != null) {
                captionLoanSelect = this.props.selectedLoan['date_loan_start'];
            }

            let nf = new Intl.NumberFormat();
            if(this.props.selectedLoan && this.props.selectedLoanId){
                loanIntervalsCards = this.state.filteredLoanIntervals.map((val) => {
                    if(val['paid_status']==0){
                        return (
                            <Popover
                                content={
                                    <div>
                                        <Row>
                                            <Col>

                                                <InputNumber
                                                    onChange={(val)=>this.setState({intervalNewVal:val})}
                                                             className={styles.PopoverFormElement}
                                                             defaultValue={this.state.intervalNewVal}
                                                             size="large"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button
                                            onClick={(e) => this.loanIntervalCardClick(val['id'],this.state.intervalNewVal, val['paid_status'], e)}
                                                    className={styles.PopoverFormBtn}
                                                    size="large"
                                                    type="primary">Pay</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                trigger='click'
                            >
                                <Col
                                    onClick={()=>this.setState({intervalNewVal:val['due_amount']})}
                                    xxl={2} xl={4} lg={6} md={8} sm={12} xs={24}
                                    key={val['id']}
                                    className={val['paid_status'] == 0 ? styles.IntervalCardNotPaid : styles.IntervalCardPaid}  >
                                    <div>{val['due_date']}</div>
                                    <div>{nf.format(val['due_amount']) + ' ' + this.props.selectedLoan['currency']}</div>
                                </Col >
                            </Popover>
                        );
                    }
                    else {
                        return (
                            <Col
                                onClick={(e) => this.loanIntervalCardClick(val['id'], val['due_amount'], val['paid_status'], e)}
                                xxl={2} xl={4} lg={6} md={8} sm={12} xs={24}
                                key={val['id']}
                                className={val['paid_status'] == 0 ? styles.IntervalCardNotPaid : styles.IntervalCardPaid}  >
                                <div>{val['due_date']}</div>
                                <div>{nf.format(val['due_amount']) + ' ' + this.props.selectedLoan['currency']}</div>
                            </Col >
                        );
                    }
                })

                loanDescriptions = <LoanDescriptions loan={this.props.selectedLoan} />
            }

        }


        const { MonthPicker, YearPicker } = DatePicker;

        const { TabPane } = Tabs;


        let nf = Intl.NumberFormat();
        let codeLink = ""
        if(currAccount){
            codeLink =<a target="_blank" href={"http://fina.mv/cust/"+currAccount['code']}>{currAccount['code']}</a>
        }
        return (
            <div>
                {authRedirect}
                {nullAccountRedirect}
                {createLoanRedirect}
                {editLoanRedirect}
                {editAccountRedirect}
                {deleteAccountRedirect}
                <Row>
                    <Col span={24}>
                        <PageHeader
                            style={{
                                border: '1px solid rgb(235, 237, 240)',
                            }}
                            onBack={() => window.history.back()}
                            title={currAccount ? currAccount['account_name'] : ''}
                        >
                            <Descriptions
                                size="middle"
                                layout="vertical"
                                bordered={true}
                                column={{ xxl: 4, xl: 4, lg: 2, md: 2, sm: 1, xs: 1 }}
                            >
                                <Descriptions.Item label="ID Card">
                                    <a href={"http://fina.mv/api/" + currAccount['id_card_attachment']}>
                                        {currAccount ? currAccount['account_id_card'] : ''}
                                    </a>
                                </Descriptions.Item>
                                <Descriptions.Item label="Tel">
                                    {currAccount ? currAccount['account_phone_no'] : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="Created at">
                                    {currAccount ? currAccount['created_at'] : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="Nationality">
                                    {currAccount ? currAccount['nation_name'] : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="Sum Borrowings (MVR)">
                                    {currAccount ? nf.format(currAccount['mvr_loan_amount']) : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="Sum Due (MVR)">
                                    {currAccount ? nf.format(currAccount['mvr_balance_due']) : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="Sum Borrowings (USD)">
                                    {currAccount ? nf.format(currAccount['usd_loan_amount']) : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="Sum Due (USD)">
                                    {currAccount ? nf.format(currAccount['usd_balance_due']) : ''}
                                </Descriptions.Item>
                                <Descriptions.Item label="Code">
                                    {codeLink}
                                </Descriptions.Item>
                            </Descriptions>
                        </PageHeader>
                    </Col>
                </Row>
                <Row>
                    <Col lg={24}>
                        <Button.Group className={styles.AccountButtonGroup}>
                            <Button key="3"
                                onClick={this.onEditAccount}
                            >Edit account</Button>
                            {this.props.userRoleAdmin==1 &&
                             <Popconfirm
                                 title="Are you sure delete this account?"
                                 onConfirm={this.onDeleteAccountConfirm}
                                 onCancel={this.onDeleteAccountCancel}
                                 okText="Yes"
                                 cancelText="No"
                             >
                                 <Button key="2">Delete account</Button>
                             </Popconfirm>
                            }
                            {(this.props.userRoleAdmin==1 || this.props.userRoleModerator==1) &&
                            <Button key="1" type="primary"
                                onClick={this.onCreateLoan}
                            >Create Borrowing</Button>
                            }
                            <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
                                <Button >{captionLoanSelect}</Button>
                            </Dropdown>
                        </Button.Group>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>

                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Tabs
                            animated={true}

                        >
                            <TabPane tab="Borrowing details" key="2">
                                <Row type="flex" justify="end">
                                    <Col>
                                        {this.props.selectedLoanId &&
                                         <Button.Group className={styles.AccountButtonGroup}>
                                             {(this.props.userRoleAdmin==1 || this.props.userRoleModerator==1) &&
                                             <Button type="primary"
                                                     onClick={this.onEditLoan}
                                             >Edit Borrowing</Button>
                                             }
                                             {this.props.userRoleAdmin==1 &&
                                             <Popconfirm
                                                 title="Are you sure delete this loan?"
                                                 onConfirm={this.onDeleteLoanConfirm}
                                                 onCancel={this.onDeleteLoanCancel}
                                                 okText="Yes"
                                                 cancelText="No"
                                             >
                                                 <Button key="2">Delete loan</Button>
                                             </Popconfirm>
                                             }
                                         </Button.Group>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {loanDescriptions}
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Borrowing Intervals" key="1">
                                <Card title="Borrowing Intervals"
                                    extra={(
                                        <Row gutter={4}>
                                            <Col md={12} sm={24}>
                                                <DatePicker
                                                    format="YYYY"
                                                    mode='year'
                                                    value={this.state.selectedYear}
                                                    onPanelChange={this.onYearChange}
                                                />
                                            </Col>
                                            <Col md={12} sm={24}>
                                                <Select
                                                    value={this.state.selectedMonth}
                                                    onChange={this.onMonthChange}
                                                    style={{ width: 120 }}
                                                >
                                                    <Select.Option value="100">All</Select.Option>
                                                    <Select.Option value="1">Jan</Select.Option>
                                                    <Select.Option value="2">Feb</Select.Option>
                                                    <Select.Option value="3">Mar</Select.Option>
                                                    <Select.Option value="4">Apr</Select.Option>
                                                    <Select.Option value="5">May</Select.Option>
                                                    <Select.Option value="6">Jun</Select.Option>
                                                    <Select.Option value="7">Jul</Select.Option>
                                                    <Select.Option value="8">Aug</Select.Option>
                                                    <Select.Option value="9">Sep</Select.Option>
                                                    <Select.Option value="10">Oct</Select.Option>
                                                    <Select.Option value="11">Nov</Select.Option>
                                                    <Select.Option value="12">Dec</Select.Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                    )}
                                >
                                    <Row>
                                        {loanIntervalsCards}
                                    </Row>
                                </Card>
                            </TabPane>

                        </Tabs>
                    </Col>
                </Row >
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        accountLoans: state.loans.accountLoans,
        loanLoanIntervals: state.loanIntervals.loanLoanIntervals,
        accounts: state.accounts.accounts,
        selectedAccountId: state.accounts.selectedAccountId,
        selectedAccount: state.accounts.selectedAccount,
        deleteAccountFailed: state.deleteAccountFailed,
        selectedLoanId: state.loans.selectedLoanId,
        selectedLoan: state.loans.selectedLoan,
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        userRoleAdmin: state.auth.user_role_admin,
        userRoleModerator: state.auth.user_role_moderator,
        userRoleStandard: state.auth.user_role_standard,
        payInstallmentLoading: state.loanIntervals.payInstallmentLoading,
        payInstallmentMessage: state.loanIntervals.payInstallmentMessage,
        payInstallmentError: state.loanIntervals.payInstallmentError
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        initAccounts: () => dispatch(actions.initAccounts()),
        setSelectedAccountId: (selectedAccountId) => dispatch(actions.setSelectedAccountId(selectedAccountId)),
        setSelectedLoanId: (selectedLoanId, selectedAccountId) => dispatch(actions.setSelectedLoanId(selectedLoanId, selectedAccountId)),
        getLoansForAccountId: (accountId) => dispatch(actions.getLoansForAccountId(accountId)),
        getLoanIntervalsForLoan: (loan) => dispatch(actions.getLoanIntervalsForLoan(loan)),
        initDeleteAccount: (accountId) => dispatch(actions.initDeleteAccount(accountId)),
        initDeleteLoan: (loanId, accountId) => dispatch(actions.initDeleteLoan(loanId, accountId)),
        payInstallment: (loanId, loanIntervalId, dueAmount, paidStatus) => dispatch(actions.payInstallment(loanId, loanIntervalId, dueAmount, paidStatus)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsAccountDetails);
