import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Popover, Drawer, Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Card, Statistic, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons';
import { PieChart } from '@mui/x-charts';
import ApiService from '../../APIServices/ApiService';
import moment from 'moment';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';

const { Option } = Select;
const { Title, Text } = Typography;

const ApiAccessList = () => {
    const theme = useRecoilValue(themeState);
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [statsDrawerVisible, setStatsDrawerVisible] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [affiliates, setAffiliates] = useState([]);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        fetchTokens();
        fetchCategories();
        fetchAffiliates();
    }, []);

    const fetchTokens = async (page = 1, pageSize = 20) => {
        try {
            setLoading(true);
            const response = await ApiService.getAllApiAccessTokens(page, pageSize);
            if (response.success) {
                setTokens(response.data || []);
                setPagination({
                    current: response.pagination?.page || 1,
                    pageSize: response.pagination?.limit || 20,
                    total: response.pagination?.total || 0,
                });
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            message.error('Failed to fetch API tokens');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await ApiService.getAllCategories();
            setCategories(response || []);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchAffiliates = async () => {
        try {
            const response = await ApiService.getAllUsers();
            // Filter users to only show affiliates (where role.slug === 'affiliate')
            const affiliateUsers = (response || []).filter(user =>
                user.role?.slug === 'affiliate'
            );
            setAffiliates(affiliateUsers);
        } catch (error) {
            console.error('Failed to fetch affiliates');
        }
    };

    const handleTableChange = (newPagination) => {
        fetchTokens(newPagination.current, newPagination.pageSize);
    };

    const handleAdd = () => {
        form.resetFields();
        setAddModalVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedToken(record);
        editForm.setFieldsValue({
            ...record,
            end_date: moment(record.end_date),
            categories: record.categories?.map(cat => cat._id || cat),
        });
        setEditModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await ApiService.deleteApiAccessToken(id);
            message.success('Token deleted successfully');
            fetchTokens(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error('Failed to delete token');
        }
    };

    const handleViewStats = async (record) => {
        try {
            setSelectedToken(record);
            setStatsDrawerVisible(true);
            const response = await ApiService.getApiAccessTokenStats(record._id);
            if (response.success) {
                setStatsData(response.data);
            }
        } catch (error) {
            message.error('Failed to fetch stats');
        }
    };

    const handleStatusChange = async (record, newStatus) => {
        try {
            let data = { is_active: newStatus };
            await ApiService.updateAffiliateApiAccessToken(record._id, data);
            message.success(`Token ${newStatus ? 'activated' : 'deactivated'} successfully`);
            fetchTokens(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error('Failed to update status');
        }
    };

    const handleAddSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                company_name: values.company_name,
                type: values.type,
                payment_type: values.payment_type,
                allowed_travel_guides: values.allowed_travel_guides,
                end_date: values.end_date.format('YYYY-MM-DD'),
                categories: values.categories,
                is_active: true,
            };

            // Only add user_id if it's selected
            if (values.user_id) {
                payload.user_id = values.user_id;
            }

            // Only add email if it's provided
            if (values.email) {
                payload.email = values.email;
            }

            console.log('Submitting payload:', payload); // Debug log

            await ApiService.createApiAccessToken(payload);
            message.success('Token created successfully');
            setAddModalVisible(false);
            form.resetFields();
            fetchTokens(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to create token');
        }
    };

    const handleEditSubmit = async (values) => {
        try {
            const payload = {
                name: values.name,
                company_name: values.company_name,
                end_date: values.end_date.format('YYYY-MM-DD'),
                allowed_travel_guides: values.allowed_travel_guides,
                categories: values.categories,
            };
            await ApiService.updateApiAccessToken(selectedToken._id, payload);
            message.success('Token updated successfully');
            setEditModalVisible(false);
            editForm.resetFields();
            fetchTokens(pagination.current, pagination.pageSize);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to update token');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: 'Affiliate',
            dataIndex: 'user_id',
            key: 'user_id',
            width: 150,
            render: (user) => (
                <Space>
                    {(user == null) ? "" : <UserOutlined style={{ color: '#1890ff' }} />}
                    {(user == null) ? <Text style={{ color: "red" }}>N/A</Text> : <Text ellipsis>{user.firstName} {user.lastName}</Text>}
                </Space>
            ),

        },
        {
            title: 'Token',
            dataIndex: 'token',
            key: 'token',
            width: 200,
            ellipsis: true,
            render: (text) => (
                <Space>
                    <Text ellipsis style={{ maxWidth: 150 }}>{text}</Text>
                    <CopyOutlined
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                        onClick={() => {
                            navigator.clipboard.writeText(text);
                            message.success('Token copied to clipboard!');
                        }}
                    />
                </Space>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type) => <Tag color="blue">{type}</Tag>,
        },
        {
            title: 'Payment Type',
            dataIndex: 'payment_type',
            key: 'payment_type',
            width: 120,
            render: (type) => <Tag color={type === 'free' ? 'green' : 'orange'}>{type}</Tag>,
        },
        {
            title: 'Quota',
            dataIndex: 'allowed_travel_guides',
            key: 'allowed_travel_guides',
            width: 80,
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            width: 120,
            render: (date) => moment(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            render: (_, record) => {
                const isActive = record.is_active !== false;
                const statusContent = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Button
                            type={isActive ? 'primary' : 'default'}
                            size="small"
                            onClick={() => handleStatusChange(record, true)}
                            style={{ width: '100%' }}
                        >
                            Active
                        </Button>
                        <Button
                            type={!isActive ? 'primary' : 'default'}
                            danger={!isActive}
                            size="small"
                            onClick={() => handleStatusChange(record, false)}
                            style={{ width: '100%' }}
                        >
                            Inactive
                        </Button>
                    </div>
                );
                return (
                    <Popover content={statusContent} title="Change Status" trigger="click">
                        <Tag color={isActive ? 'green' : 'red'} style={{ cursor: 'pointer' }}>
                            {isActive ? 'Active' : 'Inactive'}
                        </Tag>
                    </Popover>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<BarChartOutlined />}
                        onClick={() => handleViewStats(record)}
                    >
                        Stats
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this token?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2}>API Access Tokens</Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add New API Access
                    </Button>
                </Col>
            </Row>

            <CustomCard theme={theme}>
                <Table
                    columns={columns}
                    dataSource={tokens}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showTotal: (total) => `Total ${total} tokens`,
                        showSizeChanger: true,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1400 }}
                />
            </CustomCard>

            {/* Add Modal */}
            <Modal
                title="Create New API Access Token"
                open={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter name' }]}
                            >
                                <Input placeholder="Client contact name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Company Name"
                                name="company_name"
                                rules={[{ required: true, message: 'Please enter company name' }]}
                            >
                                <Input placeholder="Company name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Type"
                                name="type"
                                rules={[{ required: true, message: 'Please select type' }]}
                            >
                                <Select placeholder="Select type">
                                    <Option value="pdf">PDF</Option>
                                    <Option value="html_json">HTML/JSON</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Payment Type"
                                name="payment_type"
                                rules={[{ required: true, message: 'Please select payment type' }]}
                            >
                                <Select placeholder="Select payment type">
                                    <Option value="free">Free</Option>
                                    <Option value="paid">Paid</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Allowed Travel Guides"
                                name="allowed_travel_guides"
                                rules={[{ required: true, message: 'Please enter quota' }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="Quota" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="End Date"
                                name="end_date"
                                rules={[{ required: true, message: 'Please select end date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Categories"
                        name="categories"
                        rules={[{ required: true, message: 'Please select at least one category' }]}
                    >
                        <Select mode="multiple" placeholder="Select categories">
                            {categories.map(cat => (
                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Affiliate User"
                                name="user_id"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value || getFieldValue('email')) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Please select an affiliate user or enter an email'));
                                        },
                                    }),
                                ]}
                            >
                                <Select
                                    placeholder="Select an affiliate user"
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                                    }
                                    onChange={() => form.validateFields(['email'])}
                                >
                                    {affiliates.map(affiliate => (
                                        <Option key={affiliate._id} value={affiliate._id}>
                                            {affiliate.firstName} {affiliate.lastName} ({affiliate.email})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { type: 'email', message: 'Please enter a valid email' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value || getFieldValue('user_id')) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Please enter an email or select an affiliate user'));
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    placeholder="Enter email address"
                                    onChange={() => form.validateFields(['user_id'])}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Text type="secondary" style={{ display: 'block', marginTop: -16, marginBottom: 16 }}>
                        * Either Affiliate User or Email is required
                    </Text>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Create Token
                            </Button>
                            <Button onClick={() => setAddModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Edit API Access Token"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Company Name"
                                name="company_name"
                                rules={[{ required: true, message: 'Please enter company name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Allowed Travel Guides"
                                name="allowed_travel_guides"
                                rules={[{ required: true, message: 'Please enter quota' }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="End Date"
                                name="end_date"
                                rules={[{ required: true, message: 'Please select end date' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Categories"
                        name="categories"
                        rules={[{ required: true, message: 'Please select at least one category' }]}
                    >
                        <Select mode="multiple" placeholder="Select categories">
                            {categories.map(cat => (
                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Update Token
                            </Button>
                            <Button onClick={() => setEditModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Stats Drawer */}
            <Drawer
                title={`Statistics - ${selectedToken?.name}`}
                placement="right"
                width={600}
                onClose={() => setStatsDrawerVisible(false)}
                open={statsDrawerVisible}
            >
                {statsData && (
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Total Accesses"
                                        value={statsData.usage?.total_accesses || 0}
                                        valueStyle={{ color: '#3f8600' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Unique Guides"
                                        value={statsData.usage?.unique_guides_accessed || 0}
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic
                                        title="Remaining Quota"
                                        value={statsData.usage?.remaining_quota || 0}
                                        valueStyle={{ color: '#cf1322' }}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Access Type Breakdown" style={{ marginTop: 16 }}>
                            <PieChart
                                series={[{
                                    data: (statsData.graphs?.access_type_breakdown || []).map((item, index) => ({
                                        id: index,
                                        value: item.count,
                                        label: item.type
                                    })),
                                }]}
                                height={250}
                            />
                        </Card>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default ApiAccessList;
