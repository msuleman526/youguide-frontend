import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Row, Col, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ApiService from '../APIServices/ApiService';
import logo from '../assets/large_logo.png';

const { TextArea } = Input;
const { Title } = Typography;

const ContactForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                name: values.name,
                email: values.email,
                phone_no: values.phone_no || undefined,
                message: values.message
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            const response = await ApiService.submitContact(payload);

            message.success('Your message has been sent successfully!');
            form.resetFields();
        } catch (error) {
            console.error('Error submitting contact:', error);
            message.error(error.response?.data?.message || 'Failed to send message. Please try again.');
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
                    Contact Us
                </Title>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    {/* Row 1: Name & Email */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    { required: true, message: 'Please enter your name' },
                                    { min: 2, message: 'Name must be at least 2 characters' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter your name"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email address' }
                                ]}
                            >
                                <Input
                                    placeholder="Enter your email"
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Row 2: Phone */}
                    <Form.Item
                        label="Phone No"
                        name="phone_no"
                    >
                        <Input
                            placeholder="Enter your phone number"
                            size="large"
                        />
                    </Form.Item>

                    {/* Row 3: Message */}
                    <Form.Item
                        label="Message"
                        name="message"
                        rules={[
                            { required: true, message: 'Please enter your message' },
                            { min: 10, message: 'Message must be at least 10 characters' }
                        ]}
                    >
                        <TextArea
                            placeholder="Enter your message"
                            rows={5}
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
                            Send Message
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ContactForm;
