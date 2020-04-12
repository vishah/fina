import React, { Component } from 'react';
import { Row, Col, Select, Table, Button, Menu, Dropdown, Input, Icon,
    PageHeader, Descriptions } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as actions from '../../store/actions/index';
import Highlighter from 'react-highlight-words';

class ReportsAllAccountsDuesReport extends Component {
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
        let currAccountId = record['id'];
        this.props.setSelectedAccountId(currAccountId);
        this.props.unsetSelectedLoanId();
        this.setState({
            goToAccountDetails: true
        });
    }

    componentDidMount() {
        this.props.initAllAccountsDuesReport();
    }

    accountsMenuClick = (item) => {
        this.props.setSelectedAccountId(item.key);
    }

    render() {
        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = <Redirect to="/login" />
        }


        let accountDetailsRedirect = null;
        if (this.state.goToAccountDetails === true) {
            accountDetailsRedirect = <Redirect push={true} to="/account/details" />;
        }
        else {
            accountDetailsRedirect = null;
        }

        let captionAccountSelect = "Select account";

        let accountsMenu = (
            <Menu onClick={this.accountsMenuClick}>
                {this.props.accounts && this.props.accounts.map((val) => (
                    <Menu.Item key={val['id']}>
                        {val['account_name']}
                    </Menu.Item>
                ))}
            </Menu>
        );

        const columns = [
            {
                title: 'Account Name',
                dataIndex: 'account.account_name',
                key: 'account_name',
                ...this.getColumnSearchProps('account_name'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.account.account_name.length - b.account.account_name.length,
            },
            {
                title: 'ID Card',
                dataIndex: 'account.account_id_card',
                key: 'due_amount',
                ...this.getColumnSearchProps('account.account_id_card'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.account.account_id_card.length - b.account.account_id_card.length,
            },
            {
                title: 'Borrowing id',
                dataIndex: 'id',
                key: 'id',
                ...this.getColumnSearchProps('id'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Agreement id',
                dataIndex: 'agreement_no',
                key: 'agreement_no',
                ...this.getColumnSearchProps('agreement_no'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.agreement_no.length - b.agreement_no.length
            },
            {
                title: 'Currency',
                dataIndex: 'currency',
                key: 'currency',
                ...this.getColumnSearchProps('currency'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.currency.length - b.currency.length
            },
            {
                title: 'Date Borrowing Start',
                dataIndex: 'date_loan_start',
                key: 'date_loan_start',
                ...this.getColumnSearchProps('date_loan_start'),
                defaultSortOrder: 'descend',
                sorter: (a, b) =>  {
                    let d1 = new Date(a.date_loan_start);
                    let d2 = new Date(b.date_loan_start);
                    return d1<d2;
                },
            },
            {
                title: 'Issued amount',
                dataIndex: 'loan_amount',
                key: 'loan_amount',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.loan_amount - b.loan_amount,
            },
            {
                title: 'Payment Interval Type',
                dataIndex: 'payment_interval_type',
                key: 'payment_interval_type',
                render:(text,record)=>{
                    let msg = text==0?"Daywise":"Monthly";
                    return msg;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.payment_interval_type - b.payment_interval_type
            },
            {
                title: 'Balance Due',
                dataIndex: 'balance_due',
                key: 'balance_due',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.balance_due - b.balance_due,
            },
        ];

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <PageHeader
                            ghost={false}
                            backIcon={false}
                            title="All Accounts Dues Report"
                            extra={[
                                <Button key="1" 
                                             href="http://fina.mv/api/dues-per-loan-for-all-accounts-report-pdf"
                                >PDF</Button>,
                                <Button key="2"
                                             href="http://fina.mv/api/dues-per-loan-for-all-accounts-report-csv"
                                >CSV</Button>,
                            ]}
                        >
                        </PageHeader>
                    </Col>
                </Row>
                <Row gutter={16,16}>
                    <Col span={24}>
                        <Table
                            dataSource={this.props.allAccountsDuesReport}
                            columns={columns}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(state)
    return {
        accounts: state.accounts.accounts,
        selectedAccountId: state.accounts.selectedAccountId,
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        allAccountsDuesReport:state.allAccountsDuesReport.allAccountsDuesReport,
        allAccountsDuesReportLoading: state.allAccountsDuesReport.allAccountsDuesReportLoading,
        allAccountsDuesReportMessage: state.allAccountsDuesReport.allAccountsDuesReportMessage,
        allAccountsDuesReportError: state.allAccountsDuesReport.allAccountsDuesReportError,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/ ')),
        initAccounts: () => dispatch(actions.initAccounts()),
        setSelectedAccountId: (selectedAccountId) => dispatch(actions.setSelectedAccountId(selectedAccountId)),
        unsetSelectedLoanId: () => dispatch(actions.unsetSelectedLoanId()),
        initAllAccountsDuesReport: () => dispatch(actions.initAllAccountsDuesReport()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsAllAccountsDuesReport);



