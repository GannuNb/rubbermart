import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Lock, BarChart3 } from 'lucide-react';
import styles from '../styles/CommonHome.module.css';
import TopHero from './TopHero';
import HomeImg from '../assests/Home.jpeg';

const mainCards = [
  {
    brand: "RUBBERSCRAPMART",
    tag: "Market Authority",
    title: "BUY AND SELL RUBBERSCRAP",
    desc: "India’s premier digital Rubberscrap Marketplace for sustainable scrap management. We offer a high-integrity platform to buy, sell, and trade scrap materials through eco-friendly recycling processes.",
    id: "01",
    image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1200&auto=format"
  },
  {
    brand: "RUBBERSCRAPMART",
    tag: "Circular Infrastructure",
    title: "The Industrial OS for Rubber Waste.",
    desc: "A full-stack digital backbone for the recycling sector. We automate the complexity of sourcing, grading, and reintegrating scrap into high-value production cycles.",
    id: "02",
    image: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?q=80&w=1200&auto=format"
  },
  {
    brand: "RUBBERSCRAPMART",
    tag: "Global Marketplace",
    title: "Supply Chain. Reimagined.",
    desc: "The premier B2B gateway connecting verified PCR and TBR bale suppliers to global manufacturers across 40+ countries.",
    id: "03",
    image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1200&auto=format"
  },
  {
    brand: "RUBBERSCRAPMART",
    tag: "Logistic Nodes",
    title: "Port-Ready Intelligence.",
    desc: "Strategic logistics integration at Mundra and Chennai ports. We manage customs, international shipping, and last-mile delivery.",
    id: "04",
    image: "https://images.unsplash.com/photo-1524522173746-f628baad3644?q=80&w=1200&auto=format"
  },
  {
    brand: "RUBBERSCRAPMART",
    tag: "Integrity Hub",
    title: "Verified. Vetted. Validated.",
    desc: "Every supplier undergoes a rigorous 3-point administrative audit. We eliminate trade risk so you can buy with absolute confidence.",
    id: "05",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format"
  },
  {
    brand: "RUBBERSCRAPMART",
    tag: "Material Derivatives",
    title: "Beyond the Scrap Pile.",
    desc: "Specialized trade desks for Crumb Rubber, Reclaim, and Pyrolysis Oil without compromising on technical specifications.",
    id: "06",
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=1200&auto=format"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 }
};

const CommonHome = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % mainCards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.fixedBackground}>
        <TopHero />
      </div>

      <main className={styles.scrollingContent}>
        {/* SECTION 1: HERO TEXT */}
        <section className={styles.heroTextContainer}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.mainTitle}
          >
            India's Exclusive Marketplace For <br />
            <span className={styles.gradientText}>Rubber Derived Products</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={styles.mainSubtitle}
          >
            The premier B2B marketplace connecting the global <br /> recycled rubber supply chain.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.heroBtn}
          >
            Explore Marketplace
          </motion.button>
        </section>

        {/* WHITE INSET FRAME */}
        <div className={styles.contentFrame}>
          <div className={styles.industrialBridge}>
            <div className={styles.bridgeOverlay}>Infrastructure First.</div>
            <img src={HomeImg} alt="Industrial Infrastructure" />
          </div>

          {/* SECTION 2: ABOUT US */}
          <section className={styles.aboutSection}>
            <motion.div className={styles.aboutContainer} {...fadeInUp}>
              <div className={styles.aboutLabel}>Who We Are</div>
              <h2 className={styles.aboutTitle}>India's Leading Exclusive <span className={styles.darkGradient}>B2B Rubber Scrap Marketplace</span></h2>
              <p className={styles.aboutText}>
                Rubberscrapmart.com is dedicated to the professional buying, selling, and trading of rubber scrap-derived products.
                Our platform creates a sophisticated bridge between recyclers, manufacturers, and global suppliers.
              </p>
              <Link to="/about-us" className={styles.aboutLink}>
                Learn More About Our Mission <span>→</span>
              </Link>
            </motion.div>
          </section>

          {/* SECTION 3: TALL MISSION CARDS */}
          <section className={styles.cardSection}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", stiffness: 70, damping: 15 }}
              >
                <motion.div
                  className={styles.cardBg}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.3 }}
                  transition={{ duration: 1.5 }}
                  style={{ backgroundImage: `url(${mainCards[index].image})` }}
                />

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTag}>{mainCards[index].tag}</span>
                    <span className={styles.cardBrand}>{mainCards[index].brand}</span>
                  </div>
                  <h2 className={styles.cardTitle}>{mainCards[index].title}</h2>
                  <p className={styles.cardDesc}>{mainCards[index].desc}</p>
                  <div className={styles.cardId}>{mainCards[index].id}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          {/* SECTION 4: PLATFORM SERVICES */}
          <section className={styles.servicesSection}>
            <div className={styles.servicesHeader}>
              <h3 className={styles.sectionHeader}>Platform Services</h3>
              <div className={styles.headerBar}>
                <span className={styles.sectionSubtitle}>Standardizing Global Trade</span>
                <div className={styles.statusBadge}>
                  <span className={styles.pulseDot} /> System Active
                </div>
              </div>
            </div>

            <div className={styles.serviceGrid}>
              {[
                { title: 'Verification', desc: 'On-site quality and moisture reporting for every ton.', icon: <ShieldCheck size={28} />, data: "ISO 9001 Compliant" },
                { title: 'Logistics', desc: 'Seamless cross-border freight and custom clearance.', icon: <Truck size={28} />, data: "Mundra / Chennai" },
                { title: 'Escrow', desc: 'Secure B2B payment protection and document release.', icon: <Lock size={28} />, data: "Bank-Grade Security" },
                { title: 'Analytics', desc: 'Real-time market pricing and supply chain tracking.', icon: <BarChart3 size={28} />, data: "Live Market Feed" }
              ].map((s, i) => (
                <div key={i} className={styles.serviceCard}>
                  <div className={styles.serviceTop}>
                    <div className={styles.iconBox}>{s.icon}</div>
                  </div>
                  <div className={styles.serviceBody}>
                    <div className={styles.dataTag}>{s.data}</div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                  <div className={styles.serviceHoverLine} />
                </div>
              ))}
            </div>
          </section>
        </div> {/* END OF CONTENT FRAME */}

        {/* SECTION 5: GLOBAL REACH STATS (Outside Frame for Full Width) */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <motion.div className={styles.statItem} {...fadeInUp}>
              <span className={styles.statNumber}>40+</span>
              <span className={styles.statLabel}>Countries Connected</span>
              <div className={styles.statBar} />
            </motion.div>

            <motion.div className={styles.statItem} {...fadeInUp}>
              <span className={styles.statNumber}>12k</span>
              <span className={styles.statLabel}>Metric Tons Traded</span>
              <div className={styles.statBar} />
            </motion.div>

            <motion.div className={styles.statItem} {...fadeInUp}>
              <span className={styles.statNumber}>850</span>
              <span className={styles.statLabel}>Verified Suppliers</span>
              <div className={styles.statBar} />
            </motion.div>
          </div>

          <div className={styles.tickerWrapper}>
            <div className={styles.tickerTitle}>ACTIVE LOGISTIC NODES:</div>
            <div className={styles.tickerContent}>
              <span>MUNDRA PORT, IN</span>
              <span>CHENNAI TERMINAL, IN</span>
              <span>PORT OF ROTTERDAM, NL</span>
              <span>JEBEL ALI, UAE</span>
              <span>PORT OF HAMBURG, DE</span>
              <span>SINGAPORE TERMINAL, SG</span>
              <span>MUNDRA PORT, IN</span>
              <span>CHENNAI TERMINAL, IN</span>
              <span>PORT OF ROTTERDAM, NL</span>
            </div>
          </div>
        </section>

        {/* SECTION 6: TRADE CAPABILITIES */}
        <section className={styles.capabilitiesSection}>
          <motion.div className={styles.capHeader} {...fadeInUp}>
            <span className={styles.aboutLabel}>Trade Desks</span>
            <h2 className={styles.aboutTitle}>Industrial Material <span className={styles.darkGradient}>Specializations</span></h2>
          </motion.div>

          <div className={styles.capGrid}>
            {[
              {
                category: "Tire Derived (Baled)",
                items: ["Baled Tyres PCR", "Baled Tyres TBR", "Three Piece PCR", "Three Piece TBR"],
                tag: "High Volume"
              },
              {
                category: "Processed Materials",
                items: ["Shreds", "Mulch PCR", "Rubber Granules/Crumb", "Rubber Crumb Steel"],
                tag: "Technical Grade"
              },
              {
                category: "Pyrolysis Derivatives",
                items: ["Pyro Oil", "Pyro Steel"],
                tag: "Energy & Recovery"
              }
            ].map((cap, i) => (
              <motion.div
                key={i}
                className={styles.capRow}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.capLeft}>
                  <span className={styles.capTag}>{cap.tag}</span>
                  <h3>{cap.category}</h3>
                </div>
                <div className={styles.capRight}>
                  <ul className={styles.itemList}>
                    {cap.items.map((item, idx) => (
                      <li key={idx}><span>•</span> {item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <p>© 2026 RUBBERSCRAPMART. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default CommonHome;