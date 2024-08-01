import { Button, Dropdown, Menu, Typography, Space, Flex, Select, Switch, Table } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../atom';
import CustomCard from '../components/Card';
import { useEffect, useState } from 'react';
import { DownOutlined, FlagOutlined, ShareAltOutlined } from '@ant-design/icons';
import { GET_BANK_LIST, GET_CATEGORIES_LIST } from '../Utils/Apis';
import { handleErrors } from '../Utils/Utils';
import { BiFlag } from 'react-icons/bi';
import { FiShare, FiShare2 } from 'react-icons/fi';

const Transactions = () => {
  const theme = useRecoilValue(themeState);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);
  const [selectedMonth, setSelectedMonth] = useState("May 2024");
  const [selectedYear, setSelectedYear] = useState(null);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  let [iconColor, setIconColor] = useState(theme === 'light' ? '#A8AAAD' : '#D2D4D8')

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

  const handleMenuClick = (e, year) => {
    setSelectedMonth(`${e.key} ${year}`);
    setSelectedYear(null);
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
      dataIndex: 'date',
      key: 'date',
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
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: '160px' }}
          className={
            theme === 'light'
              ? 'header-search-input-light'
              : 'header-search-input-dark'
          }
        >
          {categories.map(category => (
            <Select.Option key={category.id} value={category.name}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      ),
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
            //onClick={() => deleteRecord(record.key)}
            />
          </Flex>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      date: '2024-05-01',
      description: 'Grocery shopping',
      amount: '$100',
      category: 'Food',
    },
    {
      key: '2',
      date: '2024-05-02',
      description: 'Electricity bill',
      amount: '$50',
      category: 'Utilities',
    },
    {
      key: '3',
      date: '2024-05-03',
      description: 'Gym membership',
      amount: '$30',
      category: 'Health',
    },
    {
      key: '3',
      date: '2024-05-03',
      description: 'Gym membership',
      amount: '$30',
      category: 'Health',
    },
    {
      key: '4',
      date: '2024-05-03',
      description: 'Gym membership',
      amount: '$30',
      category: 'Health',
    },
    {
      key: '5',
      date: '2024-05-03',
      description: 'Gym membership',
      amount: '$30',
      category: 'Health',
    },
    {
      key: '6',
      date: '2024-05-03',
      description: 'Gym membership',
      amount: '$30',
      category: 'Health',
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
              open={selectedYear === year}
              onOpenChange={(visible) => setSelectedYear(visible ? year : null)}
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
          dataSource={data}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </CustomCard>
    </>
  );
}

export default Transactions;
