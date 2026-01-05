import React, { useEffect, useState } from 'react';
import { Button, Card, Spin, Typography, Result, message, Modal, Space } from 'antd';
import { CheckCircleOutlined, CodeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';

const { Title, Text, Paragraph } = Typography;

const DigitalGuideSuccess = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [guide, setGuide] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [isJsonModalVisible, setIsJsonModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const guideId = searchParams.get('guide_id');
    const transactionId = searchParams.get('transaction_id');
    const bearerToken = searchParams.get('token');

    // Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                setLoading(true);

                // Validate required parameters
                if (!guideId || !transactionId || !bearerToken) {
                    setError('Missing required parameters. Please check your payment confirmation link.');
                    setLoading(false);
                    return;
                }

                // Fetch guide details
                const guideResponse = await ApiService.getTravelGuideById(guideId, bearerToken);

                if (guideResponse.success && guideResponse.guide) {
                    setGuide(guideResponse.guide);
                } else {
                    setError('Failed to load guide details.');
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching guide:', error);
                setError(error.response?.data?.message || 'Failed to load guide details. Please try again.');
                setLoading(false);
            }
        };

        fetchGuideDetails();
    }, [guideId, transactionId, bearerToken]);

    const handleViewGuide = async () => {
        try {
            message.loading('Loading HTML Guide...', 0);

            const htmlContent = await ApiService.viewSecureHtml(guideId, transactionId, bearerToken);

            message.destroy();

            // Open HTML in new window/tab
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();
                message.success('HTML Guide opened successfully!');
            } else {
                message.error('Failed to open new window. Please allow pop-ups for this site.');
            }
        } catch (error) {
            message.destroy();
            console.error('Error opening HTML:', error);
            message.error(error.response?.data?.message || 'Failed to load HTML guide. Please contact support.');
        }
    };

    const handleOpenJson = async () => {
        try {
            message.loading('Loading JSON data...', 0);

            const jsonResponse = await ApiService.getSecureJsonData(guideId, transactionId, bearerToken);

            message.destroy();

            if (jsonResponse.success && jsonResponse.content) {
                setJsonData(jsonResponse.content);
                setIsJsonModalVisible(true);
                message.success('JSON data loaded successfully!');
            } else {
                message.error('Failed to load JSON data. Please try again.');
            }
        } catch (error) {
            message.destroy();
            console.error('Error loading JSON:', error);
            message.error(error.response?.data?.message || 'Failed to load JSON data. Please contact support.');
        }
    };

    const handleCloseJsonModal = () => {
        setIsJsonModalVisible(false);
    };

    const handleCopyJson = () => {
        if (jsonData) {
            const jsonString = JSON.stringify(jsonData, null, 2);
            navigator.clipboard.writeText(jsonString);
            message.success('JSON copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}>
                <Spin size="large" />
                <Text style={{ marginTop: 16, fontSize: 16 }}>Loading guide details...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: '20px'
            }}>
                <Result
                    status="error"
                    title="Error Loading Guide"
                    subTitle={error}
                />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <Card
                style={{
                    maxWidth: 700,
                    width: '100%',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                }}
            >
                <Result
                    style={{ padding: '5px 5px' }}
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    title={
                        <Title level={2} style={{ marginBottom: 0 }}>
                            Guide Purchased Successfully!
                        </Title>
                    }
                    subTitle={
                        <Paragraph style={{ fontSize: 16, marginTop: 8 }}>
                            Your payment has been processed successfully.
                        </Paragraph>
                    }
                />

                {guide && (
                    <div style={{ marginTop: 20 }}>
                        {/* Guide Info Container */}
                        <div style={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: '20px',
                            marginBottom: 24,
                            alignItems: isMobile ? 'center' : 'flex-start'
                        }}>
                            {/* Guide Cover Image - Left (Desktop) / Top (Mobile) */}
                            {guide.fullCover && (
                                <img
                                    src={guide.fullCover}
                                    alt={guide.name}
                                    style={{
                                        width: isMobile ? '100%' : '150px',
                                        maxWidth: isMobile ? '300px' : '214px',
                                        minWidth: isMobile ? 'auto' : '214px',
                                        height: 'auto',
                                        borderRadius: '20px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                    }}
                                />
                            )}

                            {/* Guide Details - Right (Desktop) / Bottom (Mobile) */}
                            <div style={{ flex: 1, width: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>
                                <Title level={3} style={{ marginTop: 0, marginBottom: 8 }}>
                                    {guide.name}
                                </Title>

                                {guide.description && (
                                    <Paragraph style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
                                        {guide.description}
                                    </Paragraph>
                                )}

                                {/* Guide Info */}
                                <div style={{
                                    backgroundColor: '#f9f9f9',
                                    padding: '12px 16px',
                                    borderRadius: '6px'
                                }}>
                                    {guide.city && guide.country && (
                                        <Text style={{ display: 'block', marginBottom: 8 }}>
                                            <strong>Destination:</strong> {guide.city}, {guide.country}
                                        </Text>
                                    )}
                                    {guide.category && (
                                        <Text style={{ display: 'block', marginBottom: 8 }}>
                                            <strong>Category:</strong> {guide.category.name}
                                        </Text>
                                    )}
                                    {guide.lang && (
                                        <Text style={{ display: 'block' }}>
                                            <strong>Language:</strong> {guide.lang}
                                        </Text>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: '100%', marginBottom: 16 }} size="middle">
                            <Button
                                type="primary"
                                size="large"
                                icon={<FileTextOutlined />}
                                onClick={handleViewGuide}
                                block={isMobile}
                                style={{
                                    height: 48,
                                    fontSize: 16,
                                    flex: isMobile ? 'none' : 1
                                }}
                            >
                                View Guide
                            </Button>
                            <Button
                                type="default"
                                size="large"
                                icon={<CodeOutlined />}
                                onClick={handleOpenJson}
                                block={isMobile}
                                style={{
                                    height: 48,
                                    fontSize: 16,
                                    flex: isMobile ? 'none' : 1
                                }}
                            >
                                Open JSON
                            </Button>
                        </Space>

                        <Paragraph style={{ marginTop: 16, fontSize: 12, color: '#999', textAlign: 'center' }}>
                            You can access this guide anytime using your transaction details.
                        </Paragraph>
                    </div>
                )}
            </Card>

            {/* JSON Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Guide JSON Data</span>
                        <Button size="small" onClick={handleCopyJson}>
                            Copy JSON
                        </Button>
                    </div>
                }
                open={isJsonModalVisible}
                onCancel={handleCloseJsonModal}
                footer={[
                    <Button key="close" onClick={handleCloseJsonModal}>
                        Close
                    </Button>
                ]}
                width={800}
                style={{ top: 20 }}
            >
                <div style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '6px'
                }}>
                    <pre style={{
                        margin: 0,
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}>
                        {JSON.stringify(jsonData, null, 2)}
                    </pre>
                </div>
            </Modal>
        </div>
    );
};

export default DigitalGuideSuccess;
