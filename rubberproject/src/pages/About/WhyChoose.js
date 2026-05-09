// src/components/about/WhyChoose.jsx

import styles from "../../styles/About/WhyChoose.module.css";

import WhyBg from "../../assests/AboutWhychoose.png";

import {
  ShieldCheck,
  BadgeDollarSign,
  Truck,
  FileCheck,
  Headset,
} from "lucide-react";

const data = [
  {
    icon: <ShieldCheck size={28} strokeWidth={2.2} />,
    title: "Verified Network",
    desc: "All buyers and sellers on RubberScrapMart are verified to ensure secure and trusted transactions.",
  },
  {
    icon: <BadgeDollarSign size={28} strokeWidth={2.2} />,
    title: "Transparent Pricing",
    desc: "Get fair market pricing with complete transparency and no hidden charges involved.",
  },
  {
    icon: <Truck size={28} strokeWidth={2.2} />,
    title: "Reliable Logistics",
    desc: "Efficient transportation and logistics support for smooth and timely deliveries.",
  },
  {
    icon: <FileCheck size={28} strokeWidth={2.2} />,
    title: "Secure & Compliant",
    desc: "We follow industry standards and secure practices for reliable business operations.",
  },
  {
    icon: <Headset size={28} strokeWidth={2.2} />,
    title: "Dedicated Support",
    desc: "Our support team is available to guide and assist you at every stage of your journey.",
  },
];

const WhyChoose = () => {
  return (
    <section
      className={styles.whySection}
      style={{
        backgroundImage: `url(${WhyBg})`,
      }}
    >
      <div className={styles.overlay}></div>

      <div className={styles.container}>
        {/* HEADING */}
        <div className={styles.centerHeading}>
          <span className={styles.sectionTag}>
            WHY CHOOSE RUBBERSCRAPMART?
          </span>

          <h2>What Makes Us Different</h2>
        </div>

        {/* GRID */}
        <div className={styles.whyGrid}>
          {data.map((item, index) => (
            <div className={styles.whyCard} key={index}>
              <div className={styles.iconBox}>{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;