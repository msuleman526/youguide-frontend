import React, { useEffect, useState } from 'react';
import {
    Card, Table, Button, Modal, Form, Input, DatePicker, InputNumber, Switch, Select,
    message, Space, Tag, Upload, Row, Col, Divider, Typography
} from 'antd';
import { PlusOutlined, UploadOutlined, UserAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ApiService from '../../APIServices/ApiService';

const { Paragraph } = Typography;

const SubAffiliates = () => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [createUserOpen, setCreateUserOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [form] = Form.useForm();
    const [createUserForm] = Form.useForm();
    const [isLogin, setIsLogin] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const res = await ApiService.getMyDirectChildren();
            setList(res || []);
        } catch (e) {
            message.error('Failed to load sub-affiliates.');
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await ApiService.listAffiliateUsersForPicker(true);
            setUsers(res || []);
        } catch (e) { /* ignore */ }
    };

    useEffect(() => { load(); loadUsers(); }, []);

    const handleCreate = async (values) => {
        try {
            setSubmitting(true);
            const fd = new FormData();
            fd.append('affiliateName', values.affiliateName);
            if (values.website) fd.append('website', values.website);
            if (values.image?.file) fd.append('logo', values.image.file);
            fd.append('primaryColor', values.primaryColor || '#3498db');
            fd.append('subscriptionEndDate', values.subscriptionEndDate.format('YYYY-MM-DD'));
            fd.append('isLogin', String(!!isLogin));
            if (isLogin && values.userId) fd.append('userId', values.userId);
            fd.append('affiliateCommissionPct', String(values.affiliateCommissionPct ?? 30));
            fd.append('subAffiliateCommissionPct', String(values.subAffiliateCommissionPct ?? 10));

            await ApiService.createSubAffiliate(fd);
            message.success('Sub-affiliate created.');
            setOpen(false);
            form.resetFields();
            setIsLogin(false);
            load();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed to create.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateUser = async (values) => {
        try {
            const u = await ApiService.createAffiliateUserInline(values);
            message.success(`User ${u.email} created.`);
            await loadUsers();
            form.setFieldValue('userId', u.id);
            createUserForm.resetFields();
            setCreateUserOpen(false);
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed to create user.');
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'affiliateName', key: 'name' },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>,
        },
        {
            title: 'End Date', dataIndex: 'subscriptionEndDate', key: 'end',
            render: (d) => d ? dayjs(d).format('YYYY-MM-DD') : '—',
        },
        { title: 'Affiliate %', dataIndex: 'affiliateCommissionPct', key: 'pct', render: (v) => `${v}%` },
        { title: 'Sub %', dataIndex: 'subAffiliateCommissionPct', key: 'sub', render: (v) => `${v}%` },
        {
            title: 'Created', dataIndex: 'createdAt', key: 'cd',
            render: (d) => dayjs(d).format('YYYY-MM-DD'),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="My Sub-Affiliates"
                extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Add Sub-Affiliate</Button>}
            >
                <Paragraph type="secondary">
                    Sub-affiliates work under you. When they make sales, you earn a cascade commission. Their link requests still go to YouGuide admin for approval.
                </Paragraph>
                <Table rowKey="_id" dataSource={list} columns={columns} loading={loading} />
            </Card>

            <Modal
                title="Add Sub-Affiliate"
                open={open}
                width={760}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={submitting}
                okText="Create"
            >
                <Form layout="vertical" form={form} onFinish={handleCreate} initialValues={{ affiliateCommissionPct: 30, subAffiliateCommissionPct: 10, primaryColor: '#3498db' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="affiliateName" label="Affiliate Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="website" label="Website">
                                <Input placeholder="https://..." />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="image" label="Logo" valuePropName="file" getValueFromEvent={(e) => e}>
                                <Upload maxCount={1} beforeUpload={() => false}>
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="primaryColor" label="Primary Color">
                                <Input type="color" style={{ width: '100%', height: 32 }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="subscriptionEndDate" label="Admin Panel End Date" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Commission</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="affiliateCommissionPct" label="Affiliate % (when they sell)" rules={[{ required: true }]}>
                                <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="subAffiliateCommissionPct" label="Sub-affiliate % (cascade up)" rules={[{ required: true }]}>
                                <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Login</Divider>
                    <Form.Item label="Login Enabled">
                        <Switch checked={isLogin} onChange={setIsLogin} />
                    </Form.Item>
                    {isLogin && (
                        <Row gutter={16}>
                            <Col span={20}>
                                <Form.Item name="userId" label="Login User" rules={[{ required: true }]}>
                                    <Select
                                        showSearch
                                        placeholder="Pick a user"
                                        filterOption={(input, opt) => (opt?.label || '').toLowerCase().includes(input.toLowerCase())}
                                        options={users.map((u) => ({ label: `${u.firstName} ${u.lastName} — ${u.email}`, value: u._id }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Button icon={<UserAddOutlined />} block onClick={() => setCreateUserOpen(true)}>New</Button>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Modal>

            <Modal
                title="Create new affiliate user"
                open={createUserOpen}
                onCancel={() => setCreateUserOpen(false)}
                onOk={() => createUserForm.submit()}
                okText="Create user"
            >
                <Form layout="vertical" form={createUserForm} onFinish={handleCreateUser}>
                    <Row gutter={16}>
                        <Col span={12}><Form.Item name="firstName" label="First name" rules={[{ required: true }]}><Input /></Form.Item></Col>
                        <Col span={12}><Form.Item name="lastName" label="Last name" rules={[{ required: true }]}><Input /></Form.Item></Col>
                    </Row>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]} extra="Min 8 chars, with upper/lower/number/special.">
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SubAffiliates;
