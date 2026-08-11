import React, { useEffect, useState } from "react";
import styles from "../../styles/Navbar/NavbarPromotion.module.css";

const NavbarPromotion = ({
  promotions,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (promotions.length <= 1) return;

    const timer = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          return (prevIndex + 1) % promotions.length;
        });

        setIsVisible(true);
      }, 400);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [promotions.length, interval]);

  if (!promotions.length) {
    return null;
  }

  const promotion = promotions[currentIndex];

  return (
    <div
      className={`${styles.promotion} ${
        isVisible ? styles.visible : styles.hidden
      }`}
    >
      <a
        href={promotion.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.promotionLink}
      >
        {/* =================================================
            LOGO
        ================================================= */}
        <div className={styles.logoWrapper}>
          <img
            src={promotion.logo}
            alt={promotion.title}
            className={styles.logo}
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}
        <div className={styles.content}>
          <span className={styles.title}>
            {promotion.title}
          </span>

          <span className={styles.subtitle}>
            {promotion.subtitle}
          </span>

          <p className={styles.description}>
            {promotion.description}
          </p>
        </div>

        {/* =================================================
            RIGHT SIDE IMAGE
            Only appears when sideImage exists
        ================================================= */}
        {promotion.sideImage && (
          <div className={styles.sideImageWrapper}>
            <img
              src={promotion.sideImage}
              alt=""
              className={styles.sideImage}
            />
          </div>
        )}
      </a>
    </div>
  );
};

export default NavbarPromotion;