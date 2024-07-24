import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Upload, message, Typography, Spin } from 'antd';
import { FaFileUpload } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import CustomInput from '../../../components/Input';
import { ADD_UPDATE_BANK, GET_BANK_BY_ID } from '../../../Utils/Apis';
import { handleErrors, toBase64 } from '../../../Utils/Utils';
import { themeState } from '../../../atom';

const BankFormPopup = ({ visible, setVisible, type, selectedBank, reload }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [theme] = useRecoilState(themeState);
    const [modalLoading, setModalLoading] = useState(false);
    const [bankData, setBankData] = useState(null)

    useEffect(() => {
        if (visible && type === "EDIT") {
            getBankByID();
        } else {
            form.resetFields();
        }
    }, [type, visible]);

    const getBankByID = async () => {
        setModalLoading(true);
        try {
            const response = await GET_BANK_BY_ID(selectedBank);
            if (response.isSuccess && response.data) {
                const { name, icon } = response.data;
                setBankData(response.data)
                const file = {
                    uid: '-1',
                    name: 'icon.png',
                    status: 'done',
                    url: icon,
                };
                form.setFieldsValue({
                    name: name,
                    icon: [file],
                });
            }
            setModalLoading(false);
        } catch (err) {
            setModalLoading(false);
            handleErrors("Fetching Bank Data", err);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            let base64Icon = "";
            let fileType = ""
            try {
                base64Icon = await toBase64(values.icon[0].originFileObj);
                fileType = values.icon[0].type
            } catch (ee) {
                base64Icon = values.icon[0].url;
                fileType = bankData.fileType
            }

            const data = {
                ...values,
                icon: base64Icon,
                fileHasHeader: true,
                isActive: true,
                fileType: fileType,
                ...(type === "EDIT" && { bankID: selectedBank })
            };

            await ADD_UPDATE_BANK(data);
            message.success(type === "ADD" ? "Bank added successfully" : 'Bank updated successfully');
            form.resetFields();
            setLoading(false);
            setVisible(false);
            reload();
        } catch (err) {
            setLoading(false);
            handleErrors(type === "ADD" ? "Adding Bank" : "Editing Bank", err);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Modal
                open={visible}
                width={450}
                loading={modalLoading}
                title={<Typography.Title level={3} className="fw-500">{type === "ADD" ? "Add Bank" : "Edit Bank"}</Typography.Title>}
                onOk={handleOk}
                okText={type === "ADD" ? "Add" : "Update"}
                onCancel={handleCancel}
                confirmLoading={loading}
            >{modalLoading ? <Spin /> :
                <Form form={form} layout="vertical" name="bank_form">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <CustomInput placeholder="Bank Name" />
                    </Form.Item>
                    <Form.Item
                        name="icon"
                        label="Icon"
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
                            <Button icon={<FaFileUpload />}>Choose Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>}
            </Modal>
        </>
    );
};

export default BankFormPopup;
