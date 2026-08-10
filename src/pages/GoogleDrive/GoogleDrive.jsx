import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Table, Typography, Tag, message, Alert, Spin, Popconfirm } from 'antd';
import { EyeOutlined, ReloadOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { HiOutlineLink } from 'react-icons/hi';
import CustomCard from '../../components/Card';
import ApiService from '../../APIServices/ApiService';
import LinkDrivePopup from './LinkDrivePopup';

/**
 * The Drive folders this backend indexes.
 *
 * The list is a MongoDB collection, not deployment config, so folders can be
 * added and removed here without an .env edit and a server restart. Each row
 * joins the registry entry with the state of its last crawl, and opens the file
 * browser for that folder.
 */

const STATUS_COLOUR = {
    completed: 'green',
    running: 'blue',
    failed: 'red',
    interrupted: 'orange',
    idle: 'default',
};

// While a crawl is running the numbers climb, so the page refreshes itself.
const RUNNING_POLL_MS = 8000;

const GoogleDrive = () => {
    const navigate = useNavigate();
    const [roots, setRoots] = useState([]);
    const [authMode, setAuthMode] = useState(null);
    // The registry - which folders this deployment indexes. Held server-side in
    // MongoDB, so it is editable here rather than in .env.
    const [folders, setFolders] = useState([]);
    const [removing, setRemoving] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [problem, setProblem] = useState(null);
    const [linkOpen, setLinkOpen] = useState(false);

    const fetchRoots = async (silent = false) => {
        if (!silent) setTableLoading(true);
        try {
            const res = await ApiService.getDriveRoots();
            const data = res?.data || {};
            setRoots(data.roots || []);
            setAuthMode(data.auth_mode || null);
            setFolders(data.folders || []);
            setProblem(null);
        } catch (error) {
            const d = error?.response?.data;
            setProblem({
                type: 'error',
                message: 'Could not read the Drive index.',
                description: d?.message || d?.error || error.message,
            });
            setRoots([]);
        } finally {
            if (!silent) setTableLoading(false);
        }
    };

    useEffect(() => { fetchRoots(); }, []);

    // Keep the numbers live while a crawl is in flight
    const anyRunning = roots.some((r) => r.status === 'running');
    useEffect(() => {
        if (!anyRunning) return undefined;
        const t = setInterval(() => fetchRoots(true), RUNNING_POLL_MS);
        return () => clearInterval(t);
    }, [anyRunning]);

    const onSync = async () => {
        setSyncing(true);
        try {
            await ApiService.triggerDriveSync();
            message.success('Sync started. A large folder takes several minutes - the counts below update as it runs.');
            fetchRoots();
        } catch (error) {
            const d = error?.response?.data;
            message.error(d?.message || d?.error || 'Failed to start the sync.');
        } finally {
            setSyncing(false);
        }
    };

    const columns = [
        {
            title: 'Folder',
            dataIndex: 'root_folder_name',
            key: 'root_folder_name',
            render: (text, record) => (
                <Typography.Text strong>{text || record.root_folder_id}</Typography.Text>
            ),
        },
        {
            title: 'Folder ID',
            dataIndex: 'root_folder_id',
            key: 'root_folder_id',
            render: (id) => (
                <Typography.Text copyable code style={{ fontSize: 12 }}>{id}</Typography.Text>
            ),
        },
        {
            title: 'Access',
            dataIndex: 'access_mode',
            key: 'access_mode',
            width: 110,
            render: (val) => (
                <Tag color={val === 'private' ? 'purple' : 'default'}>
                    {val === 'private' ? 'Private' : 'Public link'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (val, record) => (
                <Tag color={record.is_active === false ? 'default' : (STATUS_COLOUR[val] || 'default')}>
                    {val === 'running' ? <Spin size="small" style={{ marginRight: 6 }} /> : null}
                    {val || 'never run'}
                </Tag>
            ),
        },
        {
            title: 'Last Completed',
            dataIndex: 'last_completed_at',
            key: 'last_completed_at',
            width: 190,
            render: (val) => (val ? new Date(val).toLocaleString() : '—'),
        },
        {
            title: 'Action',
            key: 'action',
            width: 180,
            render: (_, record) => (
                <Flex gap="small" align="center">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/google-drive/${encodeURIComponent(record.root_folder_id)}`)}
                    >
                        View
                    </Button>
                    <Popconfirm
                        icon={<ExclamationCircleFilled style={{ color: '#ff4d4f' }} />}
                        title="Delete this folder permanently?"
                        description={
                            <div style={{ maxWidth: 320 }}>
                                <p style={{ margin: '0 0 8px' }}>
                                    This deletes <strong>{record.root_folder_name || record.root_folder_id}</strong>{' '}
                                    and <strong>every file indexed from it</strong>. Search, filtering
                                    and existing download links for those files stop working.
                                </p>
                                <p style={{ margin: 0 }}>
                                    Nothing is touched in Google Drive itself — but getting it back
                                    means adding the folder again and re-reading the whole tree,
                                    which on a large folder takes many minutes.
                                </p>
                            </div>
                        }
                        okText="Delete permanently"
                        okButtonProps={{ danger: true }}
                        cancelText="Cancel"
                        onConfirm={() => onRemove(record, true)}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            loading={removing === record.root_folder_id}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Flex>
            ),
        },
    ];

    // The registry drives the list; crawl state is joined onto it. A folder that
    // has never been synced still appears, marked idle - otherwise the page looks
    // empty and the reason is invisible.
    const rows = folders.map((f) => {
        const state = roots.find((r) => r.root_folder_id === f.folder_id) || {};
        return {
            ...state,
            root_folder_id: f.folder_id,
            root_folder_name: f.name || state.root_folder_name || null,
            access_mode: f.access_mode || 'public',
            status: state.status || 'idle',
            is_active: f.is_active,
        };
    });

    /**
     * Hard delete: drops the folder registration AND its indexed rows. The
     * backend still supports a soft deactivate, but the UI deliberately does not
     * offer it - a half-removed folder that still answers searches was more
     * confusing than useful.
     */
    const onRemove = async (record, purge) => {
        setRemoving(record.root_folder_id);
        try {
            const res = await ApiService.removeDriveRootFolder(record.root_folder_id, { purge });
            message.success(res?.message || 'Folder removed.');
            fetchRoots();
        } catch (error) {
            const d = error?.response?.data;
            message.error(d?.message || d?.error || 'Failed to remove the folder.');
        } finally {
            setRemoving(null);
        }
    };

    return (
        <div>
            <Flex justify="space-between" align="center" className="mb-2">
                <div>
                    <Typography.Title level={2} className="my-0 fw-500">
                        Google Drive
                    </Typography.Title>
                    <Typography.Title level={4} className="my-0 fw-500">
                        Browse, search and download files from the indexed Drive folders.
                    </Typography.Title>
                </div>
                <Flex gap="small" align="center">
                    <Button
                        size="large"
                        icon={<ReloadOutlined />}
                        loading={syncing}
                        onClick={onSync}
                    >
                        Sync All
                    </Button>
                    <Button
                        className="custom-primary-btn"
                        type="primary"
                        size="large"
                        onClick={() => setLinkOpen(true)}
                    >
                        <Flex gap="small" align="center">
                            <span>Add Drive Folder</span>
                            <HiOutlineLink size={20} color="#fff" />
                        </Flex>
                    </Button>
                </Flex>
            </Flex>

            {problem && (
                <Alert className="mb-2" type={problem.type} showIcon
                    message={problem.message} description={problem.description} />
            )}

            {!problem && !tableLoading && rows.length === 0 && (
                <Alert
                    className="mb-2"
                    type="info"
                    showIcon
                    message="No Drive folders are configured yet."
                    description={
                        <span>
                            Folders are set on the server rather than added here. Once one is
                            configured, press <strong>Sync Now</strong> to build the index and it
                            will appear in this list.
                        </span>
                    }
                />
            )}

            {authMode === 'none' && (
                <Alert
                    className="mb-2"
                    type="warning"
                    showIcon
                    message="Google Drive credentials are not configured."
                    description="The server has no API key or service account set, so nothing can be read from Drive."
                />
            )}

            <CustomCard>
                <Table
                    size="middle"
                    className="custom_table"
                    bordered
                    columns={columns}
                    dataSource={rows}
                    loading={tableLoading}
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10 }}
                    rowKey="root_folder_id"
                />
            </CustomCard>

            <LinkDrivePopup
                open={linkOpen}
                setOpen={setLinkOpen}
                onLinked={() => {
                    setLinkOpen(false);
                    // The crawl has only just been accepted, so the state row may
                    // not exist for a moment - the running-poll picks it up.
                    fetchRoots();
                }}
            />
        </div>
    );
};

export default GoogleDrive;
