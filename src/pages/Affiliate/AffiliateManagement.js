import { Button, Col, Flex, Row, Select, Skeleton, Spin, Table, Typography, Modal, Tag, message, Avatar } from 'antd';
import { HiOutlineUpload } from 'react-icons/hi';
import { FaEdit, FaEye, FaTrashAlt, FaClock } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import moment from 'moment';
import AffiliatePopup from './AffiliatePopup';
import QRCode from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import ExtendSubscriptionModal from './ExtendSubscriptionModal';
import PageTourWrapper from '../../components/PageTourWrapper';
import { TOUR_PAGES } from '../../Utils/TourConfig';

const AffiliateManagement = () => {
    const navigate = useNavigate();
    const theme = useRecoilValue(themeState);
    const [affiliates, setAffiliates] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const [popupType, setPopupType] = useState('Add');
    const [categories, setCategories] = useState([]);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [selectedQrUrl, setSelectedQrUrl] = useState('');
    const [extendModalVisible, setExtendModalVisible] = useState(false);
    const [selectedAffiliateForExtend, setSelectedAffiliateForExtend] = useState(null);

    const [payoutsByAffiliate, setPayoutsByAffiliate] = useState({});
    const [linkCounts, setLinkCounts] = useState({});

    useEffect(() => {
        ApiService.getAllCategories()
            .then((response) => setCategories(response))
            .catch(() => message.error('Failed to fetch categories.'));
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        setTableLoading(true);
        try {
            const [affs, summary, allLinks] = await Promise.all([
                ApiService.getAllAffiliateSubscriptions(),
                ApiService.getPayoutsSummary().catch(() => []),
                ApiService.getAllAffiliateLinks({ limit: 1000 }).catch(() => ({ links: [] })),
            ]);
            setAffiliates(affs || []);
            const byAff = {};
            (summary || []).forEach((s) => { byAff[s.affiliateId] = s; });
            setPayoutsByAffiliate(byAff);
            const counts = {};
            (allLinks?.links || []).forEach((l) => {
                if (l.status === 'approved') {
                    const id = l.affiliateId?._id || l.affiliateId;
                    counts[id] = (counts[id] || 0) + 1;
                }
            });
            setLinkCounts(counts);
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

    const handleHotelManagement = (affiliateId) => {
        navigate(`/hotel-management/${affiliateId}`);
    };

    const handleQrCodeClick = (affiliateId) => {
        const affiliateUrl = `${window.location.origin}/#/affiliate-guides/${affiliateId}`;
        setSelectedQrUrl(affiliateUrl);
        setQrModalVisible(true);
    };

    const handleExtendSubscription = (affiliate) => {
        setSelectedAffiliateForExtend(affiliate);
        setExtendModalVisible(true);
    };

    const onExtendSuccess = (updatedAffiliate) => {
        // Update the affiliate in the list
        setAffiliates(prev => prev.map(aff =>
            aff._id === updatedAffiliate._id ? { ...aff, ...updatedAffiliate } : aff
        ));
        setExtendModalVisible(false);
    };

    const columns = [
        {
            title: 'Affiliate',
            key: 'affiliate',
            width: 150,
            render: (_, record) => (
                <Flex vertical align="center" gap={8}>
                    {record.logo ? (
                        <Avatar style={{ width: 140, height: 40 }} src={record.logo} shape="square" />
                    ) : (
                        <Avatar style={{ width: 80, height: 80 }} shape="square">N/A</Avatar>
                    )}
                    <Typography.Text strong style={{ textAlign: 'center', color: 'black', marginTop: '-5px' }}>{record.affiliateName}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'QR Code',
            key: 'qrCode',
            width: 80,
            className: 'affiliate-qr-column',
            render: (_, record) => {
                const affiliateUrl = `${window.location.origin}/#/affiliate-guides/${record._id}`;
                return (
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleQrCodeClick(record._id)}
                        title="Click to enlarge QR code"
                    >
                        <QRCode
                            value={affiliateUrl}
                            size={80}
                            level="M"
                            includeMargin={true}
                        />
                    </div>
                );
            }
        },
        {
            title: 'Color',
            dataIndex: 'primaryColor',
            key: 'primaryColor',
            width: 40,
            render: (color) => <Tag color={color}>{color}</Tag>
        },
        {
            title: 'End Date',
            dataIndex: 'subscriptionEndDate',
            width: 100,
            key: 'subscriptionEndDate',
            render: (val) => moment(val).format('YYYY-MM-DD')
        },
        {
            title: 'Parent',
            key: 'parent',
            width: 140,
            render: (_, r) => {
                const parent = (affiliates || []).find((a) => a._id === (r.parentAffiliateId?._id || r.parentAffiliateId));
                return parent ? <Tag color="purple">{parent.affiliateName}</Tag> : <Typography.Text type="secondary">—</Typography.Text>;
            },
        },
        {
            title: 'Aff %',
            dataIndex: 'affiliateCommissionPct',
            key: 'apct',
            width: 70,
            render: (v) => (v != null ? `${v}%` : '—'),
        },
        {
            title: 'Sub %',
            dataIndex: 'subAffiliateCommissionPct',
            key: 'spct',
            width: 70,
            render: (v) => (v != null ? `${v}%` : '—'),
        },
        {
            title: 'Active Links',
            key: 'links',
            width: 100,
            render: (_, r) => linkCounts[r._id] || 0,
        },
        {
            title: 'Lifetime Earned',
            key: 'le',
            width: 130,
            render: (_, r) => {
                const v = payoutsByAffiliate[r._id]?.lifetimeEarned || 0;
                return `$${(v / 100).toFixed(2)}`;
            },
        },
        {
            title: 'Pending Payout',
            key: 'pp',
            width: 130,
            render: (_, r) => {
                const v = payoutsByAffiliate[r._id]?.pending || 0;
                return <Tag color={v > 0 ? 'orange' : 'default'}>{`$${(v / 100).toFixed(2)}`}</Tag>;
            },
        },
        {
            title: 'Is Login',
            dataIndex: 'isLogin',
            key: 'isLogin',
            render: (val) => val ? 'Yes' : 'No'
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
                    <Button type="link" onClick={() => handleEdit(record)} title="Edit Affiliate">
                        <FaEdit />
                    </Button>
                    <Button type="link" onClick={() => handleExtendSubscription(record)} title="Extend Subscription">
                        <FaClock />
                    </Button>
                    <Button type="link" onClick={() => handleHotelManagement(record._id)} title="Manage Clients">
                        👥
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
        <PageTourWrapper pageName={TOUR_PAGES.AFFILIATES}>
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
                        className="custom-primary-btn affiliates-add-button"
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
                    className="custom_table affiliates-table"
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

            {/* QR Code Modal */}
            <Modal
                title="QR Code - Affiliate Guide Link"
                open={qrModalVisible}
                onCancel={() => setQrModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setQrModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={400}
                centered
            >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <QRCode
                        value={selectedQrUrl}
                        size={300}
                        level="M"
                        includeMargin={true}
                    />
                    <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                        <Typography.Text style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                            {selectedQrUrl}
                        </Typography.Text>
                    </div>
                </div>
            </Modal>

            {/* Extend Subscription Modal */}
            <ExtendSubscriptionModal
                open={extendModalVisible}
                onClose={() => setExtendModalVisible(false)}
                affiliate={selectedAffiliateForExtend}
                onExtendSuccess={onExtendSuccess}
            />
        </PageTourWrapper>
    );
};

export default AffiliateManagement;
