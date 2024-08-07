import React from 'react';
import { Button, Typography, Space } from 'antd';
import { MehOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NoCategories = ({ addClick }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" align="center" size="middle">
                <MehOutlined style={{ fontSize: '64px', color: '#ff7800' }} />
                <Title level={3} style={{ marginBottom: '-10px' }}>You have no groups and categories yet!</Title>
                <Text>Please add groups and categories to add managing your expenses and incomes.</Text>
                <Button type="primary" size="large" onClick={addClick}>ADD GROUP</Button>
            </Space>
        </div>
    );
};

export default NoCategories;
