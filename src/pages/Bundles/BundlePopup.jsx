import React, { useEffect, useRef, useState } from 'react';
import {
    Drawer,
    Typography,
    Button,
    Form,
    Input,
    Divider,
    Alert,
    Upload,
    InputNumber,
    Switch,
    Select,
    Spin,
    message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const formatData = (bytes) => {
    if (!bytes) return 'Unlimited';
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb % 1 === 0 ? gb : gb.toFixed(1)} GB`;
    const mb = bytes / (1024 * 1024);
    return `${Math.round(mb)} MB`;
};

// Merge two option lists, deduping by value (first list wins / stays first).
const mergeUnique = (primary, extra) => {
    const seen = new Set(primary.map((o) => o.value));
    return [...primary, ...extra.filter((o) => !seen.has(o.value))];
};

/**
 * Select whose options come from a debounced backend search rather than a
 * pre-loaded list. `fetchOptions(query)` must return [{ value, label }].
 * `seedOptions` keeps already-selected items labelled (e.g. when editing) even
 * before/independent of any search.
 */
const RemoteSelect = ({ value, onChange, mode, placeholder, fetchOptions, seedOptions = [], debounce = 400 }) => {
    const [options, setOptions] = useState(seedOptions);
    const [fetching, setFetching] = useState(false);
    const timer = useRef(null);
    const fetchId = useRef(0);
    // value -> { value, label } of everything ever selected, so chips/labels persist.
    const selectedRef = useRef(new Map(seedOptions.map((o) => [o.value, o])));

    const runSearch = (query) => {
        const id = ++fetchId.current;
        setFetching(true);
        Promise.resolve(fetchOptions(query))
            .then((results) => {
                if (id !== fetchId.current) return; // a newer search superseded this one
                const keepSelected = [...selectedRef.current.values()];
                setOptions(mergeUnique(keepSelected, results || []));
            })
            .catch(() => { if (id === fetchId.current) setOptions([...selectedRef.current.values()]); })
            .finally(() => { if (id === fetchId.current) setFetching(false); });
    };

    // Initial fetch (empty query) so the dropdown isn't empty before typing.
    useEffect(() => {
        runSearch('');
        return () => clearTimeout(timer.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = (query) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => runSearch(query), debounce);
    };

    const handleChange = (val, opt) => {
        const arr = Array.isArray(opt) ? opt : (opt ? [opt] : []);
        for (const o of arr) {
            if (o && o.value != null) selectedRef.current.set(o.value, { value: o.value, label: o.label });
        }
        onChange?.(val);
    };

    return (
        <Select
            mode={mode}
            allowClear
            showSearch
            filterOption={false}
            onSearch={onSearch}
            onChange={handleChange}
            value={value}
            options={options}
            placeholder={placeholder}
            loading={fetching}
            notFoundContent={fetching ? <Spin size="small" /> : null}
        />
    );
};

const bookLabel = (b) =>
    `${b.eng_name || b.name}${b.lang ? ` (${b.lang})` : ''}${b.country ? ` — ${b.country}` : ''}`;
const lgLabel = (g) =>
    g.in_language && g.to_language ? `${g.in_language} → ${g.to_language}` : g.name;
const esimLabel = (e) =>
    `${e.name || e.location} — ${formatData(e.data)} · ${e.duration || '?'}d${e.price != null ? ` · €${e.price}` : ''}`;

// --- Debounced backend searches ---
const searchBooks = async (q) => {
    const r = await ApiService.getAllBooks(1, 'en', q || '', 50).catch(() => ({ books: [] }));
    return (r.books || []).map((b) => ({ value: b._id, label: bookLabel(b) }));
};
const searchLanguageGuides = async (q) => {
    const r = await ApiService.getAllLanguageGuides(1, q || '').catch(() => ({ guides: [] }));
    return (r.guides || []).map((g) => ({ value: g._id, label: lgLabel(g) }));
};
const searchEsims = async (q) => {
    const r = await ApiService.getBundleEsimOptions(q || '').catch(() => ({ data: [] }));
    return (r.data || []).map((e) => ({ value: e.packageCode, label: esimLabel(e) }));
};

const BundlePopup = ({ visible, onClose, onSave, editingBundle }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Populate form when editing / reset when adding.
    useEffect(() => {
        if (visible && editingBundle) {
            form.setFieldsValue({
                title: editingBundle.title,
                description: editingBundle.description,
                price: editingBundle.price,
                quantity: editingBundle.quantity ?? 0,
                status: editingBundle.status,
                type: editingBundle.type || 'country',
                bookIds: (editingBundle.bookIds || []).map((b) => (typeof b === 'string' ? b : b._id)),
                languageGuideIds: (editingBundle.languageGuideIds || []).map((g) => (typeof g === 'string' ? g : g._id)),
                esimPackageCode: editingBundle.esim ? editingBundle.esim.packageCode : undefined,
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, editingBundle, form]);

    // Seed labels for already-selected items so they show correctly while editing.
    const bookSeed = (editingBundle?.bookIds || [])
        .filter((b) => typeof b !== 'string')
        .map((b) => ({ value: b._id, label: bookLabel(b) }));
    const lgSeed = (editingBundle?.languageGuideIds || [])
        .filter((g) => typeof g !== 'string')
        .map((g) => ({ value: g._id, label: lgLabel(g) }));
    const esimSeed = editingBundle?.esim
        ? [{ value: editingBundle.esim.packageCode, label: esimLabel(editingBundle.esim) }]
        : [];

    const handleFinish = async (values) => {
        setLoading(true);
        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('description', values.description || '');
        formData.append('price', values.price);
        formData.append('quantity', values.quantity != null ? values.quantity : 0);
        formData.append('status', values.status !== undefined ? values.status : true);
        formData.append('type', values.type || 'country');
        formData.append('bookIds', JSON.stringify(values.bookIds || []));
        formData.append('languageGuideIds', JSON.stringify(values.languageGuideIds || []));
        formData.append('esimPackageCode', values.esimPackageCode || '');

        if (values.cover?.file) {
            formData.append('cover', values.cover.file);
        }

        try {
            if (editingBundle) {
                await ApiService.updateBundle(editingBundle._id, formData);
                message.success('Bundle updated successfully.');
            } else {
                await ApiService.createBundle(formData);
                message.success('Bundle created successfully.');
            }
            form.resetFields();
            onSave();
        } catch (error) {
            message.error(error?.response?.data?.message || 'Failed to save bundle.');
        } finally {
            setLoading(false);
        }
    };

    // Remount the remote selects whenever a different bundle is opened so their
    // internal option/search state starts fresh and re-seeds correctly.
    const selectKey = editingBundle?._id || 'new';

    return (
        <Drawer
            title={<Title level={3} className="fw-500">{editingBundle ? 'Edit Bundle' : 'Add Bundle'}</Title>}
            width={520}
            onClose={onClose}
            open={visible}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading}>
                        {editingBundle ? 'Update' : 'Submit'}
                    </Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
            destroyOnClose
        >
            <Alert
                message={editingBundle ? 'Update bundle details. Upload a new image to replace the existing one.' : 'Enter details for the bundle you want to add. Guide and eSIM selections are optional.'}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
            />
            <Divider>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>Bundle Details</Text>
            </Divider>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ status: true, type: 'country' }}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Title is required' }]}
                >
                    <Input placeholder="Enter bundle title" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <TextArea rows={4} placeholder="Enter bundle description" />
                </Form.Item>

                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: 'country', label: 'Country' },
                            { value: 'city', label: 'City' },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="bookIds" label="Travel Guides (optional)">
                    <RemoteSelect
                        key={`books-${selectKey}`}
                        mode="multiple"
                        placeholder="Type to search travel guides"
                        fetchOptions={searchBooks}
                        seedOptions={bookSeed}
                    />
                </Form.Item>

                <Form.Item name="languageGuideIds" label="Language Guides (optional)">
                    <RemoteSelect
                        key={`lg-${selectKey}`}
                        mode="multiple"
                        placeholder="Type to search language guides"
                        fetchOptions={searchLanguageGuides}
                        seedOptions={lgSeed}
                    />
                </Form.Item>

                <Form.Item name="esimPackageCode" label="eSIM (optional)">
                    <RemoteSelect
                        key={`esim-${selectKey}`}
                        placeholder="Type to search an eSIM"
                        fetchOptions={searchEsims}
                        seedOptions={esimSeed}
                    />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price (€)"
                    rules={[{ required: true, message: 'Price is required' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="Enter bundle price" />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity (stock)"
                    rules={[{ required: true, message: 'Quantity is required' }]}
                    tooltip="Available stock. Decreases by 1 per sale; shows 'Sold Out' on the website at 0."
                >
                    <InputNumber style={{ width: '100%' }} min={0} precision={0} placeholder="e.g. 10" />
                </Form.Item>

                <Form.Item name="status" label="Status" valuePropName="checked">
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                </Form.Item>

                <Form.Item
                    name="cover"
                    label="Cover Image"
                    valuePropName="file"
                    getValueFromEvent={(e) => e}
                >
                    <Upload maxCount={1} beforeUpload={() => false} accept="image/*">
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default BundlePopup;
