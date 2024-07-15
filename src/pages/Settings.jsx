import { Button, Col, Flex, Row, Table, Typography } from 'antd'
import {
  banksDataSource,
  groupsAndBanksColumns,
  groupsDataSource,
} from '../components/transaction/TransactionData'
import { useRecoilValue } from 'recoil'
import { themeState } from '../atom'
import Card from '../components/Card'

const Settings = () => {
  const theme = useRecoilValue(themeState)
  const columns = groupsAndBanksColumns(theme)

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card>
          <Typography.Title level={3} className="fw-500">
            Groups & Categories
          </Typography.Title>
          <Table
            size="middle"
            className="custom_table"
            bordered
            columns={columns}
            dataSource={groupsDataSource}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
          <Typography.Title level={3} className="fw-500">
            Bank & Bank Accounts
          </Typography.Title>
          <Table
            size="middle"
            className="custom_table"
            bordered
            columns={columns}
            dataSource={banksDataSource}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default Settings
