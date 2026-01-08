import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Typography,
    Button,
    Divider,
    Alert,
    Upload,
    message,
    Image
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';

const { Title, Text } = Typography;

const EditBookDrawer = ({ visible, onClose, book, onEditBook }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (visible && book) {
            setPreviewImage(book.imagePath || null);
            setImageFile(null);
        }
    }, [visible, book]);

    const handleImageChange = (info) => {
        if (info.file) {
            setImageFile(info.file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(info.file);
        }
    };

    const handleSubmit = async () => {
        if (!book?._id) {
            message.error("Book ID is missing");
            return;
        }

        if (!imageFile) {
            message.error("Please select an image to upload");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await ApiService.updateBookCover(book._id, formData);
            message.success("Book cover updated successfully");
            setImageFile(null);
            setPreviewImage(null);
            onClose();
            // Pass the response data to update the book in the list
            onEditBook(book._id, response.data);
        } catch (error) {
            console.error("Error updating book cover:", error);
            message.error(error?.response?.data?.message || "Failed to update book cover");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setImageFile(null);
        setPreviewImage(null);
        onClose();
    };

    return (
        <Drawer
            title={<Title level={3} className="fw-500">Update Book Cover</Title>}
            width={400}
            onClose={handleClose}
            open={visible}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={handleClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={handleSubmit} type="primary" loading={loading} disabled={!imageFile}>
                        Update Cover
                    </Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Alert
                message="Upload a new cover image for this book."
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />

            {book && (
                <div style={{ marginBottom: '16px' }}>
                    <Text strong>Book: </Text>
                    <Text>{book.name}</Text>
                </div>
            )}

            <Divider>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Current Cover</Text>
            </Divider>

            {previewImage && (
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <Image
                        src={previewImage}
                        alt="Book cover"
                        style={{ maxWidth: '200px', borderRadius: '8px' }}
                    />
                </div>
            )}

            <Divider>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Upload New Image</Text>
            </Divider>

            <Upload
                maxCount={1}
                beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                        message.error('You can only upload image files!');
                        return Upload.LIST_IGNORE;
                    }
                    handleImageChange({ file });
                    return false;
                }}
                accept="image/*"
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                    Select New Image
                </Button>
            </Upload>

            {imageFile && (
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <Text type="success">New image selected: {imageFile.name}</Text>
                </div>
            )}
        </Drawer>
    );
};

export default EditBookDrawer;
