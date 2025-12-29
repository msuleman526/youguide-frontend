import React, { useState } from 'react';
import { Card, Button, Typography, Row, Col, Alert, Divider } from 'antd';
import { CheckCircleOutlined, ExperimentOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const FeatureTestPage = () => {
    const [testResults, setTestResults] = useState({});

    const testFeature = (featureName, success) => {
        setTestResults(prev => ({ ...prev, [featureName]: success }));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Card style={{ marginBottom: '20px', textAlign: 'center' }}>
                <ExperimentOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                <Title level={2}>YouGuide Feature Testing Guide</Title>
                <Paragraph type="secondary">
                    Test the new QR Code and Client Management features
                </Paragraph>
            </Card>

            <Row gutter={[20, 20]}>
                {/* QR Code Features */}
                <Col xs={24} lg={12}>
                    <Card title="🎯 QR Code Features" style={{ height: '100%' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <Title level={4}>1. Affiliate QR Codes</Title>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>Go to <code>/affiliates</code></li>
                                <li>Check QR Code column in table</li>
                                <li>Click any QR code to enlarge</li>
                                <li>Scan QR code with phone</li>
                                <li>Should open: <code>/affiliate-guides/&#123;id&#125;</code></li>
                            </ul>
                            <Button 
                                size="small" 
                                onClick={() => window.open('/#/affiliates', '_blank')}
                            >
                                Test Affiliate QR Codes
                            </Button>
                        </div>

                        <div>
                            <Title level={4}>2. Client QR Codes</Title>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>Go to client management page</li>
                                <li>Click client QR codes to enlarge</li>
                                <li>Should link to client guides</li>
                            </ul>
                        </div>
                    </Card>
                </Col>

                {/* Client Management */}
                <Col xs={24} lg={12}>
                    <Card title="👥 Client Management" style={{ height: '100%' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <Title level={4}>1. Admin Client Management</Title>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>Go to affiliates list</li>
                                <li>Click 👥 icon for any affiliate</li>
                                <li>Should open with header/sidebar</li>
                                <li>Try adding a new client</li>
                                <li>Test extend subscription (🕐 icon)</li>
                            </ul>
                            <Button
                                size="small"
                                onClick={() => window.open('/#/affiliates', '_blank')}
                            >
                                Test Admin Client Management
                            </Button>
                        </div>

                        <div>
                            <Title level={4}>2. Affiliate Self-Management</Title>
                            <ul style={{ paddingLeft: '20px' }}>
                                <li>Create affiliate with <code>isLogin: true</code></li>
                                <li>Go to <code>/affiliate-login</code></li>
                                <li>Login and manage own clients</li>
                            </ul>
                            <Button 
                                size="small" 
                                onClick={() => window.open('/#/affiliate-login', '_blank')}
                            >
                                Test Affiliate Login
                            </Button>
                        </div>
                    </Card>
                </Col>

                {/* Extend Subscription Features */}
                <Col xs={24}>
                    <Card title="⏰ Extend Subscription Features">
                        <Row gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Title level={4}>Affiliate Subscription Extension</Title>
                                <ul style={{ paddingLeft: '20px' }}>
                                    <li><strong>Location:</strong> Affiliates table → 🕐 icon</li>
                                    <li><strong>Features:</strong></li>
                                    <ul style={{ paddingLeft: '20px' }}>
                                        <li>Add additional clicks</li>
                                        <li>Extend by number of days</li>
                                        <li>Set specific end date</li>
                                        <li>Preview new end date</li>
                                    </ul>
                                    <li><strong>Result:</strong> Updates affiliate's numberOfClicks, pendingClicks, and subscriptionEndDate</li>
                                </ul>
                            </Col>
                            <Col xs={24} md={12}>
                                <Title level={4}>Client Subscription Extension</Title>
                                <ul style={{ paddingLeft: '20px' }}>
                                    <li><strong>Location:</strong> Client management → 🕐 icon</li>
                                    <li><strong>Features:</strong></li>
                                    <ul style={{ paddingLeft: '20px' }}>
                                        <li>Extends the affiliate's subscription</li>
                                        <li>Clients inherit affiliate subscription</li>
                                        <li>Same interface as affiliate extension</li>
                                    </ul>
                                    <li><strong>Result:</strong> Updates affiliate subscription (clients inherit)</li>
                                </ul>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* URL Testing */}
                <Col xs={24}>
                    <Card title="🔗 URL Testing">
                        <Title level={4}>Test These URLs:</Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8}>
                                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                                    <Text strong>Admin Routes:</Text>
                                    <div style={{ marginTop: '8px' }}>
                                        <div><code>/affiliates</code> - QR codes</div>
                                        <div><code>/hotel-management/&#123;affiliateId&#125;</code></div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                                    <Text strong>Public Routes:</Text>
                                    <div style={{ marginTop: '8px' }}>
                                        <div><code>/affiliate-guides/&#123;id&#125;</code></div>
                                        <div><code>/hotel-guides/&#123;affiliateId&#125;/&#123;hotelId&#125;</code></div>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                                    <Text strong>Affiliate Routes:</Text>
                                    <div style={{ marginTop: '8px' }}>
                                        <div><code>/affiliate-login</code></div>
                                        <div><code>/affiliate-dashboard/&#123;id&#125;</code></div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Implementation Status */}
                <Col xs={24}>
                    <Card title="✅ Implementation Status">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Alert
                                    message="Backend Features Implemented"
                                    description={
                                        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                                            <li>Client Model & Controller</li>
                                            <li>Client Routes & Authentication</li>
                                            <li>Affiliate Login System</li>
                                            <li>Subscription Extension APIs</li>
                                            <li>Click Inheritance Logic</li>
                                        </ul>
                                    }
                                    type="success"
                                    showIcon
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Alert
                                    message="Frontend Features Implemented"
                                    description={
                                        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                                            <li>QR Code Generation & Modals</li>
                                            <li>Client Management Components</li>
                                            <li>Affiliate Dashboard</li>
                                            <li>Extend Subscription Modals</li>
                                            <li>Proper Layout Integration</li>
                                        </ul>
                                    }
                                    type="success"
                                    showIcon
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Installation Instructions */}
                <Col xs={24}>
                    <Card title="🔧 Installation Required">
                        <Alert
                            message="Install QR Code Library"
                            description={
                                <div>
                                    <Paragraph>Run this command in the frontend directory:</Paragraph>
                                    <div style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                        npm install qrcode.react
                                    </div>
                                </div>
                            }
                            type="warning"
                            showIcon
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FeatureTestPage;
