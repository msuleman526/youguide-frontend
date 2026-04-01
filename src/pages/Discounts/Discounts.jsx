import { Button, Flex, Table, Typography, Modal, Tag, message } from 'antd';
import { HiOutlineUpload } from 'react-icons/hi';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import DiscountPopup from './DiscountPopup';

const Discounts = () => {
    const theme = useRecoilValue(themeState);
    const [discounts, setDiscounts] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [popupType, setPopupType] = useState('Add');

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        setTableLoading(true);
        try {
            const response = await ApiService.getAllDiscounts();
            setDiscounts(response);
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to fetch discounts.');
            setDiscounts([]);
        } finally {
            setTableLoading(false);
        }
    };

    const deleteDiscount = async (id) => {
        setTableLoading(true);
        try {
            await ApiService.deleteDiscount(id);
            message.success('Discount deleted successfully.');
            setDiscounts(prev => prev.filter(d => d._id !== id));
        } catch (err) {
            message.error('Failed to delete discount.');
        } finally {
            setTableLoading(false);
        }
    };

    const confirmDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this discount?',
            onOk: () => deleteDiscount(id),
            okText: 'Yes',
            cancelText: 'No',
        });
    };

    const typeColors = { overall: 'blue', category: 'purple', product_type: 'orange' };
    const typeLabels = { overall: 'Overall', category: 'Category', product_type: 'Product Type' };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Typography.Text strong>{text}</Typography.Text>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (val) => <Tag color={typeColors[val]}>{typeLabels[val]}</Tag>,
        },
        {
            title: 'Discount',
            key: 'discount',
            render: (_, record) => (
                <span>
                    {record.discountValue}{record.discountUnit === 'percentage' ? '%' : '€'} off
                </span>
            ),
        },
        {
            title: 'Applied To',
            key: 'target',
            render: (_, record) => {
                if (record.type === 'category') {
                    return record.categories?.map(c => c.name).join(', ') || '-';
                }
                if (record.type === 'product_type') {
                    const labels = { book: 'Travel Guides', esim: 'eSIMs', language_guide: 'Language Guides' };
                    return record.productTypes?.map(pt => labels[pt] || pt).join(', ') || '-';
                }
                return 'All Products';
            },
        },
        {
            title: 'Period',
            key: 'period',
            render: (_, record) => {
                const start = new Date(record.startDate).toLocaleDateString();
                const end = new Date(record.endDate).toLocaleDateString();
                const isExpired = new Date(record.endDate) < new Date();
                return (
                    <span style={{ color: isExpired ? '#d32f2f' : 'inherit' }}>
                        {start} - {end}
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
                const isExpired = new Date(record.endDate) < new Date();
                if (isExpired) return <Tag color="red">Expired</Tag>;
                return <Tag color={val ? 'blue' : 'red'}>{val ? 'Active' : 'Inactive'}</Tag>;
            },
        },
        {
            title: 'Allow Coupon',
            dataIndex: 'allowCoupon',
            key: 'allowCoupon',
            render: (val) => <Tag color={val !== false ? 'green' : 'red'}>{val !== false ? 'Yes' : 'No'}</Tag>,
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

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setPopupType('Edit');
        setVisible(true);
    };

    const onAddDiscount = () => {
        setSelectedDiscount(null);
        setPopupType('Add');
        setVisible(true);
    };

    const onSaveDiscount = (discount) => {
        if (popupType === 'Edit') {
            setDiscounts(prev => prev.map(d => (d._id === discount._id ? discount : d)));
        } else {
            setDiscounts(prev => [discount, ...prev]);
        }
        setVisible(false);
    };

    return (
        <div>
            <Flex justify="space-between" align="center" className="mb-2">
                <div>
                    <Typography.Title level={2} className="my-0 fw-500">
                        Discount Management
                    </Typography.Title>
                    <Typography.Title level={4} className="my-0 fw-500">
                        Create and manage discounts for guides, eSIMs, and categories.
                    </Typography.Title>
                </div>
                <Button
                    className="custom-primary-btn"
                    type="primary"
                    size="large"
                    onClick={onAddDiscount}
                >
                    <Flex gap="small" align="center">
                        <span>Create Discount</span>
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
                    dataSource={discounts}
                    loading={tableLoading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10 }}
                    rowKey="_id"
                />
            </CustomCard>
            <DiscountPopup
                open={visible}
                setOpen={() => setVisible(false)}
                onSaveDiscount={onSaveDiscount}
                discount={selectedDiscount}
                type={popupType}
            />
        </div>
    );
};

export default Discounts;
