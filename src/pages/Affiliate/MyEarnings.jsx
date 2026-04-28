import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin, message } from 'antd';
import dayjs from 'dayjs';
import ApiService from '../../APIServices/ApiService';

const fmt = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;
const monthLabel = (y, m) => dayjs(`${y}-${String(m).padStart(2, '0')}-01`).format('MMM YYYY');

const MyEarnings = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await ApiService.getMyEarnings();
                setData(res);
            } catch (e) {
                message.error('Failed to load earnings.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <Spin style={{ display: 'block', margin: '60px auto' }} size="large" />;
    if (!data) return null;

    const { totals, monthly, perLink, cascadeFrom } = data;

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={6}><Card><Statistic title="Lifetime Earned" value={fmt(totals.lifetime)} /></Card></Col>
                <Col xs={24} sm={6}><Card><Statistic title="Pending Payout" value={fmt(totals.pending)} valueStyle={{ color: '#fa8c16' }} /></Card></Col>
                <Col xs={24} sm={6}><Card><Statistic title="Paid" value={fmt(totals.paid)} valueStyle={{ color: '#52c41a' }} /></Card></Col>
                <Col xs={24} sm={6}><Card><Statistic title="Total Sales" value={totals.saleCount} /></Card></Col>
            </Row>

            <Card title="Monthly breakdown (last 12 months)" style={{ marginBottom: 16 }}>
                <Table
                    rowKey={(r) => `${r.year}-${r.month}`}
                    dataSource={monthly}
                    pagination={false}
                    size="small"
                    columns={[
                        { title: 'Month', key: 'm', render: (_, r) => monthLabel(r.year, r.month) },
                        { title: 'Sales', dataIndex: 'sales', key: 's' },
                        { title: 'Earned', dataIndex: 'earned', key: 'e', render: fmt },
                    ]}
                />
            </Card>

            <Card title="Earnings per link (where you are the seller)" style={{ marginBottom: 16 }}>
                <Table
                    rowKey={(r) => r.link?._id || Math.random()}
                    dataSource={perLink}
                    pagination={false}
                    size="small"
                    columns={[
                        { title: 'Link', key: 'name', render: (_, r) => r.link?.name || '—' },
                        { title: 'Slug', key: 'slug', render: (_, r) => r.link?.slug ? <code>{r.link.slug}</code> : '—' },
                        { title: 'Type', key: 'type', render: (_, r) => <Tag>{r.link?.type}</Tag> },
                        { title: 'Sales', dataIndex: 'sales', key: 's' },
                        { title: 'Gross', dataIndex: 'gross', key: 'g', render: fmt },
                        { title: 'Your Earnings', dataIndex: 'earned', key: 'e', render: (v) => <strong>{fmt(v)}</strong> },
                    ]}
                />
            </Card>

            <Card title="Cascade earnings (from your sub-affiliates)">
                <Table
                    rowKey={(r) => r.sellerAffiliate?._id || Math.random()}
                    dataSource={cascadeFrom}
                    pagination={false}
                    size="small"
                    columns={[
                        { title: 'Sub-affiliate', key: 'name', render: (_, r) => r.sellerAffiliate?.affiliateName || '—' },
                        { title: 'Sales by them', dataIndex: 'sales', key: 's' },
                        { title: 'You earned', dataIndex: 'earned', key: 'e', render: (v) => <strong>{fmt(v)}</strong> },
                    ]}
                    locale={{ emptyText: 'No cascade earnings yet.' }}
                />
            </Card>
        </div>
    );
};

export default MyEarnings;
