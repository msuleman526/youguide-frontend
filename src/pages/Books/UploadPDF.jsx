import React, { useState } from 'react';
import { Modal, Typography, Button, Form, Upload, Divider, Alert, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';

const { Title, Text } = Typography;
const { Option } = Select;

// Language options with identical label and value
const languages = [
    'English',
    'Chinese (Simplified)',
    'Urdu',
    'Spanish',
    'Dutch',
    'German',
    'French',
    'Italian',
    'Russian',
    'Portuguese',
    'Japanese',
    'Polish',
    'Arabic',
    'Turkish',
    'Hindi',
    'Indonesian',
];

const UploadPDF = ({ bookID, visible, onClose, onUploadPDF }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleFinish = (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('language', values.language);

        // Append the PDF file
        if (values.file?.file) {
            formData.append('file', values.file.file);
        }

        // Call API to upload the book PDF
        ApiService.uploadBookPDF(bookID, formData)
            .then((response) => {
                setLoading(false);
                form.resetFields();
                onClose();
                onUploadPDF(response);
            })
            .catch((error) => {
                console.error('Error uploading PDF book:', error);
                setLoading(false);
            });
    };

    return (
        <Modal
            open={visible}
            width={450}
            title={<Title level={3} className="fw-500">Upload Guides</Title>}
            onOk={form.submit}
            okText="Upload"
            onCancel={onClose}
            confirmLoading={loading}
        >
            <Alert
                message="Select a language and upload the book's PDF file."
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    Guide PDF Details
                </Text>
            </Divider>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="language"
                    label="Language"
                    rules={[{ required: true, message: 'Please select a language' }]}
                >
                    <Select placeholder="Select a language">
                        {languages.map((language) => (
                            <Option key={language} value={language}>
                                {language}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="file"
                    label="Guide PDF"
                    valuePropName="file"
                    rules={[{ required: true, message: 'Please upload a PDF file' }]}
                >
                    <Upload maxCount={1} beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload PDF</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadPDF;
