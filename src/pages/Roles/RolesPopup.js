import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form, Input, Typography, Alert, Divider, message } from 'antd';
import ApiService from '../../APIServices/ApiService';

const RolesPopup = ({ type, role, open, setOpen, onSaveRole }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Role", role)
        if (open && type === 'Edit' && role) {
            form.setFieldsValue({
                name: role.name
            })
        } else {
            form.resetFields()
        }
    }, [open])

    const closeDrawer = () => {
        setOpen(false);
    };

    const onFinish = (values) => {
        if (type === 'Edit') {
            setLoading(true)
            try {
                ApiService.editRole(values, role._id)
                    .then(response => {
                        message.success("Roles updated.")
                        setLoading(false)
                        onSaveRole(response)
                    })
                    .catch(error => {
                        setLoading(false)
                        message.error(error?.response?.data?.message || "Roles Failed.")
                    });
            } catch (error) {
                setLoading(false)
                console.log("Error", error)
            }
        } else {
            setLoading(true)
            try {
                ApiService.createRole(values)
                    .then(response => {
                        message.success("Roles Created.")
                        setLoading(false)
                        onSaveRole(response)
                    })
                    .catch(error => {
                        setLoading(false)
                        message.error(error?.response?.data?.message || "Roles Failed.")
                    });
            } catch (error) {
                setLoading(false)
                console.log("Error", error)
            }
        }
    };

    return (
        <Drawer
            title={<Typography.Title level={3} className="fw-500">{type === 'Edit' ? 'Edit Role' : 'Add Role'}</Typography.Title>}
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
                message="Create a new role to define user permissions and access levels."
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    Define Your Role
                </Typography.Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    label="Role Name"
                    rules={[{ required: true, message: 'Role Name is required' }]}
                >
                    <Input placeholder="Enter role name" />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default RolesPopup;
