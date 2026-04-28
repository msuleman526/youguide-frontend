import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Input, message, Typography, Select } from 'antd';
import ApiService from '../../APIServices/ApiService';

const ApiAccessRequestQueue = () => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllApiAccessRequests({ status: statusFilter, limit: 100 });
            setRows(data?.requests || []);
        } catch (e) {
            message.error('Failed to load requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [statusFilter]);

    const approve = async (id) => {
        try {
            await ApiService.approveApiAccessRequest(id);
            message.success('Approved. API token issued.');
            load();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Approve failed.');
        }
    };

    const submitReject = async () => {
        try {
            await ApiService.rejectApiAccessRequest(rejectId, rejectReason);
            message.success('Rejected.');
            setRejectOpen(false);
            setRejectId(null);
            setRejectReason('');
            load();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Reject failed.');
        }
    };

    const columns = [
        { title: 'Affiliate', dataIndex: ['affiliateId', 'affiliateName'], key: 'aff' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Company', dataIndex: 'companyName', key: 'co' },
        { title: 'Email', dataIndex: 'email', key: 'em' },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (v) => <Tag>{v}</Tag> },
        { title: 'Payment', dataIndex: 'paymentType', key: 'pt', render: (v) => <Tag color={v === 'free' ? 'green' : 'gold'}>{v}</Tag> },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (s) => <Tag color={s === 'pending' ? 'orange' : s === 'approved' ? 'green' : 'red'}>{s}</Tag>,
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'cats',
            render: (cats) => (cats || []).map((c) => <Tag key={c._id}>{c.name}</Tag>),
        },
        {
            title: 'End Date', dataIndex: 'endDate', key: 'end',
            render: (d) => d ? new Date(d).toLocaleDateString() : '—',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, row) => row.status === 'pending' ? (
                <Space>
                    <Button type="primary" onClick={() => approve(row._id)}>Approve</Button>
                    <Button danger onClick={() => { setRejectId(row._id); setRejectOpen(true); }}>Reject</Button>
                </Space>
            ) : null,
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card title="API Access Requests" extra={
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="approved">Approved</Select.Option>
                    <Select.Option value="rejected">Rejected</Select.Option>
                </Select>
            }>
                <Table
                    rowKey="_id"
                    dataSource={rows}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 20 }}
                />
            </Card>

            <Modal
                title="Reject request"
                open={rejectOpen}
                onCancel={() => setRejectOpen(false)}
                onOk={submitReject}
                okText="Reject"
                okButtonProps={{ danger: true }}
            >
                <Input.TextArea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason" />
            </Modal>
        </div>
    );
};

export default ApiAccessRequestQueue;
