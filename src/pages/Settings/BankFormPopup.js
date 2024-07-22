import React, { useState } from 'react';
import { Modal, Button, Form, Input, notification, Upload, message } from 'antd';
import axios from 'axios';
import { toBase64 } from '../../Utils/Utils';
import { FaFileUpload } from 'react-icons/fa';

const BankFormPopup = ({ visible, setVisible }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Convert the icon file to base64
            const iconFile = values.icon[0].originFileObj;
            const base64Icon = await toBase64(iconFile);

            const data = { ...values, icon: iconFile };
            console.log(data)

            // // Call your API here
            // const response = await axios.post('your-api-endpoint', data);
            // notification.success({
            //     message: 'Success',
            //     description: 'Data submitted successfully',
            // });
            setVisible(false);
            //form.resetFields();
        } catch (error) {
            console.error(error);
            notification.error({
                message: 'Error',
                description: 'There was an error submitting your data',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Modal
                open={visible}
                title="Alied Bank"
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical" name="alied_bank_form">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="icon"
                        label="Icon"
                        rules={[{ required: true, message: 'Please select an icon!' }]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            <Button icon={<FaFileUpload />}>Choose Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default BankFormPopup;