import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import GooglePlacesAutocomplete  from 'react-google-places-autocomplete'; // You may need to install this package

const { Option } = Select;

const BookPopup = ({ visible, onClose, onAddBook }) => {
  const [form] = Form.useForm();
  const [address, setAddress] = useState(null);

  const handleFinish = (values) => {
    const bookData = { ...values, address }; 
    onAddBook(bookData);
    form.resetFields(); 
    setAddress(null); 
    onClose(); 
  };

  return (
    <Modal
      title="Add New Book"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the book name!' }]}
        >
          <Input placeholder="Enter book name" />
        </Form.Item>

        <Form.Item
          label="Address"
          rules={[{ required: true, message: 'Please select an address!' }]}
        >
          <GooglePlacesAutocomplete
            apiKey={"AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0"}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select placeholder="Select status">
            <Option value="active">Active</Option>
            <Option value="not-activew">Not Active</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true, message: 'Please select a language!' }]}
        >
          <Select placeholder="Select language" mode="multiple">
            <Option value="english">English</Option>
            <Option value="spanish">Spanish</Option>
            <Option value="french">French</Option>
            <Option value="german">German</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Book
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookPopup;
