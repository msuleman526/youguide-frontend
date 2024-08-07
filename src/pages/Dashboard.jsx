import {
  Button,
  Col,
  DatePicker,
  Flex,
  Progress,
  Row,
  Table,
  Typography,
} from 'antd'
import React, { useEffect, useState } from 'react'
import {
  ExpensesSvg,
  IncomeSvg,
  RemainingSvg,
} from '../components/icons/AllSvgIcon'
import { BarChart } from '@mui/x-charts/BarChart';
import { categoryGroupColumns, categoryGroupDataSoruce, flaggedCategoryDataSoruce, flaggedColumns } from '../components/transaction/TransactionData';
import { useRecoilState } from 'recoil';
import { themeState } from '../atom'
import Card from '../components/Card';

const Dashboard = () => {
  const theme = useRecoilState(themeState)
  const columns = categoryGroupColumns(theme)
  const columns1 = flaggedColumns(theme)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 700)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let data = [
    {
      label: 'INCOME FY 2025',
      value: '$0.0',
      color: '#ff7800',
      icon: <IncomeSvg />,
    },
    {
      label: 'INCOME FY 2024',
      value: '$0.0',
      color: '#ff7800',
      icon: <IncomeSvg />,
    },
    {
      label: 'EXPENSE FY 2025',
      value: '$0.0',
      color: '#FF4949',
      icon: <ExpensesSvg />,
    },
    {
      label: 'EXPENSE FY 2024',
      value: '$0.0',
      color: '#FF4949',
      icon: <ExpensesSvg />,
    },
    {
      label: 'INCOME CY 2024',
      value: '$0.0',
      color: '#F29A2E',
      icon: <RemainingSvg />,
    },
    {
      label: 'EXPENSE CY 2024',
      value: '$0.0',
      color: '#FF4949',
      icon: <ExpensesSvg />,
    },
  ]
  let progressData = [
    {
      name: 'Shoppoing',
      value: 70,
    },
    {
      name: 'House',
      value: 40,
    },

    {
      name: 'Bills',
      value: 60,
    },
    {
      name: 'Grocery',
      value: 80,
    },
    {
      name: 'Others',
      value: 20,
    },
    {
      name: 'Chilling',
      value: 80,
    },
  ]


  const options = {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light2", //"light1", "dark1", "dark2"
    title:{
      text: "Simple Column Chart with Index Labels"
    },
    axisY: {
      includeZero: true
    },
    data: [{
      type: "column",
      indexLabelFontColor: "#5A5757",
      indexLabelPlacement: "outside",
      dataPoints: [
        { x: 10, y: 24 },
        { x: 20, y: 55 },
        { x: 30, y: 50 },
        { x: 40, y: 65 },
        { x: 50, y: 71 },
        { x: 60, y: 68 },
        { x: 70, y: 38 },
        { x: 80, y: 92, indexLabel: "Highest" },
        { x: 90, y: 54 },
        { x: 100, y: 60 },
        { x: 110, y: 21 },
        { x: 120, y: 49 },
        { x: 130, y: 36 }
      ]
    }]
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Flex justify="space-between" align="center">
          {!isMobile && <Typography.Title level={4} >Dashboard</Typography.Title>}
          <Flex gap={'small'} align="center">
            <DatePicker.RangePicker size="large" />
            <Button type="primary" size="large">
              Compare
            </Button>
          </Flex>
        </Flex>
      </Col>
      {data.map(({ label, value, color, icon }, index) => (
        <Col xs={24} sm={12} md={12} lg={8} xl={4} xxl={4}  key={index}>
          <Card
            style={{
              maxHeight: '200px',
            }}
          >
            <Flex justify="space-between">
              <Flex vertical gap={'small'} align="left">
                <Typography.Title className="my-0" level={5}>
                  {label}
                </Typography.Title>
                <Typography.Title className="my-0" level={3} style={{ color, textAlign: 'left'}}>
                  {value}
                </Typography.Title>
              </Flex>
              <Flex align="end">{icon}</Flex>
            </Flex>
          </Card>
        </Col>
      ))}
      <Col xs={24} md={12}>
        <Card>
            <Typography.Title level={4}>Monthly Income/Expense Breakdown</Typography.Title>
            <BarChart
              series={[
                { data: [35, 44, 24, 34], },
                { data: [51, 6, 49, 30] },
                { data: [15, 25, 30, 50] },
                { data: [60, 50, 15, 25] },
              ]}
              height={264}
              xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band', tickLabelStyle: { fill: 'white', color: 'white'}, }]}
              yAxis={[{tickLabelStyle: { fill: 'white', color: 'white'}, labelStyle: { fill: 'white', color: 'white'}}]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              
            />
        </Card>
      </Col>
      <Col xs={24} md={12}>
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
                strokeColor={'#ff7800'}
                showInfo={false}
              />
            </Flex>
          ))}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
            <Typography.Title level={4}>Flagged Transactions</Typography.Title>
            <Table
              size="middle"
              className="custom_table"
              bordered
              columns={columns1}
              style={{margin: '-5px'}}
              dataSource={flaggedCategoryDataSoruce}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
            <Typography.Title level={4}>Tracked Category Groups</Typography.Title>
            <Table
              size="middle"
              className="custom_table"
              bordered
              columns={columns}
              style={{margin: '-5px'}}
              dataSource={categoryGroupDataSoruce}
              scroll={{ x: 'max-content' }}
              pagination={false}
            />
        </Card>
      </Col>
    </Row>
  )
}

export default Dashboard
