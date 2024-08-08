import React, { useEffect, useState } from 'react';
import { Drawer, Form, message, Typography, Select, Spin, Button, Alert, Tooltip, Switch } from 'antd';
import { handleErrors } from '../../../Utils/Utils';
import { themeState } from '../../../atom';
import { useRecoilState } from 'recoil';
import CustomInput from '../../../components/Input';
import { ADD_UPDATE_CATEGORY, GET_CATEGORY_BY_ID, GET_CATEGORY_GROUPS_LIST } from '../../../Utils/Apis';
import CustomCard from '../../../components/Card';
import { BsQuestionCircle } from 'react-icons/bs';

const CategoryFormDrawer = ({ visible, setVisible, type, selectedCategory, reload }) => {
    const [loading, setLoading] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false)
    const [form] = Form.useForm();
    const [theme] = useRecoilState(themeState)
    const [groups, setGroups] = useState([])
    const [isActive, setIsActive] = useState(false);
    const [isTracked, setIsTracked] = useState(false);

    useEffect(() => {
        if (visible) {
            callingCategoryGroupListAPI();
        }
    }, [visible])

    useEffect(() => {
        if (visible && type === "EDIT") {
            getCategoryByID();
        } else {
            form.resetFields();
        }
    }, [type, visible]);

    const getCategoryByID = async () => {
        setDrawerLoading(true);
        try {
            const response = await GET_CATEGORY_BY_ID(selectedCategory);
            if (response.isSuccess && response.data) {
                const data = response.data;
                setIsActive(data.isActive);
                setIsTracked(data.isTracked);
                form.setFieldsValue({
                    name: data.name,
                    groupID: data.groupID,
                });
            }
            setDrawerLoading(false);
        } catch (err) {
            setDrawerLoading(false);
            handleErrors("Fetching Category Data", err);
        }
    };

    const callingCategoryGroupListAPI = async () => {
        setDrawerLoading(true)
        try {
            let response = await GET_CATEGORY_GROUPS_LIST();
            if (response.isSuccess && response.data) {
                setGroups(response.data)
            } else {
                setGroups([])
            }
            setDrawerLoading(false);
        } catch (err) {
            setGroups([])
            setDrawerLoading(false);
        }
    }

    const handleOk = async () => {
        try {
            let values = await form.validateFields();
            let newValues = { ...values, "isTracked": isTracked, "isActive": isActive, "categoryID": type === "EDIT" ? selectedCategory : 0 }
            setLoading(true);
            try {
                await ADD_UPDATE_CATEGORY(newValues);
                setLoading(false);
                form.resetFields();
                handleCancel()
                reload()
                message.success(type === "EDIT" ? 'Category updated successfully' : 'Category added successfully');
            } catch (err) {
                setLoading(false);
                handleErrors(type === "EDIT" ? "Updating Category" : "Adding Category", err)
            }
        } catch (error) {
            message.error('There was an error submitting your data');
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <Drawer
            open={visible}
            width={450}
            closeIcon={null}
            onClose={handleCancel}
            title={
                <Typography.Title level={3} className="fw-500" style={{ marginTop: '10px' }}>
                    {type === "ADD" ? "Add Category" : "Update Category"}
                </Typography.Title>
            }
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleOk} type="primary" loading={loading}>
                        {type === "ADD" ? "Add Category" : "Update Category"}
                    </Button>
                </div>
            }
        >
            <Alert
                style={{ marginBottom: '10px' }}
                message="Use categories to organize your expenses and incomes. Without category you cannot manage the balance."
                type="info"
            />
            {drawerLoading ? (
                <Spin />
            ) : (
                <Form form={form} layout="vertical" name="category_form">
                    <CustomCard>
                        <Form.Item
                            name="name"
                            label="Category Name"
                            rules={[{ required: true, message: 'Please input the name!' }]}
                        >
                            <CustomInput placeholder="e.g. Food" />
                        </Form.Item>
                        <Form.Item
                            name="groupID"
                            label="Category Group"
                            rules={[{ required: true, message: 'Please select the group!' }]}
                        >
                            <Select
                                placeholder="e.g. Home Expenses"
                                className={theme === 'light' ? 'header-search-input-light' : 'header-search-input-dark'}
                            >
                                {groups.map(group => (
                                    <Select.Option key={group.categoryGroupID} value={group.categoryGroupID}>
                                        {group.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            style={{ height: '20px' }}
                            label={<span>
                                Category Properties
                                <Tooltip title="Category will inherit these properties.">
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
                                <Tooltip title="Category will treated as active, All the transaction will considered as active.">
                                    <BsQuestionCircle style={{ marginLeft: 8, marginTop: '4px', color: '#1890ff' }} />
                                </Tooltip>
                            </span>
                        </Form.Item>
                        <Form.Item
                            style={{ marginTop: '-20px' }}
                            name="isTracked"
                            valuePropName="checked"
                        >
                            <span style={{ display: 'inline-flex' }}>
                                <Switch checked={isTracked} onChange={(val) => setIsTracked(val)} /> <Typography.Title style={{ fontSize: '13px', marginLeft: '5px', marginTop: '3px', fontWeight: '300' }}>TREAT AS TRACKED</Typography.Title>
                                <Tooltip title="Category will treated as tracked, all the transactions will tracked.">
                                    <BsQuestionCircle style={{ marginLeft: 8, marginTop: '4px', color: '#1890ff' }} />
                                </Tooltip>
                            </span>
                        </Form.Item>
                    </CustomCard>
                </Form>
            )}
        </Drawer>
    );
};

export default CategoryFormDrawer;
