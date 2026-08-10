import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button, Flex, Table, Typography, Tag, message, Select, Input, Tooltip, Alert, Spin, Popconfirm,
} from 'antd';
import {
    ArrowLeftOutlined, DownloadOutlined, ReloadOutlined, DeleteOutlined,
    ExclamationCircleFilled, SearchOutlined,
} from '@ant-design/icons';
import CustomCard from '../../components/Card';
import ApiService from '../../APIServices/ApiService';

/**
 * Read-only view of one indexed Drive root.
 *
 * Files are listed flat across every folder level, so nothing is hidden inside a
 * subfolder. Search, type filter, sorting and paging all run server-side against
 * the index, which is why they answer in milliseconds on a 20,000-folder tree.
 */

// Mirrors the server's taxonomy (googleDriveService.ALL_TYPES).
//
// Only concrete types are offered. The server also understands group filters
// (document, office, spreadsheet, presentation, media) and they still work over
// the API - they are just not listed here, because a dropdown mixing "PDF" with
// "Documents, which also contains PDF" invites picking the wrong one.
const TYPE_OPTIONS = [
    { value: 'all', label: 'All types' },
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'Word (.docx)' },
    { value: 'doc', label: 'Word (.doc)' },
    { value: 'gdoc', label: 'Google Docs' },
    { value: 'xlsx', label: 'Excel' },
    { value: 'gsheet', label: 'Google Sheets' },
    { value: 'pptx', label: 'PowerPoint' },
    { value: 'gslides', label: 'Google Slides' },
    { value: 'csv', label: 'CSV' },
    { value: 'text', label: 'Text' },
    { value: 'markdown', label: 'Markdown (.md)' },
    { value: 'json', label: 'JSON' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'archive', label: 'Archives' },
    { value: 'other', label: 'Other' },
];

// The server sorts on these keys; the labels are ours.
//
// Sorting by name is deliberately not offered. The Name column shows the file's
// full path, but the server sorts on the bare filename - and in these folders
// every file is called the same thing, so the option looked broken. Sorting on
// path instead would fix it if it is ever wanted back.
const SORT_OPTIONS = [
    { value: 'size', label: 'Size' },
    { value: 'created', label: 'Created' },
    { value: 'modified', label: 'Modified' },
    { value: 'type', label: 'Type' },
];

const TYPE_COLOUR = {
    pdf: 'red', docx: 'blue', doc: 'blue', gdoc: 'blue',
    xlsx: 'green', xls: 'green', gsheet: 'green', csv: 'green',
    pptx: 'orange', ppt: 'orange', gslides: 'orange',
    image: 'purple', video: 'magenta', audio: 'gold',
    text: 'cyan', markdown: 'geekblue', json: 'cyan', archive: 'volcano',
    folder: 'default', other: 'default',
};

// While the crawl is running the list is re-read on this interval, so newly
// indexed files appear without a manual reload. The server writes its progress
// counters every 2s, so polling faster than this would mostly re-read the same
// numbers.
const INDEXING_POLL_MS = 4000;

// How long nothing may change before the crawl is treated as settled. Measured
// against files AND folders: a deepest-first walk spends stretches reading
// folder levels that hold no files at all, and judging on the file count alone
// would call a perfectly healthy crawl stalled.
const STALL_MS = 120000;

const formatSize = (bytes) => {
    if (bytes === null || bytes === undefined || bytes === 0) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
};

