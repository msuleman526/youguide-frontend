import { Modal, Form, Input, Select, Button, Upload, message, Tag, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import ApiService from '../../APIServices/ApiService';

const { Text } = Typography;

const HotelPopup = ({ open, setOpen, onSaved, hotel, type, approvedLinks = [] }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (open) {
            if (hotel && type === 'Edit') {
                form.setFieldsValue({
                    hotelName: hotel.hotelName,
                    primaryColor: hotel.primaryColor,
                    affiliateLinkId: hotel.affiliateLinkId?._id || hotel.affiliateLinkId,
                });
                if (hotel.logo) {
                    setFileList([{ uid: '-1', name: 'logo', status: 'done', url: hotel.logo, thumbUrl: hotel.logo }]);
                }
            } else {
                form.resetFields();
                form.setFieldsValue({ primaryColor: '#3498db' });
                setFileList([]);
            }
        }
    }, [hotel, type, form, open]);

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('hotelName', values.hotelName);
            fd.append('primaryColor', values.primaryColor || '#3498db');
            fd.append('affiliateLinkId', values.affiliateLinkId);
            if (fileList.length > 0 && fileList[0].originFileObj) {
                fd.append('logo', fileList[0].originFileObj);
            }

            if (type === 'Edit' && hotel?._id) {
                await ApiService.updateHotel(hotel._id, fd);
                message.success('Client updated.');
            } else {
                await ApiService.createMyHotel(fd);
                message.success('Client added.');
            }
            onSaved?.();
            setOpen(false);
            form.resetFields();
            setFileList([]);
        } catch (e) {
            message.error(e?.response?.data?.message || 'Save failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);

    return (
        <Modal
            title={`${type === 'Edit' ? 'Edit' : 'Add'} Client`}
            open={open}
            onCancel={() => setOpen(false)}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={type === 'Edit' ? 'Update' : 'Add'}
        >
            <Form layout="vertical" form={form} onFinish={handleSave}>
                <Form.Item name="hotelName" label="Client / Hotel Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="affiliateLinkId"
                    label="Use Affiliate Link"
                    rules={[{ required: true, message: 'Pick the link this client is associated with.' }]}
                    extra="The shareable URL is the same — clicks from this client will be tagged with src=clientId."
                >
                    <Select
                        placeholder="Select an approved link"
                        options={approvedLinks.map((l) => ({
                            label: (
                                <span>
                                    {l.name} <Tag color={l.type === 'paid' ? 'gold' : 'blue'} style={{ marginLeft: 6 }}>{l.type}</Tag>
                                </span>
                            ),
                            value: l._id,
                        }))}
                    />
                </Form.Item>

                <Form.Item name="primaryColor" label="Primary Color">
                    <Input type="color" style={{ width: 80, height: 32 }} />
                </Form.Item>

                <Form.Item label="Logo">
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Text type="secondary" style={{ fontSize: 12 }}>
                    Categories are inherited from the chosen link.
                </Text>
            </Form>
        </Modal>
    );
};

export default HotelPopup;
