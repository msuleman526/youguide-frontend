import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, message, Table, Tag, Avatar, Modal, Flex, Row, Col } from 'antd';
import { HiOutlineUpload } from 'react-icons/hi';
import { FaEdit, FaEye, FaTrashAlt, FaSignOutAlt, FaUser, FaClock } from 'react-icons/fa';
import ApiService from '../../APIServices/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import HotelPopup from './HotelPopup';
import QRCode from 'qrcode.react';
import moment from 'moment';
import ExtendHotelModal from './ExtendHotelModal';
import PageTourWrapper from '../../components/PageTourWrapper';
import { TOUR_PAGES } from '../../Utils/TourConfig';

const { Title, Text } = Typography;

const AffiliateHotelManagement = () => {
    const { affiliateId } = useParams();
    const navigate = useNavigate();
    const [affiliate, setAffiliate] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [popupType, setPopupType] = useState('Add');
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [selectedQrUrl, setSelectedQrUrl] = useState('');
    const [extendModalVisible, setExtendModalVisible] = useState(false);
    const [selectedHotelForExtend, setSelectedHotelForExtend] = useState(null);

    useEffect(() => {
        // Check if user is logged in as affiliate
        const token = localStorage.getItem('affiliateToken');
        const affiliateData = localStorage.getItem('affiliateData');
        
        if (!token || !affiliateData) {
            navigate('/login');
            return;
        }

        const parsedAffiliate = JSON.parse(affiliateData);
        if (String(parsedAffiliate.id) !== affiliateId) {
            message.error('Access denied');
            navigate('/login');
            return;
        }

        setAffiliate(parsedAffiliate);
        fetchHotels();
    }, [affiliateId, navigate]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const response = await ApiService.getMyHotels();
            setHotels(response);
        } catch (error) {
            message.error('Failed to fetch clients');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('affiliateToken');
        localStorage.removeItem('affiliateData');
        localStorage.removeItem('affiliateUser');
        message.success('Logged out successfully');
        navigate('/login'); // Use unified login
    };

    const deleteHotel = async (hotelId) => {
        setLoading(true);
        try {
            await ApiService.deleteHotel(hotelId);
            message.success('Client deleted successfully.');
            setHotels((prev) => prev.filter((h) => h._id !== hotelId));
        } catch (err) {
            message.error('Failed to delete client.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (hotelId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this client?',
            onOk: () => deleteHotel(hotelId),
            okText: 'Yes',
            cancelText: 'No',
        });
    };

    const handleView = (hotel) => {
        window.open(`#/hotel-guides/${affiliateId}/${hotel._id}`, '_blank');
    };

    const handleEdit = (hotel) => {
        setSelectedHotel(hotel);
        setPopupType('Edit');
        setVisible(true);
    };

    const onAddHotel = () => {
        setPopupType('Add');
        setSelectedHotel(null);
        setVisible(true);
    };

    const onSaveHotel = () => {
        fetchHotels();
        setVisible(false);
    };

    const handleQrCodeClick = (hotelId) => {
        const hotelUrl = `${window.location.origin}/#/hotel-guides/${affiliateId}/${hotelId}`;
        setSelectedQrUrl(hotelUrl);
        setQrModalVisible(true);
    };

    const handleExtendHotelSubscription = (hotel) => {
        setSelectedHotelForExtend(hotel);
        setExtendModalVisible(true);
    };

    const onExtendSuccess = (updatedAffiliate, updatedHotel) => {
        // Update affiliate data
        setAffiliate(prev => ({ ...prev, ...updatedAffiliate }));
        // Refresh hotels list
        fetchHotels();
        setExtendModalVisible(false);
    };

    const columns = [
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (logo) => logo ? <Avatar style={{ width: '100px', height: 'fit-content' }} src={logo} shape="square" /> : 'N/A',
        },
        {
            title: 'Client Name',
            dataIndex: 'hotelName',
            key: 'hotelName',
        },
        {
            title: 'QR Code',
            key: 'qrCode',
            width: 120,
            render: (_, record) => {
                const hotelUrl = `${window.location.origin}/#/hotel-guides/${affiliateId}/${record._id}`;
                return (
                    <div 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleQrCodeClick(record._id)}
                        title="Click to enlarge QR code"
                    >
                        <QRCode 
                            value={hotelUrl} 
                            size={80}
                            level="M"
                            includeMargin={true}
                        />
                    </div>
                );
            }
        },
        {
            title: 'Primary Color',
            dataIndex: 'primaryColor',
            key: 'primaryColor',
            render: (color) => <Tag color={color}>{color}</Tag>
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
                    <Button type="link" onClick={() => handleExtendHotelSubscription(record)} title="Extend Subscription">
                        <FaClock />
                    </Button>
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

    if (!affiliate) {
        return <div>Loading...</div>;
    }

    return (
        <PageTourWrapper pageName={TOUR_PAGES.AFFILIATE_HOTELS}>
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            
            {/* Header */}
            <Card 
                style={{ 
                    marginBottom: '24px', 
                    background: `linear-gradient(135deg, ${affiliate.primaryColor || '#1890ff'}, ${affiliate.primaryColor || '#1890ff'}dd)`,
                    border: 'none'
                }}
            >
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ color: 'white', margin: 0 }}>
                            Clients Management
                        </Title>
                        <Text style={{ color: 'white', fontSize: '16px' }}>
                            Manage your clients/sub-affiliates and QR codes
                        </Text>
                        <br />
                        <Text style={{ color: 'white', fontSize: '14px' }}>
                            Subscription ends: {moment(affiliate.subscriptionEndDate).format('MMM DD, YYYY')} | Pending clicks: {affiliate.pendingClicks || 0}
                        </Text>
                    </Col>
                </Row>
            </Card>

            {/* Default Affiliate Link */}
            <Card style={{ marginBottom: '24px' }}>
                <Title level={4}>Your Affiliate Link</Title>
                <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                }}>
                    <Text code style={{ fontSize: '14px' }}>
                        {`${window.location.origin}/#/affiliate-guides/${affiliateId}`}
                    </Text>
                </div>
            </Card>

            {/* Hotel Management */}
            <Card>
                <Flex justify="space-between" align="center" style={{ marginBottom: '20px' }}>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                           Clients
                        </Title>
                        <Text type="secondary">
                            Manage your clients/sub-affiliates
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        className="affiliate-hotels-add-button"
                        onClick={onAddHotel}
                        style={{ backgroundColor: affiliate.primaryColor }}
                    >
                        <Flex gap="small" align="center">
                            <span>Add Client</span>
                            <HiOutlineUpload size={20} color="#fff" />
                        </Flex>
                    </Button>
                </Flex>

                <Table
                    size="middle"
                    bordered
                    className="affiliate-hotels-table"
                    columns={columns}
                    dataSource={hotels}
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10 }}
                    rowKey="_id"
                />
            </Card>

            <HotelPopup
                open={visible}
                setOpen={() => setVisible(false)}
                onSaveHotel={onSaveHotel}
                categories={affiliate.categories}
                hotel={selectedHotel}
                type={popupType}
                affiliateId={affiliateId}
            />
            
            {/* QR Code Modal */}
            <Modal
                title="QR Code - Client Guide Link"
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
            
            {/* Extend Hotel Subscription Modal */}
            <ExtendHotelModal
                open={extendModalVisible}
                onClose={() => setExtendModalVisible(false)}
                hotel={selectedHotelForExtend}
                affiliate={affiliate}
                onExtendSuccess={onExtendSuccess}
            />
        </div>
        </PageTourWrapper>
    );
};

export default AffiliateHotelManagement;
