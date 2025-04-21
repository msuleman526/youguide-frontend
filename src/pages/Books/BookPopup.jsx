import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Typography,
    Button,
    Form,
    Input,
    Divider,
    Alert,
    Upload,
    InputNumber,
    Select,
    message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import ApiService from '../../APIServices/ApiService';
import TextArea from 'antd/es/input/TextArea';

const { Title, Text } = Typography;
const { Option } = Select;

const LANG_MAP = {
    ARABIC: "ARABIC",
    CHINESE: "CHINESE",
    DUTCH: "DUTCH",
    ENGLISH: "ENGLISH",
    FRENCH: "FRENCH",
    GERMAN: "GERMAN",
    ITALIAN: "ITALIAN",
    JAPANESE: "JAPANESE",
    POLISH: "POLISH",
    PORTUGUESE: "PORTUGUESE",
    RUSSIAN: "RUSSIAN",
    SPANISH: "SPANISH"
};

const BookPopup = ({ visible, onClose, loading, onAddBook }) => {
    const [form] = Form.useForm();
    const [locationDetails, setLocationDetails] = useState({ city: '', country: '' });
    const [categories, setCategories] = useState([]);

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

    const handleAddressSelect = (value) => {
        const address = value.value.label;
        const components = value.value.terms;

        let city = '';
        let country = '';
        if (components.length >= 2) {
            city = components[components.length - 3]?.value || components[components.length - 2]?.value || '';
            country = components[components.length - 1]?.value || '';
        }

        if (city === "" || country === "") {
            message.error("Please select a valid city and country.");
            return;
        }

        setLocationDetails({ city, country });
        form.setFieldsValue({ address, city, country });
    };

    const handleFinish = (values) => {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('eng_name', values.eng_name);
        formData.append('description', values.description);
        formData.append('eng_description', values.eng_description);
        formData.append('address', values.city + ", " + values.country);
        formData.append('city', values.city);
        formData.append('country', values.country);
        formData.append('category_id', values.category_id);
        formData.append('price', values.price);
        formData.append('language', values.language);

        if (values.image?.file) {
            formData.append('image', values.image.file);
        }

        if (values.pdf?.file) {
            formData.append('pdf', values.pdf.file);
        }

        if (values.json?.file) {
            formData.append('json', values.json.file);
        }

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
            width={500}
            onClose={onClose}
            open={visible}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading} disabled={locationDetails.city === ""}>
                        Submit
                    </Button>
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
                    name="eng_name"
                    label="English Book Name"
                    rules={[{ required: true, message: 'English Book Name is required' }]}
                >
                    <Input placeholder="Enter English book name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Book Description"
                    rules={[{ required: true, message: 'Book description is required' }]}
                >
                    <TextArea placeholder="Enter book description" />
                </Form.Item>

                <Form.Item
                    name="eng_description"
                    label="English Book Description"
                    rules={[{ required: true, message: 'English description is required' }]}
                >
                    <TextArea placeholder="Enter English description" />
                </Form.Item>

                <Form.Item label="Location">
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0"
                        types={['(cities)']}
                        selectProps={{
                            onChange: handleAddressSelect,
                            placeholder: 'Enter City and Country'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="city"
                    label="City"
                    hidden
                    rules={[{ required: true, message: 'City is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="country"
                    label="Country"
                    hidden
                    rules={[{ required: true, message: 'Country is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Price is required' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter book price" />
                </Form.Item>

                <Form.Item
                    name="category_id"
                    label="Category"
                    rules={[{ required: true, message: 'Category is required' }]}
                >
                    <Select placeholder="Select a category">
                        {categories.map(category => (
                            <Option key={category.id} value={category.id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="language"
                    label="Language"
                    rules={[{ required: true, message: 'Language is required' }]}
                >
                    <Select placeholder="Select a language">
                        {Object.keys(LANG_MAP).map(key => (
                            <Option key={key} value={LANG_MAP[key]}>{LANG_MAP[key]}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Book Cover Image"
                    rules={[{ required: true, message: 'Image is required' }]}
                    valuePropName="file"
                    getValueFromEvent={e => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="pdf"
                    label="PDF File"
                    rules={[{ required: true, message: 'PDF file is required' }]}
                    valuePropName="file"
                    getValueFromEvent={e => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload PDF</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="json"
                    label="JSON File (optional)"
                    valuePropName="file"
                    getValueFromEvent={e => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload JSON</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default BookPopup;
