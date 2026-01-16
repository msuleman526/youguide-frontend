import React, { useState, useEffect } from 'react';
import { Drawer, Row, Col, Card, Statistic, Tabs, Table, Tag, Typography, Button, Modal } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { PieChart } from '@mui/x-charts';
import dayjs from 'dayjs';
import ApiService from '../../APIServices/ApiService';

const { Text } = Typography;

const StatsDrawer = ({
    visible,
    onClose,
    token,
    statsData,
    isAffiliate = false
}) => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Transaction Logs state
    const [transactionLogs, setTransactionLogs] = useState([]);
    const [transactionLogsLoading, setTransactionLogsLoading] = useState(false);
    const [transactionLogsPagination, setTransactionLogsPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0
    });

    // API Logs state
    const [apiLogs, setApiLogs] = useState([]);
    const [apiLogsLoading, setApiLogsLoading] = useState(false);
    const [apiLogsPagination, setApiLogsPagination] = useState({
        current: 1,
        pageSize: 50,
        total: 0
    });

    // Log Detail Modal state
    const [logDetailModalVisible, setLogDetailModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        if (visible && token?._id) {
            setActiveTab('dashboard');
        }
    }, [visible, token]);

    useEffect(() => {
        if (visible && token?._id && activeTab === 'transaction') {
            fetchTransactionLogs();
        }
    }, [visible, token, activeTab]);

    useEffect(() => {
        if (visible && token?._id && activeTab === 'api') {
            fetchApiLogs();
        }
    }, [visible, token, activeTab]);

    const fetchTransactionLogs = async (page = 1, pageSize = 20) => {
        try {
            setTransactionLogsLoading(true);
            const response = isAffiliate
                ? await ApiService.getAffiliateApiAccessTokenLogs(token._id, page, pageSize)
                : await ApiService.getApiAccessTokenLogs(token._id, page, pageSize);
            if (response.success) {
                setTransactionLogs(response.data || []);
                setTransactionLogsPagination({
                    current: response.pagination?.page || 1,
                    pageSize: response.pagination?.limit || 20,
                    total: response.pagination?.total || 0,
                });
            }
        } catch (error) {
            console.error('Failed to fetch transaction logs');
        } finally {
            setTransactionLogsLoading(false);
        }
    };

    const fetchApiLogs = async (page = 1, pageSize = 50) => {
        try {
            setApiLogsLoading(true);
            const response = isAffiliate
                ? await ApiService.getAffiliateApiAccessDetailLogs(token._id, page, pageSize)
                : await ApiService.getApiAccessDetailLogs(token._id, page, pageSize);
            if (response.success) {
                setApiLogs(response.data || []);
                setApiLogsPagination({
                    current: response.pagination?.page || 1,
                    pageSize: response.pagination?.limit || 50,
                    total: response.pagination?.total || 0,
                });
            }
        } catch (error) {
            console.error('Failed to fetch API logs');
        } finally {
            setApiLogsLoading(false);
        }
    };

    const handleTransactionLogsTableChange = (pagination) => {
        fetchTransactionLogs(pagination.current, pagination.pageSize);
    };

    const handleApiLogsTableChange = (pagination) => {
        fetchApiLogs(pagination.current, pagination.pageSize);
    };

    const transactionLogsColumns = [
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
            width: 200,
            dataIndex: 'transaction_id',
            key: 'transaction_id',
            render: (text) => text || 'N/A',
            ellipsis: true,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
        },
    ];

    const apiLogsColumns = [
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            width: 150,
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'response_status',
            key: 'response_status',
            width: 50,
            render: (status) => (
                <Tag color={status >= 200 && status < 300 ? 'green' : status >= 400 ? 'red' : 'orange'}>
                    {status ? status : "N/A"}
                </Tag>
            ),
        },
        {
            title: 'Origin',
            dataIndex: 'origin',
            key: 'origin',
            width: 70,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedLog(record);
                        setLogDetailModalVisible(true);
                    }}
                >
                    View
                </Button>
            ),
        },
    ];

    const tabItems = [
        {
            key: 'dashboard',
            label: 'Logs Dashboard',
            children: (
                <div>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Total Accesses"
                                    value={statsData?.usage?.total_accesses || 0}
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Unique Guides"
                                    value={statsData?.usage?.unique_guides_accessed || 0}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Total Quota"
                                    value={statsData?.usage?.total_allowed || 0}
                                    valueStyle={{ color: '#cf1322' }}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Remaining Quota"
                                    value={statsData?.usage?.remaining_quota || 0}
                                    valueStyle={{ color: '#cf1322' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Access Type Breakdown" style={{ marginTop: 16 }}>
                        <PieChart
                            series={[{
                                data: (statsData?.graphs?.access_type_breakdown || []).map((item, index) => ({
                                    id: index,
                                    value: item.count,
                                    label: item.type
                                })),
                            }]}
                            height={250}
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'transaction',
            label: 'Transaction Logs',
            children: (
                <Table
                    columns={transactionLogsColumns}
                    dataSource={transactionLogs}
                    rowKey="_id"
                    loading={transactionLogsLoading}
                    pagination={{
                        ...transactionLogsPagination,
                        showTotal: (total) => `Total ${total} logs`,
                        showSizeChanger: true,
                    }}
                    onChange={handleTransactionLogsTableChange}
                    size="small"
                />
            ),
        },
        {
            key: 'api',
            label: 'API Logs',
            children: (
                <Table
                    columns={apiLogsColumns}
                    dataSource={apiLogs}
                    rowKey="_id"
                    loading={apiLogsLoading}
                    pagination={{
                        ...apiLogsPagination,
                        showTotal: (total) => `Total ${total} logs`,
                        showSizeChanger: true,
                    }}
                    onChange={handleApiLogsTableChange}
                    size="small"
                    scroll={{ x: 900 }}
                />
            ),
        },
    ];

    return (
        <Drawer
            title={`Statistics - ${token?.name}`}
            placement="right"
            width={800}
            onClose={onClose}
            open={visible}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
            />

            <Modal
                title="API Log Details"
                open={logDetailModalVisible}
                onCancel={() => {
                    setLogDetailModalVisible(false);
                    setSelectedLog(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setLogDetailModalVisible(false);
                        setSelectedLog(null);
                    }}>
                        Close
                    </Button>
                ]}
                width={600}
            >
                {selectedLog && (
                    <div style={{ padding: '12px 0' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Text strong>Message: </Text>
                                <Text style={{ color: 'black' }}>{selectedLog.message || 'N/A'}</Text>
                            </Col>
                            <Col span={12}>
                                <Text strong>Status: </Text>
                                <Tag color={selectedLog.response_status >= 200 && selectedLog.response_status < 300 ? 'green' : selectedLog.response_status >= 400 ? 'red' : 'orange'}>
                                    {selectedLog.response_status || 'N/A'}
                                </Tag>
                            </Col>
                            <Col span={12}>
                                <Text strong>Method: </Text>
                                <Tag color={
                                    selectedLog.method === 'GET' ? 'green' :
                                    selectedLog.method === 'POST' ? 'blue' :
                                    selectedLog.method === 'PUT' ? 'orange' :
                                    selectedLog.method === 'DELETE' ? 'red' : 'default'
                                }>
                                    {selectedLog.method || 'N/A'}
                                </Tag>
                            </Col>
                            <Col span={24}>
                                <Text strong>Endpoint: </Text>
                                <Text style={{ color: 'black' }}>{selectedLog.endpoint || 'N/A'}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>Origin: </Text>
                                <Text style={{ color: 'black' }}>{selectedLog.origin || 'N/A'}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>Referer: </Text>
                                <Text style={{ color: 'black' }}>{selectedLog.referer || 'N/A'}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>User Agent: </Text>
                                <Text style={{ wordBreak: 'break-all', color: 'black' }}>{selectedLog.user_agent || 'N/A'}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>Query Params: </Text>
                                <Text code style={{ color: 'black' }}>{selectedLog.query_params ? JSON.stringify(selectedLog.query_params, null, 2) : 'N/A'}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>IP Address: </Text>
                                <Text style={{ color: 'black' }}>{selectedLog.ip_address || 'N/A'}</Text>
                            </Col>
                            <Col span={24}>
                                <Text strong>Date: </Text>
                                <Text style={{ color: 'black' }}>{selectedLog.created_at ? dayjs(selectedLog.created_at).format('MMM DD, YYYY HH:mm:ss') : 'N/A'}</Text>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </Drawer>
    );
};

export default StatsDrawer;
