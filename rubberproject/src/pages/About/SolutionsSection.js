// src/components/about/SolutionsSection.jsx

import styles from "../../styles/About/SolutionsSection.module.css";

import {
  Layers3,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Building2,
  ShoppingBag,
  MapPinned,
  Recycle,
} from "lucide-react";

const solutions = [
  {
    icon: <Layers3 size={24} strokeWidth={2.2} />,
    title: "Wide Range of Materials",
    desc: "Buy and sell rubber scrap, recycled materials, industrial waste, and reusable products.",
  },

  {
    icon: <ClipboardList size={24} strokeWidth={2.2} />,
    title: "Smart Order Management",
    desc: "Manage inquiries, transactions, and communication through a streamlined platform.",
  },

  {
    icon: <BarChart3 size={24} strokeWidth={2.2} />,
    title: "Market Insights",
    desc: "Access real-time market trends, pricing updates, and industry insights for smarter decisions.",
  },

  {
    icon: <TrendingUp size={24} strokeWidth={2.2} />,
    title: "Business Growth",
    desc: "Expand your network and unlock new business opportunities across India.",
  },
];

const stats = [
  {
    icon: <Building2 size={24} strokeWidth={2.2} />,
    number: "10,000+",
    label: "Happy Businesses",
  },

  {
    icon: <ShoppingBag size={24} strokeWidth={2.2} />,
    number: "50,000+",
    label: "Orders Facilitated",
  },

  {
    icon: <MapPinned size={24} strokeWidth={2.2} />,
    number: "200+",
    label: "Cities Served",
  },

  {
    icon: <Recycle size={24} strokeWidth={2.2} />,
    number: "15+",
    label: "Material Categories",
  },
];

const SolutionsSection = () => {
  return (
    <section className={styles.solutionsSection}>
      <div className={styles.container}>
        {/* HEADING */}
        <div className={styles.heading}>
          <span className={styles.sectionTag}>OUR SOLUTIONS</span>

          <h2>End-to-End Solutions for Your Scrap Business</h2>
        </div>

        {/* GRID */}
        <div className={styles.solutionsGrid}>
          {/* LEFT */}
          <div className={styles.solutionsLeft}>
            {solutions.map((item, index) => (
              <div className={styles.solutionItem} key={index}>
                <div className={styles.iconBox}>{item.icon}</div>

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className={styles.solutionsRight}>
            <span className={styles.rightTag}>WHY RUBBERSCRAPMART</span>

            <h3>Empowering Businesses, Strengthening Economies</h3>

            <p>
              RubberScrapMart is more than just a marketplace — we are a growth
              partner helping industries simplify rubber scrap trading through
              technology, transparency, and trusted business connections.
            </p>

            {/* STATS */}
            <div className={styles.solutionStats}>
              {stats.map((item, index) => (
                <div className={styles.statCard} key={index}>
                  <div className={styles.statIcon}>{item.icon}</div>

                  <h4>{item.number}</h4>

                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;