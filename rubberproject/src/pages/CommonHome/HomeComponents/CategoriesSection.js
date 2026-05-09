import React, { useRef } from "react";
import {
  MoveRight,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import tyreImg from "../../../assests/Tyre.jpeg";

import styles from "./CategoriesSection.module.css";

function CategoriesSection() {

  const scrollRef = useRef(null);

  const categories = [
    {
      label: "Baled Tyres PCR",
      desc: "Passenger car radial tyres",
    },
    {
      label: "Baled Tyres TBR",
      desc: "Truck & bus radial tyres",
    },
    {
      label: "Three Piece PCR",
      desc: "Processed PCR rubber",
    },
    {
      label: "Three Piece TBR",
      desc: "Industrial TBR material",
    },
    {
      label: "Shredds",
      desc: "Premium tyre shredds",
    },
    {
      label: "Pyro Oil",
      desc: "Industrial pyrolysis oil",
    },
    {
      label: "Pyro Steel",
      desc: "Recovered industrial steel",
    },
  ];

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.categoriesSection}>

      <div className="container-fluid px-xl-5 px-lg-4 px-3">

        {/* =========================
            HEADER
        ========================= */}
        <div className={styles.topHeader}>

          <div className={styles.leftContent}>

            <div className={styles.topTag}>
              <Store size={14} />
              <span>Marketplace</span>
            </div>

            <div className={styles.headingRow}>

              <div>

                <h2 className={styles.heading}>
                  Explore <span>Top Categories</span>
                </h2>

                <p className={styles.subText}>
                  Browse high-quality rubber derived products
                  from verified global suppliers.
                </p>

              </div>

              <button className={styles.viewAllBtn}>
                View all Categories
                <MoveRight size={16} />
              </button>

            </div>

          </div>

        </div>

        {/* =========================
            SLIDER HEADER
        ========================= */}
        <div className={styles.sliderTop}>

          <div className={styles.sliderArrows}>

            <button
              className={styles.arrowControl}
              onClick={scrollLeft}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className={styles.arrowControl}
              onClick={scrollRight}
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

        {/* =========================
            HORIZONTAL CARDS
        ========================= */}
        <div
          className={styles.categoriesSlider}
          ref={scrollRef}
        >

          {categories.map((item, index) => (

            <div
              className={styles.categoryCard}
              key={index}
            >

              {/* IMAGE */}
              <div className={styles.imageWrapper}>

                <img
                  src={tyreImg}
                  alt={item.label}
                  className={styles.categoryImage}
                />

              </div>

              {/* CONTENT */}
              <div className={styles.cardContent}>

                <h3>{item.label}</h3>

                <p>{item.desc}</p>

                <div className={styles.bottomRow}>

                  <div className={styles.bottomLine}></div>

                  <div className={styles.arrowBtn}>
                    <MoveRight size={14} />
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default CategoriesSection;