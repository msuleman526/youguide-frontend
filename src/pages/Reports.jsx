import { Button, Col, Flex, Row, Table, Typography } from 'antd'
import { HiOutlineUpload } from 'react-icons/hi'
import TransactionCard from '../components/transaction/TransactionCard'
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import {
  membersColumns,
  membersDataSource,
  transactionCardData,
  transactionColumns,
  transactionTableData,
} from '../components/transaction/TransactionData'
import { useRecoilValue } from 'recoil'
import { themeState } from '../atom'
import Card from '../components/Card'

const Reports = () => {

  return (
    <Card>
      <Typography.Title level={3} className="fw-500">
        Reports
      </Typography.Title>
    </Card>
  )
}

export default Reports
