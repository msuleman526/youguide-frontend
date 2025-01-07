import { Table, Typography, message, Select, Tag } from 'antd';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';

const Transactions = () => {
  const theme = useRecoilValue(themeState);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState('all');
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch transactions on component mount
  useEffect(() => {
    setTableLoading(true);
    ApiService.getAllTransactions()
      .then((response) => {
        setTransactions(response);
        setFilteredTransactions(response);
        setTableLoading(false);
      })
      .catch((error) => {
        setTableLoading(false);
        message.error(error?.response?.data?.message || 'Failed to fetch transactions.');
        setTransactions([]);
        setFilteredTransactions([]);
      });
  }, []);

  // Filter transactions based on type
  const handleFilterChange = (type) => {
    setTransactionType(type);
    if (type === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter((tx) => tx.type === type));
    }
  };

  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
      width: 50,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (_, record) => {
        if (record.type === 'subscription' || record.type === 'book') {
          return `${record.firstName || 'N/A'} ${record.lastName || 'N/A'}`;
        }
        return record.customer_name || 'N/A';
      },
    }
    {
      title: 'Customer Email',
      dataIndex: 'customer_email',
      key: 'customer_email',
      render: (email) => email || 'N/A',
    },
    {
      title: 'Transaction Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'email' ? 'blue' : type === 'book' ? 'green' : 'orange'}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Guide/Subscription',
      key: 'bookName',
      render: (_, record) => record.book_id || record.subscription_id ? (
        <Tag color="purple">
          {record.book_id?.name || record.subscription_id?.name || "N/A"}
        </Tag>
      ) : 'N/A',
    },
    {
      title: 'Guide PDF',
      key: 'bookPdf',
      render: (_, record) => record.book_id?.pdfFiles?.map((pdf, index) => (
        <Tag color="geekblue" key={index}>
          {pdf.language}
        </Tag>
      )),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'paid' ? 'green' : 'red' }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
  ];

  return (
    <>
      <div>
        <Typography.Title level={2} className="my-0 fw-500">
          Transactions
        </Typography.Title>
        <Typography.Title level={4} className="my-0 fw-500">
          View all transaction records.
        </Typography.Title>
        <div style={{ marginBottom: '16px' }}>
          <Select
            value={transactionType}
            onChange={handleFilterChange}
            style={{ width: 200 }}
            options={[
              { value: 'all', label: 'All Transactions' },
              { value: 'email', label: 'Email Transactions' },
              { value: 'book', label: 'Book Transactions' },
              { value: 'subscription', label: 'Subscription Transactions' },
            ]}
          />
        </div>
      </div>
      <CustomCard>
        <Table
          size="middle"
          className="custom_table"
          bordered
          columns={columns}
          dataSource={filteredTransactions}
          loading={tableLoading}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </CustomCard>
    </>
  );
};

export default Transactions;
