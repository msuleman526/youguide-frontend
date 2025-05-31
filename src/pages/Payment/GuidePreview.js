import React, { useEffect, useState } from 'react';
import { Spin, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';

const { Text } = Typography;

const GuidePreview = () => {
    const { id } = useParams(); // Get book ID from the URL
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await ApiService.getVendorBookByID(id);
                console.log(response)
                const pdfPath = response?.pdfPath;
                if (pdfPath) {
                    window.location.href = pdfPath;
                } else {
                    console.error('PDF path not found in the response');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching book:', error);
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {loading ? (
                <>
                    <Spin size="large" />
                    <Text style={{ marginTop: 16 }}>Loading Guide...</Text>
                </>
            ) : (
                <Text type="danger">Failed to load the guide. Please try again later.</Text>
            )}
        </div>
    );
};

export default GuidePreview;
