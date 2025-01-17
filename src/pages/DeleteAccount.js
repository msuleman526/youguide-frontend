import React from 'react';
import { Form, Input, Button, Space, Card } from 'antd';

const DeleteAccount = () => {
    const onFinish = (values) => {
        console.log('Form Values:', values);
    };

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
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Full Name"
                        name="fullName"
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
                            <Button type="primary" htmlType="submit">
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
