import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form, Input, InputNumber, DatePicker, Switch, Typography, Alert, Divider, Select, Checkbox, message } from 'antd';
import ApiService from '../../APIServices/ApiService';
import dayjs from 'dayjs';

const { Option } = Select;

const productTypeOptions = [
    { label: 'Travel Guides', value: 'book' },
    { label: 'eSIMs', value: 'esim' },
    { label: 'Language Guides', value: 'language_guide' },
];

const DiscountPopup = ({ type, discount, open, setOpen, onSaveDiscount }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [discountType, setDiscountType] = useState('overall');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategories();
            setCategories(response?.categories || response || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        if (open && type === 'Edit' && discount) {
            const values = {
                name: discount.name,
                type: discount.type,
                discountValue: discount.discountValue,
                discountUnit: discount.discountUnit || 'percentage',
                categories: discount.categories?.map(c => c._id || c) || [],
                productTypes: discount.productTypes || [],
                startDate: discount.startDate ? dayjs(discount.startDate) : null,
                endDate: discount.endDate ? dayjs(discount.endDate) : null,
                isActive: discount.isActive,
            };
            form.setFieldsValue(values);
            setDiscountType(discount.type);
        } else if (open) {
            form.resetFields();
            form.setFieldsValue({ isActive: true, discountUnit: 'percentage', type: 'overall' });
            setDiscountType('overall');
        }
    }, [open, type, discount, form]);

    const closeDrawer = () => {
        setOpen(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const data = {
                name: values.name,
                type: values.type,
                discountValue: values.discountValue,
                discountUnit: values.discountUnit,
                categories: values.type === 'category' ? values.categories : [],
                productTypes: values.type === 'product_type' ? values.productTypes : [],
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                isActive: values.isActive,
            };

            let response;
            if (type === 'Edit') {
                response = await ApiService.updateDiscount(discount._id, data);
                message.success('Discount updated successfully.');
            } else {
                response = await ApiService.createDiscount(data);
                message.success('Discount created successfully.');
            }
            onSaveDiscount(response);
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to save discount.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title={<Typography.Title level={3} className="fw-500">{type === 'Edit' ? 'Edit Discount' : 'Add Discount'}</Typography.Title>}
            width={480}
            onClose={closeDrawer}
            open={open}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={closeDrawer} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading}>Submit</Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Alert
                message="Create discounts that automatically apply to products on the website. Discounted prices will be shown on all product cards."
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Divider><Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Basic Info</Typography.Text></Divider>

                <Form.Item name="name" label="Discount Name" rules={[{ required: true, message: 'Name is required' }]}>
                    <Input placeholder="e.g. Summer Sale 20% Off" />
                </Form.Item>

                <Form.Item name="type" label="Discount Type" rules={[{ required: true }]}>
                    <Select onChange={(val) => setDiscountType(val)}>
                        <Option value="overall">Overall (All Products)</Option>
                        <Option value="category">Category (Specific Guide Categories)</Option>
                        <Option value="product_type">Product Type (Guides / eSIMs / Language Guides)</Option>
                    </Select>
                </Form.Item>

                {/* Category selection - only shown when type is 'category' */}
                {discountType === 'category' && (
                    <Form.Item
                        name="categories"
                        label="Select Categories"
                        rules={[{ required: true, message: 'Select at least one category' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select categories"
                            optionFilterProp="children"
                            showSearch
                        >
                            {categories.map(cat => (
                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {/* Product type selection - only shown when type is 'product_type' */}
                {discountType === 'product_type' && (
                    <Form.Item
                        name="productTypes"
                        label="Select Product Types"
                        rules={[{ required: true, message: 'Select at least one product type' }]}
                    >
                        <Checkbox.Group options={productTypeOptions} />
                    </Form.Item>
                )}

                <Divider><Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Discount Value</Typography.Text></Divider>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Form.Item name="discountValue" label="Value" rules={[{ required: true, message: 'Value is required' }]} style={{ flex: 1 }}>
                        <InputNumber min={0.01} placeholder="e.g. 20" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="discountUnit" label="Unit" style={{ flex: 1 }}>
                        <Select>
                            <Option value="percentage">Percentage (%)</Option>
                            <Option value="fixed">Fixed Amount (€)</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Divider><Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Validity Period</Typography.Text></Divider>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]} style={{ flex: 1 }}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'End date is required' }]} style={{ flex: 1 }}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <Form.Item name="isActive" label="Active" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default DiscountPopup;
