import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const FirstTimeTourPopup = ({ visible, onStart, onSkip }) => {
  return (
    <Modal
      open={visible}
      closable={false}
      footer={null}
      centered
      width={500}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <RocketOutlined style={{ fontSize: '64px', color: '#29b8e3', marginBottom: '20px' }} />
        <Title level={3}>Welcome to YouGuide!</Title>
        <Paragraph style={{ fontSize: '16px', marginBottom: '30px' }}>
          Would you like to take a quick tour of the platform?
          We'll guide you through the key features to help you get started.
        </Paragraph>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button size="large" onClick={onSkip}>
            Skip for now
          </Button>
          <Button type="primary" size="large" onClick={onStart} icon={<RocketOutlined />}>
            Start Tour
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FirstTimeTourPopup;
