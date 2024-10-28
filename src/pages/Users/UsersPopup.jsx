import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import GooglePlacesAutocomplete  from 'react-google-places-autocomplete'; // You may need to install this package

const { Option } = Select;

const UsersPopup = ({ visible, onClose, onAddUser }) => {
  const [form] = Form.useForm();

  const handleAddUser = (values) => {
    onAddUser(values);
    form.resetFields(); 
    onClose(); 
  };

  return (
    <Modal
      title="Add User"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddUser}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the user name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select placeholder="Select a role">
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="SuperAdmin">SuperAdmin</Select.Option>
            <Select.Option value="User">User</Select.Option>
            <Select.Option value="Affiliate">Affiliate</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select placeholder="Select a status">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please input the phone number!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input the password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsersPopup;
