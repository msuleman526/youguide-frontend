import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, message, Row, Col, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ApiService from '../APIServices/ApiService';
import logo from '../assets/large_logo.png';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const RequestForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                full_name: values.full_name,
                company_name: values.company_name || undefined,
                email_address: values.email_address,
                phone_no: values.phone_no || undefined,
                interested_id: values.interested_id || undefined,
                additional_information: values.additional_information || undefined
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            const response = await ApiService.submitContactRequest(payload);

            message.success('Your request has been submitted successfully!');
            form.resetFields();
        } catch (error) {
            console.error('Error submitting request:', error);
            message.error(error.response?.data?.message || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            {/* Logo */}
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <img
                    src={logo}
                    alt="YouGuide Logo"
                    style={{
                        maxWidth: '200px',
                        height: 'auto'
                    }}
                />
            </div>

            {/* Card with Form */}
            <Card
                style={{
                    maxWidth: 700,
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                    Submit Your Request
                </Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    {/* Row 1: Full Name & Company Name */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Full Name"
                                name="full_name"
                                rules={[
                                    { required: true, message: 'Please enter your full name' },
                                    { min: 2, message: 'Full name must be at least 2 characters' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter your full name"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Company Name"
                                name="company_name"
                            >
                                <Input
                                    placeholder="Enter your company name"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Row 2: Email Address & Phone No */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Email Address"
                                name="email_address"
                                rules={[
                                    { required: true, message: 'Please enter your email address' },
                                    { type: 'email', message: 'Please enter a valid email address' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter your email address"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Phone No"
                                name="phone_no"
                            >
                                <Input
                                    placeholder="Enter your phone number"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Row 3: I am interested in (Dropdown) */}
                    <Form.Item
                        label="I am interested in"
                        name="interested_id"
                    >
                        <Select
                            placeholder="Select an option"
                            size="large"
                            allowClear
                        >
                            <Option value="Platform Demo">Platform Demo</Option>
                            <Option value="Free Trial">Free Trial</Option>
                            <Option value="Both Free Trial and Demo">Both Free Trial and Demo</Option>
                        </Select>
                    </Form.Item>

                    {/* Row 4: Additional Notes */}
                    <Form.Item
                        label="Additional Notes"
                        name="additional_information"
                    >
                        <TextArea
                            placeholder="Enter any additional information or questions"
                            rows={4}
                            size="large"
                        />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            icon={<SendOutlined />}
                            loading={loading}
                            block
                            style={{
                                height: 48,
                                fontSize: 16,
                                fontWeight: 500
                            }}
                        >
                            Submit Your Request
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default RequestForm;
