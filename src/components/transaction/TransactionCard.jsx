import { Button, Flex, Image, Typography, message } from 'antd';
import { useState, useRef } from 'react';
import Card from '../Card';
import { convertDateToNormal, handleErrors } from '../../Utils/Utils';
import { UPLOAD_TRANSACTION_FILE } from '../../Utils/Apis';

const TransactionCard = ({ item, theme }) => {
  const { icon, name, createdOn } = item;
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleOk = async (selectedFile) => {
    try {
      setLoading(true);
      let data = new FormData();
      data.append('BankID', parseInt(item.bankID));
      data.append('BankAccountID', parseInt(item.bankAccountID));
      data.append('file', selectedFile);

      let response = await UPLOAD_TRANSACTION_FILE(data);
      if (response.isSuccess) {
        message.success("File uploaded successfully");
        setFile(null); // Clear the file after upload
      } else {
        message.error(response.message);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleErrors("Upload File", err);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleOk(selectedFile); // Auto-upload the file
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <Card
      style={{ boxShadow: theme === 'dark' && '0px 1px 6px 1px #31608A4D' }}
      className={
        theme === 'light' ? 'transaction-card' : 'transaction-card-dark'
      }
    >
      <Image
        src={icon}
        height={80}
        width={80}
        style={{ border: '1px solid #686868', borderRadius: '17px' }}
        className="obj-cover"
        alt="meezan"
        preview={false}
      />
      <Typography.Title
        level={5}
        className="text-gray-2 fw-400"
        style={{ marginTop: '10px', marginBottom: '10px' }}
      >
        {name}
      </Typography.Title>
      <Flex gap={'small'} align="center" style={{ marginBottom: '10px' }}>
        <Typography.Title level={5} className="my-0 text-gray-2">
          Last Date On:
        </Typography.Title>
        <Typography.Title level={5} className="my-0 text-gray-3 fw-400" style={{ fontSize: '15px' }}>
          {convertDateToNormal(createdOn)}
        </Typography.Title>
      </Flex>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        block
        size="large"
        type="primary"
        className="transaction-card-btn"
        onClick={openFilePicker}
        loading={loading}
      >
        Drop to Upload
      </Button>
    </Card>
  );
};

export default TransactionCard;
