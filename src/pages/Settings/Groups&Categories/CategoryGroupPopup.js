import React, { useEffect, useState } from 'react';
import { Drawer, Form, message, Typography, Spin, Select, Button, Alert, Card, Tooltip, Switch } from 'antd';
import { BsQuestionCircle } from 'react-icons/bs';
import CustomInput from '../../../components/Input';
import { ADD_UPDATE_CATEGORY_GROUP, GET_CATEGORY_GROUP_BY_ID, GET_SECTIONS_LIST } from '../../../Utils/Apis';
import { handleErrors } from '../../../Utils/Utils';
import { useRecoilState } from 'recoil';
import { themeState } from '../../../atom';

const CategoryGroupDrawer = ({ visible, setVisible, type, selectedGroup, reload }) => {
    const [theme] = useRecoilState(themeState);
    const [loading, setLoading] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [sections, setSections] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (type === "EDIT") {
                getGroupByID();
            } else {
                form.resetFields();
            }
            callingSectionsListAPI();
        }
    }, [type, visible]);

    const callingSectionsListAPI = async () => {
        setDrawerLoading(true);
        try {
            const response = await GET_SECTIONS_LIST();
            if (response.isSuccess && response.data) {
                setSections(response.data);
            } else {
                setSections([]);
            }
        } catch (err) {
            handleErrors("Fetching Sections List", err);
            setSections([]);
        } finally {
            setDrawerLoading(false);
        }
    };

    const getGroupByID = async () => {
        setDrawerLoading(true);
        try {
            const response = await GET_CATEGORY_GROUP_BY_ID(selectedGroup);
            if (response.isSuccess && response.data) {
                const { name, sectionID } = response.data;
                form.setFieldsValue({ name, sectionID });
            }
        } catch (err) {
            handleErrors("Fetching Category Group Data", err);
        } finally {
            setDrawerLoading(false);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const data = { ...values, isActive: true, isTracked: true, categoryGroupID: type === "EDIT" ? selectedGroup : 0 };
            await ADD_UPDATE_CATEGORY_GROUP(data);
            message.success(type === "ADD" ? "Category group added successfully" : "Category group updated successfully");
            form.resetFields();
            setVisible(false);
            reload();
        } catch (err) {
            handleErrors(type === "ADD" ? "Adding Category Group" : "Editing Category Group", err);
        } finally {
            setLoading(false);
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
                <Typography.Title level={3} className="fw-500" style={{ marginTop: '10px', marginLeft: '-25px' }}>
                    {type === "ADD" ? "Add Category Group" : "Edit Category Group"}
                </Typography.Title>
            }
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleOk} type="primary" loading={loading}>
                        {type === "ADD" ? "Add Group" : "Update Group"}
                    </Button>
                </div>
            }
        >
            <Alert
                style={{ marginBottom: '10px' }}
                message="Use groups to organize your categories. You cannot set a transaction's category to be a category group."
                type="info"
            />
            {drawerLoading ? (
                <Spin />
            ) : (
                <Form form={form} layout="vertical" name="group_form">
                    <Card>
                        <Form.Item
                            name="name"
                            label="Category Group Name"
                            rules={[{ required: true, message: 'Please input the name!' }]}
                        >
                            <CustomInput placeholder="e.g. Food" />
                        </Form.Item>
                        <Form.Item
                            name="sectionID"
                            label="Category Group Section"
                            rules={[{ required: true, message: 'Please select the section!' }]}
                        >
                            <Select
                                placeholder="e.g. Expense"
                                className={theme === 'light' ? 'header-search-input-light' : 'header-search-input-dark'}
                            >
                                {sections.map(section => (
                                    <Select.Option key={section.categorySectionID} value={section.categorySectionID}>
                                        {section.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <label htmlFor="group_form_label">
                            <span>
                                Category Group Properties
                                <Tooltip title="Category group will inherit these properties.">
                                    <BsQuestionCircle style={{ marginLeft: 8, color: '#1890ff' }} />
                                </Tooltip>
                            </span>
                        </label>
                        <Form.Item
                            style={{ marginTop: '5px' }}
                            name="isActive"
                            valuePropName="checked"
                        >
                            <span>
                                <Switch /> <span style={{ fontSize: '13px', marginLeft: '5px' }}>Treat as Active</span>
                            </span>
                        </Form.Item>
                        <Form.Item
                            style={{ marginTop: '-20px' }}
                            name="isTracked"
                            valuePropName="checked"
                        >
                            <span>
                                <Switch /> <span style={{ fontSize: '13px', marginLeft: '5px' }}>Treat as Tracked</span>
                            </span>
                        </Form.Item>
                    </Card>
                </Form>
            )}
        </Drawer>
    );
};

export default CategoryGroupDrawer;
