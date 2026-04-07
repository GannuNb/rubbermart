import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, RefreshCcw, Truck, ShieldCheck, Globe,
  BarChart3, Factory, Recycle, Scale, MessageSquare, ChevronRight
} from 'lucide-react';
import styles from '../styles/Home.module.css';
import HeroCloudErase from './HeroCloudErase';

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true }
};

const Home = () => {
  const materials = [
    { title: "Crumb Rubber", usage: "Road Construction", img: "https://images.pexels.com/photos/6314022/pexels-photo-6314022.jpeg?auto=format&fit=crop&w=600&h=400&q=80" },
    { title: "Pyrolysis Oil", usage: "Industrial Heating", img: "https://images.unsplash.com/photo-1624365169192-6f17be3ad4ed?auto=format&fit=crop&w=600&h=400&q=80" },
    { title: "Reclaim Rubber", usage: "Automotive Parts", img: "https://images.pexels.com/photos/5439446/pexels-photo-5439446.jpeg?auto=format&fit=crop&w=600&h=400&q=80" },
    { title: "Steel Wire", usage: "Steel Smelting", img: "https://images.pexels.com/photos/4774911/pexels-photo-4774911.jpeg?auto=format&fit=crop&w=600&h=400&q=80" }
  ];

  return (
    <div className={styles.wrapper}>

      {/* --- SECTION 1: HERO --- */}
      <section className={styles.hero}>
        <HeroCloudErase />
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.pill}>
            <span className={styles.pillBadge}>Live</span>
            <p>India's Premier Rubber Marketplace</p>
          </div>
          <h1 className={styles.heroTitle}>
            Scaling the <br />
            <span className={styles.gradientText}>Circular Economy</span> <br />
            for Rubber Waste.
          </h1>
          <p className={styles.heroSub}>
            A sophisticated B2B ecosystem connecting global buyers with verified
            Indian rubber scrap derivatives through transparent, digital-first trading.
          </p>
          <div className={styles.btnGroup}>
            <button className={styles.primaryBtn}>Join the Network <ArrowRight size={18} /></button>
            <button className={styles.secondaryBtn}>View Live Market</button>
          </div>
        </motion.div>
      </section>

      {/* --- SECTION 2: DARK STATS --- */}
      <section className={styles.statsSection}>
        <motion.div 
          className={styles.statsGrid}
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {[
            { label: "Market Reach", val: "40M+", icon: <Globe size={32} /> },
            { label: "Verified Supply", val: "100%", icon: <ShieldCheck size={32} /> },
            { label: "Trade Volume", val: "₹500Cr+", icon: <BarChart3 size={32} /> }
          ].map((stat, i) => (
            <motion.div key={i} className={styles.statCard} variants={fadeInUp}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <h3>{stat.val}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- SECTION 3: MATERIAL VERTICALS --- */}
      <section className={styles.verticalsSection}>
        <div className={styles.container}>
          <motion.div className={styles.centeredHeader} {...fadeInUp}>
            <h2 className={styles.sectionTitle}>Material Specialization</h2>
            <p>Facilitating high-volume trade across industrial rubber derivatives.</p>
          </motion.div>
          
          <motion.div 
            className={styles.verticalsGrid}
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {materials.map((item, i) => (
              <motion.div 
                key={i} 
                className={styles.verticalCard} 
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                <div className={styles.imageWrapper}>
                  <img src={item.img} alt={item.title} />
                </div>
                <div className={styles.verticalContent}>
                  <h4>{item.title}</h4>
                  <p>{item.usage}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 4: BENTO GRID --- */}
      <section className={styles.bentoSection}>
        <div className={styles.container}>
          <motion.div className={styles.centeredHeader} {...fadeInUp}>
            <h2 className={styles.sectionTitle}>Engineered for Efficiency</h2>
            <p>The platform automates the heavy lifting of scrap logistics.</p>
          </motion.div>

          <motion.div 
            className={styles.bentoGrid}
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            <motion.div className={`${styles.bentoItem} ${styles.large}`} variants={fadeInUp} whileHover={{ scale: 1.01 }}>
              <RefreshCcw size={48} color="#10b981" />
              <h3>Advanced Circular Infrastructure</h3>
              <p>From sourcing to delivery, we manage the entire lifecycle of rubber derivatives with ESG-compliant digital tracking.</p>
            </motion.div>

            <motion.div className={styles.bentoItem} variants={fadeInUp} whileHover={{ scale: 1.02 }}>
              <Truck size={32} color="#10b981" />
              <h3>Port-Ready</h3>
              <p>Integrated logistics nodes in Mundra and Chennai.</p>
            </motion.div>

            <motion.div className={styles.bentoItem} variants={fadeInUp} whileHover={{ scale: 1.02 }}>
              <ShieldCheck size={32} color="#10b981" />
              <h3>Smart Verification</h3>
              <p>3-point administrative audit for every live listing.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 5: ROADMAP --- */}
      <section className={styles.roadmapSection}>
        <div className={styles.container}>
          <motion.div className={styles.centeredHeader} {...fadeInUp}>
            <h2 className={styles.sectionTitle}>The Export Journey</h2>
          </motion.div>
          <motion.div 
            className={styles.roadmapWrapper}
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {[
              { icon: <Factory />, label: "Collection", text: "Aggregate from 200+ centers." },
              { icon: <Recycle />, label: "Processing", text: "ISO-certified shredding." },
              { icon: <Scale />, label: "Compliance", text: "Customs & Documentation." },
              { icon: <Globe />, label: "Delivery", text: "Direct Global Logistics." }
            ].map((step, i) => (
              <motion.div key={i} className={styles.roadmapStep} variants={fadeInUp}>
                <div className={styles.roadmapIcon}>{step.icon}</div>
                <h5>{step.label}</h5>
                <p>{step.text}</p>
                {i < 3 && <ChevronRight className={styles.roadmapArrow} size={20} />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SECTION 6: FAQ --- */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqGrid}>
            <motion.div className={styles.faqInfo} {...fadeInUp}>
              <h2 className={styles.sectionTitle}>Trust & <br /> Transparency</h2>
              <p>Everything you need to know about our trading standards.</p>
              <button className={styles.contactBtn}><MessageSquare size={18} /> Contact Support</button>
            </motion.div>
            <motion.div 
              className={styles.faqList}
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
            >
              {[
                { q: "Supplier Verification?", a: "We audit every facility for Pollution Control certifications." },
                { q: "Payment Security?", a: "Transactions are held in a secure digital escrow until delivery." },
                { q: "Quality Control?", a: "Every batch includes a 3rd party lab chemical analysis report." }
              ].map((faq, i) => (
                <motion.div key={i} className={styles.faqItem} variants={fadeInUp}>
                  <h6>{faq.q}</h6>
                  <p>{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FOOTER TICKER --- */}
      <div className={styles.marketTicker}>
        <div className={styles.tickerContent}>
          {["CRUMB RUBBER - ₹34,200 ▲", "TYRE OIL - ₹42,100 ▼", "STEEL SCRAP - ₹28,500 ▲", "RECLAIM RUBBER - ₹51,000 ▲"].map((t, i) => (
            <span key={i} className={styles.tickerItem}>{t}</span>
          ))}
          {/* Duplicate for infinite loop */}
          {["CRUMB RUBBER - ₹34,200 ▲", "TYRE OIL - ₹42,100 ▼", "STEEL SCRAP - ₹28,500 ▲", "RECLAIM RUBBER - ₹51,000 ▲"].map((t, i) => (
            <span key={`${i}-dup`} className={styles.tickerItem}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;