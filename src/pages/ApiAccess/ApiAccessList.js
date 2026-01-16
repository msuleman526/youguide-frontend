import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Popover, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import AddTokenModal from './AddTokenModal';
import EditTokenModal from './EditTokenModal';
import StatsDrawer from './StatsDrawer';
import PageTourWrapper from '../../components/PageTourWrapper';
import { TOUR_PAGES } from '../../Utils/TourConfig';

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
        setAddModalVisible(true);
    };

    const handleAddSuccess = () => {
        message.success('Token created successfully');
        setAddModalVisible(false);
        fetchTokens(pagination.current, pagination.pageSize);
    };

    const handleEdit = (record) => {
        setSelectedToken(record);
        setEditModalVisible(true);
    };

    const handleEditSuccess = () => {
        message.success('Token updated successfully');
        setEditModalVisible(false);
        fetchTokens(pagination.current, pagination.pageSize);
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
            title: 'Remaining',
            dataIndex: 'remaining_allowed',
            key: 'remaining_allowed',
            width: 100
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
        <PageTourWrapper pageName={TOUR_PAGES.API_ACCESS_LIST}>
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2}>API Access Tokens</Title>
                </Col>
                <Col>
                    <Button className="api-access-add-button" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
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
                    scroll={{ x: 1500 }}
                    className="api-access-table"
                />
            </CustomCard>

            <AddTokenModal
                visible={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                onSuccess={handleAddSuccess}
                categories={categories}
                affiliates={affiliates}
            />

            <EditTokenModal
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onSuccess={handleEditSuccess}
                token={selectedToken}
                categories={categories}
            />

            <StatsDrawer
                visible={statsDrawerVisible}
                onClose={() => setStatsDrawerVisible(false)}
                token={selectedToken}
                statsData={statsData}
            />
        </div>
        </PageTourWrapper>
    );
};

export default ApiAccessList;
