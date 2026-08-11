import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Typography, Table, Tag, Alert, Input, Button, Divider, message, Space,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';
import './DriveApiDocs.css';

/**
 * Public, client-facing documentation for the Drive Files API.
 *
 * Public on purpose: this is the page an admin sends to a client, so it cannot
 * sit behind the panel's login. Nothing here is sensitive - it documents an API
 * that refuses every request without a token, and the token is supplied by
 * whoever shares the link.
 *
 * `?token=` prefills every example with the reader's own token so the curl
 * commands are runnable as pasted, which is the difference between a page
 * someone reads and one they use. The value stays client-side: HashRouter puts
 * the query after the '#', so it is never sent to a server, never reaches
 * access logs, and never leaves as a Referer header.
 *
 * Kept in step with youguide-backend/Cybellium API Documentation.md, which is
 * the same content in the form clients were originally sent.
 */

const { Title, Paragraph, Text } = Typography;

const PLACEHOLDER = 'YOUR_TOKEN_HERE';

/** Docs describe the API as deployed, so examples follow the configured host. */
const API_BASE = ApiService.URLL;

const Code = ({ children, token }) => {
    const body = String(children).replace(new RegExp(PLACEHOLDER, 'g'), token || PLACEHOLDER);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(body);
            message.success('Copied');
        } catch {
            message.info('Select the text to copy it.');
        }
    };

    return (
        <div className="drive-code">
            <Button
                className="drive-code-copy"
                size="small"
                type="text"
                icon={<CopyOutlined />}
                onClick={copy}
            />
            <pre>{body}</pre>
        </div>
    );
};

const Endpoint = ({ method, path, note }) => {
    const colour = {
        GET: 'blue', POST: 'green', DELETE: 'red', PUT: 'orange',
    }[method] || 'default';

    return (
        <div className="drive-endpoint">
            <Tag color={colour} style={{ margin: 0, fontWeight: 600 }}>{method}</Tag>
            <span>{path}</span>
            {note ? <Text type="secondary" style={{ fontSize: 12 }}>{note}</Text> : null}
        </div>
    );
};

const paramColumns = [
    { title: 'Parameter', dataIndex: 'name', key: 'name', width: 170, render: (v) => <Text code>{v}</Text> },
    { title: 'Description', dataIndex: 'desc', key: 'desc' },
    { title: 'Example', dataIndex: 'example', key: 'example', width: 220, render: (v) => (v ? <Text code style={{ fontSize: 12 }}>{v}</Text> : '—') },
];

const listParams = [
    { key: 'type', name: 'type', desc: 'Filter by file type. Comma-separated, or a group name.', example: 'docx,pdf' },
    { key: 'in_folder', name: 'in_folder', desc: 'Files at any depth below this folder (recursive).', example: 'in_folder=1pE3jw…' },
    { key: 'folder_id', name: 'folder_id', desc: 'Direct children only of this folder, for folder-by-folder browsing.', example: 'folder_id=1itOmG…' },
    { key: 'q', name: 'q', desc: 'Search. Matches filename and folder path. Case-insensitive, partial.', example: 'q=paris' },
    { key: 'search_in', name: 'search_in', desc: 'Narrow the search: all (default), name, path.', example: 'search_in=name' },
    { key: 'extension', name: 'extension', desc: 'Filter by file extension.', example: 'extension=docx,pdf' },
    { key: 'modified_after', name: 'modified_after', desc: 'Only files changed since this date (ISO-8601).', example: 'modified_after=2026-01-01' },
    { key: 'include_folders', name: 'include_folders', desc: 'Include folders in results. Default true.', example: 'include_folders=false' },
    { key: 'sort', name: 'sort', desc: 'name (default), size, modified, created, type.', example: 'sort=modified' },
    { key: 'order', name: 'order', desc: 'asc (default) or desc.', example: 'order=desc' },
    { key: 'page', name: 'page', desc: 'Page number, starts at 1. Default 1.', example: 'page=2' },
    { key: 'limit', name: 'limit', desc: 'Results per page. Default 50, maximum 200.', example: 'limit=20' },
];

