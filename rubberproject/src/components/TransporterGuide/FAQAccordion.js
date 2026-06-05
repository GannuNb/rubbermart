import React, { useState } from "react";
import styles from "./FAQAccordion.module.css";
import { Plus, Headphones, MessageSquare, HelpCircle, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const transporterFaqData = [
  {
    id: 1,
    question: "How do I accept a delivery?",
    answer: "Navigate to Assigned Deliveries, review details, and click 'Accept Delivery'."
  },
  {
    id: 2,
    question: "When will I receive payment?",
    answer: "Payments are typically released to your balance account right after complete verification of uploaded delivery proof."
  },
  {
    id: 3,
    question: "How do I update shipment status?",
    answer: "Go to your active delivery dashboard panel and change tracking nodes from Transit to Delivered."
  },
  {
    id: 4,
    question: "What documents are required?",
    answer: "A valid signed Proof of Delivery (POD), commercial bill lading copy, and clear product images."
  },
  {
    id: 5,
    question: "Can I reject a shipment?",
    answer: "Yes, but it must be processed within your allocated dispatch timer window before physical collection."
  },
  {
    id: 6,
    question: "How are disputes handled?",
    answer: "Disputed metrics can be flagged instantly via our platform portal to receive manual operator mediation support."
  }
];

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainCard}>
        <div className={styles.gridOverlay}></div>

        <div className={styles.layout}>
          {/* Illustration Side */}
          <div className={styles.illustrationSide}>
            <div className={styles.bgGlow}></div>
            <div className={styles.particle} style={{ top: '10%', left: '5%' }}></div>
            <div className={styles.particle} style={{ bottom: '15%', left: '10%' }}></div>

            <div className={styles.purpleBubble}>
              <span className={styles.questionMark}>?</span>
            </div>

            <div className={styles.yellowBubble}>
              <div className={styles.dots}>
                <span></span><span></span><span></span>
              </div>
              <div className={styles.yellowTail}></div>
            </div>
          </div>

          {/* Content Side */}
          <div className={styles.contentSide}>
            <div className={styles.header}>
              <div className={styles.topBadge}>
                <HelpCircle size={12} /> <span>Transporter Support</span>
              </div>
              <h2 className={styles.heading}>Frequently Asked Questions</h2>
              <p className={styles.subHeading}>Find answers to common questions about logistics, transit updates, and payouts.</p>
            </div>

            <div className={styles.faqList}>
              {transporterFaqData.map((item, index) => (
                <div key={item.id} className={styles.faqItemWrapper}>
                  <div
                    className={styles.faqItem}
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className={styles.faqText}>{item.question}</span>
                    <div className={`${styles.plusCircle} ${activeIndex === index ? styles.active : ""}`}>
                      {activeIndex === index ? <Minus size={12} /> : <Plus size={12} />}
                    </div>
                  </div>

                  <div className={`${styles.answerWrapper} ${activeIndex === index ? styles.open : ""}`}>
                    <div className={styles.answerText}>
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transporter Specific Support Bar */}
      <div className={styles.supportBar}>
        <div className={styles.supportLeft}>
          <div className={styles.headphoneBox}>
            <Headphones size={24} color="white" />
          </div>
          <div className={styles.supportText}>
            <h3>Still need assistance?</h3>
            <p>Our transit support team is available 24/7 to help you with routing, load tracking, and balance adjustments.</p>
          </div>
        </div>
        <Link to="/contactus" className={styles.chatBtn} style={{ textDecoration: 'none' }}>
          <MessageSquare size={18} fill="#4b24d1" color="#4b24d1" />
          Chat with Support
        </Link>
      </div>
    </div>
  );
};

export default FAQAccordion;