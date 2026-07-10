import React, { useState, useEffect } from 'react';
import BottomMenu from '../components/bottomMenu';
import Footer from '../components/Footer';

export default function IBMQuantum() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Trigger fade-in animation on mount
        setOpacity(1);
    }, []);

    const padding = windowWidth < 768 ? 16 : windowWidth < 1024 ? 48 : 96;
    const maxContentWidth = 700;

    return (
        <div>
            <BottomMenu />
            <div style={{ 
                paddingLeft: padding, 
                paddingRight: padding, 
                paddingTop: 192, 
                paddingBottom: 96,
                opacity: opacity,
                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Hero Section */}
                <div style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h1 style={{ marginBottom: 16 }}>IBM Quantum dashboard</h1>
                    <p style={{ 
                        fontSize: 20, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        marginBottom: 24
                    }}>
                        Building platform to enable lawyers to win business, collaborate with colleagues, and level up business development skills.
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: 24, 
                        flexWrap: 'wrap',
                        fontSize: 16,
                        color: 'var(--color-text)'
                    }}>
                        <div>
                            <strong>Role:</strong> Product Designer
                        </div>
                        <div>
                            <strong>Timeline:</strong> 2022
                        </div>
                        <div>
                            <strong>Team:</strong> Product, Engineering, Research
                        </div>
                    </div>
                </div>

                {/* Overview */}
                <section style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h2 style={{ marginBottom: 24 }}>Overview</h2>
                    <p style={{ 
                        fontSize: 18, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        maxWidth: 700
                    }}>
                        Brief summary of the project context, business goals, and user needs. This section sets the stage for the case study and provides essential background information.
                    </p>
                </section>

                {/* Problem Statement */}
                <section style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h2 style={{ marginBottom: 24 }}>Problem</h2>
                    <p style={{ 
                        fontSize: 18, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        maxWidth: 700,
                        marginBottom: 16
                    }}>
                        Clear articulation of the problem space, user pain points, and business challenges that drove this project.
                    </p>
                    <ul style={{ 
                        fontSize: 18, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        maxWidth: 700,
                        paddingLeft: 24
                    }}>
                        <li>Key user pain point or challenge</li>
                        <li>Business impact or opportunity</li>
                        <li>Technical or design constraint</li>
                    </ul>
                </section>

                {/* Research & Discovery */}
                <section style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h2 style={{ marginBottom: 24 }}>Research & Discovery</h2>
                    <p style={{ 
                        fontSize: 18, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        maxWidth: 700,
                        marginBottom: 24
                    }}>
                        Summary of research methods, key findings, and insights that informed the design direction.
                    </p>
                    <div style={{ 
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 24,
                        padding: 32,
                        marginBottom: 24
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Key Findings</h3>
                        <ul style={{ 
                            fontSize: 16, 
                            color: 'var(--color-text)', 
                            lineHeight: '24px',
                            paddingLeft: 24
                        }}>
                            <li>Research insight or user behavior observation</li>
                            <li>Quantitative data point or metric</li>
                            <li>Qualitative insight from user interviews</li>
                        </ul>
                    </div>
                </section>

                {/* Design Solution */}
                <section style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h2 style={{ marginBottom: 24 }}>Design Solution</h2>
                    <p style={{ 
                        fontSize: 18, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        maxWidth: 700,
                        marginBottom: 32
                    }}>
                        High-level description of the design approach and how it addresses the identified problems.
                    </p>
                    {/* Placeholder for hero image */}
                    <div style={{ 
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 24,
                        padding: '56.25% 0 0 0',
                        position: 'relative',
                        marginBottom: 32
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text)',
                            fontSize: 16
                        }}>
                            Hero image / Key design solution
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h2 style={{ marginBottom: 24 }}>Key Features</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Feature 1</h3>
                            <p style={{ 
                                fontSize: 16, 
                                color: 'var(--color-text)', 
                                lineHeight: '24px',
                                maxWidth: 700
                            }}>
                                Description of key feature, design decision, and rationale.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Feature 2</h3>
                            <p style={{ 
                                fontSize: 16, 
                                color: 'var(--color-text)', 
                                lineHeight: '24px',
                                maxWidth: 700
                            }}>
                                Description of key feature, design decision, and rationale.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 12 }}>Feature 3</h3>
                            <p style={{ 
                                fontSize: 16, 
                                color: 'var(--color-text)', 
                                lineHeight: '24px',
                                maxWidth: 700
                            }}>
                                Description of key feature, design decision, and rationale.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Impact & Results */}
                <section style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h2 style={{ marginBottom: 24 }}>Impact & Results</h2>
                    <p style={{ 
                        fontSize: 18, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        maxWidth: 700,
                        marginBottom: 24
                    }}>
                        Measurable outcomes, metrics, and business impact achieved through this design work.
                    </p>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: windowWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
                        gap: 16,
                        marginBottom: 24
                    }}>
                        <div style={{ 
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 16,
                            padding: 24
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 500, marginBottom: 8 }}>XX%</div>
                            <div style={{ fontSize: 14, color: 'var(--color-text)' }}>Metric description</div>
                        </div>
                        <div style={{ 
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 16,
                            padding: 24
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 500, marginBottom: 8 }}>XX%</div>
                            <div style={{ fontSize: 14, color: 'var(--color-text)' }}>Metric description</div>
                        </div>
                        <div style={{ 
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 16,
                            padding: 24
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 500, marginBottom: 8 }}>XX%</div>
                            <div style={{ fontSize: 14, color: 'var(--color-text)' }}>Metric description</div>
                        </div>
                    </div>
                </section>

                {/* Learnings */}
                <section style={{ maxWidth: maxContentWidth, margin: '0 auto', marginBottom: 96 }}>
                    <h2 style={{ marginBottom: 24 }}>Learnings</h2>
                    <p style={{ 
                        fontSize: 18, 
                        color: 'var(--color-text)', 
                        lineHeight: '28px',
                        maxWidth: 700
                    }}>
                        Reflection on what was learned during the project, what worked well, and what could be improved in future iterations.
                    </p>
                </section>
            </div>
            <Footer />
        </div>
    );
}
