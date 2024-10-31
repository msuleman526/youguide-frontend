import React, { useEffect, useState } from 'react';
import { Result, Button } from 'antd';
import { useParams } from 'react-router-dom';

const PaymentSuccess = ({ onBack }) => {
    // Use useParams to get the bookId from the URL
    const [bookName, setBookName] = useState('');

    useEffect(() => {
        // Extract the query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name'); // Get the 'name' parameter
        setBookName(name || 'Unknown Book'); // Set default if name is not found
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Result
                status="success"
                title="Payment Successful!"
                subTitle={`Your booking has been confirmed. Book ID: ${bookName}`}
            />
        </div>
    );
};

export default PaymentSuccess;
