import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Typography, Tag, Space, Button } from 'antd';
import dayjs from 'dayjs';
import ApiService from '../../APIServices/ApiService';

const { Option } = Select;
const { Text } = Typography;

const EditTokenModal = ({
    visible,
    onCancel,
    onSuccess,
    token,
    categories
}) => {
    const [form] = Form.useForm();
    const [quotaDetails, setQuotaDetails] = useState(null);
    const [quotaLoading, setQuotaLoading] = useState(false);
    const [selectedAffiliateDetails, setSelectedAffiliateDetails] = useState(null);
    const [editAllowedValue, setEditAllowedValue] = useState(null);

    useEffect(() => {
        if (visible && token) {
            setQuotaDetails(null);
            setSelectedAffiliateDetails(null);
            setEditAllowedValue(token.allowed_travel_guides);

            form.setFieldsValue({
                ...token,
                end_date: dayjs(token.end_date),
                categories: token.categories?.map(cat => cat._id || cat),
            });

            // Fetch affiliate data if there's an associated user
            if (token.user_id?._id || token.user_id) {
                const userId = token.user_id?._id || token.user_id;
                fetchAllAffiliateData(userId);
            }
        }
    }, [visible, token, form]);

    const fetchAllAffiliateData = async (userId) => {
        setQuotaLoading(true);
        try {
            const [quotaRes, affiliateRes] = await Promise.all([
                ApiService.getAffiliateQuotaDetails(userId),
                ApiService.getAffiliateByUserId(userId)
            ]);
            setQuotaDetails(quotaRes);
            setSelectedAffiliateDetails(affiliateRes);
        } catch (error) {
            console.error('Failed to fetch affiliate data');
            setQuotaDetails(null);
            setSelectedAffiliateDetails(null);
        } finally {
            setQuotaLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                company_name: values.company_name,
                end_date: values.end_date.format('YYYY-MM-DD'),
                allowed_travel_guides: values.allowed_travel_guides,
                categories: values.categories,
            };
            await ApiService.updateApiAccessToken(token._id, payload);
            onSuccess();
            form.resetFields();
        } catch (error) {
            throw error;
        }
    };

    const maxAvailable = quotaDetails
        ? (quotaDetails.remaining_quota || 0) + (token?.allowed_travel_guides || 0)
        : undefined;

    return (
        <Modal
            title="Edit API Access Token"
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
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Company Name"
                            name="company_name"
                            rules={[{ required: true, message: 'Please enter company name' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Allowed Travel Guides"
                            name="allowed_travel_guides"
                            rules={[
                                { required: true, message: 'Please enter quota' },
                                () => ({
                                    validator(_, value) {
                                        if (!value || !quotaDetails) {
                                            return Promise.resolve();
                                        }
                                        if (value > maxAvailable) {
                                            return Promise.reject(new Error(`Cannot exceed available quota (${maxAvailable})`));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={maxAvailable}
                                style={{ width: '100%' }}
                                onChange={(value) => setEditAllowedValue(value)}
                            />
                        </Form.Item>
                        {quotaDetails && (
                            <div style={{ marginTop: 10, marginBottom: 8 }}>
                                <Text type="secondary">
                                    Affiliate Quota: <Tag color="blue">{quotaDetails.initial_api_quota || quotaDetails.total_quota || 0}</Tag>
                                    <br />
                                    Current Remaining: <Tag color={quotaDetails.remaining_quota > 0 ? 'green' : 'red'}>{quotaDetails.remaining_quota || 0}</Tag>
                                </Text>
                                {editAllowedValue !== null && editAllowedValue !== undefined && (
                                    <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                                        After change, affiliate remaining: <Tag color={
                                            ((quotaDetails.remaining_quota || 0) + (token?.allowed_travel_guides || 0) - editAllowedValue) >= 0 ? 'orange' : 'red'
                                        }>
                                            {(quotaDetails.remaining_quota || 0) + (token?.allowed_travel_guides || 0) - editAllowedValue}
                                        </Tag>
                                    </Text>
                                )}
                            </div>
                        )}
                        {quotaLoading && (
                            <Text type="secondary" style={{ display: 'block', marginTop: -16, marginBottom: 8 }}>
                                Loading quota details...
                            </Text>
                        )}
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="End Date"
                            name="end_date"
                            rules={[
                                { required: true, message: 'Please select end date' },
                                () => ({
                                    validator(_, value) {
                                        if (!value || !selectedAffiliateDetails?.quota_end_date) {
                                            return Promise.resolve();
                                        }
                                        const affiliateEndDate = dayjs(selectedAffiliateDetails.quota_end_date);
                                        if (value.isAfter(affiliateEndDate)) {
                                            return Promise.reject(new Error(`End date must be on or before affiliate's quota end date (${affiliateEndDate.format('MMM DD, YYYY')})`));
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                disabledDate={(current) => {
                                    if (!selectedAffiliateDetails?.quota_end_date) return false;
                                    return current && current.isAfter(dayjs(selectedAffiliateDetails.quota_end_date), 'day');
                                }}
                            />
                        </Form.Item>
                        {selectedAffiliateDetails?.quota_end_date && (
                            <Text type="secondary" style={{ display: 'block', marginTop: -16, marginBottom: 8 }}>
                                Affiliate Quota End Date: <Tag color="blue">{dayjs(selectedAffiliateDetails.quota_end_date).format('MMM DD, YYYY')}</Tag>
                            </Text>
                        )}
                    </Col>
                </Row>

                <Form.Item
                    label="Categories"
                    name="categories"
                    rules={[{ required: true, message: 'Please select at least one category' }]}
                >
                    <Select mode="multiple" placeholder="Select categories">
                        {categories.map(cat => (
                            <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Update Token
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

export default EditTokenModal;
