import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Button, Typography, Flex, Input, Select, Modal, Drawer, Timeline, message } from 'antd';
import { EyeOutlined, QrcodeOutlined, UnorderedListOutlined, SearchOutlined, MailOutlined } from '@ant-design/icons';
import QRCode from 'qrcode.react';
import ApiService from '../../APIServices/ApiService';
import CustomCard from '../../components/Card';

const { Title, Text } = Typography;

const statusColors = {
    pending: 'orange',
    verified: 'blue',
    purchased: 'green',
    email_sent: 'cyan',
    failed: 'red',
};

const logActionColors = {
    order_saved: 'blue',
    order_verified: 'geekblue',
    esim_purchased: 'green',
    email_sent: 'cyan',
    error: 'red',
};

const AmazonPurchases = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // QR Code Modal
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Logs Drawer
    const [logsDrawerVisible, setLogsDrawerVisible] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [logsOrder, setLogsOrder] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current,
                limit: pagination.pageSize,
            };
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;

            const data = await ApiService.getAmazonOrders(params);
            if (data.success) {
                setOrders(data.orders);
                setPagination(prev => ({ ...prev, total: data.totalOrders }));
            }
        } catch (error) {
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, search, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleTableChange = (pag) => {
        setPagination(prev => ({ ...prev, current: pag.current, pageSize: pag.pageSize }));
    };

    const handleSearch = (value) => {
        setSearch(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    // QR Code
    const showQrCode = (record) => {
        setSelectedOrder(record);
        setQrModalVisible(true);
    };

    // Logs
    const showLogs = async (record) => {
        setLogsOrder(record);
        setLogsDrawerVisible(true);
        setLogsLoading(true);
        try {
            const data = await ApiService.getAmazonOrderLogs(record._id);
            if (data.success) {
                setLogs(data.logs);
            }
        } catch (error) {
            message.error('Failed to fetch logs');
        } finally {
            setLogsLoading(false);
        }
    };

    const handleResendEmail = async (record) => {
        try {
            const data = await ApiService.resendAmazonOrderEmail(record._id);
            if (data.success) {
                message.success(data.message || 'Email sent successfully');
                fetchOrders();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send email');
        }
    };

    const columns = [
        {
            title: 'Order Number',
            dataIndex: 'order_number',
            key: 'order_number',
            width: 200,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Package',
            dataIndex: 'package_name',
            key: 'package_name',
            width: 200,
        },
        {
            title: 'Customer Email',
            dataIndex: 'customer_email',
            key: 'customer_email',
            width: 220,
            render: (text) => text || <Text type="secondary">—</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={statusColors[status] || 'default'}>
                    {status?.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: 120,
            render: (text) => text || <Text type="secondary">—</Text>,
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            render: (date) => new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
            }),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Flex gap={8}>
                    <Button
                        type="link"
                        icon={<QrcodeOutlined />}
                        onClick={() => showQrCode(record)}
                        disabled={!record.esim_profiles || record.esim_profiles.length === 0}
                        title="View QR Code"
                    />
                    <Button
                        type="link"
                        icon={<UnorderedListOutlined />}
                        onClick={() => showLogs(record)}
                        title="View Logs"
                    />
                    {record.esim_profiles?.length > 0 && record.customer_email && (
                        <Button
                            type="link"
                            icon={<MailOutlined />}
                            onClick={() => handleResendEmail(record)}
                            title="Send Email"
                            style={{ color: '#fa8c16' }}
                        />
                    )}
                </Flex>
            ),
        },
    ];

    const profile = selectedOrder?.esim_profiles?.[0];

    return (
        <>
            <Flex justify="space-between" align="center" className="mb-2">
                <div>
                    <Title level={2} className="my-0 fw-500">Amazon Purchases</Title>
                    <Title level={5} className="my-0 fw-500" type="secondary">
                        Manage Amazon eSIM orders
                    </Title>
                </div>
            </Flex>

            <CustomCard>
                <Flex gap={12} style={{ marginBottom: 20 }} wrap="wrap" align="center">
                    {/* <Input
                        placeholder="Search by order, email, package..."
                        allowClear
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                        suffix={<SearchOutlined style={{ color: '#bbb' }} />}
                        size="large"
                    /> */}
                    <Select
                        placeholder="Filter by status"
                        allowClear
                        onChange={handleStatusFilter}
                        style={{ width: 180 }}
                        size="large"
                        options={[
                            { label: 'Pending', value: 'pending' },
                            { label: 'Verified', value: 'verified' },
                            { label: 'Purchased', value: 'purchased' },
                            { label: 'Email Sent', value: 'email_sent' },
                            { label: 'Failed', value: 'failed' },
                        ]}
                    />
                </Flex>

                <Table
                    size="middle"
                    className="custom_table"
                    bordered
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} orders`,
                    }}
                    onChange={handleTableChange}
                />
            </CustomCard>

            {/* QR Code Modal */}
            <Modal
                title={`QR Code — Order #${selectedOrder?.order_number || ''}`}
                open={qrModalVisible}
                onCancel={() => setQrModalVisible(false)}
                footer={[<Button key="close" onClick={() => setQrModalVisible(false)}>Close</Button>]}
                centered
                width={420}
            >
                {profile?.qrCode ? (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <iframe
                            src={profile.qrCode}
                            title="eSIM QR Code"
                            style={{ width: '100%', height: 700, border: 'none', borderRadius: 8 }}
                        />
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', padding: 20 }}>No QR code available for this order.</p>
                )}
            </Modal>

            {/* Logs Drawer */}
            <Drawer
                title={<Title level={4} className="my-0">Logs — Order #{logsOrder?.order_number || ''}</Title>}
                width={450}
                onClose={() => setLogsDrawerVisible(false)}
                open={logsDrawerVisible}
            >
                {logsLoading ? (
                    <p>Loading logs...</p>
                ) : logs.length === 0 ? (
                    <p style={{ color: '#999' }}>No logs found for this order.</p>
                ) : (
                    <Timeline
                        items={logs.map(log => ({
                            color: logActionColors[log.action] || 'gray',
                            children: (
                                <div key={log._id}>
                                    <Tag color={logActionColors[log.action] || 'default'} style={{ marginBottom: 4 }}>
                                        {log.action?.replace('_', ' ').toUpperCase()}
                                    </Tag>
                                    <p style={{ margin: '4px 0', fontSize: 13 }}>{log.details}</p>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        {new Date(log.createdAt).toLocaleString('en-GB', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit', second: '2-digit',
                                        })}
                                    </Text>
                                </div>
                            ),
                        }))}
                    />
                )}
            </Drawer>
        </>
    );
};

export default AmazonPurchases;
