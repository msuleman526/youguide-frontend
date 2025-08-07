import { Button, Col, Flex, Row, Select, Skeleton, Spin, Table, Typography, Modal, Tag, message, Avatar } from 'antd';
import { HiOutlineUpload } from 'react-icons/hi';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import moment from 'moment';
import AffiliatePopup from './AffiliatePopup';

const AffiliateManagement = () => {
    const theme = useRecoilValue(themeState);
    const [affiliates, setAffiliates] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const [popupType, setPopupType] = useState('Add');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        ApiService.getAllCategories()
            .then((response) => setCategories(response))
            .catch(() => message.error('Failed to fetch categories.'));
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        setTableLoading(true);
        try {
            const response = await ApiService.getAllAffiliateSubscriptions();
            console.log("RESPONSe")
            console.log(response);
            setAffiliates(response);
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to fetch affiliates.');
            setAffiliates([]);
        } finally {
            setTableLoading(false);
        }
    };

    const deleteAffiliate = async (affiliateId) => {
        setTableLoading(true);
        try {
            await ApiService.deleteAffiliateSubsubscription(affiliateId);
            message.success('Affiliate deleted successfully.');
            setAffiliates((prev) => prev.filter((a) => a._id !== affiliateId));
        } catch (err) {
            message.error('Failed to delete affiliate.');
        } finally {
            setTableLoading(false);
        }
    };

    const confirmDelete = (affiliateId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this affiliate?',
            onOk: () => deleteAffiliate(affiliateId),
            okText: 'Yes',
            cancelText: 'No',
        });
    };

    const handleView = (affiliate) => {
        window.open("#/affiliate-guides/" + affiliate._id, '_blank');
    };

    const columns = [
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (logo) => logo ? <Avatar style={{ width: '150px', height: 'fit-content' }} src={logo} shape="square" /> : 'N/A',
        },
        {
            title: 'Affiliate Name',
            dataIndex: 'affiliateName',
            key: 'affiliateName',
        },
        {
            title: 'Primary Color',
            dataIndex: 'primaryColor',
            key: 'primaryColor',
            render: (color) => <Tag color={color}>{color}</Tag>
        },
        {
            title: 'Subscription End Date',
            dataIndex: 'subscriptionEndDate',
            key: 'subscriptionEndDate',
            render: (val) => moment(val).format('YYYY-MM-DD')
        },
        {
            title: 'Number of Clicks',
            dataIndex: 'numberOfClicks',
            key: 'numberOfClicks'
        },
        {
            title: 'Pending Clicks',
            dataIndex: 'pendingClicks',
            key: 'pendingClicks'
        },
        {
            title: 'Is Login',
            dataIndex: 'isLogin',
            key: 'isLogin',
            render: (val) => val ? 'Yes' : 'No'
        },
        {
            title: 'Categories',
            dataIndex: 'categories',
            key: 'categories',
            render: (cats) => (cats || []).map((cat) => <Tag key={cat._id}>{cat.name}</Tag>)
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) => moment(val).format('YYYY-MM-DD HH:mm')
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Flex>
                    <Button type="link" onClick={() => handleView(record)}>
                        <FaEye />
                    </Button>
                    <Button type="link" danger onClick={() => confirmDelete(record._id)}>
                        <FaTrashAlt />
                    </Button>
                </Flex>
            ),
        },
    ];

    const handleEdit = (affiliate) => {
        setSelectedAffiliate(affiliate);
        setPopupType('Edit');
        setVisible(true);
    };

    const onAddAffiliate = () => {
        setPopupType('Add');
        setSelectedAffiliate(null);
        setVisible(true);
    };

    const onSaveAffiliate = () => {
        fetchAffiliates();
        setVisible(false);
    };

    return (
        <>
            <div>
                <Flex justify="space-between" align="center" className="mb-2">
                    <div>
                        <Typography.Title level={2} className="my-0 fw-500">
                            Affiliate Management
                        </Typography.Title>
                        <Typography.Title level={4} className="my-0 fw-500">
                            Manage all affiliates.
                        </Typography.Title>
                    </div>
                    <Button
                        className="custom-primary-btn"
                        type="primary"
                        size="large"
                        onClick={onAddAffiliate}
                    >
                        <Flex gap="small" align="center">
                            <span>Create Affiliate</span>
                            <HiOutlineUpload size={20} color="#fff" />
                        </Flex>
                    </Button>
                </Flex>
            </div>
            <CustomCard>
                <Table
                    size="middle"
                    className="custom_table"
                    bordered
                    columns={columns}
                    dataSource={affiliates}
                    loading={tableLoading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10 }}
                    rowKey="_id"
                />
            </CustomCard>
            <AffiliatePopup
                open={visible}
                setOpen={() => setVisible(false)}
                onSaveAffiliate={onSaveAffiliate}
                categories={categories}
                affiliate={selectedAffiliate}
                type={popupType}
            />
        </>
    );
};

export default AffiliateManagement;
