import React, { useEffect, useState } from "react";
import styles from "../../styles/Navbar/NavbarAd.module.css";

// Images
import VikahLogo from "../../assests/VikahLogo.png";
import RST4000 from "../../assests/R4.png";
import Tyrebaler from "../../assests/TyreBaler.png";

function NavbarAd() {
  // =====================================================
  // NAVBAR ADVERTISEMENTS
  // =====================================================

  const ads = [
    {
      id: 1,
      title: "VIKAH ECOTECH",
      subtitle: "Industrial Recycling Solutions",
      image: VikahLogo,
      url: "https://vikahecotech.com",
      type: "product",
    },

    {
      id: 2,
      title: "Tyre Scrap Balers",
      subtitle: "Efficient Tyre Scrap Processing",
      image: Tyrebaler,
      url: "https://vikahecotech.com/tyre-scrap-balers",
      type: "product",
    },

    {
      id: 3,
      title: "RST-4000",
      subtitle: "Advanced Rubber Recycling Machine",
      image: RST4000,
      url: "https://vikahecotech.com/rst4000",
      type: "product",
    },

    {
      id: 4,
      title: "VIKAH ECOTECH",
      subtitle: "Please visit us for more information",
      image: VikahLogo,
      url: "https://vikahecotech.com",
      type: "message",
    },
  ];

  // =====================================================
  // CURRENT AD
  // =====================================================

  const [currentAd, setCurrentAd] = useState(0);

  // =====================================================
  // AUTO SLIDE
  // Changes advertisement every 4 seconds
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // CURRENT AD DATA
  // =====================================================

  const ad = ads[currentAd];

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className={styles.adWrapper}>
      <a
        key={ad.id}
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.adCard}
        aria-label={`Visit ${ad.title}`}
      >
        {/* =================================================
            LOGO / IMAGE
        ================================================= */}

        <div className={styles.adLogo}>
          <img
            src={ad.image}
            alt={ad.title}
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className={styles.adContent}>
          <h4>{ad.title}</h4>

          <p>{ad.subtitle}</p>

          {/* =================================================
              FINAL INFORMATION SLIDE
          ================================================= */}

          {ad.type === "message" && (
            <span className={styles.adCta}>
              Discover more about our solutions
            </span>
          )}
        </div>
      </a>
    </div>
  );
}

export default NavbarAd;