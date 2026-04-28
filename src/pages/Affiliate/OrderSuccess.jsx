import React, { useEffect, useState } from 'react';
import { Card, Spin, Result, Button, Typography, Tag, message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';

const { Title, Paragraph, Text } = Typography;

const OrderSuccess = () => {
    const [params] = useSearchParams();
    const sessionId = params.get('session_id');
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setError('Missing session id.');
            setLoading(false);
            return;
        }
        let cancelled = false;
        const tryFetch = async (attempt = 0) => {
            try {
                const data = await ApiService.getAffiliateGuideOrder(sessionId);
                if (cancelled) return;
                setOrder(data.order);
                setBook(data.book);
                setLoading(false);
            } catch (e) {
                if (cancelled) return;
                if (attempt < 5) {
                    // Webhook may take a moment to land; retry with backoff.
                    setTimeout(() => tryFetch(attempt + 1), (attempt + 1) * 1500);
                } else {
                    setError(e?.response?.data?.message || 'Order not yet available.');
                    setLoading(false);
                }
            }
        };
        tryFetch();
        return () => { cancelled = true; };
    }, [sessionId]);

    if (loading) {
        return (
            <div style={{ padding: 60, textAlign: 'center' }}>
                <Spin size="large" tip="Confirming your order..." />
            </div>
        );
    }

    if (error || !order || !book) {
        return (
            <div style={{ padding: 40 }}>
                <Result
                    status="warning"
                    title="We couldn't load your order"
                    subTitle={error || 'Try refreshing in a moment.'}
                    extra={<Button type="primary" onClick={() => window.location.reload()}>Refresh</Button>}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 40, maxWidth: 720, margin: '0 auto' }}>
            <Result
                status="success"
                title="Thanks — your guide is ready!"
                subTitle={`Confirmation has been emailed to ${order.customer_email}.`}
            />
            <Card>
                <Title level={4}>{book.eng_name || book.name}</Title>
                <Paragraph type="secondary">
                    {[book.city, book.country].filter(Boolean).join(', ')}
                </Paragraph>
                <Text>Order: <code>{order.paymentId}</code></Text><br />
                <Text>Amount: <Tag color="green">{(order.amountTotal / 100).toFixed(2)} {(order.currency || 'eur').toUpperCase()}</Tag></Text>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {book.pdfPath && (
                        <Button type="primary" size="large" href={book.pdfPath} target="_blank">
                            Open PDF
                        </Button>
                    )}
                    {book.fullCover && (
                        <Button size="large" href={book.fullCover} target="_blank">
                            Cover image
                        </Button>
                    )}
                </div>
                <Paragraph type="secondary" style={{ marginTop: 16, fontSize: 12 }}>
                    The PDF link is temporary — refresh this page to get a fresh one. A copy was also emailed to you (valid for 7 days).
                </Paragraph>
            </Card>
        </div>
    );
};

export default OrderSuccess;
