import { Button, Form, Input, Modal, DatePicker, InputNumber, Switch, Select, Upload, Row, Col, message, Divider, Typography } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import moment from 'moment';

const { Option } = Select;

const AffiliatePopup = ({ open, setOpen, onSaveAffiliate, affiliate, type, categories }) => {
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [existingAffiliate, setExistingAffiliate] = useState(null);
    const [pendingFormData, setPendingFormData] = useState(null);

    useEffect(() => {
        if (affiliate) {
            // Convert categories to array of IDs if they are objects
            const categoryIds = (affiliate.categories || []).map(cat =>
                typeof cat === 'object' ? cat._id : cat
            );
            // Get userId if it's an object
            const userId = affiliate.userId?._id || affiliate.userId;

            form.setFieldsValue({
                ...affiliate,
                subscriptionEndDate: moment(affiliate.subscriptionEndDate),
                categories: categoryIds,
                userId: userId,
                allow_token: affiliate.allow_token || 1,
                initial_api_quota: affiliate.initial_api_quota,
                quota_end_date: affiliate.quota_end_date ? moment(affiliate.quota_end_date) : null,
                quota_packages: affiliate.quota_packages || [],
            });
            setIsLogin(affiliate.isLogin || false);
        } else {
            form.resetFields();
            setIsLogin(false);
        }
    }, [affiliate, form]);

    useEffect(() => {
        ApiService.getAllUsers()
            .then((response) => {
                // Filter users to only show affiliates (where role.slug === 'affiliate')
                const affiliateUsers = (response || []).filter(user =>
                    user.role?.slug === 'affiliate'
                );
                setUsers(affiliateUsers);
                setTableLoading(false);
            })
            .catch((error) => {
                setTableLoading(false);
                setUsers([]);
            });
    }, []);

    const buildFormData = (values) => {
        const formData = new FormData();

        // Only append logo if a new image is uploaded
        if (values.image?.file) {
            formData.append('logo', values.image.file);
        }

        if (isLogin) {
            if (values.userId) formData.append('userId', values.userId);
            formData.append('initial_api_quota', values.initial_api_quota || 0);
            formData.append('allow_token', values.allow_token || 1);
            formData.append('quota_end_date', values.quota_end_date);
            formData.append('quota_packages', JSON.stringify(values.quota_packages || []));
        }

        formData.append('affiliateName', values.affiliateName);
        formData.append('primaryColor', values.primaryColor);
        formData.append('subscriptionEndDate', values.subscriptionEndDate);
        formData.append('numberOfClicks', values.numberOfClicks);
        formData.append('categories', JSON.stringify(values.categories));
        formData.append('isLogin', isLogin);

        return formData;
    };

    const saveAffiliate = async (formData) => {
        try {
            if (type === 'Edit' && affiliate?._id) {
                await ApiService.updateAffiliateSubscription(affiliate._id, formData);
                message.success("Affiliate updated successfully");
            } else {
                await ApiService.saveAffiliateSubscription(formData);
                message.success("Affiliate saved successfully");
            }
            setLoading(false);
            onSaveAffiliate();
            form.resetFields();
            setLogoFile(null);
            setIsLogin(false);
            setConfirmModalVisible(false);
            setPendingFormData(null);
            setExistingAffiliate(null);
        } catch (error) {
            console.error("Error saving affiliate:", error);
            message.error(error?.response?.data?.message || "Error saving affiliate");
            setLoading(false);
        }
    };

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = buildFormData(values);

        // Check if user is selected and isLogin is enabled
        if (isLogin && values.userId) {
            try {
                const existingAff = await ApiService.getAffiliateByUserId(values.userId);

                if (existingAff) {
                    // In edit mode, if the existing affiliate is the same as the one being edited, proceed
                    if (type === 'Edit' && affiliate?._id === existingAff._id) {
                        await saveAffiliate(formData);
                    } else {
                        // User is attached to another affiliate, show confirmation
                        setExistingAffiliate(existingAff);
                        setPendingFormData(formData);
                        setConfirmModalVisible(true);
                        setLoading(false);
                    }
                } else {
                    // User is not attached to any affiliate, proceed
                    await saveAffiliate(formData);
                }
            } catch (error) {
                console.error("Error checking user affiliate:", error);
                message.error("Error checking user affiliate");
                setLoading(false);
            }
        } else {
            // No user selected or login not enabled, proceed directly
            await saveAffiliate(formData);
        }
    };

    const handleConfirmRemoveAndCreate = async () => {
        setLoading(true);
        setConfirmModalVisible(false);
        await saveAffiliate(pendingFormData);
    };

    const handleCancelConfirm = () => {
        setConfirmModalVisible(false);
        setPendingFormData(null);
        setExistingAffiliate(null);
    };

    return (
        <Modal
            title={`${type} Affiliate`}
            open={open}
            confirmLoading={loading}
            onCancel={() => setOpen(false)}
            onOk={() => form.submit()}
            okText={type === 'Edit' ? 'Update' : 'Create'}
            width={800}
        >
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Affiliate website and clients setting.
            </Typography.Text>
            <Form layout="vertical" form={form} onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Affiliate Name"
                            name="affiliateName"
                            rules={[{ required: true, message: 'Please enter affiliate name' }]}
                        >
                            <Input placeholder="Enter affiliate name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="image"
                            label="Affiliate Logo"
                            rules={[{ required: type !== 'Edit', message: 'Image is required' }]}
                            valuePropName="file"
                            getValueFromEvent={e => e}
                        >
                            <Upload maxCount={1} beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>
                                    {type === 'Edit' ? 'Change Image' : 'Upload Image'}
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Primary Color" name="primaryColor">
                            <Input type="color" defaultValue="#3498db" style={{ width: '100%', height: 32 }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Admin Panel End Date"
                            name="subscriptionEndDate"
                            rules={[{ required: true, message: 'Please select end date' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Number of Clicks"
                            name="numberOfClicks"
                            rules={[{ required: true, message: 'Please enter number of clicks' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter clicks" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Login Enabled" name="isLogin" valuePropName="checked" initialValue={false}>
                            <Switch onChange={(checked) => setIsLogin(checked)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Categories"
                            name="categories"
                            rules={[{ required: true, message: 'Please select at least one category' }]}
                        >
                            <Select mode="multiple" style={{ width: '100%' }} placeholder="Select categories" options={categories.map((c) => ({ label: c.name, value: c._id }))} />
                        </Form.Item>
                    </Col>
                </Row>

                {isLogin && (
                    <>
                        <Divider>API Access Settings</Divider>

                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item label="Select User" name="userId" rules={[{ required: false, message: 'Please select user' }]}>
                                    <Select placeholder="Select a user" showSearch filterOption={(input, option) =>
                                        (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                                    }>
                                        {users.map((user) => (
                                            <Option key={user._id} value={user._id}>
                                                {user.firstName + ' ' + user.lastName + ' - ' + user.email}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Initial Quota"
                                    name="initial_api_quota"
                                    rules={[{ required: true, message: 'Please enter initial quota' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter initial quota" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Allow Token"
                                    name="allow_token"
                                    initialValue={1}
                                    rules={[{ required: true, message: 'Please enter allow token' }]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={1} placeholder="Allow token" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="API Access End Date"
                                    name="quota_end_date"
                                    rules={[{ required: true, message: 'Please select end date' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.List name="quota_packages">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row key={key} gutter={16} align="middle">
                                            <Col span={11}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quota_amount']}
                                                    label={key === 0 ? 'Quota Amount' : ''}
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <InputNumber style={{ width: '100%' }} min={1} placeholder="Quota" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={11}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    label={key === 0 ? 'Price' : ''}
                                                    rules={[{ required: true, message: 'Required' }]}
                                                >
                                                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Price" prefix="€" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                                <MinusCircleOutlined
                                                    style={{ color: 'red', fontSize: 18, marginTop: key === 0 ? 8 : -24 }}
                                                    onClick={() => remove(name)}
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Quota Package
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </>
                )}
            </Form>

            {/* Confirmation Modal for existing user */}
            <Modal
                title="User Already Attached"
                open={confirmModalVisible}
                onCancel={handleCancelConfirm}
                footer={[
                    <Button key="cancel" onClick={handleCancelConfirm}>
                        Cancel
                    </Button>,
                    <Button
                        key="confirm"
                        type="primary"
                        danger
                        loading={loading}
                        onClick={handleConfirmRemoveAndCreate}
                    >
                        {type === 'Edit' ? 'Remove & Update' : 'Remove & Create'}
                    </Button>,
                ]}
            >
                <p>
                    This user is already attached with another affiliate dashboard:
                    <strong> {existingAffiliate?.affiliateName}</strong>
                </p>
                <p>
                    Do you want to remove the user from the existing affiliate and {type === 'Edit' ? 'update' : 'create'} this one?
                </p>
            </Modal>
        </Modal>
    );
};

export default AffiliatePopup;
