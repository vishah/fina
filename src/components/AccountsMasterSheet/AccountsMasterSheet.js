import React, { Component } from 'react';
import { Row, Col, Select, Table, Button, Descriptions, Input, Icon } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as actions from '../../store/actions/index';
import Highlighter from 'react-highlight-words';

class AccountsMasterSheet extends Component {
    componentDidMount() {
        this.props.initAccounts();
    }

    state = {
        goToAccountDetails: false,
        searchText: '',
        searchedColumn: ''
    }
    // Search Start
    getByPath = function(obj, path, def) {
        path = path
            .replace(/\[/g, '.')
            .replace(/]/g, '')
            .split('.');
        path.forEach(function (level) {
            obj = obj[level];
        });
        if (obj === undefined) {
            return def;
        }
        return obj;
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            this.getByPath(record,dataIndex)
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            (this.state.searchedColumn === dataIndex) ?
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
            : text
        ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({ 
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    // Search End

    onRowClick = (record) => {
        console.log("onrowclick", record)
        let currAccountId = record['id'];
        this.props.setSelectedAccountId(currAccountId);
        this.props.unsetSelectedLoanId();
        this.setState({
            goToAccountDetails: true
        })
    }

    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/login" />
        }

        let accountDetailsRedirect = null;
        if (this.state.goToAccountDetails === true) {
            accountDetailsRedirect = <Redirect push={true} to="/account/details" />
        }
        else {
            accountDetailsRedirect = null;
        }
        console.log("Sd", this.props.accounts);
        const columns = [
            {
                title: 'ID Card',
                dataIndex: 'account_id_card',
                key: 'account_id_card',
                ...this.getColumnSearchProps('account_id_card'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.account_id_card.length - b.account_id_card.length,
            },
            {
                title: 'Name',
                dataIndex: 'account_name',
                key: 'account_name',
                ...this.getColumnSearchProps('account_name'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.account_name.length - b.account_name.length,
            },
            {
                title: 'Phone no',
                dataIndex: 'account_phone_no',
                key: 'account_phone_no',
                ...this.getColumnSearchProps('account_phone_no'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.account_phone_no - b.account_phone_no
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render:(value,record)=>{
                    if(value==0){
                        return "Orgnization";
                    }
                    else {
                        return "Individual";
                    }
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.type - b.type
            },
            {
                title: 'Amount Issued (MVR)',
                dataIndex: 'mvr_loan_amount',
                key: 'mvr_loan_amount',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.mvr_loan_amount - b.mvr_loan_amount
            },
            {
                title: 'Balance Due (MVR)',
                dataIndex: 'mvr_balance_due',
                key: 'mvr_balance_due',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.mvr_balance_due - b.mvr_balance_due
            },
            {
                title: 'Amount Issued (USD)',
                dataIndex: 'usd_loan_amount',
                key: 'usd_loan_amount',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.usd_loan_amount - b.usd_loan_amount
            },
            {
                title: 'Balance Due (USD)',
                dataIndex: 'usd_balance_due',
                key: 'usd_balance_due',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.usd_balance_due - b.usd_balance_due
            },
            {
                title: 'View',
                dataIndex: 'id',
                render: (text, record) =>
                    <Button shape="circle" icon="select"
                        onClick={() => this.onRowClick(record)}
                    />
            },
        ];

        let sumLoanAmountMvr = 0;
        let sumLoanReceivedMvr = 0;
        let sumBalanceDueMvr = 0;

        let sumLoanAmountUsd = 0;
        let sumLoanReceivedUsd = 0;
        let sumBalanceDueUsd = 0;

        let nf = new Intl.NumberFormat();
        if(this.props.totals){
            let totals = this.props.totals[0];
            if(totals.mvr_loan_amount){
                sumLoanAmountMvr = nf.format(totals.mvr_loan_amount);
            }
            if(totals.mvr_balance_due){
                sumBalanceDueMvr = nf.format(totals.mvr_balance_due);
            }
            if(totals.usd_loan_amount){
                sumLoanAmountUsd = nf.format(totals.usd_loan_amount);
            }
            if(totals.usd_balance_due){
                sumBalanceDueUsd = nf.format(totals.usd_balance_due);
            }
            sumLoanReceivedMvr =nf.format(totals.mvr_loan_amount - totals.mvr_balance_due);
            sumLoanReceivedUsd =nf.format(totals.usd_loan_amount - totals.usd_balance_due);
        }


        return (
            <div>
                {authRedirect}
                {accountDetailsRedirect}
                <Table
                    dataSource={this.props.accounts}
                    columns={columns}
                />
                <Descriptions title="Totals" layout="vertical" bordered>
                    <Descriptions.Item label="Total Issued Amount (MVR)">
                        {sumLoanAmountMvr}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Received/Paid Amount (MVR)">
                        {sumLoanReceivedMvr}
                    </Descriptions.Item>
                    <Descriptions.Item label="TotalDues (MVR)">
                        {sumBalanceDueMvr}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Issued Amount (USD)">
                        {sumLoanAmountUsd}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Received/Paid Amount (USD)">
                        {sumLoanReceivedUsd}
                    </Descriptions.Item>
                    <Descriptions.Item label="TotalDues (USD)">
                        {sumBalanceDueUsd}
                    </Descriptions.Item>

                </Descriptions>

            </div >
        );
    }
}

const mapStateToProps = state => {
    console.log(state)
    return {
        accounts: state.accounts.accounts,
        totals: state.accounts.totals,
        accountsLoanTotals: state.accounts.accountsLoanTotals,
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        initAccounts: () => dispatch(actions.initAccounts()),
        setSelectedAccountId: (selectedAccountId) => dispatch(actions.setSelectedAccountId(selectedAccountId)),
        unsetSelectedLoanId: () => dispatch(actions.unsetSelectedLoanId())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsMasterSheet);
