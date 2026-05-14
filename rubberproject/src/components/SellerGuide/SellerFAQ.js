import React, { useState } from "react";
import styles from "../../styles/SellerGuide/FAQSupport.module.css";
import { Plus, Headphones, MessageSquare, HelpCircle, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const faqData = [
  { 
    question: "How do I increase my listing's visibility?", 
    answer: "High-quality images and precise technical specifications are key. Listings with verified moisture content and clear contamination percentages tend to rank higher in buyer search results." 
  },
  { 
    question: "Is there a commission fee for selling?", 
    answer: "Registration is free. We charge a nominal transaction fee only when a deal is successfully closed. You can view the full fee breakdown in your Seller Dashboard." 
  },
  { 
    question: "How do I handle shipping and logistics?", 
    answer: "Sellers can choose to manage their own logistics or opt for RubberScrapMart's verified logistics partners. Once an order is confirmed, you can generate shipping labels directly from the portal." 
  },
  { 
    question: "How and when do I get paid?", 
    answer: "Payments are secured via our Escrow system. Once the buyer confirms receipt and quality of the material, funds are released to your registered bank account within 24-48 hours." 
  },
  { 
    question: "What happens if a buyer disputes the quality?", 
    answer: "Our dispute resolution team mediates based on the original listing details and the loading photos you provide. We recommend taking clear photos during the loading process for protection." 
  },
  { 
    question: "Can I sell international scrap materials?", 
    answer: "Yes, our platform supports international trade. However, you must ensure all export documentation and compliance certificates are uploaded with your listing." 
  }
];

const SellerFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mainCard}>
        <div className={styles.gridOverlay}></div>
        
        <div className={styles.layout}>
          {/* Visual Illustration Side */}
          <div className={styles.illustrationSide}>
            <div className={styles.bgGlow}></div>
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

          {/* Content Side */}
          <div className={styles.contentSide}>
            <div className={styles.header}>
              <div className={styles.topBadge}>
                <HelpCircle size={12} /> <span>Seller Assistance</span>
              </div>
              <h2 className={styles.heading}>Frequently Asked Questions</h2>
              <p className={styles.subHeading}>Everything you need to know about scaling your scrap business.</p>
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

      {/* Support Bar */}
      <div className={styles.supportBar}>
        <div className={styles.supportLeft}>
          <div className={styles.headphoneBox}>
            <Headphones size={24} color="white" />
          </div>
          <div className={styles.supportText}>
            <h3>Still need assistance?</h3>
            <p>Our dedicated seller support team is available 24/7 to help you with listings and payments.</p>
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

export default SellerFAQ;