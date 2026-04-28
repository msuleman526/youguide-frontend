import React, { useState, useEffect } from 'react';
import {
    Card, Button, Typography, message, Table, Tag, Modal, Form, Input,
    InputNumber, Select, Row, Col, Space, Tooltip, Popconfirm, Drawer, Statistic, Spin
} from 'antd';
import { CopyOutlined, LinkOutlined, PlusOutlined, ReloadOutlined, BarChartOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import HotelPopup from './HotelPopup';

const { Title, Paragraph, Text } = Typography;

const PUBLIC_BASE = (typeof window !== 'undefined') ? `${window.location.origin}/#` : '';

const AffiliateHotelManagement = () => {
    const { affiliateId } = useParams();
    const navigate = useNavigate();

    const [affiliate, setAffiliate] = useState(null);
    const [links, setLinks] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [requestOpen, setRequestOpen] = useState(false);
    const [requestForm] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const [hotelOpen, setHotelOpen] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);

    const [statsOpen, setStatsOpen] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsData, setStatsData] = useState(null);

    const approvedLinks = links.filter((l) => l.status === 'approved');
    const hasApprovedLink = approvedLinks.length > 0;

    useEffect(() => {
        const token = localStorage.getItem('affiliateToken');
        const data = localStorage.getItem('affiliateData');
        if (!token || !data) { navigate('/login'); return; }
        const parsed = JSON.parse(data);
        if (String(parsed.id) !== affiliateId) {
            message.error('Access denied');
            navigate('/login');
            return;
        }
        setAffiliate(parsed);
        loadAll();
    }, [affiliateId, navigate]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [linksRes, hotelsRes, catsRes] = await Promise.all([
                ApiService.getMyAffiliateLinks(),
                ApiService.getMyHotels(),
                ApiService.getAllCategories(),
            ]);
            setLinks(linksRes || []);
            setHotels(hotelsRes || []);
            setCategories(catsRes || []);
        } catch (e) {
            message.error('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const submitRequest = async (values) => {
        try {
            setSubmitting(true);
            await ApiService.requestAffiliateLink({
                name: values.name,
                type: values.type,
                numberOfClicks: values.numberOfClicks,
                categories: values.categories,
            });
            message.success('Link requested. Awaiting admin approval.');
            setRequestOpen(false);
            requestForm.resetFields();
            loadAll();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Request failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const deleteLink = async (id) => {
        try {
            await ApiService.deleteAffiliateLink(id);
            message.success('Link deleted.');
            loadAll();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Delete failed.');
        }
    };

    const openStats = async (link) => {
        setStatsOpen(true);
        setStatsData(null);
        setStatsLoading(true);
        try {
            const data = await ApiService.getAffiliateLinkStats(link._id);
            setStatsData(data);
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed to load stats.');
        } finally {
            setStatsLoading(false);
        }
    };

    const copyUrl = (slug, hotelId) => {
        const url = `${PUBLIC_BASE}/affiliate-guides/${slug}${hotelId ? `?src=${hotelId}` : ''}`;
        navigator.clipboard?.writeText(url);
        message.success('Link copied.');
    };

    const linkColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Type', dataIndex: 'type', key: 'type',
            render: (t) => <Tag color={t === 'paid' ? 'gold' : 'blue'}>{t}</Tag>,
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (s) => {
                const colors = { pending: 'orange', approved: 'green', rejected: 'red', exhausted: 'red', expired: 'red' };
                return <Tag color={colors[s] || 'default'}>{s}</Tag>;
            },
        },
        {
            title: 'Slug / URL', dataIndex: 'slug', key: 'slug',
            render: (slug) => slug ? (
                <Space>
                    <code>{slug}</code>
                    <Tooltip title="Copy URL"><Button size="small" icon={<CopyOutlined />} onClick={() => copyUrl(slug)} /></Tooltip>
                </Space>
            ) : <Text type="secondary">—</Text>,
        },
        {
            title: 'Clicks', key: 'clicks',
            render: (_, r) => `${r.clicksRemaining ?? 0} / ${r.clicksBudget ?? 0}`,
        },
        {
            title: 'Categories', dataIndex: 'categories', key: 'cats',
            render: (cats) => (cats || []).map((c) => <Tag key={c._id || c}>{c.name || c}</Tag>),
        },
        {
            title: 'Actions', key: 'a',
            render: (_, r) => (
                <Space>
                    <Tooltip title="View stats">
                        <Button
                            size="small"
                            icon={<BarChartOutlined />}
                            onClick={() => openStats(r)}
                            disabled={r.status !== 'approved' && r.status !== 'exhausted'}
                        />
                    </Tooltip>
                    {r.rejectionReason && (
                        <Tooltip title={r.rejectionReason}><Tag color="red">Why?</Tag></Tooltip>
                    )}
                    <Popconfirm title="Delete this link?" onConfirm={() => deleteLink(r._id)}>
                        <Button size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const hotelColumns = [
        { title: 'Client', dataIndex: 'hotelName', key: 'name' },
        {
            title: 'Linked Link', dataIndex: 'affiliateLinkId', key: 'link',
            render: (linkId) => {
                const l = links.find((x) => x._id === (linkId?._id || linkId));
                return l ? <Tag color="blue">{l.name}</Tag> : <Tag>—</Tag>;
            },
        },
        {
            title: 'Tracking URL', key: 'url',
            render: (_, r) => {
                const l = links.find((x) => x._id === (r.affiliateLinkId?._id || r.affiliateLinkId));
                if (!l?.slug) return <Text type="secondary">—</Text>;
                return (
                    <Space>
                        <code style={{ fontSize: 11 }}>{`/affiliate-guides/${l.slug}?src=${r._id}`}</code>
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyUrl(l.slug, r._id)} />
                    </Space>
                );
            },
        },
        {
            title: 'Created', dataIndex: 'createdAt', key: 'cd',
            render: (d) => d ? new Date(d).toLocaleDateString() : '—',
        },
        {
            title: 'Actions', key: 'a',
            render: (_, r) => (
                <Space>
                    <Popconfirm title="Delete client?" onConfirm={async () => {
                        try {
                            await ApiService.deleteHotel(r._id);
                            message.success('Deleted.');
                            loadAll();
                        } catch (e) {
                            message.error('Failed to delete.');
                        }
                    }}>
                        <Button size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={<><LinkOutlined /> My Affiliate Links</>}
                extra={
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={loadAll} />
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setRequestOpen(true)}>
                            Request New Link
                        </Button>
                    </Space>
                }
                style={{ marginBottom: 16 }}
            >
                <Paragraph type="secondary">
                    Each link gets its own click budget and category set. New requests go to YouGuide admin for approval.
                </Paragraph>
                <Table rowKey="_id" dataSource={links} columns={linkColumns} loading={loading} size="middle" />
            </Card>

            <Card
                title="My Clients"
                extra={
                    <Tooltip title={hasApprovedLink ? '' : 'Approve at least one link before adding clients'}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            disabled={!hasApprovedLink}
                            onClick={() => { setEditingHotel(null); setHotelOpen(true); }}
                        >
                            Add Client
                        </Button>
                    </Tooltip>
                }
            >
                <Paragraph type="secondary">
                    Clients ride on top of an existing approved link. The same link is shared — the <code>src</code> query param identifies which client a click came from.
                </Paragraph>
                <Table rowKey="_id" dataSource={hotels} columns={hotelColumns} loading={loading} size="middle" />
            </Card>

            <Modal
                title="Request a new link"
                open={requestOpen}
                onCancel={() => setRequestOpen(false)}
                onOk={() => requestForm.submit()}
                confirmLoading={submitting}
                okText="Submit request"
                width={620}
            >
                <Form
                    layout="vertical"
                    form={requestForm}
                    onFinish={submitRequest}
                    initialValues={{ type: 'free_html', numberOfClicks: 500 }}
                >
                    <Form.Item name="name" label="Name (for your reference)">
                        <Input placeholder="Optional, e.g. 'Summer 2026 promo'" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="free_html">Free HTML (Open guides)</Select.Option>
                                    <Select.Option value="paid">Paid (Buy Now via Stripe)</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="numberOfClicks"
                                label="No Of Clicks"
                                rules={[{ required: true }]}
                                extra="One click is consumed the first time a visitor opens a guide. Re-opens of the same guide by the same visitor are tracked but don't consume."
                            >
                                <InputNumber min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="categories" label="Categories" rules={[{ required: true, message: 'Pick at least one' }]}>
                        <Select
                            mode="multiple"
                            placeholder="Pick categories"
                            options={categories.map((c) => ({ label: c.name, value: c._id }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {hotelOpen && (
                <HotelPopup
                    open={hotelOpen}
                    setOpen={setHotelOpen}
                    type={editingHotel ? 'Edit' : 'Add'}
                    hotel={editingHotel}
                    approvedLinks={approvedLinks}
                    onSaved={() => { setHotelOpen(false); loadAll(); }}
                />
            )}

            <Drawer
                width={760}
                title={statsData?.link ? `Stats — ${statsData.link.name}` : 'Stats'}
                open={statsOpen}
                onClose={() => { setStatsOpen(false); setStatsData(null); }}
            >
                {statsLoading && (
                    <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
                )}
                {statsData && !statsLoading && (() => {
                    const isPaid = statsData.link.type === 'paid';
                    const eventLabel = isPaid ? 'Purchases' : 'Opens';
                    const eventLabelSingular = isPaid ? 'purchase' : 'open';
                    const fmtCurrency = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;

                    return (
                        <>
                            <Row gutter={16} style={{ marginBottom: 16 }}>
                                <Col xs={12} md={6}>
                                    <Card>
                                        <Statistic
                                            title="Clicks Used"
                                            value={Math.max(0, (statsData.link.clicksBudget || 0) - (statsData.link.clicksRemaining || 0))}
                                            suffix={`/ ${statsData.link.clicksBudget || 0}`}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Card>
                                        <Statistic title="Link Views" value={statsData.totals.linkViews} />
                                    </Card>
                                </Col>
                                {isPaid ? (
                                    <>
                                        <Col xs={12} md={6}>
                                            <Card>
                                                <Statistic title="Purchases" value={statsData.totals.purchases} />
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Card>
                                                <Statistic title="Gross Revenue" value={fmtCurrency(statsData.revenue?.gross)} />
                                            </Card>
                                        </Col>
                                    </>
                                ) : (
                                    <>
                                        <Col xs={12} md={6}>
                                            <Card>
                                                <Statistic title="Total Opens" value={statsData.totals.opens} />
                                            </Card>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Card>
                                                <Statistic title="Unique Opens" value={statsData.totals.uniqueOpens} />
                                            </Card>
                                        </Col>
                                    </>
                                )}
                            </Row>

                            <Card title={`${eventLabel} — last 30 days`} size="small" style={{ marginBottom: 16 }}>
                                <Table
                                    rowKey="date"
                                    size="small"
                                    dataSource={statsData.byDay}
                                    pagination={false}
                                    scroll={{ y: 200 }}
                                    locale={{ emptyText: `No ${eventLabelSingular}s yet` }}
                                    columns={[
                                        { title: 'Date', dataIndex: 'date', key: 'date' },
                                        { title: eventLabel, dataIndex: 'opens', key: 'o' },
                                        ...(isPaid ? [] : [{ title: 'Unique', dataIndex: 'unique', key: 'u' }]),
                                    ]}
                                />
                            </Card>

                            <Card title={`${eventLabel} by Guide`} size="small" style={{ marginBottom: 16 }}>
                                <Table
                                    rowKey={(r) => r.book?._id || Math.random()}
                                    size="small"
                                    dataSource={statsData.byBook}
                                    pagination={{ pageSize: 8 }}
                                    locale={{ emptyText: `No guide ${eventLabelSingular}s yet` }}
                                    columns={[
                                        { title: 'Guide', key: 'name', render: (_, r) => r.book ? (r.book.name || r.book.eng_name) : '—' },
                                        { title: 'Location', key: 'loc', render: (_, r) => r.book ? [r.book.city, r.book.country].filter(Boolean).join(', ') : '' },
                                        { title: eventLabel, dataIndex: 'opens', key: 'o' },
                                        ...(isPaid ? [] : [{ title: 'Unique', dataIndex: 'unique', key: 'u' }]),
                                    ]}
                                />
                            </Card>

                            <Card title={`${eventLabel} by Client`} size="small">
                                <Table
                                    rowKey={(r) => r.hotel?._id || Math.random()}
                                    size="small"
                                    dataSource={statsData.byHotel}
                                    pagination={false}
                                    locale={{ emptyText: 'No client traffic yet' }}
                                    columns={[
                                        { title: 'Client', key: 'name', render: (_, r) => r.hotel?.hotelName || '—' },
                                        { title: eventLabel, dataIndex: 'opens', key: 'o' },
                                        ...(isPaid ? [] : [{ title: 'Unique', dataIndex: 'unique', key: 'u' }]),
                                    ]}
                                />
                            </Card>
                        </>
                    );
                })()}
            </Drawer>
        </div>
    );
};

export default AffiliateHotelManagement;
