import React, { useEffect, useState } from 'react';
import {
    Button, Col, Image, Row, Typography, message, Select, Input, Empty, Divider,
    Modal, Form, Result, Spin, Popover, Badge, Space
} from 'antd';
import { ShoppingCartOutlined, FilterOutlined } from '@ant-design/icons';
import { useParams, useSearchParams } from 'react-router-dom';
import ApiService from '../../APIServices/ApiService';
import { showAddress } from '../../Utils/Utils';
import logo from '../../assets/large_logo.png';

const languageOptions = [
    { name: 'Arabic', code: 'ar' },
    { name: 'Chinese', code: 'zh_cn' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Russian', code: 'ru' },
    { name: 'Italian', code: 'it' },
    { name: 'English', code: 'en' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Polish', code: 'pl' },
    { name: 'Dutch', code: 'nl' },
];

const AffiliateSubscriptionGuides = () => {
    const { id: slug } = useParams();
    const [searchParams] = useSearchParams();
    const src = searchParams.get('src') || null;

    const [resolving, setResolving] = useState(true);
    const [resolveError, setResolveError] = useState(null);
    const [linkInfo, setLinkInfo] = useState(null);

    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [query, setQuery] = useState('');
    const [language, setLanguage] = useState('en');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [buyOpen, setBuyOpen] = useState(false);
    const [buyBook, setBuyBook] = useState(null);
    const [buyForm] = Form.useForm();
    const [buying, setBuying] = useState(false);

    const primaryColor = linkInfo?.affiliate?.primaryColor || '#29b8e3';
    const isPaid = linkInfo?.type === 'paid';

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setResolving(true);
            try {
                const info = await ApiService.getAffiliateLinkBySlug(slug, src);
                if (cancelled) return;
                setLinkInfo(info);
            } catch (e) {
                if (cancelled) return;
                setResolveError(e?.response?.data?.message || 'Link unavailable.');
            } finally {
                if (!cancelled) setResolving(false);
            }
        })();
        return () => { cancelled = true; };
    }, [slug, src]);

    useEffect(() => {
        if (linkInfo) fetchGuides(1, true);
        // eslint-disable-next-line
    }, [linkInfo, language]);

    const fetchGuides = async (page, reset = false) => {
        if (reset) {
            setGuides([]);
            setPageNo(1);
        }
        setLoading(true);
        const isMobile = window.innerWidth <= 768;
        const limit = isMobile ? 4 : 8;
        try {
            const params = { page, limit, query, lang: language };
            if (selectedCategories.length) params.categories = selectedCategories.join(',');
            const res = await ApiService.getBooksByLinkSlug(slug, params);
            if (reset) {
                setGuides(res.books || []);
            } else {
                setGuides((prev) => [...prev, ...(res.books || [])]);
            }
            setHasMore(res.totalPages > res.currentPage);
        } catch (e) {
            message.error('Failed to fetch guides.');
        } finally {
            setLoading(false);
        }
    };

    const onSearchClick = () => fetchGuides(1, true);

    const handleLoadMore = () => {
        const next = pageNo + 1;
        setPageNo(next);
        fetchGuides(next, false);
    };

    const openFreeGuide = (book) => {
        // The viewer (PdfAffiliateViewer) calls logAffiliateGuideOpen on mount,
        // so we don't need to log here — just navigate.
        const srcQuery = src ? `?src=${encodeURIComponent(src)}` : '';
        window.open(`#/view-affiliate-content/${slug}/${book._id}${srcQuery}`, '_blank', 'noopener');
    };

    const startBuy = (book) => {
        setBuyBook(book);
        setBuyOpen(true);
        buyForm.resetFields();
    };

    const submitBuy = async (values) => {
        try {
            setBuying(true);
            const res = await ApiService.createAffiliateGuideCheckout({
                slug, bookId: buyBook._id, src, email: values.email, name: values.name,
            });
            if (res.checkout_url) {
                window.location.href = res.checkout_url;
            } else {
                message.error('Could not start checkout.');
            }
        } catch (e) {
            message.error(e?.response?.data?.message || 'Checkout failed.');
        } finally {
            setBuying(false);
        }
    };

    if (resolving) {
        return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
    }
    if (resolveError) {
        return <Result status="warning" title="Link unavailable" subTitle={resolveError} />;
    }

    const affiliateName = linkInfo?.affiliate?.name;
    const affiliateLogo = linkInfo?.affiliate?.logo;
    const client = linkInfo?.client || null;
    const headerName = client?.name || affiliateName;
    const headerLogo = client?.logo || affiliateLogo;
    const linkCategories = linkInfo?.categories || [];
    const activeFilterCount = selectedCategories.length + (language !== 'en' ? 1 : 0);

    const filterPanel = (
        <div style={{ width: 280, maxWidth: '90vw' }}>
            <Typography.Text strong style={{ display: 'block', marginBottom: 6 }}>Categories</Typography.Text>
            <Select
                mode="multiple"
                allowClear
                placeholder="All categories"
                value={selectedCategories}
                onChange={setSelectedCategories}
                options={linkCategories.map((c) => ({ label: c.name, value: c._id }))}
                style={{ width: '100%', marginBottom: 12 }}
                maxTagCount="responsive"
            />
            <Typography.Text strong style={{ display: 'block', marginBottom: 6 }}>Language</Typography.Text>
            <Select
                value={language}
                onChange={setLanguage}
                style={{ width: '100%', marginBottom: 12 }}
                options={languageOptions.map((l) => ({ label: l.name, value: l.code }))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <Button onClick={() => { setSelectedCategories([]); setLanguage('en'); }}>Clear</Button>
                <Button
                    type="primary"
                    style={{ background: primaryColor, borderColor: primaryColor }}
                    onClick={() => { setFilterOpen(false); fetchGuides(1, true); }}
                >
                    Apply
                </Button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', margin: 0, padding: 0, background: '#fafafa' }}>
            <style>{`
                .affiliate-guide-search.ant-input,
                .affiliate-guide-search .ant-input {
                    padding-bottom: 16px !important;
                }
            `}</style>
            {/* Fixed Header — logo left, search+filter right, content capped at 1440 */}
            <div
                style={{
                    position: 'sticky',
                    top: 0, left: 0, width: '100%',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    zIndex: 1100,
                }}
            >
                <div
                    style={{
                        maxWidth: 1232,
                        margin: '0 auto',
                        padding: '12px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                        {headerLogo ? (
                            <img
                                src={headerLogo}
                                alt={headerName || 'Brand'}
                                style={{ height: 48, width: 'auto', maxWidth: 200, objectFit: 'contain' }}
                            />
                        ) : (
                            <Typography.Title level={4} style={{ color: primaryColor, margin: 0 }}>
                                {headerName}
                            </Typography.Title>
                        )}
                    </div>

                    <div
                        style={{
                            flex: '1 1 320px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 8,
                            minWidth: 0,
                        }}
                    >
                        <Space.Compact style={{ flex: '1 1 220px', maxWidth: 420, minWidth: 180, height: 32 }}>
                            <Input
                                size="middle"
                                placeholder="Search city, country, or name"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onPressEnter={onSearchClick}
                                allowClear
                                className="affiliate-guide-search"
                                style={{ height: 32 }}
                            />
                            <Button
                                size="middle"
                                type="primary"
                                style={{ height: 32, background: primaryColor, borderColor: primaryColor }}
                                onClick={onSearchClick}
                            >
                                Search
                            </Button>
                        </Space.Compact>
                        <Popover
                            placement="bottomRight"
                            trigger="click"
                            open={filterOpen}
                            onOpenChange={setFilterOpen}
                            content={filterPanel}
                            title="Filter guides"
                        >
                            <Badge count={activeFilterCount} size="small">
                                <Button
                                    size="middle"
                                    icon={<FilterOutlined />}
                                    style={{ height: 32, width: 32, borderColor: primaryColor, color: primaryColor }}
                                    aria-label="Filter"
                                />
                            </Badge>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div>
                <div style={{ textAlign: 'center', padding: '32px 0 12px', backgroundColor: 'transparent' }}>
                    <Typography.Title level={2} className="my-0 fw-500" style={{ color: primaryColor }}>
                        Our Travel Guides
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        {isPaid ? 'Browse and purchase travel guides' : 'Browse curated travel guides'}
                    </Typography.Text>
                </div>

                <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                        {guides.map((book) => (
                            <div key={book._id} style={{ flex: '0 0 auto', width: 300 }}>
                                <div
                                    style={{
                                        width: '100%',
                                        background: 'white',
                                        borderRadius: 15,
                                        boxShadow: '5px 5px 5px lightgray',
                                        height: 540,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: 5,
                                    }}
                                >
                                    <Image
                                        src={book.fullCover || book.imagePath}
                                        preview={false}
                                        style={{
                                            width: '100%',
                                            height: 360,
                                            objectFit: 'cover',
                                            borderTopLeftRadius: 15,
                                            borderTopRightRadius: 15,
                                        }}
                                    />
                                    <Typography.Title
                                        level={5}
                                        style={{
                                            margin: '10px 8px 0',
                                            height: 60,
                                            color: primaryColor,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {(book.name || book.eng_name || '').length > 39
                                            ? (book.name || book.eng_name).slice(0, 39) + '...'
                                            : (book.name || book.eng_name)}
                                    </Typography.Title>
                                    <Typography.Paragraph
                                        style={{ margin: '0 8px', height: 40, color: '#000' }}
                                    >
                                        {showAddress(book)}
                                    </Typography.Paragraph>
                                    <Button
                                        type="primary"
                                        icon={isPaid ? <ShoppingCartOutlined /> : null}
                                        style={{
                                            marginTop: 'auto',
                                            backgroundColor: primaryColor,
                                            borderRadius: 20,
                                            margin: 8,
                                        }}
                                        onClick={() => isPaid ? startBuy(book) : openFreeGuide(book)}
                                    >
                                        {isPaid
                                            ? `Buy Now${book.price ? ` · ${book.price} €` : ''}`
                                            : 'Open Guide'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {hasMore && !loading && guides.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                backgroundColor: primaryColor,
                                border: 'none',
                                borderRadius: 25,
                                padding: '10px 30px',
                                height: 'auto',
                            }}
                            onClick={handleLoadMore}
                        >
                            Load More Guides
                        </Button>
                    </div>
                )}

                {!hasMore && guides.length > 0 && (
                    <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                        <Typography.Text>No more guides to load</Typography.Text>
                    </div>
                )}

                {loading && guides.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
                )}

                {!loading && guides.length === 0 && (
                    <div style={{ padding: 40 }}>
                        <Empty description="No Guides Found" />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                style={{
                    width: '100%',
                    background: 'white',
                    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
                    padding: '30px 0',
                    marginTop: 50,
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
                    <Row gutter={[40, 40]} style={{ marginBottom: 40 }}>
                        <Col xs={24} md={12}>
                            {headerLogo && (
                                <img
                                    src={headerLogo}
                                    alt={headerName || 'Brand'}
                                    style={{ height: 60, width: 'auto', maxWidth: 200, objectFit: 'contain', marginBottom: 20 }}
                                />
                            )}
                            <Typography.Paragraph style={{ fontSize: 16, lineHeight: 1.6, color: 'black' }}>
                                {headerName
                                    ? `${headerName} provides comprehensive travel guides powered by YouGuide, offering destination guides in 13 languages, seamless eSIM connectivity worldwide, and language guides for 50+ languages to enhance your travel experience.`
                                    : 'Comprehensive travel guides offering destination information in 13 languages, seamless eSIM connectivity worldwide, and language guides for 50+ languages to enhance your travel experience.'}
                            </Typography.Paragraph>
                        </Col>
                        <Col xs={24} md={12}>
                            <Row gutter={[20, 20]}>
                                <Col xs={24} lg={12}>
                                    <Typography.Title level={4} style={{ color: '#000', marginBottom: 20 }}>Information</Typography.Title>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <a href="https://www.youguide.com/pages/about-us" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>About us</a>
                                        <a href="https://www.youguide.com/pages/contact" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>Contact us</a>
                                        <a href="https://www.youguide.com/blogs/news" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>Blogs</a>
                                        <a href="https://www.youguide.com/pages/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>Privacy Policy</a>
                                        <a href="https://www.youguide.com/pages/terms-and-conditions" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>Terms and Conditions</a>
                                        <a href="https://www.youguide.com/pages/eula" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>EULA</a>
                                        <a href="https://www.youguide.com/pages/merchandise-1" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>Merchandise</a>
                                        <a href="https://www.youguide.com/pages/affiliate-program" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontSize: 14 }}>Affiliate program</a>
                                    </div>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <Typography.Title level={4} style={{ color: '#000', marginBottom: 20 }}>Powered By</Typography.Title>
                                    <Image src={logo} style={{ width: 150 }} preview={false} />
                                    {affiliateLogo && (
                                        <div style={{ marginTop: 20 }}>
                                            <Typography.Title level={4} style={{ color: '#000', marginBottom: 10 }}>Affiliate By</Typography.Title>
                                            <Image src={affiliateLogo} alt="Affiliate" style={{ width: 120 }} preview={false} />
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider style={{ margin: '20px 0', borderColor: '#e0e0e0' }} />
                </div>
                <div style={{ height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography.Text style={{ color: '#000', fontSize: 14 }}>
                        Copyright © {new Date().getFullYear()} - YouGuide
                    </Typography.Text>
                </div>
            </div>

            <Modal
                title={`Buy: ${buyBook?.name || buyBook?.eng_name || ''}`}
                open={buyOpen}
                onCancel={() => setBuyOpen(false)}
                onOk={() => buyForm.submit()}
                confirmLoading={buying}
                okText="Continue to payment"
                okButtonProps={{ style: { background: primaryColor, borderColor: primaryColor } }}
            >
                <Typography.Paragraph type="secondary">
                    We'll email your guide to the address below as soon as your payment completes.
                </Typography.Paragraph>
                <Form layout="vertical" form={buyForm} onFinish={submitBuy}>
                    <Form.Item name="name" label="Your name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AffiliateSubscriptionGuides;
