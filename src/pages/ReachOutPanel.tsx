import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BottomMenu from '../components/bottomMenu';
import Footer from '../components/Footer';
import styles from './ReachOutPanel.module.css';

type BadgeType = 'success' | 'risk' | 'constraint';

interface SectionBadge {
    type: BadgeType;
    title: string;
    description: string;
}

interface SectionBlock {
    title: string;
    text: string;
    badges?: SectionBadge[];
    imageCaption?: string;
    image: string;
}

const SECTION_BLOCKS: SectionBlock[] = [
    {
        title: 'Activator enables networking lawyers to act on their BD opportunities.',
        text: 'As a part of the tool, we created Signals, an AI powered feature that delivers impactful business development nudges for lawyers to act on. We provide lawyers timely insight into their network movement, news to share, and cross-sell opportunities. Signals adoption was key to the success of Activator.',
        badges: [
            { type: 'success', title: 'SUCCESS METRIC', description: 'Increase total signals actioned' },
            { type: 'success', title: 'SUCCESS METRIC', description: 'Increase in signal action rate' },
        ],
        image: '/reach-out-panel-overview-signal.webp',
    },
    {
        title: "Lawyers couldn't action signals in-product or understand their relevance",
        text: "The lawyers we talked to asked some common questions: How do I action these opportunities? Why am I the lawyer receiving this nudge? What do I do about it? Our current reaching out action led to a small area of contact information, which didn't answer any of our testers' questions.",
        badges: [{ type: 'risk', title: 'RISK', description: 'Negative impact to the adoption rate of Signals and Activator' }],
        imageCaption: 'Conversation during user testing...',
        image: '/reach-out-panel-problem.webp',
    },
    {
        title: 'Our solution: a dedicated space for in-product outreach',
        text: 'The outreach panel gives users the space to reach out to key contacts in-product while also enabling them to understand their BD opportunity.',
        badges: [{ type: 'constraint', title: 'CONSTRAINT', description: 'We kept the outreach in a panel because it was already implemented that way, so we could save time' }],
        image: '/reach-out-solution-1.webp',
    },
    {
        title: 'Personalized context for each opportunity',
        text: 'Opportunity details highlighted why this was a good opportunity and what should they do about it. The context is generated from signal data as well as underlying data about the contact and their previous interactions.',
        badges: [{ type: 'constraint', title: 'CONSTRAINT', description: "We used Intapp's AI Prompt Studio to generate the opportunity details, which is limited to text generation" }],
        image: '/reach-out-solution-2.webp',
    },
    {
        title: 'AI-generated email drafting',
        text: 'Email drafting helps lawyers draft emails based on the opportunity details. Users are able to revert changes to preserve any previous states, or rewrite the email if wanted.',
        badges: [{ type: 'constraint', title: 'CONSTRAINT', description: "We weren't technically able to send the email truly in-product, so we ported to the user's primary email client" }],
        image: '/reach-out-solution-3.webp',
    },
    {
        title: 'Mobile experience on the go',
        text: 'We are also releasing on mobile to bring the feature to parity with web.',
        image: '/reach-out-solution-4.webp',
    },
];

const NARROW_BREAKPOINT = 960;