const typeRows = [
    { key: 't1', value: 'docx · doc · gdoc', meaning: 'Word documents / Google Docs' },
    { key: 't2', value: 'pdf', meaning: 'PDF' },
    { key: 't3', value: 'xlsx · xls · gsheet', meaning: 'Spreadsheets / Google Sheets' },
    { key: 't4', value: 'pptx · ppt · gslides', meaning: 'Presentations / Google Slides' },
    { key: 't5', value: 'image', meaning: 'Any image (jpg, png, gif, webp…)' },
    { key: 't6', value: 'video', meaning: 'Any video' },
    { key: 't7', value: 'audio', meaning: 'Any audio' },
    { key: 't8', value: 'csv · text · json', meaning: 'Plain-text formats' },
    { key: 't9', value: 'archive', meaning: 'zip, rar, 7z, tar, gz' },
    { key: 't10', value: 'folder', meaning: 'Folder' },
    { key: 't11', value: 'other', meaning: 'Anything else' },
];

const groupRows = [
    { key: 'g1', value: 'document', meaning: 'docx, doc, gdoc, pdf, text, csv, json' },
    { key: 'g2', value: 'office', meaning: 'docx, doc, xlsx, xls, pptx, ppt' },
    { key: 'g3', value: 'spreadsheet', meaning: 'xlsx, xls, gsheet, csv' },
    { key: 'g4', value: 'presentation', meaning: 'pptx, ppt, gslides' },
    { key: 'g5', value: 'media', meaning: 'image, video, audio' },
];

const typeColumns = [
    { title: 'Value', dataIndex: 'value', key: 'value', width: 240, render: (v) => <Text code>{v}</Text> },
    { title: 'Meaning', dataIndex: 'meaning', key: 'meaning' },
];

const errorRows = [
    { key: 'e1', code: 'TOKEN_MISSING', status: 401, action: 'Add the Authorization: Bearer … header.' },
    { key: 'e2', code: 'TOKEN_INVALID', status: 401, action: 'Token not recognised — check for typos.' },
    { key: 'e3', code: 'TOKEN_EXPIRED / TOKEN_INACTIVE', status: 401, action: 'Contact us for a new token.' },
    { key: 'e4', code: 'RATE_LIMITED', status: 429, action: 'Slow down. Wait the seconds given in the Retry-After header.' },
    { key: 'e5', code: 'UNKNOWN_TYPE', status: 400, action: 'Check the type value against the table above.' },
    { key: 'e6', code: 'TYPE_FORBIDDEN / ROOT_FOLDER_FORBIDDEN', status: 403, action: "Your token isn't scoped for that content." },
    { key: 'e7', code: 'FILE_NOT_FOUND', status: 404, action: 'File no longer exists, or is outside your token’s scope.' },
    { key: 'e8', code: 'LINK_EXPIRED', status: 410, action: 'Download link expired — request a new one.' },
    { key: 'e9', code: 'UPLOAD_FORBIDDEN', status: 403, action: "Uploading isn't enabled on your token — contact us." },
    { key: 'e10', code: 'FILE_TOO_LARGE', status: 413, action: 'Upload exceeds 100 MB.' },
    { key: 'e11', code: 'FILE_REQUIRED', status: 400, action: 'Attach the file under the form field name file.' },
    { key: 'e12', code: 'DELETE_FORBIDDEN', status: 403, action: "Deleting isn't enabled on your token — contact us." },
    { key: 'e13', code: 'IS_FOLDER', status: 400, action: 'You asked to delete a folder. Pass recursive=true to confirm.' },
    { key: 'e14', code: 'DRIVE_DELETE_NOT_PERMITTED', status: 403, action: 'Google will not let this file be deleted. See Delete a file.' },
    { key: 'e15', code: 'DRIVE_NOT_FOUND', status: 404, action: 'The file is gone from Google Drive, or no longer shared with us.' },
    { key: 'e16', code: 'WRITE_NOT_CONFIGURED', status: 501, action: 'This library is connected read-only. Contact us.' },
];

