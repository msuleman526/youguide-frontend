import React from 'react';
import { Button, Card, Typography, Result } from 'antd';
import { CheckCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const QuotaPurchaseSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const affiliateId = searchParams.get('affiliate_id');
    const quotaAmount = searchParams.get('quota_amount');

    const handleGoToDashboard = () => {
        navigate('/');
    };

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
                    maxWidth: 500,
                    width: '100%',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px'
                }}
            >
                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 72 }} />}
                    title={
                        <Title level={2} style={{ marginBottom: 0, color: '#52c41a' }}>
                            Purchase Successful!
                        </Title>
                    }
                    subTitle={
                        <Paragraph style={{ fontSize: 16, marginTop: 8, color: '#666' }}>
                            Your quota has been added to your account.
                        </Paragraph>
                    }
                />

                <div style={{
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: 24,
                    textAlign: 'center'
                }}>
                    <Text style={{ fontSize: 14, color: '#666' }}>Quota Added</Text>
                    <Title level={1} style={{ margin: '8px 0', color: '#52c41a' }}>
                        +{quotaAmount || 0}
                    </Title>
                    <Text style={{ fontSize: 14, color: '#666' }}>API Access Quota</Text>
                </div>

                <Button
                    type="primary"
                    size="large"
                    icon={<DashboardOutlined />}
                    onClick={handleGoToDashboard}
                    block
                    style={{
                        height: 50,
                        fontSize: 16,
                        borderRadius: '8px'
                    }}
                >
                    Go to Dashboard
                </Button>

                <Paragraph style={{ marginTop: 16, fontSize: 12, color: '#999', textAlign: 'center' }}>
                    Thank you for your purchase. Your quota is now available for use.
                </Paragraph>
            </Card>
        </div>
    );
};

export default QuotaPurchaseSuccess;
