import styles from "./AiPatterns.module.css";
import { useNavigate } from "react-router-dom";

export default function AiPatterns() {
    const navigate = useNavigate();
    return (
        <div>
            <div className={styles.back_div}>
                <div className={styles.button_container}>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        title="Back"
                        style={{
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '8px',
                            padding: '0px',
                            alignItems: 'center',
                            color: 'var(--color-text)',
                            fontFamily: 'AspektaVF',
                            background: 'none',
                            fontSize: '14px',
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
                </div>
                <div className={styles.jump_links}>
                    <a className={styles.nav_link} href="#overview">Problem</a>
                    <a className={styles.nav_link} href="#solution">Solution</a>
                    <a className={styles.nav_link} href="#pain-points">Initial audit</a>
                    <a className={styles.nav_link} href="#industry-analysis">Industry analysis</a>
                    <a className={styles.nav_link} href="#design-choices">Design choices</a>
                </div>

            </div>
            <div className={styles.casestudy}>
                <div style={{marginBottom: "40px"}}>
                    <h1 
                        className={styles.title_hero}
                    >
                        Intapp's visual design for AI patterns
                    </h1>
                    <p
                        className={styles.body_hero}
                    >
                        Audited and refreshed the visual identity of AI branding within Intapp's products.
                    </p>
                </div>
                <img
                    className= {styles.hero_image} 
                    style={{marginBottom: "16px"}} 
                    src="./ai-patterns-hero.webp"
                    fetchPriority="high"
                    decoding="sync"
                >
                </img>
                <div className={styles.roles_and_timelines}>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Role</p>
                        <p className={styles.body_role}>Product Designer</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Tools</p>
                        <p className={styles.body_role}>Figma</p>
                        <p className={styles.body_role}>Figma Make</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Team</p>
                        <p className={styles.body_role}>Myself</p>
                        <p className={styles.body_role}>Design Systems Lead</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Timeline</p>
                        <p className={styles.body_role}>3 weeks</p>
                    </div>
                </div>
                <div style={{marginBottom: "80px", paddingBottom: "80px", borderBottom: "1px solid #E1EED3"}}>
                    <h1 style={{marginBottom: "24px"}} className={styles.title_hero}>Here's how the work is moving the needle</h1>
                    <div className={styles.card_row}>
                            <div className={styles.info_card}>
                                <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Cross-platform adoption</p>
                                <p className={styles.card_body}>Our standards are currently being adopted across 5 different products</p>
                            </div>
                            <div className={styles.info_card}>
                                <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Time saved</p>
                                <p className={styles.card_body}>Significantly reducing design and dev time with a scalable system</p>
                            </div>
                    </div>
                </div>
                <div id="overview" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <div>
                        <h1 className={styles.title_main}>Our standards for showcasing AI patterns across multiple products were disjointed and out of control</h1>
                        <p className={styles.body_main}>In the past few years, AI at Intapp had exploded. Product teams were exploring the possibilities to make AI an integral part of each experience. While this explosion in exploration is natural with new technology, it came with cost; duplicative work, inconsistencies in the user experience, confusion, missed & mismatched expectations for the end user.</p>
                        <div className={styles.card_row}>
                            <div className={styles.info_card} style={{backgroundColor: "var(--color-badge-pink-bg)", backgroundImage: "linear-gradient(to bottom, var(--color-badge-pink-bg), var(--color-badge-pink-bg-end))", border: "1px solid var(--color-badge-pink-border"}}>
                                <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px", color: "var(--color-badge-coral-text)"}}>Business risk</p>
                                <p className={styles.card_body} style={{color: "var(--color-badge-coral-text)"}}>Having user churn in the product if they feel that the experience is disjointed</p>
                            </div>
                            <div className={styles.info_card} style={{backgroundColor: "var(--color-badge-pink-bg)", backgroundImage: "linear-gradient(to bottom, var(--color-badge-pink-bg), var(--color-badge-pink-bg-end))", border: "1px solid var(--color-badge-pink-border"}}>
                                <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px", color: "var(--color-badge-coral-text)"}}>Business risk</p>
                                <p className={styles.card_body} style={{color: "var(--color-badge-coral-text)"}}>Unnecessary time, money, and resources spent building bespoke components </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="solution" style={{marginBottom: "clamp(32px, 10vw, 64px)", paddingBottom: "clamp(32px, 10vw, 64px)", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>We updated standards, defined new principles, and unified patterns for AI-powered forms, summaries, input fields, and more</h1>
                    <video className={styles.case_study_video} autoPlay loop muted playsInline>
                        <source src="./ai-pattern-modal-loading.webm" type="video/webm" />
                    </video>
                </div>
                <div id="pain-points" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <h1 className={styles.title_main}>A comprehensive audit revealed consistency gaps with styling, branding, communication, and functionality</h1>
                    <p className={styles.body_main}>Across the 5 different products that had integrated AI, I documented all the instances of large-scale AI design patterns such as summarizations, suggestions, and coversational. Once I identified all of those patterns, I documented all their individual components and compared cross-product similar patterns to each other. Inconsistencies were common. Here's an example of an AI-branded header but served 3 different ways.</p>
                    <img src="./consistency-gaps.webp" style={{width: "100%", height: "auto", borderRadius: "16px", marginBottom: "32px"}}></img>
                    <p className={styles.body_main}>We also found that, through the use of space and color, a lot of emphasis was placed on some AI components that weren't enriching the users' understanding of the AI moment itself. </p>
                    <img src="./entry-form.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div id="industry-analysis" style={{marginBottom: "clamp(32px, 10vw, 64px)", paddingBottom: "clamp(32px, 10vw, 64px)", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>Competitors' AI branding leaned more towards compact visual design yet still informative</h1>
                    <p className={styles.body_main}>We found that competitors were much more agile in updating their standards on showcase in-product AI. We also found that they were able to communicate a lot more information about their design patterns using less space. There were two examples of communication on AI usage that really impressed me: IBM's AI badge and Microsoft's disclaimer on enterprise protection.</p>
                    <img src="./competitors-ai-patterns.webp" style={{width: "100%", height: "auto", borderRadius: "16px", marginBottom: "32px"}}></img>
                    <p className={styles.body_main}>Our UX researcher also gave us interview insights on clients' concerns on AI security and risk. They mostly center around needing to have certainty on output accuracy and source transparency with links leading back to the original source of data</p>
                    <div style={{display: 'flex', flexDirection: "column", gap: '32px', padding: '24px', backgroundColor: 'var(--color-bg-muted)', borderRadius: '16px'}}>
                        <div style={{display: "flex", flexDirection: "row", gap: "12px", alignItems: "top"}}>
                            1.
                            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                                <p style={{fontWeight: '500'}}>Users want to link back to the sources that generate content</p>
                                <p>They don’t need the sources so visible all the time, but people are using the sources as a jumping off point to research more.</p>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", gap: "12px", alignItems: "top"}}>
                            2.
                            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                                <p style={{fontWeight: '500'}}>People are most concerned about data privacy, data protection, and accuracy</p>
                                <p>This goes back to source transparency, linking to the source and having traceability with the sources</p>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row", gap: "12px", alignItems: "top"}}>
                            3.
                            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                                <p style={{fontWeight: '500'}}>We are missing the interaction design that makes AI feel like AI</p>
                                <p>Majority of industry standard AI experience have AI specific loading states and generation experiences that illustrate a smart version of “AI thinking”</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="design-choices" style={{marginBottom: "clamp(40px, 10vw, 80px)"}}>
                    <p className={styles.body_main} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "clamp(12px, 4vw, 14px)"}}>Design Choices</p>
                    <h1 className={styles.title_main}>A compact AI badge that provides model and configuration transparency</h1>
                    <p className={styles.body_main}>Instead of just having a label that mentioned the use of AI, we wanted to create a source of transparency for the user that could be used on a wide range of existing design patterns: widgets, panels, forms, etc.</p>
                    <img src="./modular-badge.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "clamp(40px, 10vw, 80px)"}}>
                    <h1 className={styles.title_main}>A lightweight, modular banner for forms</h1>
                    <p className={styles.body_main}>At the bottom of forms, we had an expand / collapse pattern for sources and feedback that took up a lot of space and was an unnecessary purple. We simplified it into a single banner that was quickly informative but also could comfortably scale to different sizes.</p>
                    <img src="./modular-banner.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "clamp(40px, 10vw, 80px)"}}>
                    <h1 className={styles.title_main}>Informative icon set to help the user understand what actions AI was taking</h1>
                    <p className={styles.body_main}>Before, we used a 'sparkle' icon to indicating anything AI related. The issue was that it didn't inform the user of what action the AI was taking in the system, past the fact that it was there. We moved to an icon set that communicated a far broader range, and this example shows they can be applied to loading states</p>
                    <img src="./icon-set.png" style={{width: "100%", height: "auto", borderRadius: "16px", marginBottom: "4px"}}></img>
                    <img src="./form-loading.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "clamp(32px, 10vw, 64px)", paddingBottom: "clamp(32px, 10vw, 64px)", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>Enabling transparency through improved source pills</h1>
                    <p className={styles.body_main}>In our previous system with low adoption rates, we were giving each lawyer every opportunity one-by-one. In a new agentic world, we could shorten the workflow by grouping together multiple actions while allowing the LLM to still give context on why the options were there.</p>
                    <img src="./source-transparency.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div> 
                <div id="learnings" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <h1 className={styles.title_main}>As AI understanding rapidly skyrockets, what's relevant today might not be relevant tomorrow</h1>
                    <p className={styles.body_main}>Modern brand systems for AI move incredibly fast, and we were caught lagging behind while we were iterating on core product functionality. Even the work that we do today, showcasing the features and impact of AI might not be relevant in the future as general literacy, understanding, and functionality changes.</p>
                </div>
                <div>
                    <p style={{fontWeight: "350", fontSize: "14px", marginBottom: '16px', color: "#333"}}>More projects!!!</p>
                    <div className={styles.project_row} style={{marginBottom: "clamp(64px, 10vw, 128px)"}}>
                        <div className={styles.project_card} onClick={() => navigate('/bddigest')}>
                            <img src="./bd-digest-list.webp" style={{width: "100%", height: "auto", borderRadius: "12px"}}></img>
                            <p style={{fontWeight: "350", fontSize: "clamp(12px, 3.5vw, 16px"}}>Business development digest</p>
                        </div>
                        <div className={styles.project_card} style={{cursor: "default"}}>
                            <img src="./embedded-celeste-list.webp" style={{width: "100%", height: "auto", borderRadius: "12px"}}></img>
                            <p style={{fontWeight: "350", fontSize: "clamp(12px, 3.5vw, 16px", color: "var(--color-text-muted)"}}>Embedded Celeste - coming soon!!!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}