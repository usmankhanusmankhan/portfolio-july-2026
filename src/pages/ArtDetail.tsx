import React, { useState, useEffect, JSX } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, spring } from 'framer-motion';
import artContent from '../config/artContent.json';

// Renders a link with a custom color (and a distinct hover color), plus a
// small popover above it showing the destination URL on hover.
const LinkWithPreview: React.FC<{ label: string; url: string }> = ({ label, url }) => {
    const [hovered, setHovered] = useState(false);

    // Edit these to change link appearance
    const linkColor = 'var(--color-text-link, #4f46e5)';
    const linkHoverColor = 'var(--color-badge-coral, #7c7ff0)';

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    fontWeight: '500',
                    color: hovered ? linkHoverColor : linkColor,
                    textDecoration: 'underline',
                    textDecorationStyle: 'wavy',
                    textDecorationColor: hovered ? 'var(--color-badge-coral)' : 'var(--color-border)',
                    textUnderlineOffset: hovered ? '4px' : '3px',
                    transition: 'all 0.15s ease',
                }}
            >
                {label}
            </a>
            <AnimatePresence>
                {hovered && (
                    // Outer span: static horizontal centering only.
                    // Framer Motion overwrites the `transform` CSS property
                    // whenever it animates x/y/scale, so translateX(-50%)
                    // can't live on the same element that animates `y` —
                    // it has to sit on this untouched wrapper instead.
                    <span
                        role="tooltip"
                        style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '4px',
                            zIndex: 10,
                        }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15, ease: 'easeOut', type: spring, stiffness: 100, damping: 20 }}
                            style={{
                                display: 'block',
                                padding: '6px 10px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg)',
                                boxShadow: '0 2px 8px var(--color-modal-shadow)',
                                color: 'var(--color-text)',
                                fontSize: '12px',
                                lineHeight: '16px',
                                fontFamily: 'AspektaVF',
                                whiteSpace: 'nowrap',
                                maxWidth: '280px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                pointerEvents: 'none',
                                fontWeight: '350',
                            }}
                        >
                            {url}
                        </motion.span>
                    </span>
                )}
            </AnimatePresence>
        </span>
    );
};

export default function ArtDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [opacity, setOpacity] = useState(0);
    const [imageMounted, setImageMounted] = useState(false);

    useEffect(() => {
        setOpacity(1);
        setTimeout(() => setImageMounted(true), 200);
    }, []);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Typography — edit these to control title and body text
    const titleFontSize = 20;
    const titleLineHeight = 30;
    ;
    const bodyBoldMarginBottom = 16; // space after a bold paragraph

    const getImagePath = (artId: string | undefined) => {
        if (!artId) return '';
        return `/${artId}.webp`;
    };

    const getTitle = (artId: string | undefined) => {
        if (!artId) return 'Artwork';
        const content = (artContent as any)[artId];
        return content?.title || artId.charAt(0).toUpperCase() + artId.slice(1);
    };

    const getBodyContent = (artId: string | undefined) => {
        if (!artId) return [];
        const content = (artContent as any)[artId];
        return content?.body || [];
    };

    // Parses "[label](https://url)" markdown-style links inside a segment's
    // text and returns an array of plain strings and <a> elements.
    // Any text without link syntax is returned unchanged as a single string.
    const renderWithLinks = (text: string) => {
        const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts: (string | JSX.Element)[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        let key = 0;

        while ((match = linkPattern.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }
            const [, label, url] = match;
            parts.push(<LinkWithPreview key={key++} label={label} url={url} />);
            lastIndex = linkPattern.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }
        return parts;
    };

    return (
        <div className="art-detail-page">

            <button
                type="button"
                onClick={() => navigate(-1)}
                title="Back"
                style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '8px',
                    padding: '0px',
                    alignItems: 'center',
                    color: 'var(--color-text)',
                    fontFamily: 'AspektaVF',
                    position: 'fixed',
                    top: '48px',
                    left: '48px',
                }}
            >
                Back
                <img
                    src="/ids-icon-keyboard-arrow-return.svg"
                    alt=""
                    width={12}
                    height={12}
                    style={{ display: 'block' }}
                />
            </button>
            <div style={{
                paddingTop: 'clamp(64px, 10vw, 96px)',
                paddingBottom: 'clamp(64px, 10vw, 96px)',
                paddingLeft: 'clamp(20px, 5vw, 32px)',
                paddingRight: 'clamp(20px, 5vw, 32px)',
                opacity,
                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, maxWidth: 600, width: '100%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: '24px' }}>
                                <p style={{
                                    fontSize: `${titleFontSize}px`,
                                    lineHeight: `${titleLineHeight}px`,
                                    color: 'var(--color-text)',
                                    textAlign: 'center',
                                    margin: 0,
                                    fontFamily: 'AspektaVF',
                                    fontWeight: '500'
                                }}>
                                    {getTitle(id)}
                                </p>
                            </div>
                            {id && (
                                <motion.div
                                    style={{ marginBottom: 64 }}
                                    initial={{ opacity: 0.5 }}
                                    animate={imageMounted ? { opacity: 1, scale: 1 } : { opacity: 0.5 }}
                                    transition={prefersReducedMotion
                                        ? { duration: 0 }
                                        : { opacity: { type: 'spring', stiffness: 100, damping: 15 }}
                                    }
                                >
                                    <img
                                        src={getImagePath(id)}
                                        alt={id}
                                        decoding="async"
                                        style={{ width: '100%', height: 'auto', display: 'block' }}
                                    />
                                </motion.div>
                            )}
                        </div>
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                flexShrink: 0,
                                marginBottom: '`${bodyMarginBottom}px`',
                            }}
                        >
                            {getBodyContent(id).map((segment: { text: string; bold: boolean }, index: number) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: segment.bold ? 500 : 300,
                                        fontSize: segment.bold ? 'clamp(12px, 3.5vw, 16px)' : 'clamp(12px, 3.5vw, 16px)',
                                        lineHeight: segment.bold ? 'clamp(28px, 3.5vw, 30px)' : 'clamp(28px, 3.5vw, 30px)',
                                        display: 'block',
                                        color: 'var(--color-text)',
                                        marginTop: segment.bold && index > 0 ? `${bodyBoldMarginBottom}px` : 0,
                                        marginBottom: segment.bold && index < getBodyContent(id).length - 1
                                            ? `${bodyBoldMarginBottom}px`
                                            : 48,
                                    }}
                                >
                                    {renderWithLinks(segment.text)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}