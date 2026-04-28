import React, { useEffect, useState } from 'react';
import {
    Card, Button, Table, Tag, Modal, Form, Input, Select, DatePicker,
    Space, message, Tooltip, Typography
} from 'antd';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ApiService from '../../APIServices/ApiService';

const { Paragraph, Text } = Typography;

const AffiliateApiAccessList = () => {
    const [requests, setRequests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();

    const load = async () => {
        try {
            setLoading(true);
            const [r, c] = await Promise.all([
                ApiService.getMyApiAccessRequests(),
                ApiService.getAllCategories(),
            ]);
            setRequests(r || []);
            setCategories(c || []);
        } catch (e) {
            message.error('Failed to load.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const submit = async (values) => {
        try {
            setSubmitting(true);
            await ApiService.createApiAccessRequest({
                name: values.name,
                companyName: values.companyName,
                email: values.email,
                type: values.type,
                paymentType: values.paymentType,
                categories: values.categories,
                endDate: values.endDate.format('YYYY-MM-DD'),
            });
            message.success('Request submitted. Awaiting admin approval.');
            setOpen(false);
            form.resetFields();
            load();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const copy = (token) => {
        navigator.clipboard?.writeText(token);
        message.success('Token copied.');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'n' },
        { title: 'Company', dataIndex: 'companyName', key: 'co' },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (v) => <Tag>{v}</Tag> },
        {
            title: 'Payment', dataIndex: 'paymentType', key: 'pt',
            render: (v) => <Tag color={v === 'free' ? 'green' : 'gold'}>{v}</Tag>,
        },
        {
            title: 'Status', dataIndex: 'status', key: 's',
            render: (s) => <Tag color={s === 'pending' ? 'orange' : s === 'approved' ? 'green' : 'red'}>{s}</Tag>,
        },
        {
            title: 'Categories', dataIndex: 'categories', key: 'c',
            render: (cats) => (cats || []).map((c) => <Tag key={c._id}>{c.name}</Tag>),
        },
        {
            title: 'End Date', dataIndex: 'endDate', key: 'end',
            render: (d) => d ? dayjs(d).format('YYYY-MM-DD') : '—',
        },
        {
            title: 'Token / Reason', key: 'tok',
            render: (_, r) => {
                if (r.status === 'approved' && r.apiAccessId?.token) {
                    return (
                        <Space>
                            <code style={{ fontSize: 11 }}>{r.apiAccessId.token.slice(0, 12)}…</code>
                            <Tooltip title="Copy">
                                <Button size="small" icon={<CopyOutlined />} onClick={() => copy(r.apiAccessId.token)} />
                            </Tooltip>
                        </Space>
                    );
                }
                if (r.status === 'rejected' && r.rejectionReason) {
                    return <Text type="danger">{r.rejectionReason}</Text>;
                }
                return <Text type="secondary">—</Text>;
            },
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="API Access"
                extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Request Access</Button>}
            >
                <Paragraph type="secondary">
                    Request API access; once an admin approves, your token appears here. Quotas have been removed — usage is just tracked, not capped.
                </Paragraph>
                <Table rowKey="_id" dataSource={requests} columns={columns} loading={loading} />
            </Card>

            <Modal
                title="Request API Access"
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={submitting}
                okText="Submit"
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={submit}
                    initialValues={{ type: 'pdf', paymentType: 'free' }}
                >
                    <Form.Item name="name" label="Token Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Acme Travel API" />
                    </Form.Item>
                    <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="pdf">PDF</Select.Option>
                            <Select.Option value="html_json">HTML / JSON</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="paymentType" label="Payment" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="free">Free</Select.Option>
                            <Select.Option value="paid">Paid</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="categories" label="Categories" rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            placeholder="Pick categories"
                            options={categories.map((c) => ({ label: c.name, value: c._id }))}
                        />
                    </Form.Item>
                    <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AffiliateApiAccessList;
