import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, notification, Upload, message, Typography, Select } from 'antd';
import axios from 'axios';
import { handleErrors, toBase64 } from '../../Utils/Utils';
import { themeState } from '../../atom';
import { useRecoilState } from 'recoil';
import CustomInput from '../../components/Input';
import { GET_BANK_LIST } from '../../Utils/Apis';

const BankAccountPopup = ({ visible, setVisible, type }) => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false)
    const [form] = Form.useForm();
    const [theme, setTheme] = useRecoilState(themeState)
    const [banks, setBanks] = useState([])

    useEffect(() => {
        if (visible) callingBanksListAPI()
    }, [visible])

    const callingBanksListAPI = async () => {
        setFormLoading(true)
        try {
            let response = await GET_BANK_LIST();
            if (response.isSuccess && response.data) {
                setBanks(response.data)
            } else {
                setBanks([])
            }
            setFormLoading(false);
        } catch (err) {
            setBanks([])
            setFormLoading(false);
        }
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            try {
                //await ADD_BANK(values);
                setLoading(false);
                form.resetFields();
                handleCancel()
                message.success('Bank account added successfully');
            } catch (err) {
                setLoading(false);
                handleErrors("Adding Bank", err)
            }
        } catch (error) {
            console.error(error);
            message.error('There was an error submitting your data');
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
                height={360}
                loading={formLoading}
                title={<Typography level={3} className="fw-500">{type === "ADD" ? "Add Bank Account" : "Edit Bank Account"}</Typography>}
                onOk={handleOk}
                okText={type === "ADD" ? "Add" : "Update"}
                onCancel={handleCancel}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical" name="alied_bank_form">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <CustomInput
                            placeholder="Bank Name"
                        />
                    </Form.Item>
                    <Form.Item
                        name="accountAliase"
                        label="Account Alias"
                        rules={[{ required: true, message: 'Please input the alias!' }]}
                    >
                        <CustomInput
                            placeholder="Account Alias"
                        />
                    </Form.Item>
                    <Form.Item
                        name="bankID"
                        label="Bank"
                        rules={[{ required: true, message: 'Please select the bank!' }]}
                    >
                        <Select placeholder="Select a bank" className={
                            theme === 'light'
                                ? 'header-search-input-light'
                                : 'header-search-input-dark'
                        }>
                            {banks.map(bank => (
                                <Select.Option key={bank.bankID} value={bank.bankID}>
                                    {bank.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default BankAccountPopup;
