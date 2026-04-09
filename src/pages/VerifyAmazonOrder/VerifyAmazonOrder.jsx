import React, { useState } from 'react';
import { Input, Button, Typography, Alert, Tag, message } from 'antd';
import { ShoppingOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import CustomCard from '../../components/Card';

const { Title, Text } = Typography;

const VerifyAmazonOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        setResult(null);
        if (!orderId.trim()) return message.warning('Please enter your Amazon Order ID');
        if (!email.trim()) return message.warning('Please enter your email address');

        setLoading(true);
        try {
            const data = await ApiService.verifyAmazonOrder({
                order_id: orderId.trim(),
                email: email.trim(),
            });
            if (data.success) {
                setResult({
                    type: 'success',
                    message: 'Your eSIM(s) have been activated and sent to your email!',
                    order: data.order,
                });
            } else {
                setResult({ type: 'error', message: data.message || 'Verification failed' });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setResult({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    const packages = result?.order?.packages || [];

    return (
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 16px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <SafetyCertificateOutlined style={{ fontSize: 48, color: '#29b8e3', marginBottom: 12 }} />
                <Title level={2} className="my-0 fw-500">Verify Amazon Order</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                    Enter your Amazon order ID and email address to activate your eSIM.
                    Your eSIM details and QR code will be sent to your email.
                </Text>
            </div>

            <CustomCard>
                <div style={{ marginBottom: 20 }}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>Amazon Order ID</Text>
                    <Input
                        size="large"
                        prefix={<ShoppingOutlined style={{ color: '#bbb' }} />}
                        placeholder="e.g. 123-4567890-1234567"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        onPressEnter={handleVerify}
                    />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 6 }}>Email Address</Text>
                    <Input
                        size="large"
                        prefix={<MailOutlined style={{ color: '#bbb' }} />}
                        placeholder="your@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onPressEnter={handleVerify}
                    />
                </div>

                {result && (
                    <div style={{ marginBottom: 20 }}>
                        <Alert
                            type={result.type === 'success' ? 'success' : 'error'}
                            showIcon
                            message={result.type === 'success' ? 'Success!' : 'Error'}
                            description={
                                <>
                                    <p>{result.message}</p>
                                    {packages.length > 0 && (
                                        <div style={{ marginTop: 8 }}>
                                            {packages.map((pkg, idx) => (
                                                <div key={idx} style={{ marginBottom: 8, padding: '8px 12px', background: '#f6ffed', borderRadius: 6, border: '1px solid #b7eb8f' }}>
                                                    <Text strong style={{ fontSize: 13 }}>{pkg.cleaned_package_name || pkg.package_name}</Text>
                                                    {pkg.quantity > 1 && <Tag color="purple" style={{ marginLeft: 8 }}>x{pkg.quantity}</Tag>}
                                                    {pkg.location && <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{pkg.location}</Text>}
                                                    <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                                                        {pkg.esim_profiles?.length || 0} eSIM profile(s) sent to your email
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {result.order && !packages.length && (
                                        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                                            <p><strong>Package:</strong> {result.order.package_name}</p>
                                            <p style={{ marginTop: 4 }}>Check your email for the QR code and activation details.</p>
                                        </div>
                                    )}
                                </>
                            }
                        />
                    </div>
                )}

                <Button
                    size="large"
                    block
                    loading={loading}
                    onClick={handleVerify}
                    style={{ backgroundColor: '#29b8e3', borderColor: '#29b8e3', color: '#fff' }}
                >
                    {loading ? 'Verifying & Activating...' : 'Verify & Activate eSIM'}
                </Button>

                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontSize: 12 }}>
                    Your eSIM will be purchased and activation details sent to your email immediately.
                </Text>
            </CustomCard>
        </div>
    );
};

export default VerifyAmazonOrder;
