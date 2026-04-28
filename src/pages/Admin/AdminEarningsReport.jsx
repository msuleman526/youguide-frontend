import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Space, Button, Tag, message } from 'antd';
import ApiService from '../../APIServices/ApiService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const fmt = (cents) => `$${((cents || 0) / 100).toFixed(2)}`;
const monthLabel = (y, m) => dayjs(`${y}-${String(m).padStart(2, '0')}-01`).format('MMM YYYY');

const AdminEarningsReport = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [range, setRange] = useState([dayjs().subtract(11, 'month').startOf('month'), dayjs().endOf('month')]);

    const load = async () => {
        try {
            setLoading(true);
            const params = {};
            if (range?.[0]) params.from = range[0].format('YYYY-MM-DD');
            if (range?.[1]) params.to = range[1].format('YYYY-MM-DD');
            const data = await ApiService.getAdminEarningsReport(params);
            setReport(data);
        } catch (e) {
            message.error('Failed to load report.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const columns = [
        { title: 'Affiliate', dataIndex: ['affiliate', 'affiliateName'], key: 'aff' },
        { title: 'Sales', dataIndex: 'sales', key: 's' },
        { title: 'Direct', dataIndex: 'earnedDirect', key: 'd', render: fmt },
        { title: 'Cascade', dataIndex: 'earnedCascade', key: 'c', render: fmt },
        { title: 'Total Earned', dataIndex: 'earnedTotal', key: 't', render: (v) => <strong>{fmt(v)}</strong> },
        { title: 'Paid', dataIndex: 'paid', key: 'p', render: fmt },
        { title: 'Pending', dataIndex: 'pending', key: 'pe', render: (v) => <Tag color="orange">{fmt(v)}</Tag> },
    ];

    const monthlyColumns = [
        { title: 'Month', key: 'm', render: (_, r) => monthLabel(r.year, r.month) },
        { title: 'Purchases', dataIndex: 'purchases', key: 'pu' },
        { title: 'Gross Sales', dataIndex: 'grossSales', key: 'gs', render: fmt },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Earnings Report"
                extra={
                    <Space>
                        <RangePicker
                            value={range}
                            onChange={setRange}
                            allowClear={false}
                            picker="date"
                        />
                        <Button type="primary" onClick={load} loading={loading}>Apply</Button>
                    </Space>
                }
            >
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={8}><Card><Statistic title="Gross Sales (window)" value={fmt(report?.totals?.grossSales || 0)} /></Card></Col>
                    <Col span={8}><Card><Statistic title="Purchases" value={report?.totals?.purchases || 0} /></Card></Col>
                    <Col span={8}><Card><Statistic title="Affiliates with earnings" value={(report?.perAffiliate || []).length} /></Card></Col>
                </Row>

                <h3>Per Affiliate</h3>
                <Table
                    rowKey="affiliateId"
                    dataSource={report?.perAffiliate || []}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 25 }}
                    style={{ marginBottom: 24 }}
                />

                <h3>Monthly Trend</h3>
                <Table
                    rowKey={(r) => `${r.year}-${r.month}`}
                    dataSource={report?.monthly || []}
                    columns={monthlyColumns}
                    pagination={false}
                    size="small"
                />
            </Card>
        </div>
    );
};

export default AdminEarningsReport;
