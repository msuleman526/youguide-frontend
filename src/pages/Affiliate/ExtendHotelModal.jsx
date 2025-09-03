import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, DatePicker, Typography, Divider, Row, Col, message } from 'antd';
import { CalendarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import ApiService from '../../APIServices/ApiService';

const { Title, Text } = Typography;

const ExtendHotelModal = ({ open, onClose, hotel, affiliate, onExtendSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && hotel) {
            form.resetFields();
        }
    }, [open, hotel, form]);

    const handleExtend = async (values) => {
        setLoading(true);
        try {
            const extendData = {};
            
            if (values.additionalClicks && values.additionalClicks > 0) {
                extendData.additionalClicks = parseInt(values.additionalClicks);
            }
            
            if (values.subscriptionEndDate) {
                extendData.subscriptionEndDate = values.subscriptionEndDate.format('YYYY-MM-DD');
            } else if (values.extensionDays && values.extensionDays > 0) {
                extendData.extensionDays = parseInt(values.extensionDays);
            }

            // Call API to extend hotel's affiliate subscription
            const response = await ApiService.extendHotelAffiliateSubscription(hotel._id, extendData);
            
            message.success('Subscription extended successfully!');
            onExtendSuccess(response.affiliate, response.hotel);
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to extend subscription');
        } finally {
            setLoading(false);
        }
    };

    const calculateNewEndDate = () => {
        const extensionDays = form.getFieldValue('extensionDays');
        if (extensionDays && affiliate) {
            const currentEndDate = moment(affiliate.subscriptionEndDate);
            const newEndDate = currentEndDate.add(extensionDays, 'days');
            return newEndDate.format('YYYY-MM-DD');
        }
        return '';
    };

    return (
        <Modal
            title="Extend Hotel Subscription"
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            destroyOnClose
        >
            {hotel && affiliate && (
                <>
                    {/* Current Status */}
                    <div style={{ 
                        backgroundColor: '#f0f8ff', 
                        padding: '16px', 
                        borderRadius: '8px', 
                        marginBottom: '24px',
                        border: '1px solid #d6e4ff'
                    }}>
                        <Title level={5} style={{ margin: 0, marginBottom: '12px' }}>
                            Hotel: {hotel.hotelName}
                        </Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                            Note: Hotels inherit subscription from their affiliate ({affiliate.affiliateName})
                        </Text>
                        <Row gutter={[16, 8]}>
                            <Col span={12}>
                                <Text><strong>Affiliate Clicks:</strong> {affiliate.numberOfClicks}</Text>
                            </Col>
                            <Col span={12}>
                                <Text><strong>Pending Clicks:</strong> {affiliate.pendingClicks}</Text>
                            </Col>
                            <Col span={12}>
                                <Text><strong>Subscription End:</strong></Text>
                            </Col>
                            <Col span={12}>
                                <Text>{moment(affiliate.subscriptionEndDate).format('YYYY-MM-DD')}</Text>
                            </Col>
                        </Row>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleExtend}
                        onValuesChange={() => form.validateFields()}
                    >
                        {/* Add Clicks Section */}
                        <Title level={5}>
                            <PlusCircleOutlined /> Add Additional Clicks (to Affiliate)
                        </Title>
                        <Form.Item
                            label="Additional Clicks"
                            name="additionalClicks"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!value || value > 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Must be a positive number');
                                    }
                                }
                            ]}
                        >
                            <Input 
                                type="number" 
                                min="1"
                                placeholder="Enter number of clicks to add (e.g., 1000)" 
                                addonAfter="clicks"
                            />
                        </Form.Item>

                        <Divider />

                        {/* Extend Date Section */}
                        <Title level={5}>
                            <CalendarOutlined /> Extend Affiliate Subscription Date
                        </Title>
                        
                        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                            Choose either to extend by days OR set a specific end date
                        </Text>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Extend by Days"
                                    name="extensionDays"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                const endDate = form.getFieldValue('subscriptionEndDate');
                                                if (endDate && value) {
                                                    return Promise.reject('Cannot use both extension days and specific end date');
                                                }
                                                if (value && value <= 0) {
                                                    return Promise.reject('Must be a positive number');
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <Input 
                                        type="number" 
                                        min="1"
                                        placeholder="e.g., 30" 
                                        addonAfter="days"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="OR Set Specific End Date"
                                    name="subscriptionEndDate"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                const extensionDays = form.getFieldValue('extensionDays');
                                                if (extensionDays && value) {
                                                    return Promise.reject('Cannot use both extension days and specific end date');
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <DatePicker 
                                        style={{ width: '100%' }}
                                        disabledDate={(current) => current && current < moment().endOf('day')}
                                        placeholder="Select end date"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Preview */}
                        {form.getFieldValue('extensionDays') && (
                            <div style={{ 
                                backgroundColor: '#f6ffed', 
                                padding: '12px', 
                                borderRadius: '4px',
                                border: '1px solid #b7eb8f',
                                marginBottom: '16px'
                            }}>
                                <Text>
                                    <strong>New end date will be:</strong> {calculateNewEndDate()}
                                </Text>
                            </div>
                        )}

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '24px' }}>
                            <Button onClick={onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Extend Subscription
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
        </Modal>
    );
};

export default ExtendHotelModal;
