import { Button, Form, Input, Modal, DatePicker, InputNumber, Select, Upload, Row, Col, message, Divider, Typography } from 'antd';
import { UploadOutlined, UserAddOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import dayjs from 'dayjs';

const AffiliatePopup = ({ open, setOpen, onSaveAffiliate, affiliate, type }) => {
    const [form] = Form.useForm();
    const [createUserForm] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createUserOpen, setCreateUserOpen] = useState(false);

    const loadUsers = async () => {
        try {
            const list = await ApiService.listAffiliateUsersForPicker(false);
            setUsers(list || []);
        } catch (_) { /* ignore */ }
    };

    useEffect(() => {
        if (open) {
            loadUsers();
        }
    }, [open]);

    useEffect(() => {
        if (affiliate) {
            const userId = affiliate.userId?._id || affiliate.userId;
            setTimeout(() => {
                form.setFieldsValue({
                    affiliateName: affiliate.affiliateName,
                    website: affiliate.website,
                    primaryColor: affiliate.primaryColor || '#3498db',
                    subscriptionEndDate: affiliate.subscriptionEndDate ? dayjs(affiliate.subscriptionEndDate) : null,
                    userId,
                    affiliateCommissionPct: affiliate.affiliateCommissionPct ?? 30,
                    subAffiliateCommissionPct: affiliate.subAffiliateCommissionPct ?? 10,
                });
            }, 0);
        } else {
            form.resetFields();
            form.setFieldsValue({
                primaryColor: '#3498db',
                affiliateCommissionPct: 30,
                subAffiliateCommissionPct: 10,
            });
        }
    }, [affiliate, form, open]);

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            const fd = new FormData();
            fd.append('affiliateName', values.affiliateName);
            if (values.website) fd.append('website', values.website);
            fd.append('primaryColor', values.primaryColor || '#3498db');
            fd.append('subscriptionEndDate', values.subscriptionEndDate.format('YYYY-MM-DD'));
            fd.append('isLogin', 'true');
            fd.append('userId', values.userId);
            fd.append('affiliateCommissionPct', String(values.affiliateCommissionPct ?? 30));
            fd.append('subAffiliateCommissionPct', String(values.subAffiliateCommissionPct ?? 10));
            if (values.image?.file) fd.append('logo', values.image.file);

            if (type === 'Edit' && affiliate?._id) {
                await ApiService.updateAffiliateSubscription(affiliate._id, fd);
                message.success('Affiliate updated.');
            } else {
                await ApiService.saveAffiliateSubscription(fd);
                message.success('Affiliate created.');
            }
            onSaveAffiliate();
            setOpen(false);
            form.resetFields();
        } catch (e) {
            message.error(e?.response?.data?.message || 'Save failed.');
        } finally {
            setLoading(false);
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

    return (
        <>
            <Modal
                title={`${type} Affiliate`}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={loading}
                okText={type === 'Edit' ? 'Update' : 'Create'}
                width={780}
            >
                <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    Brand and login. Click budgets and categories now live on individual affiliate links the affiliate will request.
                </Typography.Text>
                <Form layout="vertical" form={form} onFinish={handleFinish}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="affiliateName" label="Affiliate Name" rules={[{ required: true }]}>
                                <Input placeholder="Acme Travel" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="website" label="Website">
                                <Input placeholder="https://acme.travel" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="image" label="Logo"
                                rules={[{ required: type !== 'Edit', message: 'Logo is required' }]}
                                valuePropName="file" getValueFromEvent={(e) => e}
                            >
                                <Upload
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    className="upload-full-width"
                                    style={{ display: 'block', width: '100%' }}
                                >
                                    <Button block icon={<UploadOutlined />} style={{ width: '100%' }}>
                                        {type === 'Edit' ? 'Change' : 'Upload'}
                                    </Button>
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

                    <style>{`
                        .upload-full-width .ant-upload,
                        .upload-full-width .ant-upload-select {
                            display: block !important;
                            width: 100% !important;
                        }
                    `}</style>

                    <Divider>Commission</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="affiliateCommissionPct" label="Affiliate %" rules={[{ required: true }]}>
                                <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="subAffiliateCommissionPct" label="Sub-affiliate %" rules={[{ required: true }]}>
                                <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Login</Divider>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item name="userId" label="Login User" rules={[{ required: true, message: 'Please pick a user' }]}>
                                <Select
                                    showSearch
                                    placeholder="Pick user"
                                    filterOption={(input, opt) => (opt?.label || '').toLowerCase().includes(input.toLowerCase())}
                                    options={users.map((u) => ({ label: `${u.firstName} ${u.lastName} — ${u.email}`, value: u._id }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Form.Item label=" ">
                                <Button icon={<UserAddOutlined />} onClick={() => setCreateUserOpen(true)} block>New</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="Create new affiliate user"
                open={createUserOpen}
                onCancel={() => setCreateUserOpen(false)}
                onOk={() => createUserForm.submit()}
                okText="Create"
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
        </>
    );
};

export default AffiliatePopup;
