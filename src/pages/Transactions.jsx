import { Button, Dropdown, Menu, Typography, Space, Flex, Select, Switch, Table } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../atom';
import CustomCard from '../components/Card';
import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { GET_BANK_LIST, GET_CATEGORIES_LIST, GET_TRANSACTION_LIST } from '../Utils/Apis';
import { convertDateToNormal, formatDate, handleErrors } from '../Utils/Utils';
import { BiFlag } from 'react-icons/bi';
import { FiShare2 } from 'react-icons/fi';

const Transactions = () => {
  const theme = useRecoilValue(themeState);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);
  const [selectedMonth, setSelectedMonth] = useState("August 2024");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedBankID, setSelectedBankID] = useState(0);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  let [iconColor, setIconColor] = useState(theme === 'light' ? '#A8AAAD' : '#D2D4D8');
  const [transactions, setTransactions] = useState([]);
  const [visibleDropdowns, setVisibleDropdowns] = useState({});

  useEffect(() => {
    const fetchBank = async () => {
      try {
        let response = await GET_BANK_LIST();
        if (response.isSuccess && response.data) {
          setBanks(response.data);
        } else {
          setBanks([]);
        }
      } catch (err) {
        setBanks([]);
        handleErrors('Getting Banks', err);
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
    getCategories();
    fetchBank();
  }, []);

  useEffect(() => {
    getTransactions();
  }, [selectedBankID, selectedMonth]);

  const getTransactions = async () => {
    const [month, year] = selectedMonth.split(' ');
    const firstDate = new Date(`${month} 1, ${year}`);
    const lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0);

    const data = {
      "description": "",
      "transactionFromDate": firstDate.toISOString(),
      "transactionToDate": lastDate.toISOString(),
      "categoryId": 0,
      "bankId": selectedBankID,
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

  const menu = (year) => (
    <Menu onClick={(e) => handleMenuClick(e, year)}>
      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
        <Menu.Item key={month}>
          {month}
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (text, record) => (<span>{convertDateToNormal(record.transactionDate)}</span>)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (<span>{record.amount}$</span>)
    },
    {
      title: 'Bank',
      dataIndex: 'bankName',
      key: 'bankName',
    },
    {
      title: 'Bank Account',
      dataIndex: 'bankAccountName',
      key: 'bankAccountName',
    },
    {
      title: 'Actions',
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
          {years.map((year) => (
            <Dropdown
              overlay={menu(year)}
              trigger={['click']}
              visible={visibleDropdowns[year]}
              onClick={() => setVisibleDropdowns(prev => ({ ...prev, [year]: !prev[year] }))}
              key={year}
            >
              <Button
                style={{
                  background: 'transparent',
                  color: (theme === 'light' || (theme.length > 0 && theme[0] === "light")) ? "#000000" : '#FFFFFF'
                }}
              >
                {year} <DownOutlined />
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
            style={{ width: '250px' }}
            className={
              theme === 'light'
                ? 'header-search-input-light'
                : 'header-search-input-dark'
            }
            onChange={value => setSelectedBankID(value)}
          >
            <Select.Option key={0} value={0}>
              Transactions from all banks
            </Select.Option>
            {banks.map(bank => (
              <Select.Option key={bank.bankID} value={bank.bankID}>
                {bank.name}
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
