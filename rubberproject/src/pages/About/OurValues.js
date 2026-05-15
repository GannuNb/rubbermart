// src/components/about/OurValues.jsx
import styles from "../../styles/About/OurValues.module.css";
import {
  ShieldCheck,
  Handshake,
  Leaf,
  Lightbulb,
  HeartHandshake,
} from "lucide-react";

// Import the background image
import ValuesBg from "../../assests/bg1.png"; 

const values = [
  {
    icon: <ShieldCheck size={28} strokeWidth={2.2} />,
    title: "Integrity",
    desc: "We believe in transparency, ethical business practices, and honest communication across every transaction.",
  },
  {
    icon: <Handshake size={28} strokeWidth={2.2} />,
    title: "Trust",
    desc: "Building long-term relationships through reliability, accountability, and customer confidence.",
  },
  {
    icon: <Leaf size={28} strokeWidth={2.2} />,
    title: "Sustainability",
    desc: "Promoting responsible recycling and sustainable industrial practices for a cleaner future.",
  },
  {
    icon: <Lightbulb size={28} strokeWidth={2.2} />,
    title: "Innovation",
    desc: "Continuously improving our platform with smarter and more efficient digital solutions.",
  },
  {
    icon: <HeartHandshake size={28} strokeWidth={2.2} />,
    title: "Customer First",
    desc: "Our customers remain at the center of every decision, service, and business solution we provide.",
  },
];

const OurValues = () => {
  return (
    <section 
      className={styles.valuesSection}
      style={{ backgroundImage: `url(${ValuesBg})` }}
    >
      {/* Overlay to control image visibility */}
      <div className={styles.overlay}></div>

      <div className={styles.container}>
        <div className={styles.centerHeading}>
          <span className={styles.sectionTag}>OUR VALUES</span>
          <h2>The Principles That Guide Us</h2>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((item, index) => (
            <div className={styles.valueCard} key={index}>
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

export default OurValues;