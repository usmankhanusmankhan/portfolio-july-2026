import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import artContent from '../config/artContent.json';

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
    const titleFontSize = 16;
    const titleLineHeight = 21;
    const titleMarginBottom = 12;
    const bodyFontSize = 16;
    const bodyLineHeight = 28;
    const bodyMarginBottom = 24;
    // Bold segments within the body
    const bodyBoldFontSize = 16;
    const bodyBoldLineHeight = 24;
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

    return (
        <div className="art-detail-page">
            <div style={{
                padding: 48,
                paddingTop: 96,
                paddingBottom: 96,
                opacity,
                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, maxWidth: 600 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: `${titleMarginBottom}px` }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    title="Back"
                                    style={{
                                        border: 'none',
                                        borderRadius: '9999px',
                                        background: 'var(--color-bg)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        gap: '8px',
                                        padding: '0px',
                                        alignItems: 'center',
                                        color: 'var(--color-text)',
                                        fontFamily: 'AspektaVF',
                                        marginBottom: '32px',
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
                                <p style={{
                                    fontSize: `${titleFontSize}px`,
                                    lineHeight: `${titleLineHeight}px`,
                                    color: 'var(--color-text)',
                                    textAlign: 'left',
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
                                width: '600px',
                                minWidth: '600px',
                                flexShrink: 0,
                                marginBottom: '`${bodyMarginBottom}px`',
                            }}
                        >
                            {getBodyContent(id).map((segment: { text: string; bold: boolean }, index: number) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: segment.bold ? 500 : 300,
                                        fontSize: segment.bold ? `${bodyBoldFontSize}px` : `${bodyFontSize}px`,
                                        lineHeight: segment.bold ? `${bodyBoldLineHeight}px` : `${bodyLineHeight}px`,
                                        display: 'block',
                                        color: 'var(--color-text)',
                                        marginTop: segment.bold && index > 0 ? `${bodyBoldMarginBottom}px` : 0,
                                        marginBottom: segment.bold && index < getBodyContent(id).length - 1
                                            ? `${bodyBoldMarginBottom}px`
                                            : 48,
                                    }}
                                >
                                    {segment.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}