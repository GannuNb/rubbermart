import React, { useState } from "react";
import styles from "../../styles/BuyerGuide/FAQSupport.module.css";
import { Plus, Headphones, MessageSquare, HelpCircle, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const faqData = [
  { 
    question: "How do I ensure the quality of the scrap material?", 
    answer: "You can review seller ratings, request detailed photos, and check for quality certifications or third-party inspection reports provided in the listing." 
  },
  { 
    question: "Is my payment secure on this platform?", 
    answer: "Yes, we use an escrow-style payment system. Funds are only released to the seller once you confirm the receipt and quality of the material." 
  },
  { 
    question: "Can I cancel an order after placing it?", 
    answer: "Orders can be cancelled before the seller starts the shipping process. Once shipped, cancellations are subject to our dispute resolution policy." 
  },
  { 
    question: "How is the shipping cost calculated?", 
    answer: "Shipping costs are calculated based on the weight of the material, the distance between the buyer and seller, and the current freight market rates." 
  },
  { 
    question: "What should I do if the material is not as described?", 
    answer: "Immediately raise a dispute through your dashboard. Keep all documentation and photos ready; our support team will mediate the issue within 24-48 hours." 
  },
  { 
    question: "How do I get an invoice for my purchase?", 
    answer: "Invoices are automatically generated and available for download in the 'My Orders' section of your account immediately after payment confirmation." 
  }
];

const FAQSupport = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainCard}>
        <div className={styles.gridOverlay}></div>
        
        <div className={styles.layout}>
          {/* Illustration Side shifted further left */}
          <div className={styles.illustrationSide}>
            <div className={styles.bgGlow}></div>
            <div className={styles.particle} style={{ top: '10%', left: '5%' }}></div>
            <div className={styles.particle} style={{ bottom: '15%', left: '10%' }}></div>

            <div className={styles.purpleBubble}>
              <span className={styles.questionMark}>?</span>
              <div className={styles.bubbleTail}></div>
            </div>

            <div className={styles.yellowBubble}>
              <div className={styles.dots}>
                <span></span><span></span><span></span>
              </div>
              <div className={styles.yellowTail}></div>
            </div>
          </div>

          {/* Content Side expanded to the left */}
          <div className={styles.contentSide}>
            <div className={styles.header}>
              <div className={styles.topBadge}>
                <HelpCircle size={12} /> <span>We're Here to Help</span>
              </div>
              <h2 className={styles.heading}>Frequently Asked Questions</h2>
              <p className={styles.subHeading}>Everything you need to know about purchasing and logistics.</p>
            </div>

            <div className={styles.faqList}>
              {faqData.map((item, index) => (
                <div key={index} className={styles.faqItemWrapper}>
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

      <div className={styles.supportBar}>
        <div className={styles.supportLeft}>
          <div className={styles.headphoneBox}>
            <Headphones size={24} color="white" />
          </div>
          <div className={styles.supportText}>
            <h3>Still need assistance?</h3>
            <p>Our buyer support team is available 24/7 to help you with orders, tracking, and disputes.</p>
          </div>
        </div>
        <Link to="/contactus" className={styles.chatBtn} style={{ textDecoration: 'none' }}>
  <MessageSquare size={18} fill="#6d28d9" color="#6d28d9" />
  Chat with Support
</Link>
      </div>
    </div>
  );
};

export default FAQSupport;