import React, { useEffect, useRef, useState } from "react";

import styles from "./TestimonialsSection.module.css";

import {
  FaStar,
  FaQuoteLeft,
} from "react-icons/fa";

const TestimonialsSection = () => {

  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef(null);

  const testimonials = [
    {
      name: "Rahul Verma",
      role: "Scrap Buyer",
      feedback:
        "RubberScrapMart completely transformed the way we source rubber scrap materials. The platform is smooth, trusted, and highly reliable for bulk procurement.",
    },
    {
      name: "Ganesh",
      role: "Scrap Seller",
      feedback:
        "The verification and support system is excellent. We receive genuine inquiries, faster responses, and secure business opportunities every day.",
    },
    {
      name: "Priya Patel",
      role: "Business Owner",
      feedback:
        "A very professional B2B marketplace. We found long-term international buyers and expanded our rubber business successfully through the platform.",
    },
  ];

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();

  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.testimonialSection} ${
        isVisible ? styles.animateIn : ""
      }`}
    >

      {/* BACKGROUND GLOW */}
      <div className={styles.bgGlowOne}></div>
      <div className={styles.bgGlowTwo}></div>

      <div className="container-fluid px-md-5">

        {/* =========================
            HEADER
        ========================= */}

        <div className={styles.header}>

          <div className={styles.badge}>
            Trusted Reviews
          </div>

          <h2 className={styles.title}>
            What Our <span>Users Say</span>
          </h2>

          <p className={styles.subtitle}>
            Real experiences from verified buyers and sellers
            using RubberScrapMart across global markets.
          </p>

        </div>

        {/* =========================
            TESTIMONIAL GRID
        ========================= */}

        <div className="row g-4 mt-1">

          {testimonials.map((t, index) => (

            <div
              className="col-lg-4 col-md-6 d-flex"
              key={index}
            >

              <div
                className={styles.cardBox}
                style={{
                  "--delay": `${index * 0.15}s`,
                }}
              >

                {/* QUOTE ICON */}
                <div className={styles.quoteIcon}>
                  <FaQuoteLeft />
                </div>

                {/* STARS */}
                <div className={styles.stars}>

                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={styles.starIcon}
                    />
                  ))}

                </div>

                {/* FEEDBACK */}
                <p className={styles.feedback}>
                  "{t.feedback}"
                </p>

                {/* USER */}
                <div className={styles.userInfo}>

                  <div className={styles.userAvatar}>
                    {t.name.charAt(0)}
                  </div>

                  <div className={styles.userMeta}>

                    <h4 className={styles.name}>
                      {t.name}
                    </h4>

                    <span className={styles.role}>
                      {t.role}
                    </span>

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