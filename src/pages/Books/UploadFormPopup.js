import React, { useState } from 'react';
import { Modal, Button, Form, Upload, Typography, Spin, message } from 'antd';
import { FaFileUpload } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { themeState } from '../../atom';
import ApiService from '../../APIServices/ApiService';

const UploadFormPopup = ({ visible, setVisible, fetchAllBooks }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [theme] = useRecoilState(themeState);
    const [file, setFile] = useState(null);

    const handleCancel = () => {
        setVisible(false);
        form.resetFields();
        setFile(null);
    };

    const handleFileChange = (e) => {
        setFile(e.fileList[0]?.originFileObj || null);
    };

    const handleUpload = async () => {
        if (!file) {
            message.error('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            await ApiService.uploadBook(formData);
            message.success('Book uploaded successfully.');
            fetchAllBooks(); // Refresh the book list
            handleCancel(); // Close modal and reset state
        } catch (error) {
            message.error('Failed to upload book.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            width={450}
            title={<Typography.Title level={3} className="fw-500">Upload Guides</Typography.Title>}
            onOk={handleUpload}
            okText={"Upload"}
            onCancel={handleCancel}
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical" name="upload_form">
                <Form.Item
                    name="icon"
                    label="Choose Excel file from your computer"
                    rules={[{ required: true, message: 'Please select a file!' }]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                >
                    <Upload
                        className={theme === 'light' ? 'upload-input-light' : 'upload-input-dark'}
                        listType="picture"
                        beforeUpload={() => false}
                        maxCount={1}
                        onChange={handleFileChange}
                    >
                        <Button icon={<FaFileUpload />}>Browse a file</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadFormPopup;
