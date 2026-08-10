import styles from "./IBMQuantum.module.css";
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
                    <a className={styles.nav_link} href="#problem">Problem</a>
                    <a className={styles.nav_link} href="#solution">Solution</a>
                    <a className={styles.nav_link} href="#initial-findings">Initial findings</a>
                    <a className={styles.nav_link} href="#prototyping">Prototyping</a>
                    <a className={styles.nav_link} href="#feature-set">Feature set</a>
                </div>

            </div>
            <div className={styles.casestudy}>
                <div style={{marginBottom: "40px"}}>
                    <h1 
                        className={styles.title_hero}
                    >
                        IBM Quantum metric tracking
                    </h1>
                    <p
                        className={styles.body_hero}
                    >
                        Led design for dashboard tracking metrics for 50 IBM Quantum artifacts, saving months of implementation
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
                            <p className={styles.card_body}>Implementation time was cut down from months to 20 minutes</p>
                        </div>
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Impact</p>
                            <p className={styles.card_body}>Led to high internal usage rate to generate quarterly data reports</p>
                        </div>
                </div>
                <div className={styles.roles_and_timelines}>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Role</p>
                        <p className={styles.body_role}>Visual / Product Designer</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Tools</p>
                        <p className={styles.body_role}>Figma</p>
                        <p className={styles.body_role}>Mural</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Team</p>
                        <p className={styles.body_role}>2 Product Designers</p>
                        <p className={styles.body_role}>UX Researcher</p>
                    </div>
                    <div>
                        <p className={styles.body_role} style={{fontWeight: "300", marginBottom: "6px", color: "#333", fontSize: "14px"}}>Timeline</p>
                        <p className={styles.body_role}>1 week</p>
                    </div>
                </div>
                <div id="overview" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <div>
                        <h1 className={styles.title_main}>Our team is a world leader in quantum computing and resources, and showcases tons of online material</h1>
                        <p className={styles.body_main}>They have over 20 cloud-connected systems worldwide, including their iconic System One. Their flagship product, Qiskit Runtime, is their online quantum computing service and programming model for running quantum algorithms. Other than Qiskit Runtime, there are countless resources and way to learn about and experiment with IBM Quantum.</p>
                    </div>
                    <img src="./ibm-context.png" style={{width: "100%", height: "auto", borderRadius: "12px"}}></img>
                </div>
                <div id="problem" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <div>
                        <h1 className={styles.title_main}>With many different services and offerings, there was no centralized way to track them internally</h1>
                        <p className={styles.body_main}>Because the Quantum team couldn't track them internally, they couldn't share out data with other stakeholders and find business value in their work. From this point on, our team referred to the online resources as "touchpoints". Our managers further defined touchpoints as any IBM Quantum website, offering, service, or product.</p>
                    </div>
                    <img src="./ibm-touchpoint.png" style={{width: "100%", height: "auto", borderRadius: "12px"}}></img>
                </div>
                <div id="solution" style={{marginBottom: "clamp(32px, 10vw, 64px)", paddingBottom: "clamp(32px, 10vw, 64px)", borderBottom: "1px solid #E1EED3"}}>
                    <h1 className={styles.title_main}>We designed a consolidated solution that gave </h1>
                    <video className={styles.case_study_video} autoPlay loop muted playsInline>
                        <source src="./activator-celeste-playbook.webm" type="video/webm" />
                    </video>
                </div>
                <div id="initial-findings" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <h1 className={styles.title_main}>We interviewed cross-team stakeholders to gain insight on how they prefer to analyze data.</h1>
                    <p className={styles.body_main}>We conducted 5 interviews with a Product Manager, Data Scientist, Marketing Lead, Design Researcher, and Content Writer. They all consistently need to share out data from essential IBM Quantum touchpoints. So many touchpoints are tracked, which means that data isn't interpreted by just one team.  As a result, we needed to understand different definitions of what success looks like for our stakeholder's prioritized touchpoints.</p>
                    <img src="./ibm-stakeholders.svg" style={{width: "100%", height: "auto", marginBottom: "12px", marginTop: "12px"}}></img>
                </div>
                <div style={{marginBottom: "clamp(40px, 10vw, 80px)"}}>
                    <h1 className={styles.title_main}>Data is given without context and needs definition points</h1>
                    <p className={styles.body_main}>All stakeholders mentioned at least one data point that they regularly analyze which was confusing to them. They have the problem of presenting data during share-outs without knowing their meaning.</p>
                    <div className={styles.card_row}>
                        
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Opportunity</p>
                            <p className={styles.card_body}>Provide context behind which research studies different data sets come from, and from what source or platform</p>
                        </div>
                    </div>
                </div>
                <div id="key-insights" style={{marginBottom: "clamp(48px, 10vw, 96px)"}}>
                    <h1 className={styles.title_main}>Data is often gathered from multiple sources</h1>
                    <p className={styles.body_main}>All stakeholders mentioned at least one data point that they regularly analyze which was confusing to them. They have the problem of presenting data during share-outs without knowing their meaning.</p>
                    <div className={styles.card_row}>
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Pain Point</p>
                            <p className={styles.card_body}>Users want to block out unnecessary noise, especially in a time-constrained role</p>
                        </div>
                        <div className={styles.info_card}>
                            <p className={styles.card_body} style={{fontWeight: "500", marginBottom: "8px"}}>Opportunity</p>
                            <p className={styles.card_body}>Users need to understand context and why an opportunity actually applies to them</p>
                        </div>
                    </div>
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