import React, { useState } from "react";
import styles from "../../styles/SellerGuide/FAQSupport.module.css";
import { ChevronDown, Headphones, MessageCircle } from "lucide-react";

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

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>
        <p className={styles.subHeading}>Everything you need to know about selling on our platform.</p>
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
            <h3 className={styles.supportTitle}>Still have questions?</h3>
            <p className={styles.supportDesc}>Our dedicated seller support team is available 24/7 to help you scale your business.</p>
          </div>
        </div>
        <button className={styles.contactBtn}>
          <MessageCircle size={18} />
          <span>Contact Support</span>
        </button>
      </div>
    </div>
  );
};

export default SellerFAQ;