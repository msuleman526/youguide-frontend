import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Button, Form, Input, Divider, Alert, Upload, InputNumber, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import ApiService from '../../APIServices/ApiService';

const { Title, Text } = Typography;
const { Option } = Select;

const BookPopup = ({ visible, onClose, loading, onAddBook }) => {
    const [form] = Form.useForm();
    const [locationDetails, setLocationDetails] = useState({ city: '', country: '' });
    const [categories, setCategories] = useState([]);

    // Fetch categories when drawer is opened
    useEffect(() => {
        if (visible) {
            ApiService.getAllCategories()
                .then(response => {
                    setCategories(response || []);
                })
                .catch(error => {
                    setCategories([]);
                    console.error("Error fetching categories:", error);
                });
        }
    }, [visible]);

    // Handle the selection of address
    const handleAddressSelect = (value) => {
        const address = value.value.label;
        const components = value.value.terms;
      
        let city = '';
        let country = '';
        if (components.length >= 2) {
            city = components[components.length - 3]?.value || components[components.length - 2]?.value || '';
            country = components[components.length - 1]?.value || '';
        }

        setLocationDetails({ city, country });
        form.setFieldsValue({ address, city, country });
    };

    // Handle form submission
    const handleFinish = (values) => {
        const formData = new FormData();
        
        // Append form data fields
        formData.append('name', values.name);
        formData.append('address', values.city + ", " +  values.country);
        formData.append('city', values.city);
        formData.append('country', values.country);
        formData.append('languages', values.languages);
        formData.append('category_id', values.category_id);
        formData.append('price', values.price);
        
        // Append image and file
        if (values.image?.file) {
            formData.append('image', values.image.file);
        }
        if (values.file?.file) {
            formData.append('file', values.file.file);
        }

        // Call API to create the book
        ApiService.createBook(formData)
            .then((response) => {
                form.resetFields();
                setLocationDetails({ city: '', country: '' });
                onClose();
                onAddBook(response);
            })
            .catch(error => {
                console.error("Error creating book:", error);
            });
    };

    return (
        <Drawer
            title={<Title level={3} className="fw-500">Add Book</Title>}
            width={400}
            onClose={onClose}
            open={visible}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading}>Submit</Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Alert
                message="Enter details for the book you want to add."
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Book Details</Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    name="name"
                    label="Book Name"
                    rules={[{ required: true, message: 'Book Name is required' }]}
                >
                    <Input placeholder="Enter book name" />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ message: 'Address is required' }]}
                >
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0"
                        selectProps={{
                            onChange: handleAddressSelect,
                            placeholder: 'Enter address'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="city"
                    label="City"
                    initialValue={locationDetails.city}
                >
                    <Input placeholder="City will auto-fill based on address" disabled />
                </Form.Item>

                <Form.Item
                    name="country"
                    label="Country"
                    initialValue={locationDetails.country}
                >
                    <Input placeholder="Country will auto-fill based on address" disabled />
                </Form.Item>

                <Form.Item
                    name="languages"
                    label="Languages"
                    rules={[{ required: true, message: 'Languages are required' }]}
                >
                    <Input placeholder="Enter languages (e.g., English)" />
                </Form.Item>

                <Form.Item
                    name="category_id"
                    label="Category"
                    rules={[{ required: true, message: 'Category is required' }]}
                >
                    <Select placeholder="Select a category">
                        {categories.map(category => (
                            <Option key={category._id} value={category._id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Price is required' }]}
                >
                    <InputNumber placeholder="Enter price" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Book Cover Image"
                    valuePropName="file"
                    rules={[{ required: true, message: 'Image is required' }]}
                >
                    <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="file"
                    label="Book PDF"
                    valuePropName="file"
                    rules={[{ required: true, message: 'PDF is required' }]}
                >
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload PDF</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default BookPopup;