const errorColumns = [
    { title: 'Code', dataIndex: 'code', key: 'code', width: 300, render: (v) => <Text code style={{ fontSize: 12 }}>{v}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 80 },
    { title: 'What to do', dataIndex: 'action', key: 'action' },
];

const NAV = [
    ['auth', 'Authentication'],
    ['list-files', '1. List files'],
    ['list-folders', '2. List folders'],
    ['file-details', '3. File details'],
    ['download-link', '4. Get a download link'],
    ['download', '5. Download the file'],
    ['delete', '6. Delete a file'],
    ['upload', '7. Upload a new version'],
    ['stats', '8. Library statistics'],
    ['freshness', '9. Data freshness'],
    ['types', 'File types'],
    ['errors', 'Errors'],
    ['quickstart', 'Quick start'],
    ['notes', 'Notes'],
];

/**
 * Scrolls rather than linking to #id. The panel runs on HashRouter, so a real
 * anchor href would overwrite the route in the address bar and take the token
 * in the query string with it.
 */
const ContentsNav = () => (
    <nav>
        <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            On this page
        </Text>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
            {NAV.map(([id, label]) => (
                <li key={id} style={{ margin: '2px 0' }}>
                    <Typography.Link
                        style={{ fontSize: 13 }}
                        onClick={() => document
                            .getElementById(id)
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    >
                        {label}
                    </Typography.Link>
                </li>
            ))}
        </ul>
    </nav>
);

const DriveApiDocs = () => {
    const { search } = useLocation();
    // HashRouter keeps the query after the '#', so a token in the link never
    // reaches the server it points at.
    const fromLink = useMemo(() => new URLSearchParams(search).get('token') || '', [search]);
    const [token, setToken] = useState(fromLink);

    const code = (body) => <Code token={token}>{body}</Code>;

    return (
        <div className="drive-docs">
            <div className="drive-docs-inner">
                <div className="drive-docs-main">
                    <div className="drive-docs-hero">
                        <Title level={1} style={{ marginBottom: 4 }}>YouGuide — Drive Files API</Title>
                        <Paragraph style={{ fontSize: 16, marginBottom: 12 }}>
                            Access documents, images, and other files from our shared library over a
                            simple REST API. Browse and search with filtering and pagination,
                            download any file, upload edited copies back as new versions, and delete
                            what is no longer needed.
                        </Paragraph>
                        <div className="drive-endpoint">
                            <Text strong>Base URL</Text>
                            <Text copyable>{API_BASE}</Text>
                        </div>
                    </div>

                    {/*
                      * Pasting a token here rewrites every example on the page.
                      * Docs that can be run as-is get used; docs full of
                      * YOUR_TOKEN_HERE get skim-read and half-implemented.
                      */}
                    <div className="drive-docs-tokenbox">
                        <Space direction="vertical" size={6} style={{ width: '100%' }}>
                            <Text strong>Your API token</Text>
                            <Input
                                value={token}
                                onChange={(e) => setToken(e.target.value.trim())}
                                placeholder="ygdrv_…"
                                allowClear
                                size="large"
                                style={{ fontFamily: 'monospace' }}
                            />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {token
                                    ? 'Every example below now uses this token — copy and run them as they are.'
                                    : 'Paste your token to fill it into every example on this page. It stays in your browser and is never sent anywhere.'}
                            </Text>
                        </Space>
                    </div>

                    <Title level={2} id="auth">Authentication</Title>
                    <Paragraph>
                        Every request needs your token in the <Text code>Authorization</Text> header:
                    </Paragraph>
                    {code('Authorization: Bearer YOUR_TOKEN_HERE')}
                    {code(`curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  "${API_BASE}/api/drive/files?type=docx&limit=20"`)}
                    <Paragraph>
                        Keep your token private — it identifies your account and is scoped to your
                        folder. Contact us if it ever needs to be replaced; the old one stops working
                        the moment a new one is issued.
                    </Paragraph>

                    <Divider />

                    <Title level={2} id="list-files">1. List files</Title>
                    <Endpoint method="GET" path="/api/drive/files" />
                    <Paragraph>The main endpoint. Returns a paginated, filterable list.</Paragraph>

                    <Title level={3}>Parameters</Title>
                    <Table
                        size="small"
                        bordered
                        pagination={false}
                        columns={paramColumns}
                        dataSource={listParams}
                        scroll={{ x: 'max-content' }}
                    />

                    <Title level={3}>Examples</Title>
                    {code(`# All Word documents, first page
/api/drive/files?type=docx&page=1&limit=20

# All documents anywhere inside a folder, files only
/api/drive/files?type=docx&in_folder=1pE3jwLEdt-b8vnkEgZjaRreRJSxuU6Be&include_folders=false

# Just what's directly inside one folder
/api/drive/files?folder_id=1itOmGfgajSzpujp9uNCY_fxzroAeY0J3

# Search by name
/api/drive/files?q=artificial+intelligence

# Newest first
/api/drive/files?type=pdf&sort=modified&order=desc`)}

                    <Title level={3}>Response</Title>
                    {code(`{
  "success": true,
  "data": [
    {
      "id": "1Y-8YaUjj2GdJPBLCQ_eogMoZoVaIMFii",
      "name": "Artificial Intelligence Overview.docx",
      "type": "docx",
      "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "extension": "docx",
      "size": 248310,
      "is_folder": false,
      "parent_id": "1itOmGfgajSzpujp9uNCY_fxzroAeY0J3",
      "path": "Artificial Intelligence/Research",
      "depth": 2,
      "checksum": "9f8b2c1d...",
      "thumbnail_link": null,
      "icon_link": "https://drive-thirdparty.googleusercontent.com/...",
      "view_link": "https://drive.google.com/file/d/1Y-8Ya.../view",
      "created_at": "2026-02-11T09:14:00.000Z",
      "modified_at": "2026-07-23T18:01:05.740Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1487,
    "total_pages": 75,
    "has_next": true,
    "has_prev": false
  }
}`)}
                    <Paragraph>
                        Use <Text code>pagination.has_next</Text> to know when to stop paging.
                    </Paragraph>

                    <Title level={3}>Searching</Title>
                    <Paragraph>
                        Pass <Text code>q</Text> to search. By default it matches{' '}
                        <strong>both the filename and the folder path</strong>, so searching for a
                        topic returns the documents inside a folder of that name — not just files
                        that happen to be named after it.
                    </Paragraph>
                    {code(`# Anything named "cyber" OR sitting in a folder named "cyber"
/api/drive/files?q=cyber

# Filenames only
/api/drive/files?q=cyber&search_in=name

# Folder paths only
/api/drive/files?q=cyber&search_in=path

# Search combined with filters — all parameters stack
/api/drive/files?q=security&type=docx&include_folders=false&page=1&limit=20`)}
                    <Paragraph>
                        Search combines with every other parameter, so you can scope a search to one
                        folder (<Text code>in_folder</Text>), one file type (<Text code>type</Text>),
                        or a date range (<Text code>modified_after</Text>). Searching is done on our
                        servers — never download a full listing to filter it yourself.
                    </Paragraph>

                    <Divider />

                    <Title level={2} id="list-folders">2. List folders</Title>
                    <Endpoint method="GET" path="/api/drive/folders" />
                    <Paragraph>
                        Folders only — useful for building a navigation tree or folder picker without
                        paging through files. Accepts <Text code>folder_id</Text>,{' '}
                        <Text code>in_folder</Text>, <Text code>q</Text>, <Text code>page</Text>,{' '}
                        <Text code>limit</Text>.
                    </Paragraph>

                    <Divider />

                    <Title level={2} id="file-details">3. File details</Title>
                    <Endpoint method="GET" path="/api/drive/files/{fileId}" />
                    <Paragraph>
                        Returns one file's full details, its <Text code>breadcrumb</Text> (the folder
                        path above it), and a ready-to-use download link.
                    </Paragraph>
                    {code(`{
  "success": true,
  "data": {
    "id": "1Y-8YaUjj2GdJPBLCQ_eogMoZoVaIMFii",
    "name": "Artificial Intelligence Overview.docx",
    "type": "docx",
    "size": 248310,
    "path": "Artificial Intelligence/Research",
    "breadcrumb": [
      { "id": "1pE3jw...", "name": "Main Library" },
      { "id": "1itOmG...", "name": "Artificial Intelligence" }
    ],
    "download": {
      "url": "${API_BASE}/api/drive/download/eyJhbGciOi...",
      "expires_in": 900,
      "expires_at": "2026-08-07T12:30:00.000Z",
      "converted_to": null
    }
  }
}`)}

                    <Divider />

                    <Title level={2} id="download-link">4. Get a download link</Title>
                    <Endpoint method="POST" path="/api/drive/files/{fileId}/download-link" />
                    {code(`curl -X POST -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  "${API_BASE}/api/drive/files/1Y-8YaUjj2GdJPBLCQ_eogMoZoVaIMFii/download-link"`)}
                    {code(`{
  "success": true,
  "data": {
    "file": { "id": "1Y-8Ya...", "name": "Artificial Intelligence Overview.docx" },
    "url": "${API_BASE}/api/drive/download/eyJhbGciOi...",
    "expires_in": 900,
    "expires_at": "2026-08-07T12:30:00.000Z",
    "converted_to": null
  }
}`)}

                    <Divider />

                    <Title level={2} id="download">5. Download the file</Title>
                    <Endpoint method="GET" path="/api/drive/download/{token}" note="no Authorization header" />
                    <Paragraph>
                        Open the <Text code>url</Text> from step 4 <strong>directly</strong> — in a
                        browser, an <Text code>&lt;a href&gt;</Text>, or any download client.{' '}
                        <strong>No <Text code>Authorization</Text> header is needed</strong>: the
                        signed URL is the credential.
                    </Paragraph>
                    <Paragraph>Two things to know:</Paragraph>
                    <ul>
                        <li>
                            <strong>Links expire after 15 minutes.</strong> Generate them when the
                            user is ready to download, not in advance. Expired links return{' '}
                            <Text code>410</Text> — just request a new one.
                        </li>
                        <li>
                            <strong>Google Docs, Sheets, and Slides are converted automatically</strong>{' '}
                            to <Text code>.docx</Text>, <Text code>.xlsx</Text>, and{' '}
                            <Text code>.pptx</Text>. The <Text code>converted_to</Text> field tells
                            you which format you'll receive.
                        </li>
                    </ul>

                    <Divider />

                    <Title level={2} id="delete">6. Delete a file</Title>
                    <Endpoint method="DELETE" path="/api/drive/files/{fileId}" />
                    <Paragraph>
                        Moves the file to the <strong>Google Drive trash</strong> — the real Drive,
                        not just our index. It disappears from listings immediately and the owner can
                        restore it from their Trash for <strong>30 days</strong>, after which Google
                        purges it for good.
                    </Paragraph>
                    <Alert
                        type="warning"
                        showIcon
                        style={{ margin: '12px 0' }}
                        message="Deleting must be enabled on your token"
                        description={
                            <span>
                                Tokens are read-only unless deletion was explicitly granted. Without
                                it you get <Text code>403 DELETE_FORBIDDEN</Text>. Ask us to turn it on.
                            </span>
                        }
                    />
                    {code(`curl -X DELETE -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  "${API_BASE}/api/drive/files/1Y-8YaUjj2GdJPBLCQ_eogMoZoVaIMFii"`)}

                    <Title level={3}>Response — <Text code>200 OK</Text></Title>
                    {code(`{
  "success": true,
  "message": "File moved to the Google Drive trash. It can be restored there for 30 days.",
  "data": {
    "id": "1Y-8YaUjj2GdJPBLCQ_eogMoZoVaIMFii",
    "name": "Artificial Intelligence Overview.docx",
    "recoverable": true
  }
}`)}

                    <Title level={3}>Deleting a folder</Title>
                    <Paragraph>
                        Deleting a folder takes <strong>everything inside it</strong>, so it has to be
                        asked for explicitly with <Text code>recursive=true</Text>. Without the flag
                        the request is refused with <Text code>400 IS_FOLDER</Text> and nothing is
                        touched.
                    </Paragraph>
                    {code(`curl -X DELETE -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  "${API_BASE}/api/drive/files/1itOmGfgajSzpujp9uNCY_fxzroAeY0J3?recursive=true"`)}

                    <Title level={3}>When Google refuses</Title>
                    <Paragraph>
                        Whether a file <em>can</em> be deleted depends on where it lives, not on how
                        generously it has been shared:
                    </Paragraph>
                    <ul>
                        <li>
                            <strong>Shared drive</strong> — works. We need Content manager (or
                            Manager) on that drive.
                        </li>
                        <li>
                            <strong>Someone's personal My Drive</strong> — not possible. Google only
                            lets the file's <em>owner</em> delete it; Editor access grants editing,
                            never deletion, so no sharing change enables it.
                        </li>
                    </ul>
                    <Paragraph>
                        In the second case the API answers{' '}
                        <Text code>403 DRIVE_DELETE_NOT_PERMITTED</Text> and includes Google's own
                        verdict so it is clear the refusal is not ours:
                    </Paragraph>
                    {code(`{
  "success": false,
  "error": "Google will not allow this file to be deleted",
  "message": "This file sits in someone else's My Drive, where Google only lets the OWNER delete it…",
  "code": "DRIVE_DELETE_NOT_PERMITTED",
  "details": {
    "can_edit": true,
    "can_trash": false,
    "owned_by_us": false,
    "in_shared_drive": false
  }
}`)}
                    <Paragraph type="secondary" style={{ fontSize: 13 }}>
                        Permanent deletion is not offered. Google reserves it for the file's owner or
                        a shared-drive Manager, so an option that could only ever fail is worse than
                        none — and trashing is what makes an accidental delete recoverable.
                    </Paragraph>

                    <Divider />

                    <Title level={2} id="upload">7. Upload an edited file as a new version</Title>
                    <Endpoint method="POST" path="/api/drive/files/{fileId}/update_docx_new_version" />
                    <Paragraph>
                        Send back a modified copy of a file. It lands in the <strong>same folder</strong>{' '}
                        as the original, automatically named with the next free version number.
                    </Paragraph>
                    <Paragraph>
                        The original file is <strong>never overwritten</strong> — each upload creates
                        a new version alongside it, so nothing is ever lost.
                    </Paragraph>

                    <Title level={3}>Naming</Title>
                    <Table
                        size="small"
                        bordered
                        pagination={false}
                        columns={[
                            { title: 'Already in the folder', dataIndex: 'has', key: 'has', render: (v) => <Text code>{v}</Text> },
                            { title: 'Your upload becomes', dataIndex: 'becomes', key: 'becomes', render: (v) => <Text code>{v}</Text> },
                        ]}
                        dataSource={[
                            { key: 'v1', has: 'Report.docx', becomes: 'Report_V1.docx' },
                            { key: 'v2', has: 'Report.docx, Report_V1.docx', becomes: 'Report_V2.docx' },
                            { key: 'v3', has: 'Report.docx, Report_V1.docx, Report_V2.docx', becomes: 'Report_V3.docx' },
                        ]}
                        scroll={{ x: 'max-content' }}
                    />
                    <Paragraph style={{ marginTop: 12 }}>
                        Version numbers never collide or reset — the API checks the folder each time
                        and takes the next free number. Uploading a file already named{' '}
                        <Text code>Report_V2</Text> produces <Text code>Report_V3</Text>, not{' '}
                        <Text code>Report_V2_V1</Text>.
                    </Paragraph>

                    <Title level={3}>Request</Title>
                    <Paragraph>Send as <Text code>multipart/form-data</Text>:</Paragraph>
                    <Table
                        size="small"
                        bordered
                        pagination={false}
                        columns={[
                            { title: 'Field', dataIndex: 'field', key: 'field', width: 120, render: (v) => <Text code>{v}</Text> },
                            { title: 'Required', dataIndex: 'req', key: 'req', width: 100 },
                            { title: 'Description', dataIndex: 'desc', key: 'desc' },
                        ]}
                        dataSource={[
                            { key: 'f1', field: 'file', req: 'Yes', desc: 'The edited file (binary)' },
                            { key: 'f2', field: 'name', req: '—', desc: 'Override the automatic name. Skips versioning entirely.' },
                        ]}
                        scroll={{ x: 'max-content' }}
                    />
                    {code(`curl -X POST \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -F "file=@/path/to/edited-report.docx" \\
  "${API_BASE}/api/drive/files/1Y-8YaUjj2GdJPBLCQ_eogMoZoVaIMFii/update_docx_new_version"`)}
                    {code(`const form = new FormData();
form.append('file', fileInput.files[0]);

const res = await fetch(
  \`${API_BASE}/api/drive/files/\${fileId}/update_docx_new_version\`,
  { method: 'POST', headers: { Authorization: \`Bearer \${TOKEN}\` }, body: form }
);`)}

                    <Title level={3}>Response — <Text code>201 Created</Text></Title>
                    {code(`{
  "success": true,
  "message": "Uploaded as Report_V3.docx",
  "data": {
    "file": {
      "id": "1NewFileIdAbc123",
      "name": "Report_V3.docx",
      "type": "docx",
      "size": 251044,
      "path": "Artificial Intelligence/Research"
    },
    "version": 3,
    "based_on": { "id": "1Y-8Ya...", "name": "Report.docx" },
    "folder_id": "1itOmG...",
    "previous_versions": ["Report_V1.docx", "Report_V2.docx"],
    "edit_link": "https://docs.google.com/document/d/1NewFileIdAbc123/edit",
    "view_link": "https://drive.google.com/file/d/1NewFileIdAbc123/view"
  }
}`)}
                    <Paragraph>
                        The new file appears in <Text code>GET /api/drive/files</Text>{' '}
                        <strong>immediately</strong> — no waiting for the next refresh.
                    </Paragraph>

                    <Title level={3}>Upload to a specific folder</Title>
                    <Endpoint method="POST" path="/api/drive/upload" />
                    <Paragraph>
                        Same <Text code>multipart/form-data</Text>, plus a{' '}
                        <Text code>folder_id</Text> field. Without a <Text code>name</Text>, the
                        uploaded filename is versioned against that folder's existing contents.
                    </Paragraph>

                    <Title level={3}>Notes</Title>
                    <ul>
                        <li>Maximum upload size is <strong>100 MB</strong>.</li>
                        <li>
                            Uploading must be enabled on your token — you'll get{' '}
                            <Text code>403 UPLOAD_FORBIDDEN</Text> otherwise. Ask us to turn it on.
                        </li>
                        <li>
                            The Drive folder must grant us <strong>Editor</strong> access. With
                            view-only access uploads are rejected.
                        </li>
                    </ul>

                    <Divider />

                    <Title level={2} id="stats">8. Library statistics</Title>
                    <Endpoint method="GET" path="/api/drive/stats" />
                    <Paragraph>
                        File counts and total size per type — handy for showing totals in a UI.
                    </Paragraph>
                    {code(`{
  "success": true,
  "data": {
    "by_type": [
      { "type": "docx",   "count": 1487, "total_size": 412339922 },
      { "type": "image",  "count": 3204, "total_size": 891233001 },
      { "type": "folder", "count": 1032, "total_size": 0 }
    ],
    "totals": { "count": 5723, "total_size": 1303572923 }
  }
}`)}

                    <Divider />

                    <Title level={2} id="freshness">9. Data freshness</Title>
                    <Endpoint method="GET" path="/api/drive/sync/status" />
                    <Paragraph>
                        Shows when the library was last refreshed from Google Drive. Look at{' '}
                        <Text code>roots[0].last_completed_at</Text>.
                    </Paragraph>
                    <Paragraph>
                        File data is indexed on our side and refreshed automatically every few hours,
                        so listing responses are fast regardless of library size. Message us if you
                        ever need an immediate refresh.
                    </Paragraph>

                    <Divider />

                    <Title level={2} id="types">File types</Title>
                    <Table
                        size="small"
                        bordered
                        pagination={false}
                        columns={typeColumns}
                        dataSource={typeRows}
                        scroll={{ x: 'max-content' }}
                    />
                    <Title level={3}>Group shortcuts</Title>
                    <Paragraph>Use these instead of listing types individually:</Paragraph>
                    <Table
                        size="small"
                        bordered
                        pagination={false}
                        columns={[
                            { title: 'Group', dataIndex: 'value', key: 'value', width: 240, render: (v) => <Text code>{v}</Text> },
                            { title: 'Expands to', dataIndex: 'meaning', key: 'meaning' },
                        ]}
                        dataSource={groupRows}
                        scroll={{ x: 'max-content' }}
                    />

                    <Divider />

                    <Title level={2} id="errors">Errors</Title>
                    <Paragraph>All errors return the same shape:</Paragraph>
                    {code(`{
  "success": false,
  "error": "Token expired",
  "message": "This API token expired on 2026-08-01T00:00:00.000Z",
  "code": "TOKEN_EXPIRED"
}`)}
                    <Table
                        size="small"
                        bordered
                        pagination={false}
                        columns={errorColumns}
                        dataSource={errorRows}
                        scroll={{ x: 'max-content' }}
                    />

                    <Divider />

                    <Title level={2} id="quickstart">Quick start</Title>
                    {code(`TOKEN="YOUR_TOKEN_HERE"
BASE="${API_BASE}"

# 1. See what's available
curl -H "Authorization: Bearer $TOKEN" "$BASE/api/drive/stats"

# 2. List Word documents
curl -H "Authorization: Bearer $TOKEN" \\
  "$BASE/api/drive/files?type=docx&page=1&limit=20&include_folders=false"

# 3. Get a download link (use an id from step 2)
curl -X POST -H "Authorization: Bearer $TOKEN" \\
  "$BASE/api/drive/files/FILE_ID_HERE/download-link"

# 4. Download it (no header needed)
curl -L -o file.docx "PASTE_THE_URL_FROM_STEP_3"

# 5. Search
curl -H "Authorization: Bearer $TOKEN" \\
  "$BASE/api/drive/files?q=security&type=docx"

# 6. Upload the edited file back as a new version
curl -X POST -H "Authorization: Bearer $TOKEN" \\
  -F "file=@file.docx" \\
  "$BASE/api/drive/files/FILE_ID_HERE/update_docx_new_version"

# 7. Delete a file (moves it to the Drive trash)
curl -X DELETE -H "Authorization: Bearer $TOKEN" \\
  "$BASE/api/drive/files/FILE_ID_HERE"`)}

                    <Divider />

                    <Title level={2} id="notes">Notes</Title>
                    <ul>
                        <li>
                            Rate limit: <strong>120 requests per minute</strong> by default. Ask us if
                            you need more.
                        </li>
                        <li>
                            Pagination maximum is <strong>200 per page</strong>. For bulk exports,
                            page through with <Text code>in_folder</Text> rather than requesting a
                            huge limit.
                        </li>
                        <li>
                            Filtering happens server-side — always prefer <Text code>type</Text> /{' '}
                            <Text code>in_folder</Text> / <Text code>q</Text> over downloading
                            everything and filtering yourself.
                        </li>
                        <li>
                            Your token is scoped to your own folder. Requests for anything outside it
                            answer <Text code>404</Text>, never someone else's data.
                        </li>
                    </ul>

                    <Paragraph style={{ marginTop: 24 }}>
                        Questions or a token change — just get in touch.
                    </Paragraph>
                </div>

                <div className="drive-docs-nav">
                    <ContentsNav />
                </div>
            </div>
        </div>
    );
};

export default DriveApiDocs;
