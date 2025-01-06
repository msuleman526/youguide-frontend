import React from 'react';
import { Layout, Typography, Button, Row, Col, Image } from 'antd';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ContractExpired = () => {
    return (
        <Layout
            style={{
                background: 'linear-gradient(135deg, #29b8e3, #29b8e3)',
                minHeight: '100vh',
                padding: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Content
                style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    maxHeight: '400px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    maxWidth: '1200px',
                    width: '100%',
                }}
            >
                <Row justify="center" align="middle">
                    {/* Text Section */}
                    <Col
                        xs={24}
                        sm={12}
                        style={{
                            padding: '20px',
                            textAlign: 'left',
                        }}
                    >
                        <Title
                            level={2}
                            style={{
                                color: '#ff5e78',
                                fontSize: '32px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                            }}
                        >
                            Your Subscription has expired?
                        </Title>
                        <Paragraph
                            style={{
                                color: '#666',
                                fontSize: '16px',
                                marginBottom: '24px',
                            }}
                        >
                            Your subscription with youguide is expired. Please contact administrator to extend your subscription.
                        </Paragraph>
                    </Col>

                    {/* Image Section */}
                    <Col
                        xs={24}
                        sm={12}
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <Image
                            src={require('../../assets/expired.png')}
                            alt="Hourglass Illustration"
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                            }}
                        />
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ContractExpired;
