import React, { useState } from "react";
import styles from "../../styles/BuyerGuide/FAQSupport.module.css";
import { ChevronDown, Headphones, ShieldCheck, MessageCircle } from "lucide-react";

const faqData = [
  { 
    question: "How do I ensure the quality of the scrap material?", 
    answer: "Every listing includes detailed specifications (grade, moisture, contamination). You can also request a sample or check the seller's past ratings and verification badges before placing an order." 
  },
  { 
    question: "Is my payment secure on this platform?", 
    answer: "Yes. We use an Escrow-style payment system. Your funds are held securely and only released to the seller after you confirm that the material has been received and meets the described quality." 
  },
  { 
    question: "Can I cancel an order after placing it?", 
    answer: "Orders can be cancelled before the seller approves the request. Once approved and payment is initiated, please contact support for mediation regarding cancellations." 
  },
  { 
    question: "How is the shipping cost calculated?", 
    answer: "Shipping costs depend on the weight, distance, and the logistics partner selected. You will see a transparent breakdown of all costs before you finalize the payment." 
  },
  { 
    question: "What should I do if the material is not as described?", 
    answer: "Do not click 'Confirm Receipt'. Use the 'Report Issue' button on your order dashboard and upload photos of the material. Our dispute team will step in to resolve the matter within 24 hours." 
  },
  { 
    question: "How do I get an invoice for my purchase?", 
    answer: "Invoices are automatically generated and available for download in the 'My Orders' section immediately after the payment is verified by our admin." 
  }
];

const FAQSupport = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.topBadge}><ShieldCheck size={14} /> Verified Buyers Only</div>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>
        <p className={styles.subHeading}>Everything you need to know about purchasing and logistics.</p>
      </div>

      <div className={styles.faqContainer}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.faqItemWrapper}>
            <button 
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ""}`} 
              onClick={() => toggleFAQ(index)}
              aria-expanded={activeIndex === index}
            >
              <span className={styles.faqText}>{item.question}</span>
              <div className={styles.iconCircle}>
                <ChevronDown size={18} className={`${styles.faqIcon} ${activeIndex === index ? styles.rotate : ""}`} />
              </div>
            </button>
            <div className={`${styles.faqAnswer} ${activeIndex === index ? styles.show : ""}`}>
              <div className={styles.answerContent}>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.supportBox}>
        <div className={styles.supportLeft}>
          <div className={styles.headphoneCircle}>
            <Headphones size={28} />
          </div>
          <div className={styles.supportText}>
            <h3 className={styles.supportTitle}>Still need assistance?</h3>
            <p className={styles.supportDesc}>Our buyer support team is available 24/7 to help you with orders, tracking, and disputes.</p>
          </div>
        </div>
        <button className={styles.contactBtn}>
          <MessageCircle size={18} />
          <span>Chat with Support</span>
        </button>
      </div>
    </div>
  );
};

export default FAQSupport;