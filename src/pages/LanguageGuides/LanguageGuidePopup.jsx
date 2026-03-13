import React, { useEffect } from 'react';
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
    message
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const LanguageGuidePopup = ({ visible, onClose, onSave, editingGuide }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (visible && editingGuide) {
            form.setFieldsValue({
                name: editingGuide.name,
                description: editingGuide.description,
                price: editingGuide.price,
                status: editingGuide.status,
                in_language: editingGuide.in_language,
                to_language: editingGuide.to_language,
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, editingGuide, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('eng_name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('status', values.status !== undefined ? values.status : true);
        if (values.in_language) formData.append('in_language', values.in_language);
        if (values.to_language) formData.append('to_language', values.to_language);

        if (values.image?.file) {
            formData.append('image', values.image.file);
        }

        if (values.pdf?.file) {
            formData.append('file', values.pdf.file);
        }

        if (values.json?.file) {
            formData.append('json', values.json.file);
        }

        if (values.epub?.file) {
            formData.append('epub', values.epub.file);
        }

        try {
            if (editingGuide) {
                await ApiService.updateLanguageGuide(editingGuide._id, formData);
                message.success('Language guide updated successfully.');
            } else {
                await ApiService.createLanguageGuide(formData);
                message.success('Language guide created successfully.');
            }
            form.resetFields();
            onSave();
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to save language guide.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer
            title={<Title level={3} className="fw-500">{editingGuide ? 'Edit Language Guide' : 'Add Language Guide'}</Title>}
            width={500}
            onClose={onClose}
            open={visible}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading}>
                        {editingGuide ? 'Update' : 'Submit'}
                    </Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Alert
                message={editingGuide ? 'Update language guide details. Upload new files to replace existing ones.' : 'Enter details for the language guide you want to add.'}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Guide Details</Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ status: true }}
            >
                <Form.Item
                    name="name"
                    label="Guide Name"
                    rules={[{ required: true, message: 'Name is required' }]}
                >
                    <Input placeholder="Enter guide name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Description is required' }]}
                >
                    <TextArea rows={4} placeholder="Enter guide description" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Price is required' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter price" />
                </Form.Item>

                <Form.Item
                    name="in_language"
                    label="In Language (e.g. Arabic)"
                    rules={[{ required: true, message: 'In Language is required' }]}
                >
                    <Input placeholder="Language the guide is written in" />
                </Form.Item>

                <Form.Item
                    name="to_language"
                    label="To Language (e.g. Aymara)"
                    rules={[{ required: true, message: 'To Language is required' }]}
                >
                    <Input placeholder="Language being taught" />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Cover Image"
                    rules={editingGuide ? [] : [{ required: true, message: 'Image is required' }]}
                    valuePropName="file"
                    getValueFromEvent={e => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false} accept="image/*">
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="pdf"
                    label="PDF File"
                    rules={editingGuide ? [] : [{ required: true, message: 'PDF file is required' }]}
                    valuePropName="file"
                    getValueFromEvent={e => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false} accept=".pdf">
                        <Button icon={<UploadOutlined />}>Upload PDF</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="json"
                    label="JSON File (optional)"
                    valuePropName="file"
                    getValueFromEvent={e => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false} accept=".json">
                        <Button icon={<UploadOutlined />}>Upload JSON</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="epub"
                    label="EPUB File (optional)"
                    valuePropName="file"
                    getValueFromEvent={e => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false} accept=".epub">
                        <Button icon={<UploadOutlined />}>Upload EPUB</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default LanguageGuidePopup;
