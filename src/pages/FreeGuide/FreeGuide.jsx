import React, { useEffect, useState } from 'react';
import { Spin, Typography } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';

const { Text } = Typography;

const FreeGuide = () => {
    const { orderNumber } = useParams();
    const [searchParams] = useSearchParams();
    const pkgIndex = searchParams.get('pkg') || '0';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const data = await ApiService.getAmazonFreeGuide(orderNumber, pkgIndex);
                if (data.success && data.guide?.pdfUrl) {
                    // Open the presigned PDF in a new tab
                    window.open(data.guide.pdfUrl, '_blank');
                    // Close the current tab
                    window.close();
                    // If window.close() doesn't work (not opened by script), show a message
                    setLoading(false);
                    setError('');
                } else {
                    setLoading(false);
                    setError(data.message || 'No guide available for this destination.');
                }
            } catch (err) {
                setLoading(false);
                setError(err.response?.data?.message || 'Failed to load guide. Please try again.');
            }
        };

        if (orderNumber) {
            fetchGuide();
        }
    }, [orderNumber, pkgIndex]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif',
        }}>
            {loading ? (
                <>
                    <Spin size="large" />
                    <Text style={{ marginTop: 16, fontSize: 16 }}>Loading your free travel guide...</Text>
                </>
            ) : error ? (
                <Text type="danger" style={{ fontSize: 16 }}>{error}</Text>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#52c41a' }}>
                        Your travel guide has been opened in a new tab.
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13, marginTop: 8, display: 'block' }}>
                        You can close this tab now.
                    </Text>
                </div>
            )}
        </div>
    );
};

export default FreeGuide;