const DriveFolderView = () => {
    const { rootFolderId } = useParams();
    const navigate = useNavigate();

    const [root, setRoot] = useState(null);
    const [files, setFiles] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [problem, setProblem] = useState(null);
    const [downloading, setDownloading] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [syncing, setSyncing] = useState(false);
    // Whether the server can write to Drive at all. Without a service account
    // holding Editor rights every delete would 403, so the action is hidden
    // rather than offered and then refused.
    const [canDelete, setCanDelete] = useState(false);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [type, setType] = useState('all');
    // Newest first, now that name is not a sort option.
    const [sortBy, setSortBy] = useState('modified');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const requestId = useRef(0);
    // Latest crawl counters, mirrored into a ref so the stall check can see them
    // without making every poll depend on React state having flushed.
    const rootRef = useRef(null);
    // Tracks whether anything is still moving: files, folders, or neither.
    const stall = useRef({ signature: '', since: Date.now() });

    /** Crawl state for this root - drives the progress strip and auto-refresh. */
    const fetchRoot = useCallback(async () => {
        try {
            const res = await ApiService.getDriveRoots();
            const match = (res?.data?.roots || []).find((r) => r.root_folder_id === rootFolderId);
            rootRef.current = match || null;
            setRoot(match || null);
            return match || null;
        } catch {
            return null;
        }
    }, [rootFolderId]);

    useEffect(() => { fetchRoot(); }, [fetchRoot]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await ApiService.getDriveAccessInfo();
                if (!cancelled) setCanDelete(Boolean(res?.data?.can_delete));
            } catch {
                if (!cancelled) setCanDelete(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Debounce typing so a request does not fire per keystroke
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
        return () => clearTimeout(t);
    }, [search]);

    /**
     * @param {boolean} silent - a background refresh while the crawl runs. It
     *        must not raise the loading veil, or the table would flash empty
     *        every few seconds while the user is reading it.
     */
    const fetchFiles = useCallback(async (silent = false) => {
        const id = ++requestId.current;
        if (!silent) setLoading(true);
        try {
            const params = {
                root_folder_id: rootFolderId,
                page,
                limit: pageSize,
                sort: sortBy,
                order: sortOrder,
                // Flat listing across every level, files only
                include_folders: 'false',
            };
            if (type !== 'all') params.type = type;
            // Server-side search spans the folder path as well as the filename,
            // which is what makes it useful on trees where every file is called
            // the same thing.
            if (debouncedSearch) params.q = debouncedSearch;

            const res = await ApiService.getDriveFilesV2(params);

            // A slower earlier request must not overwrite a newer result
            if (id !== requestId.current) return;

            const newTotal = res?.pagination?.total || 0;
            setFiles(res?.data || []);
            setTotal(newTotal);

            // Any movement at all resets the clock - a crawl deep in a folder
            // level is still working even while the file count sits still.
            const signature = `${newTotal}:${rootRef.current?.folders_scanned ?? 0}`;
            if (signature !== stall.current.signature) {
                stall.current.signature = signature;
                stall.current.since = Date.now();
            }

            setProblem(null);
        } catch (error) {
            if (id !== requestId.current) return;
            const d = error?.response?.data;

            if (d?.code === 'DOWNLOAD_FORBIDDEN' || d?.code === 'TYPE_FORBIDDEN') {
                setProblem({
                    type: 'warning',
                    message: 'This API token is restricted.',
                    description: d?.message || 'The token in use is not allowed to see everything in this folder.',
                });
            } else if (d?.code === 'RATE_LIMITED') {
                setProblem({
                    type: 'warning',
                    message: 'Too many requests.',
                    description: 'The API token has hit its per-minute limit. Wait a moment and try again.',
                });
            } else {
                setProblem({
                    type: 'error',
                    message: 'Failed to load files.',
                    description: d?.message || d?.error || 'Unexpected error.',
                });
            }
            setFiles([]);
            setTotal(0);
        } finally {
            if (id === requestId.current && !silent) setLoading(false);
        }
    }, [rootFolderId, page, pageSize, type, sortBy, sortOrder, debouncedSearch]);

    useEffect(() => { fetchFiles(); }, [fetchFiles]);

    // Held in a ref so the poll interval is not torn down and rebuilt every time
    // a filter changes - it should keep its own cadence regardless.
    const fetchFilesRef = useRef(fetchFiles);
    useEffect(() => { fetchFilesRef.current = fetchFiles; }, [fetchFiles]);

    const crawlRunning = root?.status === 'running';
    const stalled = crawlRunning && Date.now() - stall.current.since > STALL_MS;
    const growing = crawlRunning && !stalled;

    /**
     * While the crawl is filling the index, re-read the current page on a timer.
     * Files indexed since the last read simply appear - no manual refresh, and no
     * waiting for the whole folder to finish first.
     */
    useEffect(() => {
        if (!growing) return undefined;
        const timer = setInterval(() => {
            fetchFilesRef.current(true);
            fetchRoot();
        }, INDEXING_POLL_MS);
        return () => clearInterval(timer);
    }, [growing, fetchRoot]);

    const onSync = async () => {
        setSyncing(true);
        try {
            await ApiService.triggerDriveSync({ root_folder_id: rootFolderId });
            message.success('Sync started. Files appear below as they are indexed.');
            stall.current = { signature: '', since: Date.now() };
            fetchRoot();
            fetchFiles();
        } catch (error) {
            const d = error?.response?.data;
            message.error(d?.message || d?.error || 'Failed to start the sync.');
        } finally {
            setSyncing(false);
        }
    };

    const onDownload = async (record) => {
        setDownloading(record.id);
        try {
            const res = await ApiService.createDriveDownloadLink(record.id);
            const url = res?.data?.url;
            if (!url) throw new Error('No download URL was returned');
            // The signed URL carries its own credential, so it is opened directly
            // rather than fetched - which also lets the browser stream a large
            // file straight to disk instead of buffering it as a blob.
            window.open(url, '_blank', 'noopener');
        } catch (error) {
            const d = error?.response?.data;
            message.error(d?.message || d?.error || 'Failed to download file.');
        } finally {
            setDownloading(null);
        }
    };

    const onDelete = async (record) => {
        setDeleting(record.id);
        try {
            const res = await ApiService.deleteDriveFile(record.id);
            message.success(res?.message || 'File moved to the Google Drive trash.');
            // Drop it locally straight away rather than waiting for a refetch -
            // the row is gone from Drive, so leaving it on screen is a lie.
            setFiles((current) => current.filter((f) => f.id !== record.id));
            setTotal((t) => Math.max(0, t - 1));
        } catch (error) {
            const d = error?.response?.data;
            if (d?.code === 'DRIVE_PERMISSION_DENIED') {
                message.error(
                    `${d.message} (${d?.details?.service_account_email || 'service account'})`,
                    8
                );
            } else {
                message.error(d?.message || d?.error || 'Failed to delete the file.');
            }
        } finally {
            setDeleting(null);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'path',
            key: 'name',
            // `path` already includes the filename as its last segment, so it is
            // the qualified name. Falls back to the bare name at the root, and
            // for rows indexed before paths were recorded.
            render: (text, record) => <Typography.Text>{text || record.name}</Typography.Text>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 110,
            render: (val) => <Tag color={TYPE_COLOUR[val] || 'default'}>{val || '—'}</Tag>,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            width: 110,
            render: (val) => formatSize(val),
        },
        {
            title: 'Modified',
            dataIndex: 'modified_at',
            key: 'modified_at',
            width: 150,
            render: (val) => (val ? new Date(val).toLocaleDateString() : '—'),
        },
        {
            title: 'Actions',
            key: 'action',
            width: 130,
            render: (_, record) => (
                <Flex align="center">
                    <Tooltip title="Download">
                        <Button
                            type="link"
                            loading={downloading === record.id}
                            onClick={() => onDownload(record)}
                        >
                            <DownloadOutlined />
                        </Button>
                    </Tooltip>
                    {canDelete && (
                        <Popconfirm
                            icon={<ExclamationCircleFilled style={{ color: '#ff4d4f' }} />}
                            title="Delete this file from Google Drive?"
                            description={
                                <div style={{ maxWidth: 330 }}>
                                    <p style={{ margin: '0 0 8px' }}>
                                        <strong>{record.name}</strong> is moved to the Trash of the
                                        account that owns it. It disappears from their Drive and
                                        from here straight away.
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        They can restore it from their own Trash for 30 days — you
                                        cannot restore it from here. After 30 days Google deletes
                                        it for good.
                                    </p>
                                </div>
                            }
                            okText="Delete file"
                            okButtonProps={{ danger: true }}
                            cancelText="Cancel"
                            onConfirm={() => onDelete(record)}
                        >
                            <Tooltip title="Delete from Google Drive">
                                <Button
                                    type="link"
                                    danger
                                    loading={deleting === record.id}
                                >
                                    <DeleteOutlined />
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Flex>
            ),
        },
    ];

    // A filter that matches nothing is a real answer, not a loading state - the
    // empty-table copy has to say which of the two it is.
    const filterActive = type !== 'all' || Boolean(debouncedSearch);
    const typeNoun = type === 'all'
        ? 'files'
        : `${(TYPE_OPTIONS.find((o) => o.value === type)?.label || type)} files`;

    return (
        <div>
            <Flex justify="space-between" align="center" className="mb-2">
                <div>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        style={{ paddingLeft: 0 }}
                        onClick={() => navigate('/google-drive')}
                    >
                        Back to Google Drive
                    </Button>
                    <Typography.Title level={2} className="my-0 fw-500">
                        {root ? (root.root_folder_name || rootFolderId) : <Spin size="small" />}
                    </Typography.Title>
                    <Typography.Title level={4} className="my-0 fw-500">
                        Search, filter and download files from this folder.
                    </Typography.Title>
                </div>
                <Button icon={<ReloadOutlined />} loading={syncing} onClick={onSync}>
                    Re-sync
                </Button>
            </Flex>

            {problem && (
                <Alert className="mb-2" type={problem.type} showIcon
                    message={problem.message} description={problem.description} />
            )}

            {/*
              * Progress, not a warning. A folder this size is read in stages, so
              * the list below is real and usable while the rest is still arriving -
              * it refreshes itself, and the count climbs as files are found.
              */}
            {growing && !problem && (
                <Alert
                    className="mb-2"
                    type="info"
                    showIcon
                    icon={<Spin size="small" />}
                    message="Indexing this folder…"
                    // Both live figures, each labelled and visually separated.
                    // They were previously printed as bare numbers a line apart
                    // ("1,306 found so far" / "1,273 folders read"), which read
                    // as one figure repeated rather than two different things.
                    // The headline carries no number for the same reason.
                    description={
                        <div>
                            <Flex gap="large" wrap="wrap" style={{ margin: '4px 0 8px' }}>
                                <span>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        Files indexed
                                    </Typography.Text>
                                    <br />
                                    <Typography.Text strong style={{ fontSize: 18 }}>
                                        {total.toLocaleString()}
                                    </Typography.Text>
                                </span>
                                <span>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        Folders read
                                    </Typography.Text>
                                    <br />
                                    <Typography.Text strong style={{ fontSize: 18 }}>
                                        {(root?.folders_scanned ?? 0).toLocaleString()}
                                    </Typography.Text>
                                </span>
                                {root?.drive_api_calls > 0 && (
                                    <span>
                                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                            Drive requests
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text strong style={{ fontSize: 18 }}>
                                            {root.drive_api_calls.toLocaleString()}
                                        </Typography.Text>
                                    </span>
                                )}
                            </Flex>
                            <Typography.Text type="secondary">
                                Updating every few seconds — you can search, filter and download
                                whatever is already listed below.
                            </Typography.Text>
                        </div>
                    }
                />
            )}

            {stalled && !problem && (
                <Alert
                    className="mb-2"
                    type="info"
                    showIcon
                    message={
                        filterActive
                            ? 'Some files may still be missing from this folder'
                            : `Showing the ${total.toLocaleString()} files indexed so far`
                    }
                    description={
                        <span>
                            The crawl is still running but has not turned up new files for a while.
                            Use <strong>Re-sync</strong> above if it looks stuck.
                        </span>
                    }
                />
            )}

            {root?.status === 'interrupted' && !problem && (
                <Alert
                    className="mb-2"
                    type="warning"
                    showIcon
                    message="Indexing stopped before it finished."
                    description={
                        <span>
                            The process was interrupted, so this folder is only partly indexed.
                            Everything listed below is real — use <strong>Re-sync</strong> above to
                            read the rest.
                        </span>
                    }
                />
            )}

            {root?.status === 'failed' && !problem && (
                <Alert
                    className="mb-2"
                    type="error"
                    showIcon
                    message="The last sync of this folder failed."
                    description={
                        <span>
                            {root.error || 'No reason was reported.'} Anything indexed before the
                            failure is still listed below.
                        </span>
                    }
                />
            )}

            <CustomCard>
                {/*
                  * A plain Input with an icon prefix rather than Input.Search:
                  * the Search variant hangs a separate button off the right edge,
                  * which reads as a different control class next to the Selects.
                  * Searching is debounced as you type anyway, so the button had
                  * nothing to do.
                  */}
                {/* mb-2 is the only spacing utility this project defines - see
                    src/index.css. mb-3 silently renders no margin at all. */}
                <Flex gap={12} wrap="wrap" align="center" className="mb-2">
                    <Input
                        allowClear
                        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.35)' }} />}
                        placeholder="Search by file or folder name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 280 }}
                    />
                    <Select
                        value={type}
                        onChange={(v) => { setType(v); setPage(1); }}
                        options={TYPE_OPTIONS}
                        style={{ width: 180 }}
                    />
                    <Select
                        value={sortBy}
                        onChange={(v) => { setSortBy(v); setPage(1); }}
                        options={SORT_OPTIONS}
                        style={{ width: 180 }}
                    />
                    <Select
                        value={sortOrder}
                        onChange={(v) => { setSortOrder(v); setPage(1); }}
                        options={[
                            { value: 'asc', label: 'Ascending' },
                            { value: 'desc', label: 'Descending' },
                        ]}
                        style={{ width: 180 }}
                    />
                </Flex>

                <Table
                    size="middle"
                    className="custom_table"
                    bordered
                    columns={columns}
                    dataSource={files}
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    rowKey="id"
                    locale={{
                        // "No data" is wrong while the folder is still being read -
                        // it reads as "this folder is empty" when it is not.
                        emptyText: (growing || stalled || filterActive)
                            ? (
                                <Flex vertical align="center" gap="small" style={{ padding: '24px 0' }}>
                                    {growing && <Spin />}
                                    <Typography.Text type="secondary">
                                        {growing
                                            ? 'Still reading this folder — files will appear here as they are found.'
                                            : (filterActive
                                                ? `No ${typeNoun}${debouncedSearch ? ` matching “${debouncedSearch}”` : ''} in this folder.`
                                                : 'No files have been indexed for this folder yet. Use Re-sync above to read it.')}
                                    </Typography.Text>
                                </Flex>
                            )
                            : undefined,
                    }}
                    pagination={{
                        current: page,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} files`,
                        onChange: (p, ps) => { setPage(p); setPageSize(ps); },
                    }}
                />
            </CustomCard>
        </div>
    );
};

export default DriveFolderView;
