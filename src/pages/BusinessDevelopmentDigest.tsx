import styles from "./BusinessDevelopmentDigest.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function BusinessDevelopmentDigest() {
    const navigate = useNavigate();
    return (
        <div>
            <div style={{position: "fixed", top: "48px", left: "48px", zIndex: 1000}}>
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
                        marginBottom: '12px',
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
                <div 
                    style={{display: 'flex', flexDirection: 'column', gap: '6px'}}
                >
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
                        Redefining how lawyers action business development opportunities through Intapp's agentic platform, Celeste
                    </p>
                </div>
                <img
                    className= {styles.hero_image} 
                    style={{marginBottom: "16px"}} 
                    src="./digest-hero.webp"
                    loading="lazy"
                >
                </img>
                <div className={styles.card_row} style={{marginBottom: "40px"}}>
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Impact</p>
                            <p className={styles.card_body}>Handoff time was cut to 1 week, instead of a longer, traditional handoff process</p>
                        </div>
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Impact</p>
                            <p className={styles.card_body}>Wide-spread buy in from leadership team, reigniting a spark for a dying product line </p>
                        </div>
                </div>
                <div className={styles.roles_and_timelines}>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Role</p>
                        <p className={styles.body_role}>Product Designer</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Tools</p>
                        <p className={styles.body_role}>Figma</p>
                        <p className={styles.body_role}>Claude</p>
                        <p className={styles.body_role}>Cursor</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Team</p>
                        <p className={styles.body_role}>Product Designer</p>
                        <p className={styles.body_role}>Design Lead</p>
                        <p className={styles.body_role}>Product Lead</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Timeline</p>
                        <p className={styles.body_role}>1 week</p>
                    </div>
                </div>
                <div id="overview" style={{marginBottom: "112px"}}>
                    <div>
                        <h1 className={styles.title_main}>We were missing the mark on making business development opportunities for lawyers obvious, relevant, and immediately actionable</h1>
                        <p className={styles.body_main}>Our business development offering... </p>
                    </div>
                    <img src="./overview-bddigest.webp" style={{width: "100%", height: "auto"}}></img>
                </div>
                <div id="solution" style={{marginBottom: "112px"}}>
                    <h1 className={styles.title_main}>Through our agentic experience Celeste, we offer high impact BD opportunities without overwhelming the user or becoming noise</h1>
                    <video className={styles.case_study_video} autoPlay loop muted playsInline>
                        <source src="./activator-celeste-playbook.webm" type="video/webm" />
                    </video>
                </div>
                <div id="pain-points" style={{marginBottom: "112px"}}>
                    <h1 className={styles.title_main}>Based on prior research, we knew that...</h1>
                    <div className={styles.card_row}>
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Pain Point</p>
                            <p className={styles.card_body}>Users want to block out unnecessary noise, especially in a time-constrained role</p>
                        </div>
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Pain Point</p>
                            <p className={styles.card_body}>Users need to understand context and why an opportunity actually applies to them</p>
                        </div>
                    </div>
                </div>
                <div id="prototyping" style={{marginBottom: "64px", paddingBottom: "64px", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>Cursor and Claude allowed me to rapidly prototype interactions that got the team quickly excited</h1>
                    <p className={styles.body_main}>Working closer to the code has not only helped dramatically cut down implementation time for devs, but also showcase animations and motion that communicate my vision to PMs and Devs a lot better than Figma. Typing interactions, like the one shown below, would have been much more time consuming to create in Figma.</p>
                    <video className={styles.case_study_video} autoPlay loop muted playsInline>
                        <source src="./claude-cursor-exciting.webm" type="video/webm"/>
                    </video>
                </div>
                <div id="feature-set" style={{marginBottom: "80px"}}>
                    <p className={styles.body_main} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Feature Set</p>
                    <h1 className={styles.title_main}>Leading with a high-impact cross sell opportunity</h1>
                    <p className={styles.body_main}>If a lawyer only had a few seconds of attention to think about their BD, what should they do? Through past research, we knew that a lawyer's biggest chance to grow business for the firm was the cross-sell opportunity, which were viable ways to offer additional services from other practice areas to existing clients. We lead with this card to solve the lawyer's pain point of too much noise.</p>
                    <img src="./leading-with-cross-sell-opportunity.webp" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "80px"}}>
                    <h1 className={styles.title_main}>An intelligently guided conversation</h1>
                    <p className={styles.body_main}>If a lawyer only had a few seconds of attention to think about their BD, what should they do? Through past research...</p>
                    <img src="./intelligently-guided.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "80px"}}>
                    <h1 className={styles.title_main}>Keeping the human in charge of communications</h1>
                    <p className={styles.body_main}>If a lawyer only had a few seconds of attention to think about their BD, what should they do? Through past research...</p>
                    <img src="./human-in-charge.png" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div style={{marginBottom: "96px"}}>
                    <h1 className={styles.title_main}>Bulk actionability to save time</h1>
                    <p className={styles.body_main}>If a lawyer only had a few seconds of attention to think about their BD, what should they do? Through past research...</p>
                    <img src="./bulk-actionability.webp" style={{width: "100%", height: "auto", borderRadius: "16px"}}></img>
                </div>
                <div id="learnings" style={{marginBottom: "96px"}}>
                    <h1 className={styles.title_main}>If I were to do it again, I’d meet the lawyers where they live in Outlook</h1>
                    <p className={styles.body_main}>Another tidbit of historical knowledge: we know that lawyers live in existing platforms like Outlook.We knew that placing the solution in our agentic platform would take them away from the famiilar workflow.  In the future, I would recreate the digest within Outlook to be easily actionable in theireveryday areas.</p>
                </div>
            </div>
        </div>
    );
}