import React, { useEffect, useMemo, useState } from 'react';
import {
    Card, Table, Tag, Space, Button, Drawer, Input, Select, DatePicker,
    Tooltip, message, Typography, Descriptions, Divider, Popconfirm, Badge,
} from 'antd';
import { ReloadOutlined, MailOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';

const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const STATUS_COLORS = {
    paid: 'green',
    pending: 'gold',
    failed: 'red',
    expired: 'default',
    canceled: 'default',
};

const ESIM_COLORS = {
    completed: 'green',
    ordering: 'blue',
    pending: 'gold',
    failed: 'red',
};

const formatBytes = (bytes) => {
    if (!bytes) return 'Unlimited';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(gb % 1 === 0 ? 0 : 1)} GB`;
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
};

const fmtMoney = (amount) =>
    `€${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d) => (d ? new Date(d).toLocaleString() : '—');

const WebsiteOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 25, total: 0 });

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState();
    const [source, setSource] = useState();
    const [emailStatus, setEmailStatus] = useState();
    const [dateRange, setDateRange] = useState();

    const [resendingId, setResendingId] = useState(null);
    const [detail, setDetail] = useState({ open: false, order: null });

    const queryParams = useMemo(() => {
        const p = {
            page: pagination.current,
            limit: pagination.pageSize,
        };
        if (search) p.search = search;
        if (status) p.status = status;
        if (source) p.source = source;
        if (emailStatus) p.emailStatus = emailStatus;
        if (dateRange && dateRange.length === 2) {
            p.startDate = dateRange[0].startOf('day').toISOString();
            p.endDate = dateRange[1].endOf('day').toISOString();
        }
        return p;
    }, [pagination.current, pagination.pageSize, search, status, source, emailStatus, dateRange]);

    const load = async () => {
        try {
            setLoading(true);
            const res = await ApiService.getWebsiteOrders(queryParams);
            setOrders(res?.data || []);
            setPagination((prev) => ({
                ...prev,
                total: res?.pagination?.total || 0,
            }));
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); /* eslint-disable-next-line */ }, [queryParams]);

    const resetFilters = () => {
        setSearch('');
        setStatus(undefined);
        setSource(undefined);
        setEmailStatus(undefined);
        setDateRange(undefined);
        setPagination((p) => ({ ...p, current: 1 }));
    };

    const onResend = async (order) => {
        try {
            setResendingId(order._id);
            const res = await ApiService.resendWebsiteOrderEmail(order._id);
            message.success('Email resent.');
            // Update local row
            setOrders((rows) =>
                rows.map((r) =>
                    r._id === order._id
                        ? { ...r, emailSentAt: res.emailSentAt, emailAttempts: res.emailAttempts, emailLastError: null }
                        : r
                )
            );
            if (detail.open && detail.order?._id === order._id) {
                setDetail((d) => ({
                    ...d,
                    order: { ...d.order, emailSentAt: res.emailSentAt, emailAttempts: res.emailAttempts, emailLastError: null },
                }));
            }
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed to resend email.');
        } finally {
            setResendingId(null);
        }
    };

    const columns = [
        {
            title: 'Order #',
            dataIndex: 'transactionId',
            key: 'transactionId',
            render: (tx) => (
                <Tooltip title={tx}>
                    <Text code>{(tx || '').slice(0, 8).toUpperCase()}</Text>
                </Tooltip>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d) => fmtDate(d),
            width: 170,
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (_, r) => (
                <div>
                    <div>{r.customer_email}</div>
                    {r.user && r.user.name ? (
                        <Text type="secondary" style={{ fontSize: 12 }}>{r.user.name}</Text>
                    ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>Guest</Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Items',
            key: 'items',
            render: (_, r) => (
                <Space size={4}>
                    {r.itemsCount > 0 && <Tag color="blue">{r.itemsCount} guide{r.itemsCount > 1 ? 's' : ''}</Tag>}
                    {r.esimCount > 0 && <Tag color="purple">{r.esimCount} eSIM{r.esimCount > 1 ? 's' : ''}</Tag>}
                    {r.itemsCount === 0 && r.esimCount === 0 && <Text type="secondary">—</Text>}
                </Space>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (v) => <strong>{fmtMoney(v)}</strong>,
            width: 110,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (s) => <Tag color={STATUS_COLORS[s] || 'default'}>{(s || '').toUpperCase()}</Tag>,
            width: 110,
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            render: (s) => <Tag>{s || 'website'}</Tag>,
            width: 90,
        },
        {
            title: 'Email',
            key: 'email',
            render: (_, r) => {
                if (r.emailSentAt) {
                    return (
                        <Tooltip title={`Sent ${fmtDate(r.emailSentAt)}\nAttempts: ${r.emailAttempts}`}>
                            <Tag icon={<MailOutlined />} color="green">Sent</Tag>
                        </Tooltip>
                    );
                }
                if (r.emailLastError) {
                    return (
                        <Tooltip title={r.emailLastError}>
                            <Tag icon={<MailOutlined />} color="red">Failed</Tag>
                        </Tooltip>
                    );
                }
                if (r.status === 'paid') {
                    return <Tag icon={<MailOutlined />} color="orange">Not Sent</Tag>;
                }
                return <Tag>—</Tag>;
            },
            width: 110,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, r) => (
                <Space size={4}>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => setDetail({ open: true, order: r })}
                    >
                        Details
                    </Button>
                    {r.status === 'paid' && (
                        <Popconfirm
                            title="Resend confirmation email?"
                            description={`Send a fresh confirmation email to ${r.customer_email}.`}
                            onConfirm={() => onResend(r)}
                            okText="Resend"
                        >
                            <Button
                                size="small"
                                icon={<SendOutlined />}
                                loading={resendingId === r._id}
                            >
                                {r.emailSentAt ? 'Resend' : 'Send'}
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
            width: 200,
        },
    ];

    const detailOrder = detail.order;

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Website Orders"
                extra={
                    <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
                }
            >
                <Paragraph type="secondary" style={{ marginTop: 0 }}>
                    Cart purchases coming from the public website (and mobile cart). Filter by status, search by email or order ID, and resend confirmation emails when needed.
                </Paragraph>

                <Space wrap style={{ marginBottom: 16 }}>
                    <Input.Search
                        placeholder="Search email / order ID / Stripe session"
                        allowClear
                        style={{ width: 320 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={(v) => {
                            setSearch(v);
                            setPagination((p) => ({ ...p, current: 1 }));
                        }}
                    />
                    <Select
                        placeholder="Status"
                        allowClear
                        style={{ width: 130 }}
                        value={status}
                        onChange={(v) => { setStatus(v); setPagination((p) => ({ ...p, current: 1 })); }}
                        options={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'failed', label: 'Failed' },
                            { value: 'expired', label: 'Expired' },
                            { value: 'canceled', label: 'Canceled' },
                        ]}
                    />
                    <Select
                        placeholder="Source"
                        allowClear
                        style={{ width: 120 }}
                        value={source}
                        onChange={(v) => { setSource(v); setPagination((p) => ({ ...p, current: 1 })); }}
                        options={[
                            { value: 'website', label: 'Website' },
                            { value: 'mobile', label: 'Mobile' },
                        ]}
                    />
                    <Select
                        placeholder="Email"
                        allowClear
                        style={{ width: 130 }}
                        value={emailStatus}
                        onChange={(v) => { setEmailStatus(v); setPagination((p) => ({ ...p, current: 1 })); }}
                        options={[
                            { value: 'sent', label: 'Email sent' },
                            { value: 'unsent', label: 'Email not sent' },
                        ]}
                    />
                    <RangePicker
                        value={dateRange}
                        onChange={(v) => { setDateRange(v); setPagination((p) => ({ ...p, current: 1 })); }}
                    />
                    <Button onClick={resetFilters}>Reset</Button>
                </Space>

                <Table
                    rowKey="_id"
                    dataSource={orders}
                    columns={columns}
                    loading={loading}
                    scroll={{ x: 1200 }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50', '100'],
                        showTotal: (t) => `${t} orders`,
                        onChange: (page, pageSize) =>
                            setPagination((p) => ({ ...p, current: page, pageSize })),
                    }}
                />
            </Card>

            <Drawer
                width={760}
                title={
                    detailOrder
                        ? <>Order #{(detailOrder.transactionId || '').slice(0, 8).toUpperCase()}</>
                        : 'Order'
                }
                open={detail.open}
                onClose={() => setDetail({ open: false, order: null })}
                extra={
                    detailOrder && detailOrder.status === 'paid' && (
                        <Popconfirm
                            title="Resend confirmation email?"
                            onConfirm={() => onResend(detailOrder)}
                            okText="Resend"
                        >
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                loading={resendingId === detailOrder._id}
                            >
                                {detailOrder.emailSentAt ? 'Resend Email' : 'Send Email'}
                            </Button>
                        </Popconfirm>
                    )
                }
            >
                {detailOrder && (
                    <>
                        <Descriptions column={2} size="small" bordered>
                            <Descriptions.Item label="Status">
                                <Tag color={STATUS_COLORS[detailOrder.status] || 'default'}>
                                    {(detailOrder.status || '').toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Source">
                                <Tag>{detailOrder.source || 'website'}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Customer Email">
                                {detailOrder.customer_email}
                            </Descriptions.Item>
                            <Descriptions.Item label="User">
                                {detailOrder.user?.name || (detailOrder.user ? detailOrder.user.email : 'Guest')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total">
                                <strong>{fmtMoney(detailOrder.totalAmount)}</strong>
                            </Descriptions.Item>
                            <Descriptions.Item label="Coupon">
                                {detailOrder.coupon?.code
                                    ? `${detailOrder.coupon.code} (${detailOrder.coupon.percentage}%)`
                                    : '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Created">
                                {fmtDate(detailOrder.createdAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Updated">
                                {fmtDate(detailOrder.updatedAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Stripe Session" span={2}>
                                <Text code style={{ fontSize: 12 }}>{detailOrder.paymentId}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Transaction ID" span={2}>
                                <Text code style={{ fontSize: 12 }}>{detailOrder.transactionId}</Text>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left" style={{ marginTop: 24 }}>Email</Divider>
                        <Descriptions column={2} size="small" bordered>
                            <Descriptions.Item label="Status">
                                {detailOrder.emailSentAt
                                    ? <Badge status="success" text="Sent" />
                                    : detailOrder.emailLastError
                                        ? <Badge status="error" text="Failed" />
                                        : <Badge status="warning" text="Not Sent" />}
                            </Descriptions.Item>
                            <Descriptions.Item label="Sent At">
                                {fmtDate(detailOrder.emailSentAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Attempts">
                                {detailOrder.emailAttempts || 0}
                            </Descriptions.Item>
                            <Descriptions.Item label="Last Error">
                                {detailOrder.emailLastError || '—'}
                            </Descriptions.Item>
                        </Descriptions>

                        {detailOrder.items && detailOrder.items.length > 0 && (
                            <>
                                <Divider orientation="left" style={{ marginTop: 24 }}>
                                    Guides ({detailOrder.items.length})
                                </Divider>
                                <Table
                                    rowKey={(r, i) => `${r.book_id}-${i}`}
                                    size="small"
                                    pagination={false}
                                    dataSource={detailOrder.items}
                                    columns={[
                                        { title: 'Name', dataIndex: 'name', key: 'name' },
                                        { title: 'Language / Format', dataIndex: 'lang', key: 'lang' },
                                        {
                                            title: 'Format',
                                            dataIndex: 'format',
                                            key: 'format',
                                            render: (f) => <Tag>{(f || 'pdf').toUpperCase()}</Tag>,
                                            width: 90,
                                        },
                                        {
                                            title: 'Price',
                                            dataIndex: 'price',
                                            key: 'price',
                                            render: (p, r) => (
                                                <span>
                                                    {fmtMoney(p)}
                                                    {r.originalPrice && r.originalPrice !== p && (
                                                        <Text delete type="secondary" style={{ marginLeft: 6, fontSize: 12 }}>
                                                            {fmtMoney(r.originalPrice)}
                                                        </Text>
                                                    )}
                                                </span>
                                            ),
                                            width: 130,
                                        },
                                    ]}
                                />
                            </>
                        )}

                        {detailOrder.esimItems && detailOrder.esimItems.length > 0 && (
                            <>
                                <Divider orientation="left" style={{ marginTop: 24 }}>
                                    eSIMs ({detailOrder.esimItems.length})
                                </Divider>
                                <Table
                                    rowKey={(r, i) => `${r.packageCode}-${i}`}
                                    size="small"
                                    pagination={false}
                                    dataSource={detailOrder.esimItems}
                                    expandable={{
                                        expandedRowRender: (row) =>
                                            (row.esimProfiles || []).length === 0
                                                ? <Text type="secondary">No profiles provisioned.</Text>
                                                : (
                                                    <Table
                                                        rowKey={(p, i) => `${p.iccid || i}`}
                                                        size="small"
                                                        pagination={false}
                                                        dataSource={row.esimProfiles}
                                                        columns={[
                                                            { title: 'ICCID', dataIndex: 'iccid', key: 'iccid' },
                                                            { title: 'SM-DP+', dataIndex: 'smdpAddress', key: 'smdp' },
                                                            { title: 'Activation', dataIndex: 'activationCode', key: 'ac' },
                                                            { title: 'Status', dataIndex: 'status', key: 's' },
                                                        ]}
                                                    />
                                                ),
                                        rowExpandable: (row) => (row.esimProfiles || []).length > 0,
                                    }}
                                    columns={[
                                        { title: 'Package', dataIndex: 'packageName', key: 'name' },
                                        { title: 'Location', dataIndex: 'location', key: 'loc' },
                                        {
                                            title: 'Data',
                                            dataIndex: 'data',
                                            key: 'data',
                                            render: (b) => formatBytes(b),
                                            width: 90,
                                        },
                                        {
                                            title: 'Days',
                                            dataIndex: 'duration',
                                            key: 'dur',
                                            width: 70,
                                        },
                                        {
                                            title: 'Price',
                                            dataIndex: 'price',
                                            key: 'price',
                                            render: (p) => fmtMoney(p),
                                            width: 100,
                                        },
                                        {
                                            title: 'Status',
                                            dataIndex: 'status',
                                            key: 'status',
                                            render: (s) => <Tag color={ESIM_COLORS[s] || 'default'}>{s}</Tag>,
                                            width: 110,
                                        },
                                        {
                                            title: 'Profiles',
                                            dataIndex: 'profilesCount',
                                            key: 'profiles',
                                            width: 80,
                                        },
                                    ]}
                                />
                            </>
                        )}
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default WebsiteOrders;
