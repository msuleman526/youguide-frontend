import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form, Input, Typography, Alert, Divider, message } from 'antd';
import ApiService from '../../APIServices/ApiService';

const CategoryPopup = ({ type, category, open, setOpen, onSaveCategory }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && type === 'Edit' && category) {
            form.setFieldsValue({
                name: category.name
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
                ApiService.editCategory(values, category._id)
                    .then(response => {
                        message.success("Category updated.")
                        setLoading(false)
                        onSaveCategory(response)
                    })
                    .catch(error => {
                        setLoading(false)
                        message.error(error?.response?.data?.message || "Category Failed.")
                    });
            } catch (error) {
                setLoading(false)
                console.log("Error", error)
            }
        } else {
            setLoading(true)
            try {
                ApiService.createCategory(values)
                    .then(response => {
                        message.success("Category Created.")
                        setLoading(false)
                        onSaveCategory(response)
                    })
                    .catch(error => {
                        setLoading(false)
                        message.error(error?.response?.data?.message || "Category Failed.")
                    });
            } catch (error) {
                setLoading(false)
                console.log("Error", error)
            }
        }
    };

    return (
        <Drawer
            title={<Typography.Title level={3} className="fw-500">{type === 'Edit' ? 'Edit Category' : 'Add Category'}</Typography.Title>}
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
                message="Create a new category to define the book guides"
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    Define Your Category
                </Typography.Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="name"
                    label="Category Name"
                    rules={[{ required: true, message: 'Category Name is required' }]}
                >
                    <Input placeholder="Enter Category name" />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default CategoryPopup;
