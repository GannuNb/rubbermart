import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import styles from "./ScrollToTopArrow.module.css";

function ScrollToTopArrow() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }

      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div 
      className={`${styles.container} ${isVisible ? styles.visible : styles.hidden}`}
      onClick={scrollToTop}
      style={{ "--scroll-progress": `${scrollProgress}%` }}
    >
      {/* Dynamic Progress Border Track */}
      <div className={styles.progressBorder} />
      
      {/* Core Interactive Circle */}
      <div className={styles.arrowCircle}>
        <FaArrowUp className={styles.icon} />
      </div>
    </div>
  );
}

export default ScrollToTopArrow;