import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Progress,
  Row,
  Typography,
} from 'antd'
import React from 'react'
import {
  ExpensesSvg,
  IncomeSvg,
  RemainingSvg,
} from '../components/icons/AllSvgIcon'

const Dashboard = () => {
  let data = [
    {
      label: 'Income',
      value: '$37K',
      color: '#2C87EA',
      icon: <IncomeSvg />,
    },
    {
      label: 'Expenses',
      value: '-$17K',
      color: '#FF4949',
      icon: <ExpensesSvg />,
    },
    {
      label: 'Remaing',
      value: '$20K',
      color: '#F29A2E',
      icon: <RemainingSvg />,
    },
  ]
  let progressData = [
    {
      name: 'Jeans',
      value: 70,
    },
    {
      name: 'Shirts',
      value: 40,
    },

    {
      name: 'Belts',
      value: 60,
    },
    {
      name: 'Cap',
      value: 80,
    },
    {
      name: 'Others',
      value: 20,
    },
  ]
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Flex justify="space-between" align="center">
          <Typography.Title level={3}>Compare Range</Typography.Title>
          <Flex gap={'small'} align="center">
            <DatePicker.RangePicker size="large" />
            <Button type="primary" size="large">
              Compare
            </Button>
          </Flex>
        </Flex>
      </Col>
      {data.map(({ label, value, color, icon }, index) => (
        <Col xs={24} md={12} lg={8} key={index}>
          <Card
            style={{
              borderColor: '#BEDAF8',
              maxHeight: '200px',
            }}
          >
            <Flex justify="space-between">
              <Flex vertical gap={'small'} align="center">
                <Typography.Title className="my-0" level={5}>
                  {label}
                </Typography.Title>
                <Typography.Title className="my-0" level={3} style={{ color }}>
                  {value}
                </Typography.Title>
              </Flex>
              <Flex align="end">{icon}</Flex>
            </Flex>
          </Card>
        </Col>
      ))}
      <Col xs={24} md={16}></Col>
      <Col xs={24} md={8}>
        <Card>
          <Typography.Title level={4}>Top Expenses Categories</Typography.Title>
          {progressData.map(({ name, value }, index) => (
            <Flex vertical key={index}>
              <Flex justify="space-between" align="center">
                <Typography.Text strong>{name}</Typography.Text>
                <Typography.Text strong>{value + '%'}</Typography.Text>
              </Flex>
              <Progress
                style={{ paddingTop: 0 }}
                percent={value}
                strokeColor={'#2C87EA'}
                showInfo={false}
              />
            </Flex>
          ))}
        </Card>
      </Col>
    </Row>
  )
}

export default Dashboard
