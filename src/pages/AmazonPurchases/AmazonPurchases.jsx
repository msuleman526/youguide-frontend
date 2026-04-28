import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Button, Typography, Flex, Input, Select, Modal, Drawer, Timeline, Tabs, message } from 'antd';
import { EyeOutlined, QrcodeOutlined, UnorderedListOutlined, SearchOutlined, MailOutlined, DownloadOutlined, EditOutlined, CreditCardOutlined } from '@ant-design/icons';
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

/** Collect all esim_profiles from packages array or legacy flat field */
const collectProfiles = (record) => {
    if (record.packages && record.packages.length > 0) {
        const profiles = [];
        record.packages.forEach((pkg, pkgIdx) => {
            (pkg.esim_profiles || []).forEach((p) => {
                profiles.push({ ...p, _pkgName: pkg.cleaned_package_name || pkg.package_name, _pkgIdx: pkgIdx });
            });
        });
        return profiles;
    }
    return (record.esim_profiles || []).map(p => ({ ...p, _pkgName: record.cleaned_package_name || record.package_name, _pkgIdx: 0 }));
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

    // Email Modal
    const [emailModalVisible, setEmailModalVisible] = useState(false);
    const [emailOrder, setEmailOrder] = useState(null);
    const [emailValue, setEmailValue] = useState('');
    const [emailSending, setEmailSending] = useState(false);

    // Status Update Modal
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusOrder, setStatusOrder] = useState(null);
    const [statusValue, setStatusValue] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(false);

    // Logs Drawer
    const [logsDrawerVisible, setLogsDrawerVisible] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [logsOrder, setLogsOrder] = useState(null);

    // Stripe Checkout Modal
    const [stripeModalVisible, setStripeModalVisible] = useState(false);
    const [stripeOrder, setStripeOrder] = useState(null);
    const [stripeEmail, setStripeEmail] = useState('');
    const [stripeAmount, setStripeAmount] = useState('');
    const [stripeLoading, setStripeLoading] = useState(false);

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

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const showQrCode = (record) => {
        setSelectedOrder(record);
        setQrModalVisible(true);
    };

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

    const showEmailModal = (record) => {
        setEmailOrder(record);
        setEmailValue(record.customer_email || '');
        setEmailModalVisible(true);
    };

    const handleSendEmail = async () => {
        if (!emailValue?.trim()) {
            message.warning('Please enter an email address');
            return;
        }
        setEmailSending(true);
        try {
            const data = await ApiService.resendAmazonOrderEmail(emailOrder._id, emailValue.trim());
            if (data.success) {
                message.success(data.message || 'Email sent successfully');
                setEmailModalVisible(false);
                fetchOrders();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send email');
        } finally {
            setEmailSending(false);
        }
    };

    const showStatusModal = (record) => {
        setStatusOrder(record);
        setStatusValue(record.status);
        setStatusModalVisible(true);
    };

    const showStripeModal = (record) => {
        setStripeOrder(record);
        setStripeEmail(record.customer_email || '');
        setStripeAmount('');
        setStripeModalVisible(true);
    };

    const handleStripeCheckout = async () => {
        if (!stripeEmail?.trim()) {
            message.warning('Please enter a customer email');
            return;
        }
        const amt = parseFloat(stripeAmount);
        if (!amt || amt <= 0) {
            message.warning('Please enter a valid amount');
            return;
        }
        setStripeLoading(true);
        try {
            const data = await ApiService.createAmazonEsimCheckout({
                order_number: stripeOrder.order_number,
                customer_email: stripeEmail.trim(),
                amount: amt,
            });
            if (data.success && data.checkoutUrl) {
                window.open(data.checkoutUrl, '_blank');
                setStripeModalVisible(false);
                fetchOrders();
            } else {
                message.error(data.message || 'Failed to create checkout');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to create Stripe checkout');
        } finally {
            setStripeLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!statusValue) {
            message.warning('Please select a status');
            return;
        }
        setStatusUpdating(true);
        try {
            const data = await ApiService.updateAmazonOrderStatus(statusOrder._id, statusValue);
            if (data.success) {
                message.success(data.message || 'Status updated successfully');
                setStatusModalVisible(false);
                fetchOrders();
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setStatusUpdating(false);
        }
    };

    /** Check if order has any profiles */
    const hasProfiles = (record) => collectProfiles(record).length > 0;

    const columns = [
        {
            title: 'Order Number',
            dataIndex: 'order_number',
            key: 'order_number',
            width: 200,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Full Name (API)',
            dataIndex: 'package_name',
            key: 'package_name',
            width: 240,
            render: (text, record) => {
                const pkgs = record.packages || [];
                if (pkgs.length > 1) {
                    return pkgs.map((p, i) => (
                        <div key={i} style={{ marginBottom: i < pkgs.length - 1 ? 4 : 0 }}>
                            {p.package_name}
                        </div>
                    ));
                }
                return text;
            },
        },
        {
            title: 'Package Name',
            dataIndex: 'cleaned_package_name',
            key: 'cleaned_package_name',
            width: 200,
            render: (text, record) => {
                const pkgs = record.packages || [];
                if (pkgs.length > 1) {
                    return pkgs.map((p, i) => (
                        <div key={i} style={{ marginBottom: i < pkgs.length - 1 ? 4 : 0 }}>
                            {p.cleaned_package_name || <Text type="secondary">—</Text>}
                        </div>
                    ));
                }
                return text || <Text type="secondary">—</Text>;
            },
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 70,
            align: 'center',
            render: (qty, record) => {
                const pkgs = record.packages || [];
                if (pkgs.length > 1) {
                    return pkgs.map((p, i) => (
                        <div key={i} style={{ marginBottom: i < pkgs.length - 1 ? 4 : 0 }}>
                            {p.quantity || 1}
                        </div>
                    ));
                }
                return qty || 1;
            },
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
                        disabled={!hasProfiles(record)}
                        title="View QR Code"
                    />
                    <Button
                        type="link"
                        icon={<UnorderedListOutlined />}
                        onClick={() => showLogs(record)}
                        title="View Logs"
                    />
                    {hasProfiles(record) && (
                        <Button
                            type="link"
                            icon={<MailOutlined />}
                            onClick={() => showEmailModal(record)}
                            title="Send Email"
                            style={{ color: '#fa8c16' }}
                        />
                    )}
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showStatusModal(record)}
                        title="Update Status"
                        style={{ color: '#1890ff' }}
                    />
                    <Button
                        type="link"
                        icon={<CreditCardOutlined />}
                        onClick={() => showStripeModal(record)}
                        title="Stripe Checkout"
                        style={{ color: '#52c41a' }}
                    />
                </Flex>
            ),
        },
    ];

    const handleDownloadCSV = () => {
        if (!orders.length) {
            message.warning('No data to export');
            return;
        }
        const headers = ['Order Number', 'Full Name (API)', 'Package Name', 'Qty', 'Customer Email', 'Status', 'Created'];
        const rows = orders.map(order => [
            order.order_number || '',
            order.package_name || '',
            order.cleaned_package_name || '',
            order.quantity || 1,
            order.customer_email || '',
            order.status || '',
            order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
            }) : '',
        ]);
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `amazon-purchases-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Build tab structure for QR modal: packages → eSIM profiles
    const qrPackageTabs = (() => {
        if (!selectedOrder) return [];
        const pkgs = selectedOrder.packages && selectedOrder.packages.length > 0
            ? selectedOrder.packages
            : [{
                package_name: selectedOrder.package_name,
                cleaned_package_name: selectedOrder.cleaned_package_name,
                quantity: selectedOrder.quantity || 1,
                esim_profiles: selectedOrder.esim_profiles || [],
            }];

        return pkgs
            .filter(pkg => pkg.esim_profiles && pkg.esim_profiles.length > 0)
            .map((pkg, pkgIdx) => ({
                key: String(pkgIdx),
                label: pkg.cleaned_package_name || pkg.package_name || `Package ${pkgIdx + 1}`,
                children: pkg.esim_profiles.length === 1 ? (
                    <div style={{ textAlign: 'center' }}>
                        {pkg.esim_profiles[0].qrCode ? (
                            <iframe
                                src={pkg.esim_profiles[0].qrCode}
                                title="eSIM QR Code"
                                style={{ width: '100%', height: 600, border: 'none', borderRadius: 8 }}
                            />
                        ) : (
                            <p style={{ color: '#999', padding: 20 }}>No QR code available</p>
                        )}
                    </div>
                ) : (
                    <Tabs
                        size="small"
                        type="card"
                        items={pkg.esim_profiles.map((profile, esimIdx) => ({
                            key: String(esimIdx),
                            label: `eSIM ${esimIdx + 1}`,
                            children: (
                                <div style={{ textAlign: 'center' }}>
                                    {profile.qrCode ? (
                                        <iframe
                                            src={profile.qrCode}
                                            title={`eSIM QR Code ${esimIdx + 1}`}
                                            style={{ width: '100%', height: 600, border: 'none', borderRadius: 8 }}
                                        />
                                    ) : (
                                        <p style={{ color: '#999', padding: 20 }}>No QR code available</p>
                                    )}
                                </div>
                            ),
                        }))}
                    />
                ),
            }));
    })();

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
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadCSV}
                        size="large"
                    >
                        Download CSV
                    </Button>
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

            {/* QR Code Modal — tabs for packages, sub-tabs for eSIMs */}
            <Modal
                title={`QR Codes — Order #${selectedOrder?.order_number || ''}`}
                open={qrModalVisible}
                onCancel={() => setQrModalVisible(false)}
                footer={[<Button key="close" onClick={() => setQrModalVisible(false)}>Close</Button>]}
                centered
                width={520}
                styles={{ body: { maxHeight: '75vh', overflowY: 'auto' } }}
            >
                {qrPackageTabs.length > 1 ? (
                    <Tabs items={qrPackageTabs} />
                ) : qrPackageTabs.length === 1 ? (
                    <div>
                        <Tag color="blue" style={{ marginBottom: 12 }}>{qrPackageTabs[0].label}</Tag>
                        {qrPackageTabs[0].children}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', padding: 20 }}>No QR codes available for this order.</p>
                )}
            </Modal>

            {/* Email Modal */}
            <Modal
                title={`Send Email — Order #${emailOrder?.order_number || ''}`}
                open={emailModalVisible}
                onCancel={() => setEmailModalVisible(false)}
                onOk={handleSendEmail}
                okText="Update & Send Email"
                okButtonProps={{ loading: emailSending }}
                centered
                width={450}
            >
                <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Update the customer email and resend the eSIM details.</Text>
                </div>
                <Input
                    placeholder="Enter customer email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    size="large"
                    type="email"
                    onPressEnter={handleSendEmail}
                />
            </Modal>

            {/* Status Update Modal */}
            <Modal
                title={`Update Status — Order #${statusOrder?.order_number || ''}`}
                open={statusModalVisible}
                onCancel={() => setStatusModalVisible(false)}
                onOk={handleUpdateStatus}
                okText="Update Status"
                okButtonProps={{ loading: statusUpdating }}
                centered
                width={420}
            >
                <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Change the status of this order.</Text>
                </div>
                <Select
                    value={statusValue}
                    onChange={(value) => setStatusValue(value)}
                    style={{ width: '100%' }}
                    size="large"
                    options={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Verified', value: 'verified' },
                        { label: 'Purchased', value: 'purchased' },
                        { label: 'Email Sent', value: 'email_sent' },
                        { label: 'Failed', value: 'failed' },
                    ]}
                />
            </Modal>

            {/* Stripe Checkout Modal */}
            <Modal
                title={`Stripe Checkout — Order #${stripeOrder?.order_number || ''}`}
                open={stripeModalVisible}
                onCancel={() => setStripeModalVisible(false)}
                onOk={handleStripeCheckout}
                okText="Create Checkout Link"
                okButtonProps={{ loading: stripeLoading }}
                centered
                width={440}
            >
                <div style={{ marginBottom: 12 }}>
                    <Text type="secondary">
                        Charges the customer via Stripe (admin_panel key). On success, the eSIM is auto-provisioned and emailed.
                    </Text>
                </div>
                <div style={{ marginBottom: 10 }}>
                    <Text strong>Customer Email</Text>
                    <Input
                        value={stripeEmail}
                        onChange={(e) => setStripeEmail(e.target.value)}
                        placeholder="customer@example.com"
                        size="large"
                        style={{ marginTop: 4 }}
                    />
                </div>
                <div>
                    <Text strong>Amount (EUR)</Text>
                    <Input
                        value={stripeAmount}
                        onChange={(e) => setStripeAmount(e.target.value)}
                        placeholder="e.g. 14.99"
                        type="number"
                        step="0.01"
                        min="0"
                        size="large"
                        style={{ marginTop: 4 }}
                    />
                </div>
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
