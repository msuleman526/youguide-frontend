import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form, Upload, message, Typography, Select, Spin, Alert, Tooltip, Switch } from 'antd';
import { handleErrors } from '../../../Utils/Utils';
import { themeState } from '../../../atom';
import { useRecoilState } from 'recoil';
import CustomInput from '../../../components/Input';
import { ADD_UPDATE_BANK_ACCOUNT, GET_BANK_ACCOUNT_BY_ID, GET_BANK_LIST } from '../../../Utils/Apis';
import CustomCard from '../../../components/Card';
import { BsQuestionCircle } from 'react-icons/bs';

const BankAccountPopup = ({ visible, setVisible, type, selectedBankAccount, reload }) => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [form] = Form.useForm();
    const [theme, setTheme] = useRecoilState(themeState);
    const [modalLoading, setModalLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (visible) callingBanksListAPI();
    }, [visible]);

    useEffect(() => {
        if (visible && type === "EDIT") {
            getBankAccountByID();
        } else {
            form.resetFields();
        }
    }, [type, visible]);

    const getBankAccountByID = async () => {
        setModalLoading(true);
        try {
            const response = await GET_BANK_ACCOUNT_BY_ID(selectedBankAccount);
            if (response.isSuccess && response.data) {
                const data = response.data;
                setIsActive(data.isActive);
                form.setFieldsValue({
                    name: data.name,
                    accountAliase: data.accountAliase,
                    bankID: data.bankID
                });
            }
            setModalLoading(false);
        } catch (err) {
            setModalLoading(false);
            handleErrors("Fetching Bank Data", err);
        }
    };

    const callingBanksListAPI = async () => {
        setFormLoading(true);
        try {
            let response = await GET_BANK_LIST();
            if (response.isSuccess && response.data) {
                setBanks(response.data);
            } else {
                setBanks([]);
            }
            setFormLoading(false);
        } catch (err) {
            setBanks([]);
            setFormLoading(false);
        }
    };

    const handleOk = async () => {
        try {
            let values = await form.validateFields();
            let newValues = { ...values, isActive: isActive, ...(type === "EDIT" && { bankAccountID: selectedBankAccount }) };
            setLoading(true);
            try {
                await ADD_UPDATE_BANK_ACCOUNT(newValues);
                setLoading(false);
                form.resetFields();
                handleCancel();
                reload();
                message.success(type === "EDIT" ? 'Bank account updated successfully' : 'Bank account added successfully');
            } catch (err) {
                setLoading(false);
                handleErrors(type === "EDIT" ? "Updating Bank" : "Adding Bank", err);
            }
        } catch (error) {
            message.error('There was an error submitting your data');
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Drawer
                visible={visible}
                closeIcon=""
                width={450}
                onClose={handleCancel}
                title={<Typography level={3} className="fw-500">{type === "ADD" ? "Add Bank Account" : "Edit Bank Account"}</Typography>}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleOk} type="primary" loading={loading}>
                            {type === "ADD" ? "Add Account" : "Update Account"}
                        </Button>
                    </div>
                }
            >
                <Alert
                    style={{ marginBottom: '10px' }}
                    message="For manually-managed assets, you may add transactions manually or use our CSV import feature, accessible via the Upload Transactions page."
                    type="info"
                />
                {modalLoading ? <Spin /> :
                    <Form form={form} layout="vertical" name="alied_bank_form">
                        <CustomCard>
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
                            <Form.Item
                                style={{ height: '20px' }}
                                label={<span>
                                    Bank Account Properties
                                    <Tooltip title="Bank Account will inherit these properties.">
                                        <BsQuestionCircle style={{ marginLeft: 8, color: '#1890ff' }} />
                                    </Tooltip>
                                </span>}
                                valuePropName="checked" />
                            <Form.Item
                                name="isActive"
                                valuePropName="checked"
                            >
                                <span style={{ display: 'inline-flex' }}>
                                    <Switch checked={isActive} onChange={(val) => setIsActive(val)} /> <Typography.Title style={{ fontSize: '13px', marginLeft: '5px', marginTop: '3px', fontWeight: '300' }}>TREAT AS ACTIVE</Typography.Title>
                                    <Tooltip title="Bank Account will treated as active, All the transaction will considered as active.">
                                        <BsQuestionCircle style={{ marginLeft: 8, marginTop: '4px', color: '#1890ff' }} />
                                    </Tooltip>
                                </span>
                            </Form.Item>
                        </CustomCard>
                    </Form>
                }
            </Drawer>
        </>
    );
};

export default BankAccountPopup;
