import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Typography, Select, Spin } from 'antd';
import { handleErrors } from '../../../Utils/Utils';
import { themeState } from '../../../atom';
import { useRecoilState } from 'recoil';
import CustomInput from '../../../components/Input';
import { ADD_UPDATE_CATEGORY, GET_CATEGORY_BY_ID, GET_CATEGORY_GROUPS_LIST } from '../../../Utils/Apis';

const CategoryFormPopup = ({ visible, setVisible, type, selectedCategory, reload }) => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false)
    const [form] = Form.useForm();
    const [theme, setTheme] = useRecoilState(themeState)
    const [modalLoading, setModalLoading] = useState(false)
    const [groups, setGroups] = useState([])

    useEffect(() => {
        if (visible) callingCategoryGroupListAPI()
    }, [visible])

    useEffect(() => {
        if (visible && type === "EDIT") {
            getCategoryByID();
        } else {
            form.resetFields();
        }
    }, [type, visible]);


    const getCategoryByID = async () => {
        setModalLoading(true);
        try {
            const response = await GET_CATEGORY_BY_ID(selectedCategory);
            if (response.isSuccess && response.data) {
                const data = response.data;
                form.setFieldsValue({
                    name: data.name,
                    groupID: data.groupID,
                });
            }
            setModalLoading(false);
        } catch (err) {
            setModalLoading(false);
            handleErrors("Fetching Category Data", err);
        }
    };

    const callingCategoryGroupListAPI = async () => {
        setFormLoading(true)
        try {
            let response = await GET_CATEGORY_GROUPS_LIST();
            if (response.isSuccess && response.data) {
                setGroups(response.data)
            } else {
                setGroups([])
            }
            setFormLoading(false);
        } catch (err) {
            setGroups([])
            setFormLoading(false);
        }
    }

    const handleOk = async () => {
        try {
            let values = await form.validateFields();
            let newValues = { ...values, "isTracked": true, "isActive": true, "categoryID": type === "EDIT" ? selectedCategory : 0 }
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
        <>
            <Modal
                open={visible}
                width={450}
                height={360}
                loading={formLoading}
                title={<Typography level={3} className="fw-500">{type === "ADD" ? "Add Category" : "Edit Category"}</Typography>}
                onOk={handleOk}
                okText={type === "ADD" ? "Add" : "Update"}
                onCancel={handleCancel}
                confirmLoading={loading}
            >{modalLoading ? <Spin /> :
                <Form form={form} layout="vertical" name="alied_bank_form">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <CustomInput
                            placeholder="Category Name"
                        />
                    </Form.Item>
                    <Form.Item
                        name="groupID"
                        label="Category Group"
                        rules={[{ required: true, message: 'Please select the group!' }]}
                    >
                        <Select placeholder="Select a group" className={
                            theme === 'light'
                                ? 'header-search-input-light'
                                : 'header-search-input-dark'
                        }>
                            {groups.map(group => (
                                <Select.Option key={group.categoryGroupID} value={group.categoryGroupID}>
                                    {group.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>}
            </Modal>
        </>
    );
};

export default CategoryFormPopup;
