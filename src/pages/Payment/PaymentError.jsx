import React from 'react';
import { Result, Button } from 'antd';
import { useParams } from 'react-router-dom';

const PaymentError = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Result
                status="error"
                title="Payment not successful!"
                subTitle={`Payment is failed.`}
            />
        </div>
    );
};

export default PaymentError;
