import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, message, Row, Col, Statistic, Table, Tag, Space, Select } from 'antd';
import { LineChart, BarChart } from '@mui/x-charts';
import {
  DollarCircleOutlined,
  EyeOutlined,
  TeamOutlined,
  LineChartOutlined,
  BankOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import PageTourWrapper from '../../components/PageTourWrapper';
import { TOUR_PAGES } from '../../Utils/TourConfig';

const { Title, Text } = Typography;
const { Option } = Select;

const AffiliateDashboard = () => {
    const { affiliateId } = useParams();
    const navigate = useNavigate();
    const [affiliate, setAffiliate] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('30days');
    const [expired, setExpired] = useState(false);

    // Analytics data will be fetched from API

    const handleLogout = () => {
        localStorage.removeItem('affiliateToken');
        localStorage.removeItem('affiliateData');
        localStorage.removeItem('affiliateUser');
        navigate('/login');
    };

    useEffect(() => {
        // Authentication is handled by ProtectedRoute, just verify affiliate ID access
        const affiliateData = localStorage.getItem('affiliateData');

        if (affiliateData) {
            try {
                const parsedAffiliate = JSON.parse(affiliateData);
                if (String(parsedAffiliate.id) !== affiliateId) {
                    message.error('Access denied - Affiliate ID mismatch');
                    navigate('/login');
                    return;
                }
                setAffiliate(parsedAffiliate);
            } catch (error) {
                console.error('Error parsing affiliate data:', error);
                navigate('/login');
                return;
            }
        }

        // Check subscription expiry
        const checkExpiry = async () => {
            try {
                const expiry = await ApiService.checkAffiliateSubscriptionExpiry(affiliateId);
                if (expiry?.expired) {
                    setExpired(true);
                    return;
                }
            } catch (error) {
                console.error('Subscription expiry check failed:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    setExpired(true);
                    return;
                }
            }
            fetchAnalytics();
        };
        checkExpiry();
    }, [affiliateId, navigate, timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await ApiService.getMyAffiliateAnalytics(timeRange);
            setAnalyticsData(response);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            message.error('Failed to fetch analytics');
            // Set empty analytics data structure on error
            setAnalyticsData({
                overview: {
                    totalHotels: 0,
                    totalClicks: 0,
                    pendingClicks: 0,
                    thisMonthClicks: 0
                },
                hotelsByDate: {
                    dates: [],
                    hotels: []
                },
                clicksByHotels: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (expired) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <Card style={{ textAlign: 'center', maxWidth: 450, padding: '24px' }}>
                    <CalendarOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
                    <Title level={3}>Subscription Expired</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                        Your affiliate subscription has expired or your session is no longer valid. Please log in again or contact support to renew.
                    </Text>
                    <Button type="primary" size="large" onClick={handleLogout}>
                        Back to Login
                    </Button>
                </Card>
            </div>
        );
    }

    if (!affiliate || !analyticsData) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Text>Loading analytics...</Text>
            </div>
        );
    }

    return (
        <PageTourWrapper pageName={TOUR_PAGES.AFFILIATE_DASHBOARD}>
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            
            {/* Welcome Header */}
            <Card 
                style={{ 
                    marginBottom: '24px', 
                    background: `linear-gradient(135deg, ${affiliate.primaryColor || '#1890ff'}, ${affiliate.primaryColor || '#1890ff'}dd)`,
                    border: 'none'
                }}
            >
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ color: 'white', margin: 0 }}>
                            Welcome back, {affiliate.affiliateName}!
                        </Title>
                        <Text style={{ color: 'white', fontSize: '16px' }}>
                            Analytics Dashboard - Track your performance
                        </Text>
                        <br />
                        <Text style={{ color: 'white', fontSize: '14px' }}>
                            Subscription ends: {moment(affiliate.subscriptionEndDate).format('MMM DD, YYYY')} | Pending clicks: {analyticsData?.overview?.pendingClicks || affiliate.pendingClicks || 0}
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Time Range Selector */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>Performance Analytics</Title>
                    <Text type="secondary">Track your affiliate performance and earnings</Text>
                </Col>
                <Col>
                    <Select
                        value={timeRange}
                        onChange={setTimeRange}
                        style={{ width: 120 }}
                    >
                        <Option value="7days">7 Days</Option>
                        <Option value="30days">30 Days</Option>
                        <Option value="90days">90 Days</Option>
                        <Option value="12months">12 Months</Option>
                    </Select>
                </Col>
            </Row>

            {/* 4 Key Metrics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }} className="affiliate-stats-cards">
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ textAlign: 'center' }}>
                        <Statistic
                            title="Total Clients"
                            value={analyticsData?.overview?.totalHotels || 0}
                            valueStyle={{ color: '#1890ff', fontSize: '32px', fontWeight: 'bold' }}
                            prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ textAlign: 'center' }}>
                        <Statistic
                            title="Total Clicks"
                            value={analyticsData?.overview?.totalClicks || 0}
                            valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 'bold' }}
                            prefix={<LineChartOutlined style={{ color: '#52c41a' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ textAlign: 'center' }}>
                        <Statistic
                            title="Pending Clicks"
                            value={analyticsData?.overview?.pendingClicks || 0}
                            valueStyle={{ color: '#faad14', fontSize: '32px', fontWeight: 'bold' }}
                            prefix={<EyeOutlined style={{ color: '#faad14' }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ textAlign: 'center' }}>
                        <Statistic
                            title="Expiry Date"
                            value={analyticsData?.overview?.thisMonthClicks.split("T")[0] || 'N/A'}
                            valueStyle={{ color: '#722ed1', fontSize: '32px', fontWeight: 'bold' }}
                            prefix={<CalendarOutlined style={{ color: '#722ed1' }} />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }} className="affiliate-analytics-section">

                {/* Hotels by Date */}
                <Col xs={24} lg={12}>
                    <Card title="Clients by Date" extra={<BankOutlined />}>
                        <div style={{ width: '100%', height: 300 }}>
                            {analyticsData?.hotelsByDate?.dates?.length > 0 ? (
                                <LineChart
                                    xAxis={[{
                                        data: analyticsData.hotelsByDate.dates,
                                        scaleType: 'point',
                                    }]}
                                    series={[{
                                        data: analyticsData.hotelsByDate.hotels,
                                        color: '#1890ff',
                                        curve: 'smooth',
                                        label: 'Clients Added'
                                    }]}
                                    width={500}
                                    height={300}
                                    margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                                    <BankOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                    <div>No client data available yet</div>
                                    <div>Add clients to see growth trends</div>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Clicks by Clients */}
                <Col xs={24} lg={12}>
                    <Card title="Clicks by Clients" extra={<LineChartOutlined />}>
                        <div style={{ width: '100%', height: 300 }}>
                            {analyticsData?.clicksByHotels?.length > 0 ? (
                                <BarChart
                                    xAxis={[{
                                        data: analyticsData.clicksByHotels.map(hotel => 
                                            hotel.name.length > 12 ? hotel.name.substring(0, 12) + '...' : hotel.name
                                        ),
                                        scaleType: 'band',
                                    }]}
                                    series={[{
                                        data: analyticsData.clicksByHotels.map(hotel => hotel.clicks),
                                        color: '#52c41a',
                                        label: 'Clicks'
                                    }]}
                                    width={500}
                                    height={300}
                                    margin={{ left: 60, right: 20, top: 20, bottom: 80 }}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                                    <LineChartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                    <div>No click data available yet</div>
                                    <div>Client clicks will appear here once traffic starts</div>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
        </PageTourWrapper>
    );
};

export default AffiliateDashboard;