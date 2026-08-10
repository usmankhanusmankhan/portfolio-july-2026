import styles from "./BusinessDevelopmentDigest.module.css";
import { useNavigate } from "react-router-dom";

export default function BusinessDevelopmentDigest() {
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
                    <a className={styles.nav_link} href="#overview">Overview</a>
                    <a className={styles.nav_link} href="#solution">Solution</a>
                    <a className={styles.nav_link} href="#pain-points">Pain points</a>
                    <a className={styles.nav_link} href="#prototyping">Prototyping</a>
                    <a className={styles.nav_link} href="#feature-set">Feature set</a>
                </div>

            </div>
            <div className={styles.casestudy}>
                <div style={{marginBottom: "40px"}}>
                    <h1 
                        className={styles.title_hero}
                    >
                        Business development digest
                    </h1>
                    <p
                        className={styles.body_hero}
                    >
                        Redefining how lawyers action business development opportunities by designing an agentic playbook
                    </p>
                </div>
                <img
                    className= {styles.hero_image} 
                    style={{marginBottom: "16px"}} 
                    src="./digest-hero.webp"
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
                        <p className={styles.body_role}>Cursor</p>
                        <p className={styles.body_role}>Claude</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Team</p>
                        <p className={styles.body_role}>Myself</p>
                        <p className={styles.body_role}>Design Lead</p>
                        <p className={styles.body_role}>Product Lead</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Timeline</p>
                        <p className={styles.body_role}>1 week</p>
                    </div>
                </div>
                <div style={{marginBottom: "80px", paddingBottom: "80px", borderBottom: "1px solid #E1EED3"}}>
                    <h1 style={{marginBottom: "24px"}} className={styles.title_hero}>Here's how the work moved the needle</h1>
                    <div className={styles.card_row}>
                            <div className={styles.info_card}>
                                <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Reduced handoff time by 50%</p>
                                <p className={styles.card_body}>Handoff time was cut to 1 week, instead of usual time of 1 month</p>
                            </div>
                            <div className={styles.info_card}>
                                <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>C-suite buy in</p>
                                <p className={styles.card_body}>Wide-spread buy in from leadership team, reigniting a spark for a dying product line</p>
                            </div>
                    </div>
                </div>
                <div id="overview" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <div>
                        <h1 className={styles.title_main}>We were missing the mark on making business development opportunities for lawyers obvious, relevant, and immediately actionable</h1>
                        <p className={styles.body_main}>For the past year, I had worked on Activator, a product designed to help lawyers supercharge their business development. However, we had low adoption rates due to difficulties hosting the solution on our CRM, Dealcloud. The introduction of our agentic platform, Celeste, changed the possibilities of how we delivered information to our customers.</p>
                    </div>
                    <img src="./overview-bddigest.webp" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div id="solution" style={{marginBottom: "clamp(32px, 10vw, 64px)", paddingBottom: "clamp(32px, 10vw, 64px)", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>I designed an agentic playbook to offer high impact BD opportunities without overwhelming the user or becoming noise</h1>
                    <video className={styles.case_study_video} autoPlay loop muted playsInline>
                        <source src="./activator-celeste-playbook.webm" type="video/webm" />
                    </video>
                </div>
                <div id="pain-points" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <h1 className={styles.title_main}>Interviews revealed our current services were too information heavy with little context on why it's there</h1>
                    <img src="./pain-point-interview.webp" style={{width: "100%", height: "auto", borderRadius: "16px", marginBottom: "12px", marginTop: "12px"}}></img>
                    <div className={styles.card_row}>
                        <div className={styles.info_card} style={{backgroundColor: "var(--color-badge-pink-bg)", backgroundImage: "linear-gradient(to bottom, var(--color-badge-pink-bg), var(--color-badge-pink-bg-end))", border: "1px solid var(--color-badge-pink-border"}}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px", color: "var(--color-badge-coral-text)"}}>Pain point</p>
                            <p className={styles.card_body} style={{color: "var(--color-badge-coral-text)"}}>Users want to block out unnecessary noise, especially in a time-constrained role</p>
                        </div>
                        <div className={styles.info_card} style={{backgroundColor: "var(--color-badge-pink-bg)", backgroundImage: "linear-gradient(to bottom, var(--color-badge-pink-bg), var(--color-badge-pink-bg-end))", border: "1px solid var(--color-badge-pink-border"}}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px", color: "var(--color-badge-coral-text)"}}>Pain point</p>
                            <p className={styles.card_body} style={{color: "var(--color-badge-coral-text)"}}>Users need to understand context and why an opportunity actually applies to them</p>
                        </div>
                    </div>
                </div>
                <div id="prototyping" style={{marginBottom: "clamp(32px, 10vw, 64px)", paddingBottom: "clamp(32px, 10vw, 64px)", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>Cursor and Claude allowed me to rapidly prototype interactions that got the team quickly excited</h1>
                    <p className={styles.body_main}>Working closer to the code has not only helped dramatically cut down implementation time for devs, but also showcase animations and motion that communicate my vision to PMs and Devs a lot better than Figma. Typing interactions, like the one shown below, would have been much more time consuming to create in Figma.</p>
                    <video className={styles.case_study_video} autoPlay loop muted playsInline>
                        <source src="./claude-cursor-exciting.webm" type="video/webm"/>
                    </video>
                </div>
                <div id="feature-set" style={{marginBottom: "clamp(40px, 10vw, 80px)"}}>
                    <p className={styles.body_main} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "clamp(12px, 4vw, 14px)"}}>Feature Set</p>
                    <h1 className={styles.title_main}>Leading with a high-impact cross sell opportunity</h1>
                    <p className={styles.body_main}>If a lawyer only had a few seconds of attention to think about their BD, what should they do? Through past research, we knew that a lawyer's biggest chance to grow business for the firm was the cross-sell opportunity, which were viable ways to offer additional services from other practice areas to existing clients. We lead with this card to solve the lawyer's pain point of too much noise.</p>
                    <img src="./leading-with-cross-sell-opportunity.webp" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "clamp(40px, 10vw, 80px)"}}>
                    <h1 className={styles.title_main}>An intelligently guided conversation</h1>
                    <p className={styles.body_main}>How else could we keep the lawyer's attention front and center, especially when we've learned about how time-sensitive their other work is? We intelligently refresh the conversation based on what opportunities they've already actioned so we can keep the lawyer in the moment, while taking the chance to provide positive reinforcement.</p>
                    <img src="./intelligently-guided.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "clamp(40px, 10vw, 80px)"}}>
                    <h1 className={styles.title_main}>Keeping the human in charge of communications</h1>
                    <p className={styles.body_main}>The concept of "human-in-the-loop" was continuously referenced by our team and the broader design team. We knew through past research that lawyers felt inclined to have final control over their communication with colleagues. We do not send any messages automatically, or without approval.</p>
                    <img src="./human-in-charge.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "clamp(32px, 10vw, 64px)", paddingBottom: "clamp(32px, 10vw, 64px)", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>Bulk actionability to save time</h1>
                    <p className={styles.body_main}>In our previous system with low adoption rates, we were giving each lawyer every opportunity one-by-one. In a new agentic world, we could shorten the workflow by grouping together multiple actions while allowing the LLM to still give context on why the options were there.</p>
                    <img src="./bulk-actionability.webp" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div> 
                <div id="learnings" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <h1 className={styles.title_main}>If I were to do it again, I’d meet the lawyers where they live in Outlook</h1>
                    <p className={styles.body_main}>Another tidbit of historical knowledge: we know that lawyers live in existing platforms like Outlook. We knew that placing the solution in our agentic platform would take them away from the famiilar workflow.  In the future, I would recreate the digest within Outlook to be easily actionable in their everyday areas.</p>
                </div>
                <div>
                    <p style={{fontWeight: "350", fontSize: "14px", marginBottom: '16px', color: "#333"}}>More projects!!!</p>
                    <div className={styles.project_row} style={{marginBottom: "clamp(64px, 10vw, 128px)"}}>
                        <div className={styles.project_card} onClick={() => navigate('/aipatterns')}>
                            <img src="./ai-patterns-list.webp" style={{width: "100%", height: "auto", borderRadius: "12px"}}></img>
                            <p style={{fontWeight: "350", fontSize: "16px"}}>Intapp's visual refresh for AI patterns</p>
                        </div>
                        <div className={styles.project_card} onClick={() => navigate('/')}>
                            <img src="./embedded-celeste-list.webp" style={{width: "100%", height: "auto", borderRadius: "12px"}}></img>
                            <p style={{fontWeight: "350", fontSize: "16px"}}>Embedded Celeste</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}