export default function ReachOutPanel() {
    const [opacity, setOpacity] = useState(0);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isNarrow, setIsNarrow] = useState(false);
    const consolidatedSectionRef = useRef<HTMLElement>(null);
    const contentBlockRefs = useRef<(HTMLDivElement | null)[]>(SECTION_BLOCKS.map(() => null));
    const ratiosRef = useRef<number[]>(SECTION_BLOCKS.map(() => 0));
    const lastIndexRef = useRef(0);

    useEffect(() => {
        const checkWidth = () => setIsNarrow(window.innerWidth <= NARROW_BREAKPOINT);
        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    }, []);

    useEffect(() => {
        // Trigger fade-in animation on mount
        setOpacity(1);
    }, []);

    useEffect(() => {
        if (isNarrow) return;

        const refs = contentBlockRefs.current;
        const blockCount = SECTION_BLOCKS.length;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number((entry.target as HTMLElement).dataset.index);
                    if (Number.isFinite(index) && index >= 0 && index < blockCount) {
                        ratiosRef.current[index] = entry.intersectionRatio;
                    }
                    const ratios = ratiosRef.current;
                    let maxIndex = 0;
                    let maxRatio = ratios[0];
                    for (let i = 1; i < ratios.length; i++) {
                        if (ratios[i] > maxRatio) {
                            maxRatio = ratios[i];
                            maxIndex = i;
                        }
                    }
                    if (maxIndex !== lastIndexRef.current) {
                        lastIndexRef.current = maxIndex;
                        setActiveImageIndex(maxIndex);
                    }
                });
            },
            { root: null, rootMargin: '0% 0px 0% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        refs.forEach((el) => el && observer.observe(el));
        return () => {
            refs.forEach((el) => el && observer.unobserve(el));
            observer.disconnect();
        };
    }, [isNarrow]);

    return (
        <div>
            <div className={styles.bottomMenuWrapper}>
                <BottomMenu fixed={false} />
            </div>
            <div className={styles.container} style={{ opacity: opacity }}>
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <p style={{ fontSize: 48, 
                        color: 'var(--color-text)', 
                        lineHeight: '56px',
                        maxWidth: 800,
                        fontWeight: 500,
                        marginBottom: 16,
                        fontFamily: 'Instrument Serif',
                        textAlign: 'center',
                        }}>
                        Outreach panel
                    </p>
                    <p className={styles.sectionText} style={{ marginBottom: 16, textAlign: 'center', fontSize: 24, lineHeight: '36px'}}>
                        Activator is Intapp's ultimate business and networking tool for lawyers. I led design on the outreach panel, which allowed lawyers to reach out to key contacts in-product. This feature is going GA in early 2026.
                    </p>
                </div>

            </div>
            <div className={styles.heroImagePlaceholder} style={{width: '90vw', height: '90vh', margin: '0 auto 128px'}}>
                <img src="/reachoutpanel.webp" alt="Reach Out Panel" loading="lazy" decoding="async" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 32}} />
            </div>
            {/* Consolidated content section: Overview, Problem, Design Solution */}
            <motion.section
                ref={consolidatedSectionRef}
                className={isNarrow ? styles.designSolutionSectionNarrow : `${styles.designSolutionSection} ${styles.sectionWithSmallBottomMargin}`}
            >
                {isNarrow ? (
                    /* Simple stacked layout: paragraph block then content div per section (≤960px) */
                    <div className={styles.stackedSectionList}>
                        {SECTION_BLOCKS.map((block, index) => (
                            <div key={index} className={styles.stackedBlock}>
                                <div className={styles.stackedBlockParagraph}>
                                    <p className={index === 1 ? `${styles.sectionTitle} ${styles.sectionTitleLargeMargin}` : styles.sectionTitle}>
                                        {block.title}
                                    </p>
                                    <p className={styles.sectionText} style={{ marginBottom: 24 }}>
                                        {block.text}
                                    </p>
                                    {block.badges && (
                                        block.badges.length > 1 ? (
                                            <div className={styles.metricsContainer}>
                                                {block.badges.map((badge, i) => (
                                                    <div key={i} className={styles.successMetrics}>
                                                        <img src="/success-metric-badge.svg" alt="success metric badge" className={styles.successMetricsIcon} />
                                                        <div className={styles.successMetricsText}>
                                                            <p className={styles.successMetricsTextTitle}>{badge.title}</p>
                                                            <p className={styles.successMetricsTextDescription}>{badge.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            block.badges.map((badge, i) => {
                                                if (badge.type === 'risk') {
                                                    return (
                                                        <div key={i} className={styles.risk}>
                                                            <img src="/risk-badge.svg" alt="risk badge" className={styles.successMetricsIcon} />
                                                            <div className={styles.successMetricsText}>
                                                                <p className={styles.successMetricsTextTitle} style={{ color: 'var(--color-badge-coral)' }}>{badge.title}</p>
                                                                <p className={styles.successMetricsTextDescription} style={{ color: 'var(--color-badge-coral-text)' }}>{badge.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (badge.type === 'constraint') {
                                                    return (
                                                        <div key={i} className={styles.constraint}>
                                                            <img src="/constraint-badge.svg" alt="constraint badge" className={styles.successMetricsIcon} />
                                                            <div className={styles.successMetricsText}>
                                                                <p className={styles.successMetricsTextTitle} style={{ color: 'var(--color-badge-taupe)' }}>{badge.title}</p>
                                                                <p className={styles.successMetricsTextDescription} style={{ color: 'var(--color-badge-coral-text)' }}>{badge.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={i} className={styles.successMetrics}>
                                                        <img src="/success-metric-badge.svg" alt="success metric badge" className={styles.successMetricsIcon} />
                                                        <div className={styles.successMetricsText}>
                                                            <p className={styles.successMetricsTextTitle}>{badge.title}</p>
                                                            <p className={styles.successMetricsTextDescription}>{badge.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )
                                    )}
                                </div>
                                <div className={styles.stackedBlockContent}>
                                    {block.imageCaption && (
                                        <p className={styles.stackedImageCaption}>{block.imageCaption}</p>
                                    )}
                                    <img
                                        src={block.image}
                                        alt={block.title}
                                        loading="lazy"
                                        decoding="async"
                                        className={styles.stackedBlockImage}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                            {SECTION_BLOCKS.map((block, index) => (
                                <motion.div
                                    key={index}
                                    ref={(el) => {
                                        if (el) contentBlockRefs.current[index] = el as HTMLDivElement;
                                    }}
                                    data-index={index}
                                    className={styles.designSolutionContent}
                                    {...(index === 0
                                        ? {
                                              initial: { opacity: 0, x: -96 },
                                              whileInView: { opacity: 1, x: 0 },
                                              viewport: { amount: 0.3, once: false },
                                              transition: { duration: 0.8, ease: 'easeOut' },
                                          }
                                        : {})}
                                >
                                    <p className={index === 1 ? `${styles.sectionTitle} ${styles.sectionTitleLargeMargin}` : styles.sectionTitle}>
                                        {block.title}
                                    </p>
                                    <p className={styles.sectionText} style={{ marginBottom: 24 }}>
                                        {block.text}
                                    </p>
                                    {block.badges && (
                                        block.badges.length > 1 ? (
                                            <div className={styles.metricsContainer}>
                                                {block.badges.map((badge, i) => (
                                                    <div key={i} className={styles.successMetrics}>
                                                        <img src="/success-metric-badge.svg" alt="success metric badge" className={styles.successMetricsIcon} />
                                                        <div className={styles.successMetricsText}>
                                                            <p className={styles.successMetricsTextTitle}>{badge.title}</p>
                                                            <p className={styles.successMetricsTextDescription}>{badge.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            block.badges.map((badge, i) => {
                                                if (badge.type === 'risk') {
                                                    return (
                                                        <div key={i} className={styles.risk}>
                                                            <img src="/risk-badge.svg" alt="risk badge" className={styles.successMetricsIcon} />
                                                            <div className={styles.successMetricsText}>
                                                                <p className={styles.successMetricsTextTitle} style={{ color: 'var(--color-badge-coral)' }}>{badge.title}</p>
                                                                <p className={styles.successMetricsTextDescription} style={{ color: 'var(--color-badge-coral-text)' }}>{badge.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (badge.type === 'constraint') {
                                                    return (
                                                        <div key={i} className={styles.constraint}>
                                                            <img src="/constraint-badge.svg" alt="constraint badge" className={styles.successMetricsIcon} />
                                                            <div className={styles.successMetricsText}>
                                                                <p className={styles.successMetricsTextTitle} style={{ color: 'var(--color-badge-taupe)' }}>{badge.title}</p>
                                                                <p className={styles.successMetricsTextDescription} style={{ color: 'var(--color-badge-coral-text)' }}>{badge.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={i} className={styles.successMetrics}>
                                                        <img src="/success-metric-badge.svg" alt="success metric badge" className={styles.successMetricsIcon} />
                                                        <div className={styles.successMetricsText}>
                                                            <p className={styles.successMetricsTextTitle}>{badge.title}</p>
                                                            <p className={styles.successMetricsTextDescription}>{badge.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )
                                    )}
                                </motion.div>
                            ))}
                        </div>
                        <motion.div className={styles.designSolutionImageContainer}>
                            <motion.div
                                className={styles.designSolutionImageWrapper}
                                initial={{ opacity: 0, x: 96 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ amount: 0.3 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                            >
                                {SECTION_BLOCKS[activeImageIndex].imageCaption && (
                                    <p className={styles.imageCaption}>
                                        {SECTION_BLOCKS[activeImageIndex].imageCaption}
                                    </p>
                                )}
                                <motion.img
                                    key={activeImageIndex}
                                    src={SECTION_BLOCKS[activeImageIndex].image}
                                    alt={SECTION_BLOCKS[activeImageIndex].title}
                                    className={styles.designSolutionImage}
                                />
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </motion.section>
            <Footer />
        </div>
    );
}