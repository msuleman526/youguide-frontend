import React, { useEffect, useRef, useState } from 'react';
import {
    Modal, Form, Input, InputNumber, Select, Switch, Upload, Button, message, Image, Spin,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import ApiService from '../../APIServices/ApiService';
import COUNTRIES from '../../Utils/countries';

const { TextArea } = Input;

const bookLabel = (b) =>
    `${b.eng_name || b.name || 'Untitled'}${b.lang ? ' (' + b.lang + ')' : ''}${b.country ? ' — ' + b.country : ''}`;

const PackageFormModal = ({ open, editing, onClose, onSaved }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [coverUrl, setCoverUrl] = useState('');

    // Travel guides — server-side searchable
    const [bookOptions, setBookOptions] = useState([]); // [{ value, label, raw }]
    const [searchingBooks, setSearchingBooks] = useState(false);
    const searchSeq = useRef(0);
    const searchTimer = useRef(null);

    // Language guides — loaded once on open (small list)
    const [langGuides, setLangGuides] = useState([]);
    const [loadingLangs, setLoadingLangs] = useState(false);

    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                setLoadingLangs(true);
                const lgRes = await ApiService.getAllLanguageGuides(1, '');
                setLangGuides(lgRes?.data || lgRes?.languageGuides || lgRes?.languages || []);
            } catch (e) {
                message.error('Failed to load language guides.');
            } finally {
                setLoadingLangs(false);
            }
        })();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (editing) {
            const selectedBooks = (editing.bookIds || []).filter((b) => typeof b === 'object');
            const selectedIds = (editing.bookIds || []).map((b) => (typeof b === 'object' ? b._id : b));
            // Seed dropdown with currently-selected books so their labels render.
            setBookOptions(
                selectedBooks.map((b) => ({ value: b._id, label: bookLabel(b), raw: b }))
            );
            form.setFieldsValue({
                name: editing.name,
                description: editing.description,
                country: editing.country,
                price: editing.price,
                bookIds: selectedIds,
                languageGuideIds: (editing.languageGuideIds || []).map((g) => (typeof g === 'object' ? g._id : g)),
                status: editing.status !== false,
            });
            setCoverUrl(editing.coverImage || '');
        } else {
            form.resetFields();
            form.setFieldsValue({ status: true });
            setBookOptions([]);
            setCoverUrl('');
        }
    }, [open, editing, form]);

    const fetchBooks = async (query) => {
        const seq = ++searchSeq.current;
        try {
            setSearchingBooks(true);
            const res = await ApiService.getAllBooks(1, 'en', query, 50);
            if (seq !== searchSeq.current) return; // a newer search superseded this
            const list = res?.data || res?.books || [];
            const fetched = list.map((b) => ({ value: b._id, label: bookLabel(b), raw: b }));

            // Preserve any currently-selected options so their labels don't disappear.
            const selectedIds = form.getFieldValue('bookIds') || [];
            setBookOptions((prev) => {
                const keep = prev.filter((o) => selectedIds.includes(o.value));
                const seen = new Set(keep.map((o) => o.value));
                const merged = [...keep];
                for (const opt of fetched) {
                    if (!seen.has(opt.value)) {
                        merged.push(opt);
                        seen.add(opt.value);
                    }
                }
                return merged;
            });
        } catch (e) {
            console.error('Book search error:', e);
        } finally {
            if (seq === searchSeq.current) setSearchingBooks(false);
        }
    };

    const handleBookSearch = (value) => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        const q = (value || '').trim();
        if (q.length < 2) {
            // Don't spam the API for 0/1 chars; clear non-selected options.
            const selectedIds = form.getFieldValue('bookIds') || [];
            setBookOptions((prev) => prev.filter((o) => selectedIds.includes(o.value)));
            return;
        }
        searchTimer.current = setTimeout(() => fetchBooks(q), 350);
    };

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
            <Spin spinning={loadingLangs}>
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

                    <Form.Item
                        label="Travel Guides"
                        name="bookIds"
                        extra="Type at least 2 characters to search the guide library."
                    >
                        <Select
                            mode="multiple"
                            placeholder="Search by guide name, language, or country"
                            showSearch
                            filterOption={false}
                            onSearch={handleBookSearch}
                            loading={searchingBooks}
                            notFoundContent={searchingBooks ? <Spin size="small" /> : 'Type to search…'}
                            options={bookOptions}
                            allowClear
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
