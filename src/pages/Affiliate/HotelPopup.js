import { Modal, Form, Input, Select, Button, Upload, message, ColorPicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import ApiService from '../../APIServices/ApiService';

const HotelPopup = ({ open, setOpen, onSaveHotel, categories, hotel, type, affiliateId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (hotel && type === 'Edit') {
            form.setFieldsValue({
                hotelName: hotel.hotelName,
                primaryColor: hotel.primaryColor,
                categories: hotel.categories.map(cat => cat._id || cat),
            });
            
            // Set existing logo file if available
            if (hotel.logo) {
                setFileList([{
                    uid: '-1',
                    name: 'current-logo',
                    status: 'done',
                    url: hotel.logo,
                    thumbUrl: hotel.logo,
                }]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [hotel, type, form, open]);

    const handleSave = async (values) => {
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('hotelName', values.hotelName);
            formData.append('primaryColor', values.primaryColor || '#3498db');
            formData.append('categories', JSON.stringify(values.categories || []));
            
            // Add logo if uploaded
            if (fileList.length > 0 && fileList[0].originFileObj) {
                formData.append('logo', fileList[0].originFileObj);
            }

            let response;
            if (type === 'Edit' && hotel?._id) {
                response = await ApiService.updateHotel(hotel._id, formData);
            } else {
                // Check if we're in affiliate dashboard context
                const affiliateToken = localStorage.getItem('affiliateToken');
                if (affiliateToken && !affiliateId) {
                    // Use affiliate's own method
                    response = await ApiService.createMyHotel(formData);
                } else {
                    // Use admin method
                    response = await ApiService.createHotel(affiliateId, formData);
                }
            }

            message.success(`Hotel ${type === 'Edit' ? 'updated' : 'created'} successfully!`);
            onSaveHotel();
            handleClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || `Failed to ${type.toLowerCase()} hotel`;
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setFileList([]);
        setOpen();
    };

    const handleLogoChange = (info) => {
        let newFileList = [...info.fileList];
        
        // Limit to one file
        newFileList = newFileList.slice(-1);
        
        // Add preview URL
        newFileList = newFileList.map(file => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        
        setFileList(newFileList);
    };

    const uploadProps = {
        beforeUpload: () => false, // Prevent auto upload
        fileList,
        onChange: handleLogoChange,
        accept: 'image/*',
        listType: 'picture',
        maxCount: 1,
    };

    return (
        <Modal
            title={`${type} Hotel`}
            open={open}
            onCancel={handleClose}
            footer={null}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={{
                    primaryColor: '#3498db'
                }}
            >
                <Form.Item
                    label="Hotel Name"
                    name="hotelName"
                    rules={[{ required: true, message: 'Please enter hotel name!' }]}
                >
                    <Input placeholder="Enter hotel name" />
                </Form.Item>

                <Form.Item
                    label="Logo"
                    name="logo"
                >
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Select Logo</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Primary Color"
                    name="primaryColor"
                >
                    <ColorPicker
                        format="hex"
                        value={form.getFieldValue('primaryColor')}
                        onChange={(color) => {
                            form.setFieldsValue({ primaryColor: color.toHexString() });
                        }}
                        showText
                    />
                </Form.Item>

                <Form.Item
                    label="Categories"
                    name="categories"
                    rules={[{ required: true, message: 'Please select at least one category!' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select categories"
                        style={{ width: '100%' }}
                        options={categories.map(cat => ({
                            label: cat.name,
                            value: cat._id
                        }))}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={handleClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {type === 'Edit' ? 'Update' : 'Create'} Hotel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default HotelPopup;
