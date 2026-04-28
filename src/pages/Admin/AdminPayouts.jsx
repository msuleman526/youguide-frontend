import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Drawer, message, Typography, Input } from 'antd';
import ApiService from '../../APIServices/ApiService';

const { Paragraph } = Typography;

const fmt = (cents, currency = 'usd') => {
    const v = (cents || 0) / 100;
    return v.toLocaleString(undefined, { style: 'currency', currency: currency.toUpperCase() });
};

const AdminPayouts = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawer, setDrawer] = useState({ open: false, affiliateId: null, items: [], totals: null });
    const [selected, setSelected] = useState([]);
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [history, setHistory] = useState({ open: false, affiliateName: null, rows: [] });

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getPayoutsSummary();
            setSummary(data || []);
        } catch (e) {
            message.error('Failed to load summary.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openDrilldown = async (row) => {
        try {
            const data = await ApiService.getPayoutsForAffiliate(row.affiliateId, 'unpaid');
            setDrawer({ open: true, affiliateId: row.affiliateId, items: data.items || [], totals: data.totals });
            setSelected([]);
            setReference('');
            setNotes('');
        } catch (e) {
            message.error('Failed to load drill-down.');
        }
    };

    const markPaid = async () => {
        if (!selected.length) {
            return message.warning('Select at least one purchase to settle.');
        }
        try {
            await ApiService.markPayoutPaid(drawer.affiliateId, {
                purchaseIds: selected,
                method: 'manual',
                reference,
                notes,
            });
            message.success('Marked as paid.');
            setDrawer({ open: false, affiliateId: null, items: [], totals: null });
            load();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed to mark paid.');
        }
    };

    const openHistory = async (row) => {
        try {
            const rows = await ApiService.getPayoutHistory(row.affiliateId);
            setHistory({ open: true, affiliateName: row.affiliate?.affiliateName, rows: rows || [] });
        } catch (e) {
            message.error('Failed to load history.');
        }
    };

    const summaryColumns = [
        { title: 'Affiliate', dataIndex: ['affiliate', 'affiliateName'], key: 'name' },
        { title: 'Sales', dataIndex: 'saleCount', key: 'sales' },
        { title: 'Lifetime Earned', dataIndex: 'lifetimeEarned', key: 'le', render: (v) => fmt(v) },
        { title: 'Paid', dataIndex: 'paid', key: 'paid', render: (v) => fmt(v) },
        { title: 'Pending', dataIndex: 'pending', key: 'pending', render: (v) => <strong>{fmt(v)}</strong> },
        {
            title: 'Actions', key: 'actions',
            render: (_, row) => (
                <Space>
                    <Button onClick={() => openDrilldown(row)}>Drill-down</Button>
                    <Button onClick={() => openHistory(row)}>History</Button>
                </Space>
            ),
        },
    ];

    const historyColumns = [
        { title: 'Paid On', dataIndex: 'paidAt', key: 'paidAt', render: (d) => new Date(d).toLocaleString() },
        { title: 'Amount', dataIndex: 'amount', key: 'amt', render: (v, r) => fmt(v, r.currency) },
        { title: 'Method', dataIndex: 'method', key: 'method', render: (m) => <Tag>{m || 'manual'}</Tag> },
        { title: 'Reference', dataIndex: 'reference', key: 'ref' },
        { title: 'Settled Sales', key: 'count', render: (_, r) => (r.purchaseIds || []).length },
        { title: 'Notes', dataIndex: 'notes', key: 'notes' },
        {
            title: 'Recorded By', key: 'by',
            render: (_, r) => r.paidBy ? `${r.paidBy.firstName || ''} ${r.paidBy.lastName || ''}`.trim() || r.paidBy.email : '—',
        },
    ];

    const drilldownColumns = [
        { title: 'Date', dataIndex: 'createdAt', key: 'd', render: (d) => new Date(d).toLocaleDateString() },
        { title: 'Guide', dataIndex: 'bookName', key: 'b' },
        { title: 'Link', dataIndex: 'linkName', key: 'l' },
        { title: 'Gross', dataIndex: 'amountTotal', key: 'g', render: (v) => fmt(v) },
        { title: 'Your Level', dataIndex: 'yourLevel', key: 'lv', render: (v) => v === 0 ? <Tag color="green">Seller</Tag> : <Tag>Lv {v}</Tag> },
        { title: 'Your %', dataIndex: 'yourPct', key: 'p', render: (v) => v != null ? `${v}%` : '—' },
        { title: 'Your Cut', dataIndex: 'yourAmount', key: 'a', render: (v) => <strong>{fmt(v)}</strong> },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="Affiliate Payouts">
                <Paragraph type="secondary">
                    Summary across all affiliates. Click drill-down to view unpaid sales and mark them paid.
                </Paragraph>
                <Table
                    rowKey="affiliateId"
                    dataSource={summary}
                    columns={summaryColumns}
                    loading={loading}
                    pagination={{ pageSize: 25 }}
                />
            </Card>

            <Drawer
                width={900}
                title={`Unpaid sales — Pending: ${fmt(drawer.totals?.pending || 0)}`}
                open={drawer.open}
                onClose={() => setDrawer({ open: false, affiliateId: null, items: [], totals: null })}
                extra={
                    <Space>
                        <Input placeholder="Reference / payment ID" value={reference} onChange={(e) => setReference(e.target.value)} style={{ width: 200 }} />
                        <Button type="primary" disabled={!selected.length} onClick={markPaid}>
                            Mark {selected.length || 0} as paid
                        </Button>
                    </Space>
                }
            >
                <Input.TextArea rows={2} placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ marginBottom: 16 }} />
                <Table
                    rowKey="purchaseId"
                    rowSelection={{
                        selectedRowKeys: selected,
                        onChange: setSelected,
                    }}
                    dataSource={drawer.items}
                    columns={drilldownColumns}
                    pagination={{ pageSize: 50 }}
                />
            </Drawer>

            <Drawer
                width={900}
                title={`Payout history — ${history.affiliateName || ''}`}
                open={history.open}
                onClose={() => setHistory({ open: false, affiliateName: null, rows: [] })}
            >
                <Paragraph type="secondary">
                    Manual payouts you've recorded for this affiliate. Each row is one offline transfer marking a batch of sales as settled.
                </Paragraph>
                <Table
                    rowKey="_id"
                    dataSource={history.rows}
                    columns={historyColumns}
                    pagination={{ pageSize: 25 }}
                    locale={{ emptyText: 'No payouts recorded yet.' }}
                />
            </Drawer>
        </div>
    );
};

export default AdminPayouts;
