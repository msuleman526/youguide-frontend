import React, { useEffect, useState } from 'react';
import { Button, Card, Spin, Typography, Result, message } from 'antd';
import { CheckCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';

const { Title, Text, Paragraph } = Typography;

const PdfGuideSuccess = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [guide, setGuide] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);

    const guideId = searchParams.get('guide_id');
    const transactionId = searchParams.get('transaction_id');
    const bearerToken = searchParams.get('token');

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

    const handleOpenPdf = async () => {
        try {
            message.loading('Loading PDF...', 0);

            const pdfResponse = await ApiService.downloadSecurePDF(guideId, transactionId, bearerToken);

            message.destroy();

            if (pdfResponse.success && pdfResponse.pdf_url) {
                // Open PDF in new tab
                window.open(pdfResponse.pdf_url, '_blank');
                setPdfUrl(pdfResponse.pdf_url);
                message.success('PDF opened successfully!');
            } else {
                message.error('Failed to load PDF. Please try again.');
            }
        } catch (error) {
            message.destroy();
            console.error('Error downloading PDF:', error);
            message.error(error.response?.data?.message || 'Failed to download PDF. Please contact support.');
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
                    maxWidth: 600,
                    width: '100%',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px'
                }}
            >
                <Result
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
                            gap: '20px',
                            marginBottom: 24,
                            alignItems: 'flex-start'
                        }}>
                            {/* Guide Cover Image - Left */}
                            {guide.fullCover && (
                                <img
                                    src={guide.fullCover}
                                    alt={guide.name}
                                    style={{
                                        width: '150px',
                                        minWidth: '150px',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                    }}
                                />
                            )}

                            {/* Guide Details - Right */}
                            <div style={{ flex: 1 }}>
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

                        {/* Open PDF Button */}
                        <Button
                            type="primary"
                            size="large"
                            icon={<FilePdfOutlined />}
                            onClick={handleOpenPdf}
                            block
                            style={{
                                height: 48,
                                fontSize: 16
                            }}
                        >
                            Open Guide PDF
                        </Button>

                        {pdfUrl && (
                            <Paragraph style={{ marginTop: 16, fontSize: 12, color: '#999', textAlign: 'center' }}>
                                You can access this guide anytime using your transaction details.
                            </Paragraph>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default PdfGuideSuccess;
