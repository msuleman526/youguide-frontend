import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Modal, Form, Input, Select, DatePicker, InputNumber, Row, Col, Typography, Divider, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, CopyOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useParams } from 'react-router-dom';
import StatsDrawer from '../ApiAccess/StatsDrawer';
import PageTourWrapper from '../../components/PageTourWrapper';
import { TOUR_PAGES } from '../../Utils/TourConfig';

const { Option } = Select;
const { Title, Text } = Typography;

const AffiliateApiAccessList = () => {
    const theme = useRecoilValue(themeState);
    const { affiliateId } = useParams();
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [statsDrawerVisible, setStatsDrawerVisible] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [affiliateUser, setAffiliateUser] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    // Quota and Token states
    const [quotaDetails, setQuotaDetails] = useState(null);
    const [tokenSummary, setTokenSummary] = useState(null);
    const [affiliateDetails, setAffiliateDetails] = useState(null);
    const [quotaLoading, setQuotaLoading] = useState(false);
    const [createQuotaValue, setCreateQuotaValue] = useState(null);
    const [editAllowedValue, setEditAllowedValue] = useState(null);

    useEffect(() => {
        // Get affiliate user data from localStorage
        const userData = localStorage.getItem('affiliateUser');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setAffiliateUser(parsedUser);
        }

        // Get affiliate data to get allowed categories
        const affiliateData = localStorage.getItem('affiliateData');
        if (affiliateData) {
            const parsedAffiliate = JSON.parse(affiliateData);
            setCategories(parsedAffiliate.categories || []);
            setAffiliateDetails(parsedAffiliate);
        }
    }, []);

    useEffect(() => {
        if (affiliateUser?.id) {
            fetchTokens();
            fetchQuotaAndTokenSummary();
        }
    }, [affiliateUser]);

    const fetchQuotaAndTokenSummary = async () => {
        if (!affiliateUser?.id) return;
        setQuotaLoading(true);
        try {
            const [quotaRes, tokenRes, affRes] = await Promise.all([
                ApiService.getAffiliateQuotaDetails(affiliateUser.id),
                ApiService.getAffiliateTokenSummary(affiliateUser.id),
                ApiService.getAffiliateByUserId(affiliateUser.id)
            ]);
            setQuotaDetails(quotaRes);
            setTokenSummary(tokenRes);
            if (affRes) {
                setAffiliateDetails(affRes);
            }
            // Dispatch event to refresh header quota
            window.dispatchEvent(new CustomEvent('refreshAffiliateQuota'));
        } catch (error) {
            console.error('Failed to fetch quota details');
        } finally {
            setQuotaLoading(false);
        }
    };

    const fetchTokens = async (page = 1, pageSize = 20) => {
        try {
            setLoading(true);
            const response = await ApiService.getAffiliateApiAccessTokens(affiliateUser.id, page, pageSize);
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

    const handleTableChange = (newPagination) => {
        fetchTokens(newPagination.current, newPagination.pageSize);
    };

    const handleAdd = () => {
        form.resetFields();
        setCreateQuotaValue(null);
        setAddModalVisible(true);
    };

    const handleEdit = (record) => {
        setSelectedToken(record);
        setEditAllowedValue(record.allowed_travel_guides);
        editForm.setFieldsValue({
            ...record,
            end_date: dayjs(record.end_date),
            categories: record.categories?.map(cat => cat._id || cat),
        });
        setEditModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await ApiService.deleteAffiliateApiAccessToken(id);
            message.success('Token deleted successfully');
            fetchTokens(pagination.current, pagination.pageSize);
            fetchQuotaAndTokenSummary();
        } catch (error) {
            message.error('Failed to delete token');
        }
    };

    const handleViewStats = async (record) => {
        try {
            setSelectedToken(record);
            setStatsDrawerVisible(true);
            const response = await ApiService.getAffiliateApiAccessTokenStatsById(record._id);
            if (response.success) {
                setStatsData(response.data);
            }
        } catch (error) {
            message.error('Failed to fetch stats');
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
                user_id: affiliateUser.id,
                is_active: false,
            };

            await ApiService.createAffiliateApiAccessToken(payload);
            message.success('Token created successfully');
            setAddModalVisible(false);
            form.resetFields();
            setCreateQuotaValue(null);
            fetchTokens(pagination.current, pagination.pageSize);
            fetchQuotaAndTokenSummary();
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
            await ApiService.updateAffiliateApiAccessToken(selectedToken._id, payload);
            message.success('Token updated successfully');
            setEditModalVisible(false);
            editForm.resetFields();
            setEditAllowedValue(null);
            fetchTokens(pagination.current, pagination.pageSize);
            fetchQuotaAndTokenSummary();
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
            title: 'Remaining Qouta',
            dataIndex: 'remaining_allowed',
            key: 'remaining_allowed',
            width: 120,
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            width: 120,
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            render: (_, record) => {
                const isActive = dayjs(record.end_date).isAfter(dayjs());
                return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Expired'}</Tag>;
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

    // Calculate if Add button should be disabled
    const canAddToken = tokenSummary?.remaining_tokens > 0 && quotaDetails?.remaining_quota > 0;
    const addButtonDisabled = !canAddToken;

    // Calculate max available for edit
    const maxAvailableForEdit = quotaDetails
        ? (quotaDetails.remaining_quota || 0) + (selectedToken?.allowed_travel_guides || 0)
        : undefined;

    return (
        <PageTourWrapper pageName={TOUR_PAGES.AFFILIATE_API_ACCESS_LIST}>
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} className="affiliate-api-list-header">
                <Col>
                    <Title level={2}>API Access Tokens</Title>
                </Col>
                <Col>
                    <Space>
                        {tokenSummary && (
                            <Text type="secondary">
                                Tokens: <Tag color={tokenSummary.remaining_tokens > 0 ? 'green' : 'red'}>
                                    {tokenSummary.total_allowed_tokens - tokenSummary.remaining_tokens}/{tokenSummary.total_allowed_tokens}
                                </Tag>
                            </Text>
                        )}
                        <Tooltip title={addButtonDisabled ?
                            (tokenSummary?.remaining_tokens <= 0 ? 'Token limit reached' : 'No remaining quota') : ''}>
                            <Button
                                className="affiliate-api-add-button"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                disabled={addButtonDisabled}
                            >
                                Add New API Access
                            </Button>
                        </Tooltip>
                    </Space>
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
                    className="affiliate-api-table"
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
                        <Col span={8}>
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
                        <Col span={8}>
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
                        <Col span={8}>
                            <Form.Item
                                label="Categories"
                                name="categories"
                                rules={[{ required: true, message: 'Please select categories' }]}
                            >
                                <Select mode="multiple" placeholder="Select categories">
                                    {categories.map(cat => (
                                        <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Quota Settings</Divider>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Allowed Travel Guides"
                                name="allowed_travel_guides"
                                rules={[
                                    { required: true, message: 'Please enter quota' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value || !quotaDetails?.remaining_quota) {
                                                return Promise.resolve();
                                            }
                                            if (value > quotaDetails.remaining_quota) {
                                                return Promise.reject(new Error(`Cannot exceed remaining quota (${quotaDetails.remaining_quota})`));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    max={quotaDetails?.remaining_quota || undefined}
                                    style={{ width: '100%' }}
                                    placeholder="Quota"
                                    onChange={(value) => setCreateQuotaValue(value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="End Date"
                                name="end_date"
                                rules={[
                                    { required: true, message: 'Please select end date' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value || !affiliateDetails?.quota_end_date) {
                                                return Promise.resolve();
                                            }
                                            const affiliateEndDate = dayjs(affiliateDetails.quota_end_date);
                                            if (value.isAfter(affiliateEndDate)) {
                                                return Promise.reject(new Error(`Must be on or before ${affiliateEndDate.format('MMM DD, YYYY')}`));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => {
                                        if (!affiliateDetails?.quota_end_date) return false;
                                        return current && current.isAfter(dayjs(affiliateDetails.quota_end_date), 'day');
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {quotaDetails && (
                        <div style={{ marginTop: 0, marginBottom: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Text type="secondary">
                                        Total Quota: <Tag color="blue">{quotaDetails.initial_api_quota || quotaDetails.total_quota || 0}</Tag>
                                        Remaining: <Tag color={quotaDetails.remaining_quota > 0 ? 'green' : 'red'}>{quotaDetails.remaining_quota || 0}</Tag>
                                    </Text>
                                    {createQuotaValue && quotaDetails.remaining_quota !== undefined && (
                                        <div style={{ marginTop: 4 }}>
                                            <Text type="secondary">
                                                After allocation: <Tag color={(quotaDetails.remaining_quota - createQuotaValue) >= 0 ? 'orange' : 'red'}>
                                                    {quotaDetails.remaining_quota - createQuotaValue}
                                                </Tag>
                                            </Text>
                                        </div>
                                    )}
                                </Col>
                                <Col span={12}>
                                    {affiliateDetails?.quota_end_date && (
                                        <Text type="secondary">
                                            Quota End Date: <Tag color="blue">{dayjs(affiliateDetails.quota_end_date).format('MMM DD, YYYY')}</Tag>
                                        </Text>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    )}

                    <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
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
                                rules={[
                                    { required: true, message: 'Please enter quota' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value || !quotaDetails) {
                                                return Promise.resolve();
                                            }
                                            if (value > maxAvailableForEdit) {
                                                return Promise.reject(new Error(`Cannot exceed available quota (${maxAvailableForEdit})`));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    max={maxAvailableForEdit}
                                    style={{ width: '100%' }}
                                    onChange={(value) => setEditAllowedValue(value)}
                                />
                            </Form.Item>
                            {quotaDetails && (
                                <div style={{ marginTop: -10, marginBottom: 8 }}>
                                    <Text type="secondary">
                                        Remaining Quota: <Tag color={quotaDetails.remaining_quota > 0 ? 'green' : 'red'}>{quotaDetails.remaining_quota || 0}</Tag>
                                    </Text>
                                    {editAllowedValue !== null && editAllowedValue !== undefined && (
                                        <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                                            After change: <Tag color={
                                                ((quotaDetails.remaining_quota || 0) + (selectedToken?.allowed_travel_guides || 0) - editAllowedValue) >= 0 ? 'orange' : 'red'
                                            }>
                                                {(quotaDetails.remaining_quota || 0) + (selectedToken?.allowed_travel_guides || 0) - editAllowedValue}
                                            </Tag>
                                        </Text>
                                    )}
                                </div>
                            )}
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="End Date"
                                name="end_date"
                                rules={[
                                    { required: true, message: 'Please select end date' },
                                    () => ({
                                        validator(_, value) {
                                            if (!value || !affiliateDetails?.quota_end_date) {
                                                return Promise.resolve();
                                            }
                                            const affiliateEndDate = dayjs(affiliateDetails.quota_end_date);
                                            if (value.isAfter(affiliateEndDate)) {
                                                return Promise.reject(new Error(`Must be on or before ${affiliateEndDate.format('MMM DD, YYYY')}`));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    disabledDate={(current) => {
                                        if (!affiliateDetails?.quota_end_date) return false;
                                        return current && current.isAfter(dayjs(affiliateDetails.quota_end_date), 'day');
                                    }}
                                />
                            </Form.Item>
                            {affiliateDetails?.quota_end_date && (
                                <Text type="secondary" style={{ display: 'block', marginTop: -10, marginBottom: 8 }}>
                                    Quota End Date: <Tag color="blue">{dayjs(affiliateDetails.quota_end_date).format('MMM DD, YYYY')}</Tag>
                                </Text>
                            )}
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

            <StatsDrawer
                visible={statsDrawerVisible}
                onClose={() => setStatsDrawerVisible(false)}
                token={selectedToken}
                statsData={statsData}
                isAffiliate={true}
            />
        </div>
        </PageTourWrapper>
    );
};

export default AffiliateApiAccessList;
