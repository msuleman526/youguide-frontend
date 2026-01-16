import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Typography, Radio, Divider, Tag, Space, Button } from 'antd';
import dayjs from 'dayjs';
import ApiService from '../../APIServices/ApiService';

const { Option } = Select;
const { Text } = Typography;

const AddTokenModal = ({
    visible,
    onCancel,
    onSuccess,
    categories,
    affiliates
}) => {
    const [form] = Form.useForm();
    const [assignmentType, setAssignmentType] = useState('user');
    const [quotaDetails, setQuotaDetails] = useState(null);
    const [quotaLoading, setQuotaLoading] = useState(false);
    const [tokenSummary, setTokenSummary] = useState(null);
    const [selectedAffiliateDetails, setSelectedAffiliateDetails] = useState(null);
    const [affiliateLoading, setAffiliateLoading] = useState(false);
    const [createQuotaValue, setCreateQuotaValue] = useState(null);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setAssignmentType('user');
            setQuotaDetails(null);
            setTokenSummary(null);
            setSelectedAffiliateDetails(null);
            setCreateQuotaValue(null);
        }
    }, [visible, form]);

    const fetchAllAffiliateData = async (userId) => {
        setAffiliateLoading(true);
        setQuotaLoading(true);
        try {
            const [quotaRes, affiliateRes, tokenRes] = await Promise.all([
                ApiService.getAffiliateQuotaDetails(userId),
                ApiService.getAffiliateByUserId(userId),
                ApiService.getAffiliateTokenSummary(userId)
            ]);
            setQuotaDetails(quotaRes);
            setSelectedAffiliateDetails(affiliateRes);
            setTokenSummary(tokenRes);
            return { quotaRes, affiliateRes, tokenRes };
        } catch (error) {
            console.error('Failed to fetch affiliate data');
            setQuotaDetails(null);
            setSelectedAffiliateDetails(null);
            setTokenSummary(null);
            return null;
        } finally {
            setAffiliateLoading(false);
            setQuotaLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                company_name: values.company_name,
                type: values.type,
                payment_type: values.payment_type,
                allowed_travel_guides: values.allowed_travel_guides,
                end_date: values.end_date.format('YYYY-MM-DD'),
                categories: values.categories,
                is_active: true,
            };

            if (values.user_id) {
                payload.user_id = values.user_id;
            }

            if (values.email) {
                payload.email = values.email;
            }

            await ApiService.createApiAccessToken(payload);
            onSuccess();
            form.resetFields();
        } catch (error) {
            throw error;
        }
    };

    const handleAssignmentTypeChange = (e) => {
        setAssignmentType(e.target.value);
        if (e.target.value === 'user') {
            form.setFieldsValue({ email: undefined });
        } else {
            form.setFieldsValue({ user_id: undefined, allowed_travel_guides: null });
            setSelectedAffiliateDetails(null);
            setQuotaDetails(null);
            setTokenSummary(null);
            setCreateQuotaValue(null);
        }
    };

    const handleUserChange = (value) => {
        setCreateQuotaValue(null);
        form.setFieldsValue({ allowed_travel_guides: null });
        if (value) {
            fetchAllAffiliateData(value).then(() => {
                form.validateFields(['user_id', 'end_date', 'allowed_travel_guides']);
            });
        } else {
            setSelectedAffiliateDetails(null);
            setQuotaDetails(null);
            setTokenSummary(null);
        }
    };

    return (
        <Modal
            title="Create New API Access Token"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter name' }]}
                        >
                            <Input placeholder="Client contact name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Company Name"
                            name="company_name"
                            rules={[{ required: true, message: 'Please enter company name' }]}
                        >
                            <Input placeholder="Company name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please select type' }]}
                        >
                            <Select placeholder="Select type">
                                <Option value="pdf">PDF</Option>
                                <Option value="html_json">HTML/JSON</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Payment Type"
                            name="payment_type"
                            rules={[{ required: true, message: 'Please select payment type' }]}
                        >
                            <Select placeholder="Select payment type">
                                <Option value="free">Free</Option>
                                <Option value="paid">Paid</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Categories"
                            name="categories"
                            rules={[{ required: true, message: 'Please select categories' }]}
                        >
                            <Select mode="multiple" placeholder="Select categories">
                                {categories.map(cat => (
                                    <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">Assign To</Divider>

                <Form.Item label="Assignment Type" style={{ marginBottom: 16 }}>
                    <Radio.Group value={assignmentType} onChange={handleAssignmentTypeChange}>
                        <Radio.Button value="user">Affiliate User</Radio.Button>
                        <Radio.Button value="email">Email</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {assignmentType === 'user' ? (
                    <>
                        <Form.Item
                            label="Select Affiliate User"
                            name="user_id"
                            rules={[
                                { required: true, message: 'Please select an affiliate user' },
                                () => ({
                                    validator(_, value) {
                                        if (!value || !tokenSummary) {
                                            return Promise.resolve();
                                        }
                                        if (tokenSummary.remaining_tokens <= 0) {
                                            return Promise.reject(new Error(`Token limit reached (${tokenSummary.total_allowed_tokens}/${tokenSummary.total_allowed_tokens})`));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Select
                                placeholder="Select an affiliate user"
                                allowClear
                                showSearch
                                loading={affiliateLoading}
                                filterOption={(input, option) =>
                                    (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                                }
                                onChange={handleUserChange}
                            >
                                {affiliates.map(affiliate => (
                                    <Option key={affiliate._id} value={affiliate._id}>
                                        {affiliate.firstName} {affiliate.lastName} ({affiliate.email})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {tokenSummary && (
                            <div style={{ marginTop: -16, marginBottom: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
                                <Text type="secondary">
                                    Allowed Tokens: <Tag color="blue">{tokenSummary.total_allowed_tokens}</Tag>
                                    Remaining Tokens: <Tag color={tokenSummary.remaining_tokens > 0 ? 'green' : 'red'}>{tokenSummary.remaining_tokens}</Tag>
                                </Text>
                            </div>
                        )}
                    </>
                ) : (
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email address' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>
                )}

                <Divider orientation="left">Quota Settings</Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Allowed Travel Guides"
                            name="allowed_travel_guides"
                            rules={[
                                { required: true, message: 'Please enter quota' },
                                () => ({
                                    validator(_, value) {
                                        if (!value || !quotaDetails?.remaining_quota || assignmentType !== 'user') {
                                            return Promise.resolve();
                                        }
                                        if (value > quotaDetails.remaining_quota) {
                                            return Promise.reject(new Error(`Cannot exceed affiliate's remaining quota (${quotaDetails.remaining_quota})`));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                min={1}
                                max={assignmentType === 'user' && quotaDetails?.remaining_quota ? quotaDetails.remaining_quota : undefined}
                                style={{ width: '100%' }}
                                placeholder="Enter quota"
                                onChange={(value) => setCreateQuotaValue(value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="End Date"
                            name="end_date"
                            rules={[
                                { required: true, message: 'Please select end date' },
                                () => ({
                                    validator(_, value) {
                                        if (!value || !selectedAffiliateDetails?.quota_end_date || assignmentType !== 'user') {
                                            return Promise.resolve();
                                        }
                                        const affiliateEndDate = dayjs(selectedAffiliateDetails.quota_end_date);
                                        if (value.isAfter(affiliateEndDate)) {
                                            return Promise.reject(new Error(`Must be on or before ${affiliateEndDate.format('MMM DD, YYYY')}`));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={(current) => {
                                    if (assignmentType !== 'user' || !selectedAffiliateDetails?.quota_end_date) return false;
                                    return current && current.isAfter(dayjs(selectedAffiliateDetails.quota_end_date), 'day');
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {assignmentType === 'user' && quotaDetails && (
                    <div style={{ marginTop: 0, marginBottom: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Text type="secondary">
                                    Affiliate Quota: <Tag color="blue">{quotaDetails.initial_api_quota || quotaDetails.total_quota || 0}</Tag>
                                    Remaining: <Tag color={quotaDetails.remaining_quota > 0 ? 'green' : 'red'}>{quotaDetails.remaining_quota || 0}</Tag>
                                </Text>
                                {createQuotaValue && quotaDetails.remaining_quota !== undefined && (
                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary">
                                            After allocation: <Tag color={(quotaDetails.remaining_quota - createQuotaValue) >= 0 ? 'orange' : 'red'}>
                                                {quotaDetails.remaining_quota - createQuotaValue}
                                            </Tag>
                                        </Text>
                                    </div>
                                )}
                            </Col>
                            <Col span={12}>
                                {selectedAffiliateDetails?.quota_end_date && (
                                    <Text type="secondary">
                                        Affiliate End Date: <Tag color="blue">{dayjs(selectedAffiliateDetails.quota_end_date).format('MMM DD, YYYY')}</Tag>
                                    </Text>
                                )}
                            </Col>
                        </Row>
                    </div>
                )}

                {quotaLoading && (
                    <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                        Loading affiliate quota details...
                    </Text>
                )}

                <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Create Token
                        </Button>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTokenModal;
