import React, { useState, useEffect, useCallback } from 'react';
import ApiService from '../../APIServices/ApiService';
import './VerifyAmazonOrder.css';

const EsimPopup = ({ profiles, orderNumber, emailSent, customerEmail, onClose }) => {
    const [active, setActive] = useState(0);
    const [frameBlocked, setFrameBlocked] = useState(false);
    const current = profiles[active];

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    useEffect(() => { setFrameBlocked(false); }, [active]);

    return (
        <div
            className="yg-amz-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Your eSIM"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="yg-amz-modal__card">
                <div className="yg-amz-modal__head">
                    <div>
                        <h2 className="yg-amz-modal__title">Your eSIM is ready</h2>
                        <p className="yg-amz-modal__sub">
                            Order #{orderNumber}
                            {emailSent && customerEmail ? ` · also emailed to ${customerEmail}` : ''}
                        </p>
                    </div>
                    <button type="button" className="yg-amz-modal__close" aria-label="Close" onClick={onClose}>×</button>
                </div>

                {profiles.length > 1 && (
                    <div className="yg-amz-modal__tabs" role="tablist">
                        {profiles.map((p, i) => (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                aria-selected={i === active}
                                className={`yg-amz-modal__tab${i === active ? ' is-active' : ''}`}
                                onClick={() => setActive(i)}
                            >
                                eSIM {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                <div className="yg-amz-modal__body">
                    {frameBlocked ? (
                        <div style={{ padding: '36px 24px', textAlign: 'center', color: '#144c74' }}>
                            <p style={{ margin: '0 0 14px', fontWeight: 800 }}>
                                Your eSIM viewer can't be shown in this window.
                            </p>
                            <a
                                className="yg-amz-modal__open"
                                href={current.qrCode}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open eSIM viewer in a new tab ↗
                            </a>
                        </div>
                    ) : (
                        <iframe
                            key={current.qrCode}
                            src={current.qrCode}
                            title={`eSIM ${active + 1}`}
                            className="yg-amz-modal__frame"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            onError={() => setFrameBlocked(true)}
                        />
                    )}
                </div>

                <div className="yg-amz-modal__foot">
                    <a
                        className="yg-amz-modal__open"
                        href={current.qrCode}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open in new tab ↗
                    </a>
                    <span className="yg-amz-modal__meta">
                        {current.packageName && <strong>{current.packageName}</strong>}
                        {current.location ? ` · ${current.location}` : ''}
                    </span>
                </div>
            </div>
        </div>
    );
};

const VerifyAmazonOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [popupProfiles, setPopupProfiles] = useState(null);

    const closePopup = useCallback(() => setPopupProfiles(null), []);

    const handleVerify = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setResult(null);

        if (!orderId.trim()) {
            setResult({ type: 'error', message: 'Please enter your Amazon Order Number' });
            return;
        }

        setLoading(true);
        try {
            const data = await ApiService.verifyAmazonOrder({
                order_id: orderId.trim(),
                email: email.trim(),
            });
            if (data.success) {
                const profiles = Array.isArray(data.profiles) ? data.profiles : [];
                setResult({
                    type: 'success',
                    message: data.message || 'Your eSIM is ready below.',
                    order: data.order,
                    emailSent: !!data.emailSent,
                    alreadyFulfilled: !!data.alreadyFulfilled,
                });
                if (profiles.length > 0) {
                    setPopupProfiles({
                        profiles,
                        orderNumber: data.order?.order_number || orderId.trim(),
                        emailSent: !!data.emailSent,
                        customerEmail: email.trim(),
                    });
                }
            } else {
                setResult({ type: 'error', message: data.message || 'Verification failed' });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setResult({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    const packages = result?.order?.packages || [];

    const faqs = [
        {
            q: 'What is an eSIM?',
            a: 'An eSIM is a digital SIM card built into many modern phones and tablets. Instead of inserting a plastic SIM card, you install your mobile data plan using a QR code or installation link.',
        },
        {
            q: 'Do I need an internet connection to install?',
            a: 'Yes. Please connect to Wi-Fi before installing your eSIM. After installation, activate the eSIM only when you arrive in your destination country and make sure data roaming is enabled for the eSIM.',
        },
        {
            q: 'Is my device eSIM compatible?',
            a: 'Most recent iPhones, Google Pixel phones, Samsung Galaxy phones, and selected tablets support eSIM. Check your device settings or manufacturer website before installing, because some models or country versions may not support eSIM.',
        },
        {
            q: 'Can I keep my WhatsApp number?',
            a: 'Yes. Your WhatsApp account can normally continue using your existing number. The eSIM provides mobile data only, so you can use WhatsApp calls and messages through the eSIM data connection.',
        },
        {
            q: 'When will I receive my eSIM?',
            a: 'After you enter your Amazon Order Number, your eSIM QR code is shown on-screen immediately. If you also enter your email, we send the QR code there too.',
        },
        {
            q: 'Can I use the eSIM in multiple countries?',
            a: 'That depends on the package you purchased. Some eSIMs work in one country only, while regional packages may work in several countries. Please check the destination and coverage shown in your order details.',
        },
        {
            q: 'How do I install my eSIM?',
            a: 'Enter your Amazon Order Number above, open the installation instructions, and follow the steps for iPhone or Android. Install the eSIM on the device you will use while travelling, because most eSIMs can only be installed once.',
        },
        {
            q: 'What if I need help?',
            a: 'Contact support@youguide.com for assistance. Include your Amazon Order Number and the phone model you are using, so support can help you faster.',
        },
    ];

    return (
        <div className="yg-amz">
            <div className="page">
                <header className="top">
                    <div className="logo">
                        <img src="/logo.gif" alt="YouGuide" />
                    </div>
                    <nav className="nav">
                        <a
                            href="https://appadmin.youguide.com/#/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-link"
                        >
                            <svg className="ico-sm" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M9.5 9a2.6 2.6 0 1 1 4.5 1.8c-.9.7-1.7 1.2-1.7 2.7" />
                                <path d="M12 17h.01" />
                            </svg>
                            <span>Help Center</span>
                        </a>
                        <a
                            href="https://appadmin.youguide.com/#/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-link"
                        >
                            <svg className="ico-sm" viewBox="0 0 24 24">
                                <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                                <path d="M4 13h3v6H4zM17 13h3v6h-3z" />
                                <path d="M20 18c0 2-2 3-5 3" />
                            </svg>
                            <span>24/7 Support</span>
                        </a>
                    </nav>
                </header>

                <main className="main">
                    <section className="hero">
                        <div className="eyebrow"><span>Amazon eSIM activation</span></div>
                        <h1 className="headline">Get your eSIM instantly</h1>
                        <p className="sub">
                            Enter your <strong>Amazon Order Number</strong> below. Your eSIM QR code opens
                            right here — and if you add your email, we'll send it there too.
                        </p>
                    </section>

                    <section className="center-card" aria-label="Amazon order number form">
                        <h2 className="card-title">Enter your Amazon Order Number</h2>
                        <form onSubmit={handleVerify}>
                            <div className="form-row">
                                <input
                                    className="order-input"
                                    type="text"
                                    inputMode="text"
                                    autoComplete="off"
                                    placeholder="Example: 114-1234567-1234567"
                                    aria-label="Amazon Order Number"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                                <div
                                    className="info"
                                    data-tooltip="Your Amazon order number has 3 groups of numbers (e.g. 114-1234567-1234567)"
                                    aria-label="Your Amazon order number has 3 groups of numbers"
                                    tabIndex={0}
                                >
                                    i
                                </div>
                            </div>

                            <div className="optional-email">
                                <label htmlFor="yg-amz-email">Email address (optional — we'll also email your eSIM)</label>
                                <input
                                    id="yg-amz-email"
                                    className="email-input"
                                    type="email"
                                    placeholder="your@email.com (optional)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {result && (
                                <div className={`result-box ${result.type}`}>
                                    <strong>{result.type === 'success' ? (result.alreadyFulfilled ? 'Already activated' : 'Success!') : 'Error'}</strong>
                                    <p>{result.message}</p>
                                    {packages.length > 0 && (
                                        <div className="order-meta">
                                            {packages.map((pkg, idx) => (
                                                <div key={idx} className="pkg-row">
                                                    <strong>{pkg.cleaned_package_name || pkg.package_name}</strong>
                                                    {pkg.quantity > 1 && <span className="qty">x{pkg.quantity}</span>}
                                                    {pkg.location && <span className="loc">{pkg.location}</span>}
                                                    <div className="profiles">
                                                        {pkg.esim_profiles?.length || 0} eSIM profile(s) ready
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <button className="primary-btn" type="submit" disabled={loading}>
                                {loading ? 'Activating…' : 'Get my eSIM'}
                            </button>
                        </form>

                        <div className="reassurance">
                            <div className="mini">
                                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                                <span>Instant on-screen delivery</span>
                            </div>
                            <div className="mini">
                                <svg viewBox="0 0 24 24">
                                    <rect x="5" y="10" width="14" height="10" rx="2" />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>
                                <span>Secure order lookup</span>
                            </div>
                            <div className="mini">
                                <svg viewBox="0 0 24 24">
                                    <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                                    <path d="M4 13h3v6H4zM17 13h3v6h-3z" />
                                </svg>
                                <span>24/7 Support available</span>
                            </div>
                        </div>

                        <div className="secure">
                            <svg viewBox="0 0 24 24">
                                <rect x="6" y="10" width="12" height="10" rx="2" />
                                <path d="M9 10V7a3 3 0 0 1 6 0v3" />
                            </svg>
                            <span>Your information is protected and only used to find your eSIM order.</span>
                        </div>
                    </section>

                    <section className="tip" aria-label="Where to find your Amazon order number">
                        <div>
                            <h2>Tip: where do I find my Amazon Order Number?</h2>
                            <p>
                                Open your Amazon order confirmation email or go to{' '}
                                <strong>
                                    <a
                                        href="https://www.amazon.com/gp/css/order-history"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#144c74', textDecoration: 'none' }}
                                    >
                                        Your Orders
                                    </a>
                                </strong>{' '}
                                in your Amazon account. Look for a number formatted like this:
                            </p>
                            <div className="example">114-1234567-1234567</div>
                        </div>
                        <div className="amazon-illustration" aria-hidden="true">
                            <div className="az-head">
                                <span className="az-logo">a</span>
                                <span>Amazon order details</span>
                            </div>
                            <div className="receipt-line" />
                            <div className="receipt-line short" />
                            <div className="highlight">
                                <strong>114-1234567-1234567</strong>
                            </div>
                            <div className="arrow">Use this number above ↑</div>
                        </div>
                    </section>
                </main>

                <section className="help">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                        <path d="M4 13h3v6H4zM17 13h3v6h-3z" />
                        <path d="M20 18c0 2-2 3-5 3" />
                    </svg>
                    <div>
                        <h3>We're here to help, 24/7</h3>
                        <p>Our support team is available around the clock.</p>
                    </div>
                    <div className="support">
                        <a className="outline" href="mailto:support@youguide.com">Contact Support</a>
                        <a className="mail" href="mailto:support@youguide.com">support@youguide.com</a>
                    </div>
                </section>

                <section className="faq">
                    <h2>eSIM FAQ</h2>
                    <div className="faq-grid">
                        {faqs.map((item, idx) => (
                            <div key={idx} className={`faq-item${openFaq === idx ? ' open' : ''}`}>
                                <button
                                    className="q"
                                    type="button"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                >
                                    <span>{item.q}</span>
                                    <span>⌄</span>
                                </button>
                                <div className="answer">{item.a}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="amazon">
                    <div className="az">a</div>
                    <p>
                        You purchased this eSIM on Amazon. For any order, payment or refund related questions,
                        please contact{' '}
                        <a
                            href="https://www.amazon.com/gp/help/customer/contact-us"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Amazon Customer Service
                        </a>.
                    </p>
                </section>

                <footer className="footer">
                    <span>© 2026-2027 YouGuide. All rights reserved.</span>
                    <a href="/#/privacy-policy">Privacy Policy</a>
                    <a href="mailto:support@youguide.com">Contact</a>
                </footer>
            </div>

            {popupProfiles && (
                <EsimPopup
                    profiles={popupProfiles.profiles}
                    orderNumber={popupProfiles.orderNumber}
                    emailSent={popupProfiles.emailSent}
                    customerEmail={popupProfiles.customerEmail}
                    onClose={closePopup}
                />
            )}
        </div>
    );
};

export default VerifyAmazonOrder;
