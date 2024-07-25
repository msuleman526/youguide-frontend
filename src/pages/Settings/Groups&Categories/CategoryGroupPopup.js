import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Typography, Spin, Select } from 'antd';
import CustomInput from '../../../components/Input';
import { ADD_UPDATE_CATEGORY_GROUP, GET_CATEGORY_GROUP_BY_ID, GET_SECTIONS_LIST } from '../../../Utils/Apis';
import { handleErrors } from '../../../Utils/Utils';
import { useRecoilState } from 'recoil';
import { themeState } from '../../../atom';

const CategoryGroupPopup = ({ visible, setVisible, type, selectedGroup, reload }) => {
    const [theme, setTheme] = useRecoilState(themeState)
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [modalLoading, setModalLoading] = useState(false);
    const [sections, setSections] = useState([])

    useEffect(() => {
        if (visible && type === "EDIT") {
            getGroupByID();
        } else {
            form.resetFields();
        }
    }, [type, visible]);

    useEffect(() => {
        if (visible) callingSectionsListAPI()
    }, [visible])

    const callingSectionsListAPI = async () => {
        setModalLoading(true)
        try {
            let response = await GET_SECTIONS_LIST();
            if (response.isSuccess && response.data) {
                setSections(response.data)
            } else {
                setSections([])
            }
            setModalLoading(false);
        } catch (err) {
            setSections([])
            setModalLoading(false);
        }
    }

    const getGroupByID = async () => {
        setModalLoading(true);
        try {
            const response = await GET_CATEGORY_GROUP_BY_ID(selectedGroup);
            if (response.isSuccess && response.data) {
                const { name, sectionID } = response.data;
                form.setFieldsValue({
                    name: name,
                    sectionID: sectionID,
                });
            }
            setModalLoading(false);
        } catch (err) {
            setModalLoading(false);
            handleErrors("Fetching Category Group Data", err);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const data = { ...values, "isActive": true, "isTracked": true, "categoryGroupID": type === "EDIT" ? selectedGroup : 0 }
            console.log(data, selectedGroup)
            await ADD_UPDATE_CATEGORY_GROUP(data);
            message.success(type === "ADD" ? "Category group added successfully" : 'Category group updated successfully');
            form.resetFields();
            setLoading(false);
            setVisible(false);
            reload();
        } catch (err) {
            console.log(err)
            setLoading(false);
            handleErrors(type === "ADD" ? "Adding Category group" : "Editing Category group", err);
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
                title={<Typography.Title level={3} className="fw-500">{type === "ADD" ? "Add Category Group" : "Edit Category Group"}</Typography.Title>}
                onOk={handleOk}
                okText={type === "ADD" ? "Add" : "Update"}
                onCancel={handleCancel}
                confirmLoading={loading}
            >{modalLoading ? <Spin /> :
                <Form form={form} layout="vertical" name="group_form">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <CustomInput placeholder="Category Group Name" />
                    </Form.Item>
                    <Form.Item
                        name="sectionID"
                        label="Category Section"
                        rules={[{ required: true, message: 'Please select the section!' }]}
                    >
                        <Select placeholder="Select a section" className={
                            theme === 'light'
                                ? 'header-search-input-light'
                                : 'header-search-input-dark'
                        }>
                            {sections.map(section => (
                                <Select.Option key={section.categorySectionID} value={section.categorySectionID}>
                                    {section.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>}
            </Modal>
        </>
    );
};

export default CategoryGroupPopup;
