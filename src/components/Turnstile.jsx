import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Cloudflare Turnstile widget for the admin/affiliate panel's public forms.
 *
 * Rendered explicitly (`render=explicit`) instead of letting Cloudflare auto-scan
 * for `.cf-turnstile` nodes — auto-render only fires once when the script loads,
 * which never matches a widget React mounts afterwards (every route here is
 * client-rendered under HashRouter, so that is always the case).
 *
 * The token is only a claim; `youguide-backend/src/middleware/verifyCaptcha.js`
 * is what actually validates it with Cloudflare.
 *
 * Configure with REACT_APP_TURNSTILE_SITE_KEY (CRA inlines it at build time, so a
 * rebuild is required after changing it).
 */

// Cloudflare's published test site key — renders a real widget that always passes.
// Used when no key is configured so local dev works without setup.
const DUMMY_ALWAYS_PASSES = '1x00000000000000000000AA';

const SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY || DUMMY_ALWAYS_PASSES;

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Load the Turnstile script once per page, shared by every widget instance. */
let scriptPromise = null;

function loadTurnstile() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.turnstile) return Promise.resolve();
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Turnstile script failed to load')));
            return;
        }
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => {
            // Drop the cached rejection so a later mount can retry.
            scriptPromise = null;
            reject(new Error('Turnstile script failed to load'));
        };
        document.head.appendChild(script);
    });

    return scriptPromise;
}

/**
 * Props:
 *   onVerify(token)  — required; fires with a fresh token on success
 *   onExpire()       — token expired (~5 min) or timed out
 *   onError()        — challenge failed to run
 *   theme            — 'light' | 'dark' | 'auto' (default 'auto')
 *   size             — 'normal' | 'compact' | 'flexible' (default 'flexible')
 *
 * Ref exposes `reset()` — call it after every submit, since tokens are single-use.
 */
const Turnstile = forwardRef(function Turnstile(
    { onVerify, onExpire, onError, theme = 'auto', size = 'flexible', style, className },
    ref
) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(undefined);

    // Turnstile captures the callbacks once at render() time, so hold them in refs.
    // Otherwise a parent re-render would force a widget rebuild and throw away a
    // token the visitor already earned.
    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);
    useEffect(() => {
        onVerifyRef.current = onVerify;
        onExpireRef.current = onExpire;
        onErrorRef.current = onError;
    }, [onVerify, onExpire, onError]);

    useImperativeHandle(
        ref,
        () => ({
            reset: () => {
                if (widgetIdRef.current && window.turnstile) {
                    window.turnstile.reset(widgetIdRef.current);
                }
            },
        }),
        []
    );

    const mountWidget = useCallback(() => {
        if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: SITE_KEY,
            theme,
            size,
            callback: (token) => onVerifyRef.current && onVerifyRef.current(token),
            'expired-callback': () => onExpireRef.current && onExpireRef.current(),
            'timeout-callback': () => onExpireRef.current && onExpireRef.current(),
            'error-callback': () => onErrorRef.current && onErrorRef.current(),
        });
    }, [theme, size]);

    useEffect(() => {
        let cancelled = false;

        loadTurnstile()
            .then(() => {
                if (!cancelled) mountWidget();
            })
            .catch((err) => {
                console.error('[turnstile]', err);
                if (!cancelled && onErrorRef.current) onErrorRef.current();
            });

        return () => {
            cancelled = true;
            const id = widgetIdRef.current;
            widgetIdRef.current = undefined;
            if (id && window.turnstile) {
                try {
                    window.turnstile.remove(id);
                } catch (e) {
                    // Widget already torn down (fast unmount / hot reload).
                }
            }
        };
    }, [mountWidget]);

    return <div ref={containerRef} style={{ minHeight: 65, ...style }} className={className} />;
});

export default Turnstile;

/** True when a real site key is configured (i.e. the widget is doing real work). */
export const isTurnstileConfigured = SITE_KEY !== DUMMY_ALWAYS_PASSES;
