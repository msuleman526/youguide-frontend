import React, { useEffect, useState } from 'react';
import {
  Col,
  Flex,
  Row,
  Typography,
  Statistic,
  Spin,
  message,
  DatePicker,
  Button,
  Space
} from 'antd';
import {
  BarChart,
  PieChart,
  LineChart
} from '@mui/x-charts';
import {
  UserOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  DollarOutlined,
  GlobalOutlined,
  ReloadOutlined,
  GiftOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { useRecoilValue } from 'recoil';
import { themeState } from '../atom';
import Card from '../components/Card';
import ApiService from '../APIServices/ApiService';
import moment from 'moment';

const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const theme = useRecoilValue(themeState);
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('thisYear');
  const [customDateRange, setCustomDateRange] = useState(null);
  
  // State for all analytics data
  const [dashboardStats, setDashboardStats] = useState({});
  const [usersByRole, setUsersByRole] = useState([]);
  const [usersOverTime, setUsersOverTime] = useState([]);
  const [booksByCategory, setBooksByCategory] = useState([]);
  const [purchaseTypeStats, setPurchaseTypeStats] = useState([]);
  const [affiliateClickStats, setAffiliateClickStats] = useState([]);
  const [vendorClickStats, setVendorClickStats] = useState([]);
  const [expiredAffiliates, setExpiredAffiliates] = useState([]);
  const [expiredVendors, setExpiredVendors] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [booksByLanguage, setBooksByLanguage] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [revenueOverTime, setRevenueOverTime] = useState([]);
  const [topPerformingBooks, setTopPerformingBooks] = useState([]);
  const [purchaseTrends, setPurchaseTrends] = useState([]);
  const [affiliateVsVendor, setAffiliateVsVendor] = useState([]);

  useEffect(() => {
    fetchAllAnalyticsData('thisYear'); // Load with 'thisYear' filter by default
  }, []);

  const getDateRangeFromFilter = (filter) => {
    const now = moment();
    let startDate, endDate;

    switch (filter) {
      case 'thisWeek':
        startDate = now.startOf('week').format('YYYY-MM-DD');
        endDate = now.endOf('week').format('YYYY-MM-DD');
        break;
      case 'lastWeek':
        startDate = now.subtract(1, 'week').startOf('week').format('YYYY-MM-DD');
        endDate = now.endOf('week').format('YYYY-MM-DD');
        break;
      case 'thisMonth':
        startDate = now.startOf('month').format('YYYY-MM-DD');
        endDate = now.endOf('month').format('YYYY-MM-DD');
        break;
      case 'lastMonth':
        startDate = now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        endDate = now.endOf('month').format('YYYY-MM-DD');
        break;
      case 'thisYear':
        startDate = now.startOf('year').format('YYYY-MM-DD');
        endDate = now.endOf('year').format('YYYY-MM-DD');
        break;
      case 'lastYear':
        startDate = now.subtract(1, 'year').startOf('year').format('YYYY-MM-DD');
        endDate = now.endOf('year').format('YYYY-MM-DD');
        break;
      default:
        return { startDate: null, endDate: null };
    }
    
    return { startDate, endDate };
  };

  const fetchAllAnalyticsData = async (dateFilter = null) => {
    try {
      setLoading(true);
      
      let startDate = null, endDate = null;
      
      if (dateFilter) {
        const range = getDateRangeFromFilter(dateFilter);
        startDate = range.startDate;
        endDate = range.endDate;
      } else if (customDateRange) {
        startDate = customDateRange[0].format('YYYY-MM-DD');
        endDate = customDateRange[1].format('YYYY-MM-DD');
      }
      
      const [
        dashboardStatsData,
        usersByRoleData,
        usersOverTimeData,
        booksByCategoryData,
        purchaseTypeStatsData,
        affiliateClickStatsData,
        vendorClickStatsData,
        expiredAffiliatesData,
        expiredVendorsData,
        salesByCategoryData,
        booksByLanguageData,
        popularDestinationsData,
        revenueOverTimeData,
        topPerformingBooksData,
        purchaseTrendsData,
        affiliateVsVendorData
      ] = await Promise.all([
        ApiService.getDashboardStats(startDate, endDate),
        ApiService.getUsersByRole(startDate, endDate),
        ApiService.getUsersOverTime(startDate, endDate),
        ApiService.getBooksByCategory(startDate, endDate),
        ApiService.getPurchaseTypeStats(startDate, endDate),
        ApiService.getAffiliateClickStats(startDate, endDate),
        ApiService.getVendorClickStats(startDate, endDate),
        ApiService.getExpiredAffiliates(startDate, endDate),
        ApiService.getExpiredVendors(startDate, endDate),
        ApiService.getSalesByCategory(startDate, endDate),
        ApiService.getBooksByLanguage(startDate, endDate),
        ApiService.getPopularDestinations(startDate, endDate),
        ApiService.getRevenueOverTime(startDate, endDate),
        ApiService.getTopPerformingBooks(startDate, endDate),
        ApiService.getPurchaseTrends(startDate, endDate),
        ApiService.getAffiliateVsVendorPerformance(startDate, endDate)
      ]);

      setDashboardStats(dashboardStatsData);
      setUsersByRole(usersByRoleData);
      setUsersOverTime(usersOverTimeData);
      setBooksByCategory(booksByCategoryData);
      setPurchaseTypeStats(purchaseTypeStatsData);
      setAffiliateClickStats(affiliateClickStatsData);
      setVendorClickStats(vendorClickStatsData);
      setExpiredAffiliates(expiredAffiliatesData);
      setExpiredVendors(expiredVendorsData);
      setSalesByCategory(salesByCategoryData);
      setBooksByLanguage(booksByLanguageData);
      setPopularDestinations(popularDestinationsData);
      setRevenueOverTime(revenueOverTimeData);
      setTopPerformingBooks(topPerformingBooksData);
      setPurchaseTrends(purchaseTrendsData);
      setAffiliateVsVendor(affiliateVsVendorData);
      
    } catch (error) {
      message.error('Failed to fetch analytics data');
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedDateRange(filter);
    setCustomDateRange(null);
    fetchAllAnalyticsData(filter);
  };

  const handleCustomDateChange = (dates) => {
    setCustomDateRange(dates);
    setSelectedDateRange(null);
    if (dates && dates.length === 2) {
      fetchAllAnalyticsData();
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Total Books',
      value: dashboardStats.totalBooks,
      icon: <BookOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Guide Purchases',
      value: dashboardStats.guidePurchases,
      icon: <ShoppingCartOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />,
      color: '#fa8c16'
    },
    {
      title: 'Other Purchases',
      value: dashboardStats.otherPurchases,
      icon: <GiftOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
      color: '#f5222d'
    },
    {
      title: 'Total Affiliates',
      value: dashboardStats.totalAffiliates,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
      color: '#eb2f96'
    },
    {
      title: 'Total Vendors',
      value: dashboardStats.totalVendors,
      icon: <GlobalOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      color: '#722ed1'
    },
    {
      title: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: <DollarOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
      color: '#13c2c2'
    },
    {
      title: 'Avg Revenue/Book',
      value: `$${dashboardStats.guidePurchases > 0 ? (dashboardStats.totalRevenue / dashboardStats.guidePurchases)?.toFixed(2) : '0.00'}`,
      icon: <PercentageOutlined style={{ fontSize: '24px', color: '#ff7875' }} />,
      color: '#ff7875'
    }
  ];

  const filterButtons = [
    { key: 'thisWeek', label: 'This Week' },
    { key: 'lastWeek', label: 'Last Week' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'lastMonth', label: 'Last Month' },
    { key: 'thisYear', label: 'This Year' },
    { key: 'lastYear', label: 'Last Year' }
  ];

  const commonAxisStyle = {
    tickLabelStyle: { fontSize: '8px' }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {/* Header and Filters */}
        <Col xs={24}>
          <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
            <Typography.Title level={2} style={{ margin: 0 }}>Admin Dashboard</Typography.Title>
            
            <Flex align="center" gap="middle" wrap="wrap">
              <Space wrap>
                {filterButtons.map((filter) => (
                  <Button
                    key={filter.key}
                    type={selectedDateRange === filter.key ? 'primary' : 'default'}
                    onClick={() => handleFilterChange(filter.key)}
                    size="small"
                  >
                    {filter.label}
                  </Button>
                ))}
              </Space>
              
              <RangePicker
                value={customDateRange}
                onChange={handleCustomDateChange}
                format="YYYY-MM-DD"
              />
              
              <ReloadOutlined
                style={{ fontSize: '20px', cursor: 'pointer', color: '#1890ff' }}
                onClick={() => fetchAllAnalyticsData()}
              />
            </Flex>
          </Flex>
        </Col>

        {/* Statistics Cards - 4 cards per row on desktop (4-4 layout) */}
        {statsCards.map((stat, index) => (
          <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} key={index}>
            <Card>
              <Flex justify="space-between" align="center">
                <div>
                  <Typography.Text type="secondary">{stat.title}</Typography.Text>
                  <div>
                    <Statistic 
                      value={stat.value} 
                      valueStyle={{ color: stat.color, fontSize: '20px' }} 
                    />
                  </div>
                </div>
                {stat.icon}
              </Flex>
            </Card>
          </Col>
        ))}

        {/* Revenue Over Time - Line Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Revenue Over Time</Typography.Title>
            {revenueOverTime.length > 0 ? (
              <LineChart
                series={[
                  { 
                    data: revenueOverTime.map(item => item.revenue),
                    label: 'Revenue ($)',
                    curve: 'natural'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: revenueOverTime.map(item => item.period), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 30, left: 60, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Users Over Time - Bar Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Users Registration Over Time</Typography.Title>
            {usersOverTime.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: usersOverTime.map(item => item.count),
                    label: 'New Users'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: usersOverTime.map(item => item.period), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Users by Role - Pie Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Users by Role</Typography.Title>
            {usersByRole.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: usersByRole.map((item, index) => ({
                      id: index,
                      value: item.count,
                      label: item.role
                    })),
                    arcLabelStyle: {
                      fontSize: 8,
                    }
                  }
                ]}
                height={300}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Books by Category - Bar Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Books by Category</Typography.Title>
            {booksByCategory.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: booksByCategory.map(item => item.count),
                    label: 'Number of Books'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: booksByCategory.map(item => item.category), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Purchase Type Statistics - Pie Chart */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Purchase Types Distribution</Typography.Title>
            {purchaseTypeStats.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: purchaseTypeStats.map((item, index) => ({
                      id: index,
                      value: item.count,
                      label: item.type.charAt(0).toUpperCase() + item.type.slice(1)
                    })),
                    arcLabelStyle: {
                      fontSize: 8,
                    }
                  }
                ]}
                height={300}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Affiliate Click Statistics */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Affiliate Click Statistics</Typography.Title>
            {affiliateClickStats.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: affiliateClickStats.map(item => item.totalClicks),
                    label: 'Total Clicks',
                    color: '#1890ff'
                  },
                  { 
                    data: affiliateClickStats.map(item => item.pendingClicks),
                    label: 'Pending Clicks',
                    color: '#52c41a'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: affiliateClickStats.map(item => item.affiliateName), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Vendor Click Statistics */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Vendor Click Statistics</Typography.Title>
            {vendorClickStats.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: vendorClickStats.map(item => item.totalClicks),
                    label: 'Total Clicks',
                    color: '#1890ff'
                  },
                  { 
                    data: vendorClickStats.map(item => item.pendingClicks),
                    label: 'Pending Clicks',
                    color: '#52c41a'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: vendorClickStats.map(item => item.vendorName), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Purchase Trends Over Time */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Purchase Trends Over Time</Typography.Title>
            {purchaseTrends.length > 0 ? (
              <LineChart
                series={[
                  { 
                    data: purchaseTrends.map(item => item.totalCount),
                    label: 'Total Purchases',
                    curve: 'natural'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: purchaseTrends.map(item => item.period), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Affiliate vs Vendor Performance */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Affiliate vs Vendor Performance</Typography.Title>
            {affiliateVsVendor.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: affiliateVsVendor.map(item => item.count),
                    label: 'Count',
                    color: '#1890ff'
                  },
                  { 
                    data: affiliateVsVendor.map(item => item.totalClicks),
                    label: 'Total Clicks',
                    color: '#52c41a'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: affiliateVsVendor.map(item => item.type), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Expired Affiliates */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Affiliate Status</Typography.Title>
            {expiredAffiliates.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: expiredAffiliates.map(item => item.count),
                    label: 'Count'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: expiredAffiliates.map(item => item.status), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Expired Vendors */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Vendor Status</Typography.Title>
            {expiredVendors.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: expiredVendors.map(item => item.count),
                    label: 'Count'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: expiredVendors.map(item => item.status), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Sales by Category */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Typography.Title level={4}>Sales by Category</Typography.Title>
            {salesByCategory.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: salesByCategory.map(item => item.totalSales),
                    label: 'Total Sales',
                    color: '#1890ff'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: salesByCategory.map(item => item.category), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Books by Language - Half Width */}
        <Col xs={24} md={12}>
          <Card>
            <Typography.Title level={4}>Books by Language</Typography.Title>
            {booksByLanguage.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: booksByLanguage.map(item => item.count),
                    label: 'Number of Books'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: booksByLanguage.map(item => item.language), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 50, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Most Popular Destinations - Half Width */}
        <Col xs={24} md={12}>
          <Card>
            <Typography.Title level={4}>Most Popular Destinations</Typography.Title>
            {popularDestinations.length > 0 ? (
              <BarChart
                series={[
                  { 
                    data: popularDestinations.map(item => item.purchaseCount),
                    label: 'Purchase Count'
                  }
                ]}
                height={300}
                xAxis={[
                  { 
                    data: popularDestinations.map(item => item.destination), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                yAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 80, left: 40, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Top Performing Books - Full Width at End */}
        <Col xs={24}>
          <Card>
            <Typography.Title level={4}>Top Performing Books</Typography.Title>
            {topPerformingBooks.length > 0 ? (
              <BarChart
                layout="horizontal"
                series={[
                  { 
                    data: topPerformingBooks.map(item => item.totalSales),
                    label: 'Sales Count',
                    color: '#1890ff'
                  },
                  { 
                    data: topPerformingBooks.map(item => item.totalRevenue),
                    label: 'Revenue ($)',
                    color: '#52c41a'
                  }
                ]}
                height={400}
                yAxis={[
                  { 
                    data: topPerformingBooks.map(item => 
                      item.bookName.length > 40 ? 
                      item.bookName.substring(0, 40) + '...' : 
                      item.bookName
                    ), 
                    scaleType: 'band',
                    ...commonAxisStyle
                  }
                ]}
                xAxis={[commonAxisStyle]}
                margin={{ top: 10, bottom: 30, left: 300, right: 10 }}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontSize: 8,
                    },
                  },
                }}
              />
            ) : (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text type="secondary">No data available</Typography.Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
