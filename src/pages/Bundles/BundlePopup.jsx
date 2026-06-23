import React, { useEffect, useState } from 'react';
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
    Switch,
    Select,
    message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const formatData = (bytes) => {
    if (!bytes) return 'Unlimited';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb % 1 === 0 ? gb : gb.toFixed(1)} GB`;
    const mb = bytes / (1024 * 1024);
    return `${Math.round(mb)} MB`;
};

const BundlePopup = ({ visible, onClose, onSave, editingBundle }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [books, setBooks] = useState([]);
    const [languageGuides, setLanguageGuides] = useState([]);
    const [esims, setEsims] = useState([]);
    const [optionsLoading, setOptionsLoading] = useState(false);

    // Load dropdown options once when the drawer opens.
    useEffect(() => {
        if (!visible) return;
        setOptionsLoading(true);
        Promise.all([
            ApiService.getAllBooks(1, 'en', '', 200).catch(() => ({ books: [] })),
            ApiService.getAllLanguageGuides(1, '').catch(() => ({ guides: [] })),
            ApiService.getBundleEsimOptions('').catch(() => ({ data: [] })),
        ])
            .then(([booksRes, lgRes, esimRes]) => {
                setBooks(booksRes.books || []);
                setLanguageGuides(lgRes.guides || []);
                setEsims(esimRes.data || []);
            })
            .finally(() => setOptionsLoading(false));
    }, [visible]);

    // Populate form when editing / reset when adding.
    useEffect(() => {
        if (visible && editingBundle) {
            form.setFieldsValue({
                title: editingBundle.title,
                description: editingBundle.description,
                price: editingBundle.price,
                status: editingBundle.status,
                type: editingBundle.type || 'country',
                bookIds: (editingBundle.bookIds || []).map((b) => (typeof b === 'string' ? b : b._id)),
                languageGuideIds: (editingBundle.languageGuideIds || []).map((g) => (typeof g === 'string' ? g : g._id)),
                esimPackageCode: editingBundle.esim ? editingBundle.esim.packageCode : undefined,
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, editingBundle, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('description', values.description || '');
        formData.append('price', values.price);
        formData.append('status', values.status !== undefined ? values.status : true);
        formData.append('type', values.type || 'country');
        formData.append('bookIds', JSON.stringify(values.bookIds || []));
        formData.append('languageGuideIds', JSON.stringify(values.languageGuideIds || []));
        formData.append('esimPackageCode', values.esimPackageCode || '');

        if (values.cover?.file) {
            formData.append('cover', values.cover.file);
        }

        try {
            if (editingBundle) {
                await ApiService.updateBundle(editingBundle._id, formData);
                message.success('Bundle updated successfully.');
            } else {
                await ApiService.createBundle(formData);
                message.success('Bundle created successfully.');
            }
            form.resetFields();
            onSave();
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to save bundle.');
        } finally {
            setLoading(false);
        }
    };

    const bookOptions = books.map((b) => ({
        value: b._id,
        label: `${b.eng_name || b.name}${b.lang ? ` (${b.lang})` : ''}${b.country ? ` — ${b.country}` : ''}`,
    }));

    const languageGuideOptions = languageGuides.map((g) => ({
        value: g._id,
        label: g.in_language && g.to_language ? `${g.in_language} → ${g.to_language}` : g.name,
    }));

    const esimOptions = esims.map((e) => ({
        value: e.packageCode,
        label: `${e.name || e.location} — ${formatData(e.data)} · ${e.duration || '?'}d · €${e.price}`,
    }));

    return (
        <Drawer
            title={<Title level={3} className="fw-500">{editingBundle ? 'Edit Bundle' : 'Add Bundle'}</Title>}
            width={520}
            onClose={onClose}
            open={visible}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading}>
                        {editingBundle ? 'Update' : 'Submit'}
                    </Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Alert
                message={editingBundle ? 'Update bundle details. Upload a new image to replace the existing one.' : 'Enter details for the bundle you want to add. Guide and eSIM selections are optional.'}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Bundle Details</Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ status: true, type: 'country' }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Title is required' }]}
                >
                    <Input placeholder="Enter bundle title" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <TextArea rows={4} placeholder="Enter bundle description" />
                </Form.Item>

                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: 'country', label: 'Country' },
                            { value: 'city', label: 'City' },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="bookIds" label="Travel Guides (optional)">
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        loading={optionsLoading}
                        placeholder="Search and select travel guides"
                        optionFilterProp="label"
                        options={bookOptions}
                    />
                </Form.Item>

                <Form.Item name="languageGuideIds" label="Language Guides (optional)">
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        loading={optionsLoading}
                        placeholder="Search and select language guides"
                        optionFilterProp="label"
                        options={languageGuideOptions}
                    />
                </Form.Item>

                <Form.Item name="esimPackageCode" label="eSIM (optional)">
                    <Select
                        allowClear
                        showSearch
                        loading={optionsLoading}
                        placeholder="Search and select an eSIM"
                        optionFilterProp="label"
                        options={esimOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price (€)"
                    rules={[{ required: true, message: 'Price is required' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter bundle price" />
                </Form.Item>

                <Form.Item name="status" label="Status" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item
                    name="cover"
                    label="Cover Image"
                    valuePropName="file"
                    getValueFromEvent={(e) => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false} accept="image/*">
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default BundlePopup;
