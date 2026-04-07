import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ArrowDownRight, Globe, Shield, Recycle,
    ShieldCheck, Cpu, Repeat, Target,
    Leaf, BarChart3
} from 'lucide-react';
import styles from '../styles/About.module.css';

const About = () => {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div className={styles.mainWrapper}>

            {/* --- 01. INDUSTRIAL SIGNATURE HERO --- */}
            <section className={styles.heroSection}>
                <motion.div
                    style={{ scale }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.heroImageWrapper}
                >
                    {/* Full-bleed industrial image */}
                    <img
                        src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=2000"
                        alt="Industrial Rubber Infrastructure"
                        className={styles.heroImage}
                    />

                    {/* --- UI LAYER ON TOP OF IMAGE --- */}
                    <div className={styles.overlayUI}>
                        <div className={styles.container}>

                            {/* --- RSM WATERMARK --- */}
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ duration: 10, repeat: Infinity }}
                                className={styles.brandSig}
                            >
                                {/* Blue line now sits to the left of the wrapper below */}
                                <div className={styles.verticalLine}></div>

                                {/* New wrapper to keep text stacked vertically */}
                                <div className={styles.sigTextWrapper}>
                                    <h4>RSM<span className={styles.tagVersion}>.v04</span></h4>
                                    <span>B2B INTEGRITY HUB</span>
                                </div>
                            </motion.div>

                            {/* --- STAGGERED ILLUMINATED TITLES --- */}
                            <div className={styles.signatureTitles}>
                                <motion.h1
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                    className={styles.passionH1}
                                >
                                    ABOUT
                                </motion.h1>
                                <motion.h1
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 1, ease: "circOut" }}
                                    className={styles.sustainableH1}
                                >
                                    RUBBERSCRAPMART
                                </motion.h1>
                            </div>

                            {/* Hero Badge at Bottom Right */}
                            <div className={styles.heroBadge}>
                                <h4>EST. 2024</h4>
                                <p>Digital. Industrial. Sustainable.</p>
                            </div>

                            <div className={styles.titleAmbientGlow}></div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* --- 02. OVERLAPPING NARRATIVE --- */}
            <section className={styles.storySection}>
                <div className={styles.sideText}>WHO WE ARE</div>
                <div className={styles.container}>
                    <div className={styles.storyGrid}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className={styles.storyContent}
                        >
                            <span className={styles.storySubtitle}>SINCE 2024 // INDUSTRIAL PIONEERS</span>
                            <h3>Engineering Digital Transparency</h3>
                            <p>
                                RubberScrapMart.com is India’s premier exclusive B2B marketplace, meticulously
                                designed to bridge the gap between heavy industry and sustainable digital innovation.
                                We are more than just a trading platform; we are an infrastructure-first ecosystem.
                            </p>
                            <p>
                                By streamlining the trade of rubber scrap-derived products, we empower recyclers
                                and manufacturers with data-driven insights, ensuring every transaction is
                                backed by verified industrial standards and automated logistics.
                            </p>

                            <div className={styles.statsMini}>
                                <div className={styles.statItem}>
                                    <strong>1200+</strong>
                                    <span>Verified Partners</span>
                                </div>
                                <div className={styles.statItem}>
                                    <strong>500+</strong>
                                    <span>Global Cities</span>
                                </div>
                                <div className={styles.statItem}>
                                    <strong>100%</strong>
                                    <span>Supply Integrity</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className={styles.storyDecoration}
                        >
                            <div className={styles.imageOverlay}></div>
                            <img
                                src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800"
                                alt="Industrial Facility"
                            />
                            {/* Floating "Experience" card for visual depth */}
                            <div className={styles.floatingTag}>
                                <span>NEXT-GEN B2B</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- 03. SERVICES --- */}
            <section className={styles.servicesSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>What We Bring <br /> to the Table</h2>
                    <div className={styles.serviceList}>
                        <ServiceRow
                            num="01"
                            title="Global Marketplace"
                            desc="A high-velocity B2B ecosystem connecting certified recyclers with global manufacturers. We eliminate geographical barriers by providing a centralized hub for real-time trade, cross-border logistics, and scalable supply chain integration."
                            icon={<Globe />}
                        />
                        <ServiceRow
                            num="02"
                            title="Industrial Quality Assurance"
                            desc="Our proprietary vetting protocol ensures that every buyer and supplier meets rigorous industrial benchmarks. From material purity to transaction security, we provide a layer of institutional trust that minimizes risk in high-volume rubber scrap trade."
                            icon={<Shield />}
                        />
                        <ServiceRow
                            num="03"
                            title="Circular Economy Integration"
                            desc="Architecting a sustainable future by transforming rubber waste into high-value raw materials. We provide the infrastructure for manufacturers to achieve zero-waste goals through closed-loop recycling and carbon-conscious production cycles."
                            icon={<Recycle />}
                        />
                        <ServiceRow
                            num="04"
                            title="Data-Driven Logistics"
                            desc="Optimizing the movement of industrial scrap through automated tracking and intelligent routing. Our platform provides end-to-end visibility, ensuring that material flow is consistent, transparent, and cost-effective for all stakeholders."
                            icon={<Recycle />}
                        />
                    </div>
                </div>
            </section>

            {/* --- 04. THE OPERATIONAL CYCLE --- */}
            <section className={styles.cycleSection}>
                <div className={styles.cycleContainer}>
                    <div className={styles.sideHeadingWrapper}>
                        <h2 className={styles.verticalTitle}>The Operational Cycle</h2>
                    </div>

                    <div className={styles.stepsWrapper}>
                        <div className={styles.pipelineBody}></div>
                        <div className={styles.cycleGrid}>
                            <CycleStep
                                num="01"
                                icon={<ShieldCheck size={32} />}
                                title="Vetting"
                                desc="A centralized B2B hub connecting certified recyclers with global manufacturers, eliminating geographical barriers through real-time trade and integrated logistics." />
                            <CycleStep
                                num="02"
                                icon={<Cpu size={32} />}
                                title="Grading"
                                desc="Our rigorous vetting protocol ensures every partner meets industrial benchmarks, providing a layer of institutional trust for high-volume transactions." />
                            <CycleStep
                                num="03"
                                icon={<Repeat size={32} />}
                                title="Trade"
                                desc="Driving industrial sustainability by transforming rubber waste into high-value raw materials through closed-loop recycling and carbon-conscious production." />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 05. CORE STRATEGIC PILLARS --- */}
            <section className={styles.valuesSection}>
                <div className={styles.container}>
                    <div className={styles.valuesHeader}>
                        <h2>Core Strategic <br /> Pillars</h2>
                        <p>Our commitment to industrial excellence and digital integrity.</p>
                    </div>
                    <div className={styles.valuesGrid}>
                        <ValueCard
                            icon={<Target size={40} />}
                            title="Precision Trading"
                            text="We eliminate the guesswork through data-driven grading and real-time logistics."
                        />
                        <ValueCard
                            icon={<Leaf size={40} />}
                            title="Green Integrity"
                            text="We ensure rubber waste is diverted from landfills back into the high-value supply chain."
                        />
                        <ValueCard
                            icon={<BarChart3 size={40} />}
                            title="Market Stability"
                            text="By connecting direct buyers and sellers, we reduce price volatility."
                        />
                    </div>
                </div>
            </section>

            {/* --- 06. FOOTER CALL TO ACTION --- */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={styles.ctaCard}
                    >
                        <div className={styles.ctaContent}>
                            <div className={styles.ctaText}>
                                <motion.span
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className={styles.ctaStatus}
                                >
                                    ● NOW ACCEPTING NEW PARTNERS
                                </motion.span>
                                <h2>Scale Your Industrial Reach</h2>
                                <p>Verified infrastructure to trade with enterprise-grade security.</p>

                                <div className={styles.ctaStats}>
                                    <div className={styles.ctaStatItem}>
                                        <strong>24/7</strong>
                                        <span>Market Access</span>
                                    </div>
                                    <div className={styles.ctaStatItem}>
                                        <strong>100%</strong>
                                        <span>Vetted Leads</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.ctaAction}>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#007bff", color: "#fff" }}
                                    whileTap={{ scale: 0.95 }}
                                    className={styles.ctaButton}
                                >
                                    Join the Ecosystem
                                    <ArrowDownRight size={24} />
                                </motion.button>
                            </div>
                        </div>
                        <div className={styles.ctaGradientOverlay}></div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

/* --- MINI COMPONENTS --- */
const ServiceRow = ({ num, title, desc, icon }) => (
    <motion.div whileHover={{ x: 20 }} className={styles.serviceRow}>
        <span className={styles.rowNum}>{num}</span>
        <div className={styles.rowIcon}>{icon}</div>
        <div className={styles.rowBody}>
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    </motion.div>
);

const CycleStep = ({ num, icon, title, desc }) => (
    <motion.div whileHover={{ y: -10 }} className={styles.cycleStep}>
        <div className={styles.stepHeader}>
            <span className={styles.stepNum}>{num}</span>
            <div className={styles.stepIcon}>{icon}</div>
        </div>
        <div className={styles.stepContent}>
            <h4>{title}</h4>
            <div className={styles.accentBar}></div>
            <p>{desc}</p>
        </div>
    </motion.div>
);

const ValueCard = ({ icon, title, text }) => (
    <div className={styles.valueCard}>
        <div className={styles.valueIcon}>{icon}</div>
        <h3>{title}</h3>
        <p>{text}</p>
    </div>
);

export default About;