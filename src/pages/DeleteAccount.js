import React, { useState } from 'react';
import { Form, Input, Button, Space, Card, Typography, message } from 'antd';
import axios from 'axios';
import { API_URL } from '../Utils/Apis';
import ApiService from '../APIServices/ApiService';

const { Title } = Typography;

const DeleteAccount = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(ApiService.URLL + '/delete-account', values);
            console.log(response);
            message.success(response.data.message || 'Account deletion request submitted successfully.');
            form.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const [form] = Form.useForm();

    const onFinishFailed = (errorInfo) => {
        console.log('Form Errors:', errorInfo);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f2f5',
            }}
        >
            <Card style={{ width: 400, padding: 20 }}>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 20 }}>
                    Account Deletion Request
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input your full name!' },
                        ]}
                    >
                        <Input placeholder="Enter your full name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Reason for Deleting Account"
                        name="reason"
                        rules={[
                            { required: true, message: 'Please provide a reason!' },
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter your reason" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Submit
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default DeleteAccount;