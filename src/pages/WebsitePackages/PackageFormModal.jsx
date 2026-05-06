import React, { useEffect, useState } from 'react';
import {
    Modal, Form, Input, InputNumber, Select, Switch, Upload, Button, message, Image, Spin,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import ApiService from '../../APIServices/ApiService';
import COUNTRIES from '../../Utils/countries';

const { TextArea } = Input;

const PackageFormModal = ({ open, editing, onClose, onSaved }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [coverUrl, setCoverUrl] = useState('');
    const [books, setBooks] = useState([]);
    const [langGuides, setLangGuides] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                setLoadingOptions(true);
                const [bookRes, lgRes] = await Promise.all([
                    ApiService.getAllBooks(1, 'en', '', 200),
                    ApiService.getAllLanguageGuides(1, ''),
                ]);
                setBooks(bookRes?.data || bookRes?.books || []);
                setLangGuides(lgRes?.data || lgRes?.languageGuides || lgRes?.languages || []);
            } catch (e) {
                message.error('Failed to load guide options.');
            } finally {
                setLoadingOptions(false);
            }
        })();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (editing) {
            form.setFieldsValue({
                name: editing.name,
                description: editing.description,
                country: editing.country,
                price: editing.price,
                bookIds: (editing.bookIds || []).map((b) => (typeof b === 'object' ? b._id : b)),
                languageGuideIds: (editing.languageGuideIds || []).map((g) => (typeof g === 'object' ? g._id : g)),
                status: editing.status !== false,
            });
            setCoverUrl(editing.coverImage || '');
        } else {
            form.resetFields();
            form.setFieldsValue({ status: true });
            setCoverUrl('');
        }
    }, [open, editing, form]);

    const handleUpload = async (file) => {
        try {
            setUploading(true);
            const presign = await ApiService.presignWebsitePackageCover(file.name, file.type, file.size);
            if (!presign?.uploadUrl) throw new Error('Presign failed');
            await axios.put(presign.uploadUrl, file, {
                headers: { 'Content-Type': file.type, 'x-amz-acl': 'public-read' },
            });
            setCoverUrl(presign.fileUrl);
            message.success('Cover uploaded.');
        } catch (e) {
            console.error(e);
            message.error('Upload failed.');
        } finally {
            setUploading(false);
        }
        return false; // Prevent Antd auto-upload
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!coverUrl) {
                message.warning('Please upload a cover image.');
                return;
            }
            const payload = {
                name: values.name,
                description: values.description || '',
                country: values.country,
                price: values.price,
                coverImage: coverUrl,
                bookIds: values.bookIds || [],
                languageGuideIds: values.languageGuideIds || [],
                status: values.status !== false,
            };
            setSubmitting(true);
            if (editing) {
                await ApiService.updateWebsitePackage(editing._id, payload);
                message.success('Package updated.');
            } else {
                await ApiService.createWebsitePackage(payload);
                message.success('Package created.');
            }
            onSaved && onSaved();
        } catch (e) {
            if (e?.errorFields) return; // form validation
            message.error(e?.response?.data?.message || 'Failed to save package.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            title={editing ? `Edit Package — ${editing.name}` : 'Add Package'}
            onCancel={onClose}
            onOk={handleSubmit}
            okText={editing ? 'Save Changes' : 'Create Package'}
            confirmLoading={submitting}
            width={760}
            destroyOnClose
        >
            <Spin spinning={loadingOptions}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                        <Input placeholder="e.g. Paris Essentials" />
                    </Form.Item>

                    <Form.Item label="Description" name="description">
                        <TextArea rows={3} placeholder="Short marketing description shown on package cards / detail page" />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Country is required' }]}>
                            <Select
                                showSearch
                                placeholder="Select country"
                                options={COUNTRIES.map((c) => ({ label: c, value: c }))}
                                filterOption={(input, opt) => (opt?.label || '').toLowerCase().includes(input.toLowerCase())}
                            />
                        </Form.Item>
                        <Form.Item label="Price (EUR)" name="price" rules={[{ required: true, type: 'number', min: 0, message: 'Price is required' }]}>
                            <InputNumber min={0} step={0.5} style={{ width: '100%' }} addonBefore="€" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Cover Image" required>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={handleUpload}
                            >
                                <Button icon={<UploadOutlined />} loading={uploading}>
                                    {coverUrl ? 'Replace Cover' : 'Upload Cover'}
                                </Button>
                            </Upload>
                            {coverUrl && (
                                <Image src={coverUrl} width={120} height={80} style={{ objectFit: 'cover', borderRadius: 6 }} />
                            )}
                        </div>
                    </Form.Item>

                    <Form.Item label="Travel Guides" name="bookIds">
                        <Select
                            mode="multiple"
                            placeholder="Select travel guides included in this package"
                            optionFilterProp="label"
                            options={books.map((b) => ({
                                label: `${b.eng_name || b.name} (${b.lang || ''})${b.country ? ' — ' + b.country : ''}`,
                                value: b._id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Language Guides" name="languageGuideIds">
                        <Select
                            mode="multiple"
                            placeholder="Select language guides included in this package"
                            optionFilterProp="label"
                            options={langGuides.map((g) => ({
                                label: g.in_language && g.to_language
                                    ? `${g.name} (${g.in_language} → ${g.to_language})`
                                    : g.name,
                                value: g._id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Active" name="status" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default PackageFormModal;
