import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Input, message, Typography } from 'antd';
import ApiService from '../../APIServices/ApiService';

const { Paragraph } = Typography;

const LinkApprovalQueue = () => {
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getPendingAffiliateLinks();
            setLinks(data || []);
        } catch (e) {
            message.error('Failed to load pending links.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const approve = async (id) => {
        try {
            await ApiService.approveAffiliateLink(id);
            message.success('Approved.');
            load();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Approve failed.');
        }
    };

    const submitReject = async () => {
        try {
            await ApiService.rejectAffiliateLink(rejectId, rejectReason);
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
        { title: 'Affiliate', dataIndex: ['affiliateId', 'affiliateName'], key: 'affiliate' },
        { title: 'Link Name', dataIndex: 'name', key: 'name' },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => <Tag color={t === 'paid' ? 'gold' : 'blue'}>{t}</Tag> },
        { title: 'No Of Clicks', dataIndex: 'clicksBudget', key: 'clicks' },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'cats',
            render: (cats) => (cats || []).map((c) => <Tag key={c._id}>{c.name}</Tag>),
        },
        {
            title: 'Requested',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d) => new Date(d).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, row) => (
                <Space>
                    <Button type="primary" onClick={() => approve(row._id)}>Approve</Button>
                    <Button danger onClick={() => { setRejectId(row._id); setRejectOpen(true); }}>Reject</Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <Paragraph style={{ marginBottom: 16 }}>
                    Approve or reject affiliate link requests. Approving generates a public slug and activates the link.
                </Paragraph>
                <Table
                    rowKey="_id"
                    dataSource={links}
                    columns={columns}
                    loading={loading}
                    pagination={{ pageSize: 20 }}
                />
            </Card>

            <Modal
                title="Reject link"
                open={rejectOpen}
                onCancel={() => setRejectOpen(false)}
                onOk={submitReject}
                okText="Reject"
                okButtonProps={{ danger: true }}
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Reason (shown to the affiliate)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default LinkApprovalQueue;
