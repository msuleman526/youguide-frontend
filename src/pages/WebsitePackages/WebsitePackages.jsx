import React, { useEffect, useMemo, useState } from 'react';
import {
    Card, Table, Tag, Button, Space, Image, Switch, Popconfirm, Input, message, Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import PackageFormModal from './PackageFormModal';

const { Paragraph } = Typography;

const fmtMoney = (v) => `€${(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const WebsitePackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState({ open: false, editing: null });
    const [togglingId, setTogglingId] = useState(null);

    const load = async () => {
        try {
            setLoading(true);
            const res = await ApiService.listWebsitePackages(search ? { search } : {});
            setPackages(res?.data || []);
        } catch (e) {
            message.error(e?.response?.data?.message || 'Failed to load packages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

    const handleToggle = async (row) => {
        try {
            setTogglingId(row._id);
            await ApiService.toggleWebsitePackage(row._id);
            setPackages((rows) =>
                rows.map((r) => (r._id === row._id ? { ...r, status: !r.status } : r))
            );
        } catch (e) {
            message.error('Failed to toggle status.');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (row) => {
        try {
            await ApiService.deleteWebsitePackage(row._id);
            message.success('Package deleted.');
            setPackages((rows) => rows.filter((r) => r._id !== row._id));
        } catch (e) {
            message.error('Failed to delete package.');
        }
    };

    const onSaved = () => {
        setModal({ open: false, editing: null });
        load();
    };

    const columns = useMemo(() => [
        {
            title: 'Cover',
            dataIndex: 'coverImage',
            key: 'cover',
            width: 90,
            render: (src) => src ? <Image src={src} width={64} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} /> : '—',
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug', render: (s) => <Typography.Text code style={{ fontSize: 12 }}>{s}</Typography.Text> },
        { title: 'Country', dataIndex: 'country', key: 'country', render: (c) => <Tag>{c}</Tag> },
        {
            title: 'Guides',
            key: 'guides',
            render: (_, r) => (
                <Space size={4}>
                    <Tag color="blue">{(r.bookIds || []).length} books</Tag>
                    <Tag color="purple">{(r.languageGuideIds || []).length} lang</Tag>
                </Space>
            ),
            width: 170,
        },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (v) => <strong>{fmtMoney(v)}</strong>, width: 100 },
        {
            title: 'Active',
            dataIndex: 'status',
            key: 'status',
            width: 90,
            render: (s, r) => (
                <Switch
                    checked={s}
                    loading={togglingId === r._id}
                    onChange={() => handleToggle(r)}
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 160,
            render: (_, r) => (
                <Space size={4}>
                    <Button size="small" icon={<EditOutlined />} onClick={() => setModal({ open: true, editing: r })}>Edit</Button>
                    <Popconfirm title="Delete this package?" okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(r)}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ], [togglingId]);

    return (
        <div style={{ padding: 24 }}>
            <Card
                title="Website Packages"
                extra={
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={load}>Refresh</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ open: true, editing: null })}>
                            Add Package
                        </Button>
                    </Space>
                }
            >
                <Paragraph type="secondary" style={{ marginTop: 0 }}>
                    Bundles of travel and language guides sold as a single product on the public website. Each package has its own price; an optional eSIM (filtered by country) can be added on top at checkout.
                </Paragraph>

                <Space style={{ marginBottom: 16 }}>
                    <Input.Search
                        placeholder="Search name / country / slug"
                        allowClear
                        size="small"
                        style={{ width: 320, height: 20 }}
                        styles={{ input: { height: 20, lineHeight: '20px', padding: '0 8px' }, affixWrapper: { height: 20, padding: 0 } }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={load}
                    />
                </Space>

                <Table
                    rowKey="_id"
                    loading={loading}
                    dataSource={packages}
                    columns={columns}
                    pagination={{ pageSize: 25, showSizeChanger: true, showTotal: (t) => `${t} packages` }}
                    scroll={{ x: 1100 }}
                />
            </Card>

            <PackageFormModal
                open={modal.open}
                editing={modal.editing}
                onClose={() => setModal({ open: false, editing: null })}
                onSaved={onSaved}
            />
        </div>
    );
};

export default WebsitePackages;
