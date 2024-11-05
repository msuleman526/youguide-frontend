import { Table, Typography, message } from 'antd'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../atom'
import CustomCard from '../../components/Card'
import { useEffect, useState } from 'react'
import ApiService from '../../APIServices/ApiService'

const Transactions = () => {
  const theme = useRecoilValue(themeState)
  const [transactions, setTransactions] = useState([])
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
      setTableLoading(true)
      ApiService.getAllTransactions()
        .then((response) => {
            setTransactions(response)
            setTableLoading(false)
        })
        .catch(error => {
            setTableLoading(false)
            message.error(error?.response?.data?.message || "Failed to fetch transactions.")
            setTransactions([])
        });
  }, [])

  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'paymentId',
      key: 'paymentId',
    },
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        `${record.user_id?.firstName || ''} ${record.user_id?.lastName || ''}`
      ),
    },
    {
      title: 'Book',
      key: 'book',
      render: (_, record) => record.book_id?.name || 'N/A',
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
      </div>
      <CustomCard>
        <Table
          size="middle"
          className="custom_table"
          bordered
          columns={columns}
          dataSource={transactions}
          loading={tableLoading}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </CustomCard>
    </>
  )
}

export default Transactions
