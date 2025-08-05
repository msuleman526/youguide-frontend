import { Button, Form, Input, Modal, DatePicker, InputNumber, Switch, Select, Upload, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
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

    useEffect(() => {
        if (affiliate) {
            form.setFieldsValue({
                ...affiliate,
                subscriptionEndDate: moment(affiliate.subscriptionEndDate),
            });
        } else {
            form.resetFields();
        }
    }, [affiliate]);

    useEffect(() => {
        ApiService.getAllUsers()
            .then((response) => {
                setUsers(response);
                setTableLoading(false);
            })
            .catch((error) => {
                setTableLoading(false);
                setUsers([]);
            });
    }, []);

    const handleFinish = (values) => {
        const formData = new FormData();
        setLoading(true);
        if (values.image) {
            formData.append('logo', values.image.file);
        }
        if (isLogin) {
            formData.append('userId', values.userId);
        }
        console.log("Categories:", categories);
        formData.append('affiliateName', values.affiliateName);
        formData.append('primaryColor', values.primaryColor);
        formData.append('subscriptionEndDate', values.subscriptionEndDate);
        formData.append('numberOfClicks', values.numberOfClicks);
        formData.append('categories', JSON.stringify(values.categories));
        formData.append('isLogin', isLogin);
        console.log("Form Data:", formData);

        let response = ApiService.saveAffiliateSubscription(formData).then((response) => {
            console.log("Affiliate saved successfully", response);
            message.success("Affiliate saved successfully");
            setLoading(false);
            onSaveAffiliate();
            form.resetFields();
            setLogoFile(null);
        }).catch((error) => {
            console.error("Error saving affiliate:", error);
            message.error("Error saving affiliate:", error);
            setLoading(false);
        });
    };

    return (
        <Modal
            title={`${type} Affiliate`}
            open={open}
            confirmLoading={loading}
            onCancel={() => setOpen(false)}
            onOk={() => form.submit()}
            okText={type === 'Edit' ? 'Update' : 'Create'}
        >
            <Form layout="vertical" form={form} onFinish={handleFinish}>
                <Form.Item
                    label="Affiliate Name"
                    name="affiliateName"
                    rules={[{ required: true, message: 'Please enter affiliate name' }]}
                >
                    <Input />
                </Form.Item>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            name="image"
                            label="Affliate Logo"
                            rules={[{ required: true, message: 'Image is required' }]}
                            valuePropName="file"
                            getValueFromEvent={e => e}
                        >
                            <Upload maxCount={1} beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Primary Color" name="primaryColor">
                            <Input type="color" defaultValue="#3498db" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Subscription End Date"
                    name="subscriptionEndDate"
                    rules={[{ required: true, message: 'Please select end date' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Number of Clicks"
                    name="numberOfClicks"
                    rules={[{ required: true, message: 'Please enter number of clicks' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item label="Login Enabled" name="isLogin" valuePropName="checked" initialValue={false}>
                    <Switch onChange={(checked) => setIsLogin(checked)} />
                </Form.Item>

                {isLogin && (
                    <Form.Item label="Select User" name="userId" rules={[{ required: false, message: 'Please select user' }]}>
                        <Select placeholder="Select a user">
                            {users.map((user) => (
                                <Option key={user._id} value={user._id}>
                                    {user.firstName + ' ' + user.lastName + ' - ' + user.email}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
                <Form.Item
                    label="Categories"
                    name="categories"
                    rules={[{ required: true, message: 'Please select at least one category' }]}
                >
                    <Select mode="multiple" style={{ width: '100%' }} options={categories.map((c) => ({ label: c.name, value: c._id }))} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AffiliatePopup;
