import React, { useState } from 'react';
import { Modal, Button, Form, Upload, Typography, Spin } from 'antd';
import { FaFileUpload } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import CustomInput from '../../components/Input';
import { themeState } from '../../atom';

const UploadFormPopup = ({ visible, setVisible }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [theme] = useRecoilState(themeState);
    const [modalLoading, setModalLoading] = useState(false);

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Modal
                open={visible}
                width={450}
                loading={modalLoading}
                title={<Typography.Title level={3} className="fw-500">Upload Transaction</Typography.Title>}
                onOk={handleCancel}
                okText={"Upload"}
                onCancel={handleCancel}
                confirmLoading={loading}
            >{modalLoading ? <Spin /> :
                <Form form={form} layout="vertical" name="bank_form">
                    <Form.Item
                        name="name"
                        label="Transaction file for"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <CustomInput placeholder="Transaction file for" />
                    </Form.Item>
                    <Form.Item
                        name="icon"
                        label="Choose transaction file from your computer"
                        rules={[{ required: true, message: 'Please select an icon!' }]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                    >
                        <Upload
                            className={theme === 'light' ? 'upload-input-light' : 'upload-input-dark'}
                            listType="picture"
                            beforeUpload={() => false}
                            maxCount={1}
                            defaultFileList={form.getFieldValue('icon')}
                        >
                            <Button icon={<FaFileUpload />}>Browse a file</Button>
                        </Upload>
                    </Form.Item>
                </Form>}
            </Modal>
        </>
    );
};

export default UploadFormPopup;
