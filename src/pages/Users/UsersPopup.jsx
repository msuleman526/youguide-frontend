import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form, Input, Typography, Alert, Divider, message, Select } from 'antd';
import ApiService from '../../APIServices/ApiService';

const UserPopup = ({ type, user, open, setOpen, onSaveUser }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    
    useEffect(() => {
        if (open) {
            if (type === 'Edit' && user) {
                form.setFieldsValue({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role._id
                });
            } else {
                form.resetFields();
            }

            // Fetch roles from the API when the popup opens
            ApiService.getAllRoles()
                .then(response => {
                    setRoles(response); // Assuming response.data is an array of roles
                })
                .catch(error => {
                    message.error("Failed to load roles.");
                });
        }
    }, [open, type, user, form]);

    const closeDrawer = () => {
        setOpen(false);
    };

    const onFinish = (values) => {
        setLoading(true);
        const apiCall = type === 'Edit' 
            ? ApiService.editUser(values, user._id) 
            : ApiService.createUser(values);
        
        apiCall
            .then(response => {
                message.success(`${type === 'Edit' ? 'User updated.' : 'User created.'}`);
                onSaveUser(response.user);
                setLoading(false);
                closeDrawer(); // Close drawer after saving
            })
            .catch(error => {
                setLoading(false);
                message.error(error?.response?.data?.message || "User operation failed.");
            });
    };

    return (
        <Drawer
            title={<Typography.Title level={3} className="fw-500">{type === 'Edit' ? 'Edit User' : 'Add User'}</Typography.Title>}
            width={400}
            onClose={closeDrawer}
            open={open}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading}>
                        Submit
                    </Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Alert
                message="Create a new user to manage the system"
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    Define Your User
                </Typography.Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'First Name is required' }]}
                >
                    <Input placeholder="Enter First Name" />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Last Name is required' }]}
                >
                    <Input placeholder="Enter Last Name" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Valid Email is required' }]}
                >
                    <Input placeholder="Enter Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Password is required' }]}
                >
                    <Input.Password placeholder="Enter Password" />
                </Form.Item>
                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Role is required' }]}
                >
                    <Select placeholder="Select Role">
                        {roles.map(role => (
                            <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default UserPopup;
