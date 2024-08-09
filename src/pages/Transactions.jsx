import { Button, Dropdown, Menu, Typography, Space, Flex, Select, Switch, Table, message } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../atom';
import CustomCard from '../components/Card';
import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { GET_BANK_ACCOUNTS_LIST, GET_BANK_LIST, GET_CATEGORIES_LIST, GET_TRANSACTION_LIST, GET_TRANSACTION_YEARS_LIST, UPDATE_TRANSACTION_CATEGORY } from '../Utils/Apis';
import { convertDateToNormal, formatDate, handleErrors } from '../Utils/Utils';
import { BiFlag } from 'react-icons/bi';
import { FiShare2 } from 'react-icons/fi';

const Transactions = () => {
  const theme = useRecoilValue(themeState);
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState("August 2024");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedBankAccountID, setSelectedBankAccountID] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  let [iconColor, setIconColor] = useState(theme === 'light' ? '#A8AAAD' : '#D2D4D8');
  const [transactions, setTransactions] = useState([]);
  const [visibleDropdowns, setVisibleDropdowns] = useState({});
  const [years, setYears] = useState([])

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        let response = await GET_BANK_ACCOUNTS_LIST();
        if (response.isSuccess && response.data) {
          setBankAccounts(response.data);
        } else {
          setBankAccounts([]);
        }
      } catch (err) {
        setBankAccounts([]);
        handleErrors('Getting Banks Accounts', err);
      }
    };

    const getCategories = async () => {
      try {
        let response = await GET_CATEGORIES_LIST();
        if (response.isSuccess && response.data) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setCategories([]);
        handleErrors('Getting Categories', err);
      }
    };

    const getYears = async () => {
      try {
        let response = await GET_TRANSACTION_YEARS_LIST();
        if (response.isSuccess && response.data) {
          setYears(response.data);
        } else {
          setYears([]);
        }
      } catch (err) {
        setYears([]);
        handleErrors('Getting Years', err);
      }
    };

    getYears()
    getCategories();
    fetchBankAccounts();

  }, []);

  useEffect(() => {
    getTransactions();
  }, [selectedBankAccountID, selectedMonth]);

  const getTransactions = async () => {
    const [month, year] = selectedMonth.split(' ');
    const firstDate = new Date(`${month} 1, ${year}`);
    const lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0);

    const data = {
      "description": "",
      "transactionFromDate": firstDate.toISOString(),
      "transactionToDate": lastDate.toISOString(),
      "categoryId": 0,
      "bankAccountId": selectedBankAccountID,
      "pagination": {
        "pageNo": 0,
        "pageSize": 0,
        "sortBy": "",
        "orderBy": ""
      }
    };

    try {
      let response = await GET_TRANSACTION_LIST(data);
      if (response.isSuccess && response.data) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      setTransactions([]);
      handleErrors('Getting Transactions', err);
    }
  };

  const handleMenuClick = (e, year) => {
    setSelectedMonth(`${e.key} ${year}`);
    setSelectedYear(year);
    setVisibleDropdowns(prev => ({ ...prev, [year]: false }));
  };

  const menu = (yearObj) => (
    <Menu onClick={(e) => handleMenuClick(e, yearObj.year)}>
      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        .filter((_, index) => yearObj.monthList.includes(index + 1))
        .map((month) => (
          <Menu.Item key={month}>
            {month}
          </Menu.Item>
        ))}
    </Menu>
  );

  let onCategoryChange = async (transactionId, categoryID) => {
    let response = await UPDATE_TRANSACTION_CATEGORY(categoryID, transactionId);
    if (response.isSuccess) {
       message.success("Transaction category updated successfully");
    }else{
       message.error(response.message);
    }
  }

  const columns = [
    {
      title: 'Bank Account',
      dataIndex: 'bankAccountName',
      width: '15%',
      key: 'bankAccountName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '25%',
      key: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      width: '15%',
      key: 'transactionDate',
      render: (text, record) => (<span>{convertDateToNormal(record.transactionDate)}</span>)
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '15%',
      key: 'amount',
      render: (text, record) => (<span style={{color: record.amount > 0 ? 'green' : 'red'}}>{record.amount}$</span>)
    },
    {
      title: 'Caegory',
      dataIndex: 'category',
      width: '15%',
      key: 'category',
      render: (text, record) => (
        <Select
            defaultValue={record.categoryID}
            style={{ width: '310px' }}
            placeholder={"Select a category"}
            className={
              theme === 'light'
                ? 'header-search-input-light'
                : 'header-search-input-dark'
            }
            onChange={(val) => onCategoryChange(record.transactionId, val)}
          >
            {categories.map(category => (
              <Select.Option key={category.categoryID} value={category.categoryID}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
      )
    },
    {
      title: 'Actions',
      width: '15%',
      key: 'actions',
      render: (text, record) => (
        <Flex gap="10px" align="center">
            <BiFlag
              size={18}
              color={iconColor}
            />
            <FiShare2
              size={18}
              color={iconColor}
            />
          </Flex>
      ),
    },
  ];

  return (
    <>
      <CustomCard>
        <Flex align="center" style={{ gap: '10px', marginBottom: '20px' }}>
          {years.map((yearObj) => (
            <Dropdown
              overlay={menu(yearObj)}
              trigger={['click']}
              open={visibleDropdowns[yearObj.year]}
              onClick={() => setVisibleDropdowns(prev => ({ ...prev, [yearObj.year]: !prev[yearObj.year] }))}
              key={yearObj.year}
            >
              <Button
                style={{
                  background: 'transparent',
                  color: (theme === 'light' || (theme.length > 0 && theme[0] === "light")) ? "#000000" : '#FFFFFF'
                }}
              >
                {yearObj.year} <DownOutlined />
              </Button>
            </Dropdown>
          ))}
        </Flex>
        <Flex justify="space-between" align="center" style={{ marginBottom: '10px' }}>
          <Typography.Title level={3} className="my-0 fw-500">
            Transactions {selectedMonth}
          </Typography.Title>
        </Flex>
        <Flex justify="space-between" align="center" className="mb-2">
          <Typography.Paragraph>
            Why are you categorizing expenses now? You should have been more responsible with our spending in the first place! This is not a game where you can just shuffle around numbers to make yourself look better. We need to talk about our financial decisions and how we can improve them together!
          </Typography.Paragraph>
        </Flex>
        <Flex justify="space-between" align="center" className="mb-2">
          <Select
            defaultValue={0}
            style={{ width: '310px' }}
            className={
              theme === 'light'
                ? 'header-search-input-light'
                : 'header-search-input-dark'
            }
            onChange={value => setSelectedBankAccountID(value)}
          >
            <Select.Option key={0} value={0}>
              Transactions from all banks accounts
            </Select.Option>
            {bankAccounts.map(account => (
              <Select.Option key={account.bankAccountID} value={account.bankAccountID}>
                {account.name}
              </Select.Option>
            ))}
          </Select>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Space direction="horizontal" size="small">
              <Typography.Text>Flagged</Typography.Text>
              <Switch defaultChecked />
            </Space>
            <Space direction="horizontal" size="small">
              <Typography.Text>Unassign</Typography.Text>
              <Switch defaultChecked />
            </Space>
          </div>
        </Flex>
        <Table
          size="middle"
          className="custom_table"
          bordered
          columns={columns}
          dataSource={transactions}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </CustomCard>
    </>
  );
}

export default Transactions;
