import React, { Component } from 'react';
import { Row, Col, Select, Table, Button, Menu, Dropdown, Input, Icon,
         PageHeader, Descriptions,Tag
       } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import * as actions from '../../store/actions/index';
import Highlighter from 'react-highlight-words';

class ReportsAccountStatementReport extends Component {
    componentDidMount() {
        this.props.initAccounts();
        this.props.unsetSelectedAccountId();
        this.props.unsetSelectedLoanId();
    }


    state = {
        goToAccountDetails: false,
        searchText: '',
        searchedColumn: '',
        captionAccountSelect : "Select Account",
        captionLoanSelect : "Select Loan",
        tableData:[],
        loanList:[]
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selectedAccountId!== prevProps.selectedAccountId) {
            this.props.initAccountStatementReport(this.props.selectedAccountId);
            this.props.unsetSelectedLoanId();
        }

        if(this.props.selectedLoanId !== prevProps.selectedLoanId){
            let tableData = this.props.accountStatementReport.filter((val=>{
                return val.loan_id == this.props.selectedLoanId;
            }));
            this.setState({
                tableData:tableData
            });
        }

        if(this.props.accountStatementReport!==prevProps.accountStatementReport) {
            this.setState({
                tableData:this.props.accountStatementReport
            });
        }

        if (this.props.selectedAccountId!=prevProps.selectedAccountId) {
            console.log("selected account id", this.props.selectedAccountId);
            let loanList = this.props.accountLoans[this.props.selectedAccountId];
            console.log("[componentDidUpdate]loanlist", loanList);
            this.setState({
                loanList:loanList
            });
        }


    }

    accountsMenuClick = (item) => {
        this.props.setSelectedAccountId(item.key);
        this.props.getLoansForAccountId(item.key);

        let caption = item.item.props.children;
        this.setState({
            captionAccountSelect:caption
        });
    }

    loanMenuClick = (item) => {
        this.props.setSelectedLoanId(item.key, this.props.selectedAccountId);

        let caption = item.item.props.children;
        this.setState({
            captionLoanSelect:caption
        });
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



        let accountsMenu = (
            <Menu onClick={this.accountsMenuClick}>
              {this.props.accounts && this.props.accounts.map((val) => (
                  <Menu.Item key={val['id']}>
                    {val['account_name']}
                  </Menu.Item>
              ))}
            </Menu>
        );


        let loanMenu = (
            <Menu onClick={this.loanMenuClick}>
              {
                  this.state.loanList && this.state.loanList.map((val) => (
                      <Menu.Item key={val['id']}>
                        {val['date_loan_start']}
                      </Menu.Item>
                  ))
              }
            </Menu>
        );


        const columns = [
            {
                title: 'Account Name',
                dataIndex: 'account_name',
                key: 'account_name',
                ...this.getColumnSearchProps('account_name'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.account_name.length - b.account_name.length,
            },
            {
                title: 'Date Loan Start',
                dataIndex: 'date_loan_start',
                key: 'date_loan_start',
                ...this.getColumnSearchProps('date_loan_start'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => {
                    let d1 = new Date(a.date_loan_start);
                    let d2 = new Date(b.date_loan_start);
                    return d1<d2;
                },

            },
            {
                title: 'Borrowing id',
                dataIndex: 'loan_id',
                key: 'loan_id',
                ...this.getColumnSearchProps('loan_id'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Agreement id',
                dataIndex: 'agreement_no',
                key: 'agreement_no',
                ...this.getColumnSearchProps('agreement_no'),
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.agreement_no.length- b.agreement_no.length,
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
                title: 'Issued Amount',
                dataIndex: 'loan_amount',
                key: 'loan_amount',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.loan_amount - b.loan_amount
            },
            {
                title: 'Due Date',
                dataIndex: 'due_date',
                key: 'due_date',
                ...this.getColumnSearchProps('due_date'),
                defaultSortOrder: 'descend',
                sorter: (a, b) =>  {
                    let d1 = new Date(a.due_date);
                    let d2 = new Date(b.due_date);
                    return d1<d2;
                },
            },
            {
                title: 'Due Amount',
                dataIndex: 'due_amount',
                key: 'due_amount',
                render:(text,record)=>{
                    var nf = new Intl.NumberFormat();
                    let cms = nf.format(text);
                    return <span>{cms}</span>;
                },
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.due_amount - b.due_amount
            },
            {
                title: 'Paid',
                dataIndex: 'paid_status',
                render:(text,record)=>{
                    if(text=="1"){
                        return <Icon type="check" />
                    }
                    else {
                        return <Icon type="minus" />
                    }
                },
                key: 'paid_status',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.paid_status - b.paid_status,
            },
            {
                title: 'Warning',
                    dataIndex: 'warning_level',
                    key: 'warning_level',
                    ...this.getColumnSearchProps('warning_level'),
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.warning_level- b.warning_level,
            },

        ];

        let downloadButtons = [];
        if(this.props.selectedAccountId !=null){
            downloadButtons = [
                    <Button key="1"
                href={"http://fina.mv/api/account-statement-pdf/" +
                      this.props.selectedAccountId}
                    >PDF</Button>,
                <Button key="2"
                        href={"http://fina.mv/api/account-statement-csv/" +
                        this.props.selectedAccountId}
                        >CSV</Button>,
            ];
        }

        return (
            <div>
              {authRedirect}
              <Row>
                <Col span={24}>
                  <PageHeader
                    ghost={false}
                    backIcon={false}
                    title="Account Statement"
                    subTitle="for selected acccount"
                    extra={[
                        ...downloadButtons,
                        <Dropdown overlay={accountsMenu} placement="bottomLeft" trigger={['click']}>
                          <Button type="primary">{this.state.captionAccountSelect}</Button>
                        </Dropdown>,
                        <Dropdown overlay={loanMenu} placement="bottomLeft" trigger={['click']}>
                          <Button >{this.state.captionLoanSelect}</Button>
                        </Dropdown>

                        ]}
                        >
                  </PageHeader>
                </Col>
              </Row>
              <Row gutter={16,16}>
                <Col span={24}>
                  <Table
                    dataSource={this.state.tableData}
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
        accountLoans: state.loans.accountLoans,
        accounts: state.accounts.accounts,
        selectedAccountId: state.accounts.selectedAccountId,
        selectedLoanId: state.loans.selectedLoanId,
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.access_token,
        isAuthenticated: state.auth.access_token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        accountStatementReport:state.accountStatementReport.accountStatementReport,
        accountStatementReportLoading: state.accountStatementReport.accountStatementReportLoading,
        accountStatementReportMessage: state.accountStatementReport.accountStatementReportMessage,
        accountStatementReportError: state.accountStatementReport.accountStatementReportError,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actions.login(email, password)),
        setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        initAccounts: () => dispatch(actions.initAccounts()),
        setSelectedAccountId: (selectedAccountId) => dispatch(actions.setSelectedAccountId(selectedAccountId)),
        unsetSelectedAccountId: () => dispatch(actions.unsetSelectedAccountId()),
        setSelectedLoanId: (selectedLoanId, selectedAccountId) => dispatch(actions.setSelectedLoanId(selectedLoanId, selectedAccountId)),
        getLoansForAccountId: (accountId) => dispatch(actions.getLoansForAccountId(accountId)),
        unsetSelectedLoanId: () => dispatch(actions.unsetSelectedLoanId()),
        initAccountStatementReport: (selectedAccountId) => dispatch(actions.initAccountStatementReport(selectedAccountId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsAccountStatementReport);



