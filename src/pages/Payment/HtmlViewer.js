import React, { useEffect, useState } from 'react';
import { Spin, Result } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';

const HtmlViewer = () => {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState(null);
    const [error, setError] = useState(null);

    const guideId = searchParams.get('guide_id');
    const transactionId = searchParams.get('transaction_id');

    useEffect(() => {
        const fetchHtmlContent = async () => {
            try {
                setLoading(true);

                if (!guideId || !token) {
                    setError('Missing required parameters. Please check your link.');
                    setLoading(false);
                    return;
                }

                // Collect all styling options from query params
                const stylingOptions = {};
                const optionKeys = [
                    'headings',
                    'heading_format',
                    'title_color',
                    'paragraph_color',
                    'paragraph_size',
                    'heading_size',
                    'sub_heading_size',
                    'sub_heading_color',
                    'title_size',
                    'mode'
                ];

                optionKeys.forEach(key => {
                    const value = searchParams.get(key);
                    if (value !== null) {
                        stylingOptions[key] = value;
                    }
                });

                let html;

                if (transactionId) {
                    // With transaction_id - call secure view API
                    html = await ApiService.viewSecureHtml(guideId, transactionId, token, stylingOptions);
                } else {
                    // Without transaction_id - call content view API
                    html = await ApiService.viewDigitalContentHtml(guideId, token, stylingOptions);
                }

                setHtmlContent(html);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching HTML content:', error);
                setError(error.response?.data?.message || 'Failed to load content. Please try again.');
                setLoading(false);
            }
        };

        fetchHtmlContent();
    }, [guideId, transactionId, token, searchParams]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#fff'
            }}>
                <Spin size="large" />
                <p style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Loading content...</p>
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
                    title="Error Loading Content"
                    subTitle={error}
                />
            </div>
        );
    }

    return (
        <div
            style={{ width: '100%', minHeight: '100vh' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default HtmlViewer;
