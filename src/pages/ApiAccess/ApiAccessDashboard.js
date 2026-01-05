import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Row, Col, Statistic, Drawer, Table, message, Typography, Tag, Spin, Flex } from 'antd';
import { LineChart, BarChart, PieChart } from '@mui/x-charts';
import {
    EyeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    UserOutlined,
    BankOutlined,
    ApiOutlined,
    DollarOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import moment from 'moment';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';

const { Title, Text } = Typography;
const { Option } = Select;

const ApiAccessDashboard = () => {
    const theme = useRecoilValue(themeState);
    const [tokens, setTokens] = useState([]);
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logsDrawerVisible, setLogsDrawerVisible] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logsPagination, setLogsPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [logsLoading, setLogsLoading] = useState(false);

    // Fetch all tokens for dropdown
    useEffect(() => {
        fetchTokens();
    }, []);

    const fetchTokens = async () => {
        try {
            const response = await ApiService.getAllApiAccessTokens(1, 100);
            if (response.success && response.data) {
                setTokens(response.data);
                if (response.data.length > 0) {
                    setSelectedTokenId(response.data[0]._id);
                }
            }
        } catch (error) {
            message.error('Failed to fetch API tokens');
        }
    };

    // Fetch stats when token is selected
    useEffect(() => {
        if (selectedTokenId) {
            fetchStats();
        }
    }, [selectedTokenId]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getApiAccessTokenStats(selectedTokenId);
            if (response.success) {
                setStatsData(response.data);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Failed to fetch token statistics');
        }
    };

    const fetchLogs = async (page = 1, pageSize = 20) => {
        try {
            setLogsLoading(true);
            const response = await ApiService.getApiAccessTokenLogs(selectedTokenId, page, pageSize);
            if (response.success) {
                setLogs(response.data || []);
                setLogsPagination({
                    current: response.pagination?.page || 1,
                    pageSize: response.pagination?.limit || 20,
                    total: response.pagination?.total || 0,
                });
            }
            setLogsLoading(false);
        } catch (error) {
            setLogsLoading(false);
            message.error('Failed to fetch logs');
        }
    };

    const handleViewLogs = () => {
        setLogsDrawerVisible(true);
        fetchLogs();
    };

    const handleLogsTableChange = (pagination) => {
        fetchLogs(pagination.current, pagination.pageSize);
    };

    const logsColumns = [
        {
            title: 'Guide',
            dataIndex: ['travel_guide_id', 'name'],
            key: 'guide',
            render: (text, record) => record.travel_guide_id?.name || 'N/A',
        },
        {
            title: 'Access Type',
            dataIndex: 'access_type',
            width: 100,
            key: 'access_type',
            render: (type) => (
                <Tag color={type === 'pdf' ? 'blue' : type === 'html' ? 'green' : 'orange'}>
                    {type?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Transaction ID',
            width: 350,
            dataIndex: 'transaction_id',
            key: 'transaction_id',
            render: (text) => text || 'N/A',
            ellipsis: true,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => moment(date).format('MMM DD, YYYY HH:mm'),
        },
    ];

    if (loading || !statsData) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" />
                <Text style={{ display: 'block', marginTop: 16 }}>Loading dashboard...</Text>
            </div>
        );
    }

    const { token_info, usage, graphs, recent_logs } = statsData;

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2}>API Access Dashboard</Title>
                </Col>
                <Col>
                    <Select
                        style={{ width: 400, marginRight: 16 }}
                        placeholder="Select API Token"
                        value={selectedTokenId}
                        onChange={setSelectedTokenId}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                        }
                    >
                        {tokens.map(token => (
                            <Option key={token._id} value={token._id}>
                                {token.name} - {token.company_name} ({token.type?.toUpperCase()} {token.payment_type?.toUpperCase()})
                            </Option>
                        ))}
                    </Select>
                    <Button type="primary" icon={<EyeOutlined />} onClick={handleViewLogs}>
                        View Logs
                    </Button>
                </Col>
            </Row>

            {/* Token Info Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Text type="secondary">Name</Text>
                                <div>
                                    <Statistic
                                        value={token_info?.name || 'N/A'}
                                        valueStyle={{ fontSize: '16px', color: '#1890ff' }}
                                    />
                                </div>
                            </div>
                            <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        </Flex>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Text type="secondary">Company</Text>
                                <div>
                                    <Statistic
                                        value={token_info?.company_name || 'N/A'}
                                        valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                                    />
                                </div>
                            </div>
                            <BankOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                        </Flex>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Text type="secondary">Type</Text>
                                <div>
                                    <Statistic
                                        value={token_info?.type || 'N/A'}
                                        valueStyle={{ fontSize: '16px', color: '#fa8c16' }}
                                    />
                                </div>
                            </div>
                            <ApiOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                        </Flex>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Text type="secondary">Payment</Text>
                                <div>
                                    <Statistic
                                        value={token_info?.payment_type || 'N/A'}
                                        valueStyle={{ fontSize: '16px', color: '#722ed1' }}
                                    />
                                </div>
                            </div>
                            <DollarOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                        </Flex>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Text type="secondary">Status</Text>
                                <div>
                                    <Statistic
                                        value={token_info?.is_active ? 'Active' : 'Inactive'}
                                        valueStyle={{
                                            fontSize: '16px',
                                            color: token_info?.is_active ? '#52c41a' : '#f5222d'
                                        }}
                                    />
                                </div>
                            </div>
                            <CheckCircleOutlined
                                style={{
                                    fontSize: '24px',
                                    color: token_info?.is_active ? '#52c41a' : '#f5222d'
                                }}
                            />
                        </Flex>
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={8} lg={4} xl={4}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Text type="secondary">End Date</Text>
                                <div>
                                    <Statistic
                                        value={moment(token_info?.end_date).format('MMM DD, YYYY')}
                                        valueStyle={{ fontSize: '14px', color: '#eb2f96' }}
                                    />
                                </div>
                            </div>
                            <CalendarOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
                        </Flex>
                    </Card>
                </Col>
            </Row>

            {/* Usage Summary Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Accesses"
                            value={usage?.total_accesses || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Unique Guides"
                            value={usage?.unique_guides_accessed || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Remaining Quota"
                            value={usage?.remaining_quota || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Title level={4} style={{ marginBottom: 8 }}>Access Breakdown</Title>
                        <Flex gap="small" wrap="wrap">
                            {usage?.access_breakdown && Object.entries(usage.access_breakdown).map(([key, value]) => (
                                <Tag key={key} color={key === 'pdf' ? 'blue' : key === 'html' ? 'green' : 'orange'}>
                                    {key.toUpperCase()}: {value}
                                </Tag>
                            ))}
                        </Flex>
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Daily Usage (Last 30 Days)">
                        <LineChart
                            xAxis={[{ scaleType: 'point', data: (graphs?.daily_usage || []).map(d => d.date) }]}
                            series={[{ data: (graphs?.daily_usage || []).map(d => d.count), label: 'Count' }]}
                            height={300}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Category Breakdown">
                        <PieChart
                            series={[{
                                data: (graphs?.category_breakdown || []).map((item, index) => ({
                                    id: index,
                                    value: item.count,
                                    label: item.category_name
                                })),
                            }]}
                            height={300}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24}>
                    <Card title="Access Type Breakdown">
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: (graphs?.access_type_breakdown || []).map(d => d.type) }]}
                            series={[{ data: (graphs?.access_type_breakdown || []).map(d => d.count), label: 'Count' }]}
                            height={300}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Logs Drawer */}
            <Drawer
                title="Access Logs"
                placement="right"
                width={800}
                onClose={() => setLogsDrawerVisible(false)}
                open={logsDrawerVisible}
            >
                <Table
                    columns={logsColumns}
                    dataSource={logs}
                    rowKey="_id"
                    loading={logsLoading}
                    pagination={{
                        ...logsPagination,
                        showTotal: (total) => `Total ${total} logs`,
                    }}
                    onChange={handleLogsTableChange}
                />
            </Drawer>
        </div>
    );
};

export default ApiAccessDashboard;
