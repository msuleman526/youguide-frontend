import { Button, Col, Flex, Row, Table, Typography } from 'antd'
import { HiOutlineUpload } from 'react-icons/hi'
import TransactionCard from '../components/transaction/TransactionCard'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import {
  transactionCardData,
  transactionColumns,
  transactionTableData,
} from '../components/transaction/TransactionData'
import { useRecoilValue } from 'recoil'
import { themeState } from '../atom'
import Card from '../components/Card'

const Transaction = () => {
  const theme = useRecoilValue(themeState)
  const columns = transactionColumns(theme)

  return (
    <Card>
      <Flex justify="space-between" align="center" className="mb-2">
        <Typography.Title level={3} className="my-0 fw-500">
          Upload bank transactions
        </Typography.Title>
        <Button className="custom-primary-btn" type="primary" size="large">
          <Flex gap={'small'} align="center">
            <span>Upload Transactions</span>
            <HiOutlineUpload size={20} color="#fff" />
          </Flex>
        </Button>
      </Flex>
      <Typography.Text className="text-gray">
        Why can’t you handle a simple task like uploading statement on time?
        It’s not rocket science! We rely on this app to keep track of our
        expenses and now everything is delayed because of your negligence. Do
        you even realize how important it is to stay on top ot our finance? This
        affects our entire family’s financial stability!
      </Typography.Text>
      <Row gutter={[16, 16]} style={{ marginBlock: '20px' }}>
        {(transactionCardData || [])?.map((item, index) => (
          <Col xs={24} md={12} lg={8} xl={4} key={index}>
            <TransactionCard theme={theme} item={item} />
          </Col>
        ))}
        <Col xs={24}>
          <Flex justify="end" align="center" gap={'small'}>
            <Button
              style={{ backgroundColor: '#EAF3FD', borderColor: '#EAF3FD' }}
            >
              <FaArrowLeftLong color="#4A4A4C" />
            </Button>
            <Button type="primary">
              <FaArrowRightLong />
            </Button>
          </Flex>
        </Col>
      </Row>
      <Typography.Title level={3} className="fw-500">
        Previously Uploaded Transactions
      </Typography.Title>
      <Table
        size="middle"
        className="custom_table"
        bordered
        columns={columns}
        dataSource={transactionTableData}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
    </Card>
  )
}

export default Transaction
