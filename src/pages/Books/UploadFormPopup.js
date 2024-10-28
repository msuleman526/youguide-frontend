import React, { useState } from 'react';
import { Modal, Button, Form, Upload, Typography, Spin, Select, message } from 'antd';
import { FaFileUpload } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import CustomInput from '../../components/Input';
import { themeState } from '../../atom';
import { UPLOAD_TRANSACTION_FILE } from '../../Utils/Apis';
import { handleErrors } from '../../Utils/Utils';

const UploadFormPopup = ({ visible, setVisible }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [theme] = useRecoilState(themeState);
    const [modalLoading, setModalLoading] = useState(false);

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOk = async () => {
        setVisible(false);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <>
            <Modal
                open={visible}
                width={450}
                title={<Typography.Title level={3} className="fw-500">Upload Books</Typography.Title>}
                onOk={handleOk}
                okText={"Upload"}
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                {modalLoading ? <Spin /> :
                    <Form form={form} layout="vertical" name="bank_form">
                        <Form.Item
                            name="icon"
                            label="Choose excel file from your computer"
                            rules={[{ required: true, message: 'Please select a file!' }]}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                className={theme === 'light' ? 'upload-input-light' : 'upload-input-dark'}
                                listType="picture"
                                beforeUpload={() => false}
                                maxCount={1}
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
