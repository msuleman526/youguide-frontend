import React, { useCallback, useEffect, useState } from 'react';
import {
    Drawer, Button, Form, Input, Typography, Alert, message, Radio, Spin, Tag,
} from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import ApiService from '../../APIServices/ApiService';

/**
 * Adds a Google Drive folder to the index.
 *
 * Two kinds of folder, one credential. The server reads Drive as a service
 * account, which is a real Google identity - so it reads a publicly shared
 * folder with no setup at all, AND a private one once that folder has been
 * shared with its address. There is no "private mode": the difference is
 * entirely whether the owner has shared it yet.
 *
 * What the drawer has to communicate is that READ and DELETE need different
 * things, and the gap between them is not a matter of permission level:
 *
 *   read/download - public link, or Viewer on the folder. Easy either way.
 *   delete        - the folder must be in a Workspace SHARED DRIVE with this
 *                   address as a Content manager. Editor on an ordinary folder
 *                   does not do it, because Google only lets a file's OWNER
 *                   delete it. In a personal Drive it is simply not possible.
 *
 * Getting that wrong costs somebody a support conversation about a permission
 * they already granted, so it is stated up front rather than discovered later.
 *
 * Check access is offered before adding because otherwise the first sign of a
 * sharing problem is a crawl that fails minutes later with a bare 404.
 *
 * There is no separate "link" step on this backend - registering a folder starts
 * its crawl, and the crawler's own state row is what the folder list reads.
 */

/** Mirrors the backend's parseFolderId, purely to fail fast before a round trip. */
const extractFolderId = (input) => {
    const value = String(input || '').trim();
    if (!value) return null;
    const fromUrl = /\/folders\/([a-zA-Z0-9_-]+)/.exec(value);
    if (fromUrl) return fromUrl[1];
    const fromQuery = /[?&]id=([a-zA-Z0-9_-]+)/.exec(value);
    if (fromQuery) return fromQuery[1];
    // A bare id - Drive ids are long and have no slashes or spaces.
    if (/^[a-zA-Z0-9_-]{10,}$/.test(value)) return value;
    return null;
};

