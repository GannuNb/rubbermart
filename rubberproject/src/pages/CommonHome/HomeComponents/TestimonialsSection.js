import React, { useEffect, useRef, useState } from "react";
import styles from "./TestimonialsSection.module.css";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const TestimonialsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      name: "Rahul Verma",
      role: "Scrap Buyer",
      feedback: "Vikah Rubber has completely transformed the way I source scrap materials. The platform is smooth, trustworthy, and highly reliable.",
    },
    {
      name: "Ganesh",
      role: "Scrap Seller",
      feedback: "The verification and support system is excellent. I get genuine buyers, fast responses, and secure deals every time.",
    },
    {
      name: "Priya Patel",
      role: "Business Owner",
      feedback: "A very user-friendly marketplace. I found long-term partners through Vikah Rubber. Highly recommended!",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.testimonialSection} ${isVisible ? styles.animateIn : ""}`}
    >
      <div className="container-fluid px-md-5">
        <div className={styles.header}>
          <h2 className={styles.title}>What Our Users Say</h2>
          <div className={styles.titleUnderline}></div>
          <p className={styles.subtitle}>
            Real experiences from real buyers and sellers who trust Vikah Rubber.
          </p>
        </div>

        <div className="row g-4 mt-2">
          {testimonials.map((t, index) => (
            <div className="col-lg-4 col-md-6 d-flex" key={index}>
              <div 
                className={styles.cardBox} 
                style={{ "--delay": `${index * 0.15}s` }}
              >
                <div className={styles.quoteIcon}>
                  <FaQuoteLeft />
                </div>
                
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={styles.starIcon} />
                  ))}
                </div>

                <p className={styles.feedback}>"{t.feedback}"</p>

                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {t.name.charAt(0)}
                  </div>
                  <div className={styles.userMeta}>
                    <h4 className={styles.name}>{t.name}</h4>
                    <span className={styles.role}>{t.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;