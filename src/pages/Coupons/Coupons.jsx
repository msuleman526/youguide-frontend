import { Button, Flex, Table, Typography, Modal, Tag, message } from 'antd';
import { HiOutlineUpload } from 'react-icons/hi';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import CouponPopup from './CouponPopup';

const Coupons = () => {
    const theme = useRecoilValue(themeState);
    const [coupons, setCoupons] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [popupType, setPopupType] = useState('Add');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setTableLoading(true);
        try {
            const response = await ApiService.getAllCoupons();
            setCoupons(response);
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to fetch coupons.');
            setCoupons([]);
        } finally {
            setTableLoading(false);
        }
    };

    const deleteCoupon = async (couponId) => {
        setTableLoading(true);
        try {
            await ApiService.deleteCoupon(couponId);
            message.success('Coupon deleted successfully.');
            setCoupons(prev => prev.filter(c => c._id !== couponId));
        } catch (err) {
            message.error('Failed to delete coupon.');
        } finally {
            setTableLoading(false);
        }
    };

    const confirmDelete = (couponId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this coupon?',
            onOk: () => deleteCoupon(couponId),
            okText: 'Yes',
            cancelText: 'No',
        });
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => <Typography.Text strong copyable>{text}</Typography.Text>,
        },
        {
            title: 'Discount',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (val) => `${val}%`,
        },
        {
            title: 'Expiry Date',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            render: (val) => {
                const date = new Date(val);
                const isExpired = date < new Date();
                return (
                    <span style={{ color: isExpired ? '#d32f2f' : 'inherit' }}>
                        {date.toLocaleDateString()}
                        {isExpired && ' (Expired)'}
                    </span>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (val, record) => {
                const isExpired = new Date(record.expiryDate) < new Date();
                if (isExpired) return <Tag color="red">Expired</Tag>;
                return <Tag color={val ? 'blue' : 'red'}>{val ? 'Active' : 'Inactive'}</Tag>;
            },
        },
        {
            title: 'Used / Limit',
            key: 'usage',
            render: (_, record) => (
                <span>{record.usedCount}{record.usageLimit ? ` / ${record.usageLimit}` : ' / Unlimited'}</span>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) => new Date(val).toLocaleString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Flex>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        <FaEdit />
                    </Button>
                    <Button type="link" danger onClick={() => confirmDelete(record._id)}>
                        <FaTrashAlt />
                    </Button>
                </Flex>
            ),
        },
    ];

    const handleEdit = (coupon) => {
        setSelectedCoupon(coupon);
        setPopupType('Edit');
        setVisible(true);
    };

    const onAddCoupon = () => {
        setSelectedCoupon(null);
        setPopupType('Add');
        setVisible(true);
    };

    const onSaveCoupon = (coupon) => {
        if (popupType === 'Edit') {
            setCoupons(prev => prev.map(c => (c._id === coupon._id ? coupon : c)));
        } else {
            setCoupons(prev => [coupon, ...prev]);
        }
        setVisible(false);
    };

    return (
        <div>
            <Flex justify="space-between" align="center" className="mb-2">
                <div>
                    <Typography.Title level={2} className="my-0 fw-500">
                        Coupon Management
                    </Typography.Title>
                    <Typography.Title level={4} className="my-0 fw-500">
                        Create and manage discount coupons.
                    </Typography.Title>
                </div>
                <Button
                    className="custom-primary-btn"
                    type="primary"
                    size="large"
                    onClick={onAddCoupon}
                >
                    <Flex gap="small" align="center">
                        <span>Create Coupon</span>
                        <HiOutlineUpload size={20} color="#fff" />
                    </Flex>
                </Button>
            </Flex>
            <CustomCard>
                <Table
                    size="middle"
                    className="custom_table"
                    bordered
                    columns={columns}
                    dataSource={coupons}
                    loading={tableLoading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10 }}
                    rowKey="_id"
                />
            </CustomCard>
            <CouponPopup
                open={visible}
                setOpen={() => setVisible(false)}
                onSaveCoupon={onSaveCoupon}
                coupon={selectedCoupon}
                type={popupType}
            />
        </div>
    );
};

export default Coupons;
