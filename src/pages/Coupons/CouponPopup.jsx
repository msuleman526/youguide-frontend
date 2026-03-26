import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form, Input, InputNumber, DatePicker, Switch, Typography, Alert, Divider, message } from 'antd';
import ApiService from '../../APIServices/ApiService';
import dayjs from 'dayjs';

const CouponPopup = ({ type, coupon, open, setOpen, onSaveCoupon }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && type === 'Edit' && coupon) {
            form.setFieldsValue({
                code: coupon.code,
                percentage: coupon.percentage,
                expiryDate: coupon.expiryDate ? dayjs(coupon.expiryDate) : null,
                isActive: coupon.isActive,
                usageLimit: coupon.usageLimit || null,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ isActive: true });
        }
    }, [open]);

    const closeDrawer = () => {
        setOpen(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const data = {
                code: values.code,
                percentage: values.percentage,
                expiryDate: values.expiryDate.toISOString(),
                isActive: values.isActive,
                usageLimit: values.usageLimit || null,
            };

            let response;
            if (type === 'Edit') {
                response = await ApiService.updateCoupon(coupon._id, data);
                message.success('Coupon updated successfully.');
            } else {
                response = await ApiService.createCoupon(data);
                message.success('Coupon created successfully.');
            }
            onSaveCoupon(response);
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to save coupon.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title={<Typography.Title level={3} className="fw-500">{type === 'Edit' ? 'Edit Coupon' : 'Add Coupon'}</Typography.Title>}
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
                message="Create a coupon code with a discount percentage and expiry date."
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    Coupon Details
                </Typography.Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="code"
                    label="Coupon Code"
                    rules={[{ required: true, message: 'Coupon code is required' }]}
                >
                    <Input placeholder="e.g. SUMMER25" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
                <Form.Item
                    name="percentage"
                    label="Discount Percentage"
                    rules={[{ required: true, message: 'Percentage is required' }]}
                >
                    <InputNumber min={1} max={100} placeholder="e.g. 25" style={{ width: '100%' }} addonAfter="%" />
                </Form.Item>
                <Form.Item
                    name="expiryDate"
                    label="Expiry Date"
                    rules={[{ required: true, message: 'Expiry date is required' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="usageLimit"
                    label="Usage Limit (optional)"
                >
                    <InputNumber min={1} placeholder="Leave empty for unlimited" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="isActive"
                    label="Active"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default CouponPopup;