const LinkDrivePopup = ({ open, setOpen, onLinked }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [access, setAccess] = useState(null);
    const [accessMode, setAccessMode] = useState('public');
    const [checking, setChecking] = useState(false);
    const [checkResult, setCheckResult] = useState(null);

    const loadAccess = useCallback(async () => {
        try {
            const res = await ApiService.getDriveAccessInfo();
            setAccess(res?.data || null);
        } catch {
            setAccess(null);
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        form.resetFields();
        setAccessMode('public');
        setCheckResult(null);
        loadAccess();
    }, [open, form, loadAccess]);

    const closeDrawer = () => setOpen(false);

    const onCheck = async () => {
        const url = form.getFieldValue('folderUrl');
        if (!extractFolderId(url)) {
            message.error('That does not look like a Drive folder link or id.');
            return;
        }
        setChecking(true);
        setCheckResult(null);
        try {
            const res = await ApiService.checkDriveFolder(String(url).trim());
            setCheckResult(res?.data || null);
        } catch (error) {
            const d = error?.response?.data;
            setCheckResult({ reachable: false, message: d?.message || d?.error || 'Check failed.' });
        } finally {
            setChecking(false);
        }
    };

    const onFinish = async (values) => {
        const folderId = extractFolderId(values.folderUrl);
        if (!folderId) {
            message.error('That does not look like a Drive folder link or id.');
            return;
        }

        setLoading(true);
        try {
            // Registers the folder and kicks off its first crawl. Indexing runs
            // in the background, so this returns as soon as it is accepted.
            const res = await ApiService.addDriveRootFolder({
                folderUrl: values.folderUrl?.trim(),
                name: values.name?.trim(),
                accessMode,
            });

            message.success(
                res?.already_present
                    ? 'That folder was already added. Re-indexing it now.'
                    : 'Folder added. Indexing has started — files appear as they are found.'
            );
            onLinked(res?.data || { folder_id: folderId });
        } catch (error) {
            const d = error?.response?.data;

            if (d?.code === 'DRIVE_NOT_CONFIGURED') {
                message.error('Google Drive credentials are not set on the server, so nothing can be read.');
            } else if (d?.code === 'INVALID_FOLDER') {
                message.error('That does not look like a Drive folder link or id.');
            } else {
                message.error(d?.message || d?.error || 'Failed to add the folder.');
            }
        } finally {
            setLoading(false);
        }
    };

    const email = access?.service_account_email;
    const canDoPrivate = access?.can_read_private;

    return (
        <Drawer
            title={
                <Typography.Title level={3} className="fw-500">
                    Add Drive Folder
                </Typography.Title>
            }
            width={480}
            onClose={closeDrawer}
            open={open}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={() => form.submit()} type="primary" loading={loading}>
                        Add &amp; Index
                    </Button>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="folderUrl"
                    label="Google Drive Folder Link"
                    rules={[{ required: true, message: 'Folder link is required' }]}
                    extra="Paste the whole share link, or just the folder id."
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="https://drive.google.com/drive/folders/1a2B3c...?usp=sharing"
                        onChange={() => setCheckResult(null)}
                    />
                </Form.Item>

                {/*
                  * Both kinds work, so this is not a capability switch - it only
                  * labels the folder in the list, which is worth knowing later: a
                  * public link can be revoked by anyone who has it, an explicit
                  * share cannot.
                  */}
                <Form.Item
                    label="How is this folder shared?"
                    extra="Both work. This is only recorded as a label."
                >
                    <Radio.Group
                        value={accessMode}
                        onChange={(e) => setAccessMode(e.target.value)}
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button value="public">Anyone with the link</Radio.Button>
                        <Radio.Button value="private" disabled={!canDoPrivate}>
                            Shared with us
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Display Name (optional)"
                    extra="Leave empty to use the folder's own name from Google Drive."
                >
                    <Input placeholder="e.g. Marketing Assets" />
                </Form.Item>
            </Form>

            {/*
              * One instruction, not one per mode. Since the server reads Drive as
              * a service account it handles both kinds of folder, so telling
              * someone their folder "must be shared as Anyone with the link" is
              * simply wrong now - and it was the more invasive of the two options
              * to be recommending by default.
              *
              * A public folder needs nothing. A private one needs this address.
              * Check access below says which situation you are in.
              */}
            {canDoPrivate ? (
                <Alert
                    type="info"
                    showIcon
                    message="Giving us access"
                    description={
                        <div>
                            <Typography.Text copyable code style={{ fontSize: 13, wordBreak: 'break-all' }}>
                                {email}
                            </Typography.Text>

                            <p style={{ margin: '12px 0 4px' }}>
                                <Typography.Text strong>To read and download files</Typography.Text>
                            </p>
                            <p style={{ margin: 0 }}>
                                A folder shared as “Anyone with the link” already works — nothing to
                                do. Otherwise the owner clicks <strong>Share</strong> on the folder,
                                pastes the address above and gives it <strong>Viewer</strong>.
                                Untick “Notify people”: it is not a mailbox and the message bounces.
                            </p>

                            <p style={{ margin: '12px 0 4px' }}>
                                <Typography.Text strong>To also delete files</Typography.Text>
                            </p>
                            <p style={{ margin: 0 }}>
                                The folder has to live in a Google Workspace{' '}
                                <strong>shared drive</strong>, with this address added under{' '}
                                <strong>Manage members</strong> as a <strong>Content manager</strong>.
                            </p>
                            <p style={{ margin: '6px 0 0' }}>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    Editor on an ordinary folder is <em>not</em> enough — Google only
                                    lets a file’s owner delete it, so in a personal Drive deleting is
                                    impossible however the folder is shared.
                                </Typography.Text>
                            </p>

                            <p style={{ margin: '12px 0 0' }}>
                                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                    We only ever see folders shared with this address. Nothing else
                                    in their Drive is visible to us.
                                </Typography.Text>
                            </p>
                        </div>
                    }
                    style={{ marginBottom: 12 }}
                />
            ) : (
                <Alert
                    type="warning"
                    showIcon
                    message="This server can only read publicly shared folders."
                    description="It is running on an API key, which is anonymous. Private folders need a service account configured on the server before they can be read."
                    style={{ marginBottom: 12 }}
                />
            )}

            {/*
              * Checking before adding turns a sharing mistake into an immediate,
              * readable answer instead of a crawl that fails minutes later.
              */}
            <Button onClick={onCheck} loading={checking} block style={{ marginBottom: 12 }}>
                Check access
            </Button>

            {checking && (
                <div style={{ textAlign: 'center', padding: 8 }}>
                    <Spin size="small" /> <Typography.Text type="secondary">Asking Google…</Typography.Text>
                </div>
            )}

            {checkResult && !checking && (
                <Alert
                    type={checkResult.reachable ? 'success' : 'warning'}
                    showIcon
                    icon={checkResult.reachable
                        ? <CheckCircleFilled style={{ color: '#52c41a' }} />
                        : <CloseCircleFilled style={{ color: '#faad14' }} />}
                    message={
                        checkResult.reachable
                            ? <span>Readable — <strong>{checkResult.name}</strong></span>
                            : 'Not readable yet'
                    }
                    description={
                        <div>
                            <p style={{ margin: 0 }}>{checkResult.message}</p>
                            {checkResult.shared_drive && (
                                <p style={{ margin: '8px 0 0' }}>
                                    <Tag color="blue">Shared drive</Tag>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        Folder-level sharing is enough to index it.
                                    </Typography.Text>
                                </p>
                            )}
                        </div>
                    }
                />
            )}

            <Alert
                type="warning"
                showIcon
                message="Indexing runs in the background."
                description="Every subfolder is read one at a time, so a large tree can take several minutes. You can close this and watch the folder list."
                style={{ marginTop: 12 }}
            />
        </Drawer>
    );
};

export default LinkDrivePopup;
