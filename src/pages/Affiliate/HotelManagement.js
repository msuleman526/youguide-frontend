import { Button, Flex, Table, Typography, Modal, Tag, message, Avatar, Card } from 'antd';
import { HiOutlineUpload } from 'react-icons/hi';
import { FaEdit, FaEye, FaTrashAlt, FaClock } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../atom';
import CustomCard from '../../components/Card';
import { useEffect, useState } from 'react';
import ApiService from '../../APIServices/ApiService';
import moment from 'moment';
import HotelPopup from './HotelPopup';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import ExtendHotelModal from './ExtendHotelModal';

const HotelManagement = () => {
    const { affiliateId } = useParams();
    const theme = useRecoilValue(themeState);
    const [hotels, setHotels] = useState([]);
    const [affiliate, setAffiliate] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [popupType, setPopupType] = useState('Add');
    const [affiliateCategories, setAffiliateCategories] = useState([]);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [selectedQrUrl, setSelectedQrUrl] = useState('');
    const [extendModalVisible, setExtendModalVisible] = useState(false);
    const [selectedHotelForExtend, setSelectedHotelForExtend] = useState(null);

    useEffect(() => {
        fetchAffiliate();
        fetchHotels();
    }, [affiliateId]);

    const fetchAffiliate = async () => {
        try {
            const response = await ApiService.getAffiliateByID(affiliateId);
            setAffiliate(response);
            setAffiliateCategories(response.categories || []);
        } catch (error) {
            message.error('Failed to fetch affiliate details.');
        }
    };

    const fetchHotels = async () => {
        setTableLoading(true);
        try {
            const response = await ApiService.getHotelsByAffiliate(affiliateId);
            setHotels(response);
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to fetch hotels.');
            setHotels([]);
        } finally {
            setTableLoading(false);
        }
    };

    const deleteHotel = async (hotelId) => {
        setTableLoading(true);
        try {
            await ApiService.deleteHotel(hotelId);
            message.success('Hotel deleted successfully.');
            setHotels((prev) => prev.filter((h) => h._id !== hotelId));
        } catch (err) {
            message.error('Failed to delete hotel.');
        } finally {
            setTableLoading(false);
        }
    };

    const confirmDelete = (hotelId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this hotel?',
            onOk: () => deleteHotel(hotelId),
            okText: 'Yes',
            cancelText: 'No',
        });
    };

    const handleView = (hotel) => {
        window.open(`#/hotel-guides/${affiliateId}/${hotel._id}`, '_blank');
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
            render: (logo) => logo ? <Avatar style={{ width: '150px', height: 'fit-content' }} src={logo} shape="square" /> : 'N/A',
        },
        {
            title: 'Hotel Name',
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

    return (
        <>
            <div>
                <Card style={{ marginBottom: '20px', backgroundColor: affiliate?.primaryColor || '#3498db' }}>
                    <Flex justify="space-between" align="center">
                        <div>
                            <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
                                Default Affiliate Link
                            </Typography.Title>
                            <Typography.Text style={{ color: 'white', fontSize: '16px' }}>
                                {`${window.location.origin}/#/affiliate-guides/${affiliateId}`}
                            </Typography.Text>
                        </div>
                        {affiliate?.logo && (
                            <Avatar
                                src={affiliate.logo}
                                size={120}
                                shape="square"
                                style={{ backgroundColor: 'white', padding: '4px', height: '78px' }}
                            />
                        )}
                    </Flex>
                </Card>

                <Flex justify="space-between" align="center" className="mb-2">
                    <div>
                        <Typography.Title level={2} className="my-0 fw-500">
                            Hotel Management
                        </Typography.Title>
                        <Typography.Title level={4} className="my-0 fw-500">
                            Manage hotels for {affiliate?.affiliateName}
                        </Typography.Title>
                    </div>
                    <Button
                        className="custom-primary-btn"
                        type="primary"
                        size="large"
                        onClick={onAddHotel}
                    >
                        <Flex gap="small" align="center">
                            <span>Add Hotel</span>
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
                    dataSource={hotels}
                    loading={tableLoading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10 }}
                    rowKey="_id"
                />
            </CustomCard>

            <HotelPopup
                open={visible}
                setOpen={() => setVisible(false)}
                onSaveHotel={onSaveHotel}
                categories={affiliateCategories}
                hotel={selectedHotel}
                type={popupType}
                affiliateId={affiliateId}
            />

            {/* QR Code Modal */}
            <Modal
                title="QR Code - Hotel Guide Link"
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
        </>
    );
};

export default HotelManagement;
