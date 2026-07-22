// CategoriesSection.jsx

import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoveRight, Store, ChevronLeft, ChevronRight, Layers } from "lucide-react";

import btpcr from "../../../assests/categoryimages/baledtyrespcr2.jpg";
import bttbr from "../../../assests/categoryimages/baledtyrestbr.png";
import tppcr from "../../../assests/categoryimages/threepiecepcr.png";
import tptbr from "../../../assests/categoryimages/threepiecetbr.png";
import shreddsImg from "../../../assests/categoryimages/shreds2.png";
import pyroOilImg from "../../../assests/categoryimages/pyrooil.png";
import pyroSteelImg from "../../../assests/categoryimages/pyrosteel.jpg";

import styles from "./CategoriesSection.module.css";

function CategoriesSection() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    {
      label: "Baled Tyres PCR",
      desc: "Passenger car radial tyres",
      image: btpcr,
      category: "Tyre Scrap",
      application: "Baled Tyres PCR",
      badge: "Popular",
    },
    {
      label: "Baled Tyres TBR",
      desc: "Truck & bus radial tyres",
      image: bttbr,
      category: "Tyre Scrap",
      application: "Baled Tyres TBR",
      badge: "Industrial",
    },
    {
      label: "Three Piece PCR",
      desc: "Processed PCR rubber",
      image: tppcr,
      category: "Tyre Scrap",
      application: "Three Piece PCR",
      badge: "Grade A",
    },
    {
      label: "Three Piece TBR",
      desc: "Industrial TBR material",
      image: tptbr,
      category: "Tyre Scrap",
      application: "Three Piece TBR",
      badge: "Heavy Duty",
    },
    {
      label: "Shreds",
      desc: "Premium tyre shreds",
      image: shreddsImg,
      category: "Tyre Scrap",
      application: "Shreds",
      badge: "High Demand",
    },
    {
      label: "Pyro Oil",
      desc: "Industrial pyrolysis oil",
      image: pyroOilImg,
      category: "Pyro Oil",
      application: "Pyro Oil",
      badge: "Energy",
    },
    {
      label: "Pyro Steel",
      desc: "Recovered industrial steel",
      image: pyroSteelImg,
      category: "Pyro Oil",
      application: "Pyro Steel",
      badge: "Recycled",
    },
  ];

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
  };

  return (
    <section className={styles.categoriesSection}>
      <div className="container-fluid px-xl-5 px-lg-4 px-3">
        
        {/* HEADER */}
        <div className={styles.topHeader}>
          <div className={styles.leftContent}>
            <div className={styles.topTag}>
              <Store size={15} />
              <span>Verified Marketplace</span>
            </div>

            <div className={styles.headingRow}>
              <div>
                <h2 className={styles.heading}>
                  Explore <span>Top Categories</span>
                </h2>
                <p className={styles.subText}>
                  Source high-grade rubber derived products directly from certified suppliers across India.
                </p>
              </div>

              <div className={styles.headerRightActions}>
                <button
                  className={styles.viewAllBtn}
                  onClick={() => navigate("/our-products")}
                >
                  <span>All Categories</span>
                  <MoveRight size={16} />
                </button>

                <div className={styles.sliderArrows}>
                  <button className={styles.arrowControl} onClick={scrollLeft} aria-label="Scroll left">
                    <ChevronLeft size={18} />
                  </button>
                  <button className={styles.arrowControl} onClick={scrollRight} aria-label="Scroll right">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODERN CARD SLIDER / GRID */}
        <div className={styles.categoriesSlider} ref={scrollRef}>
          {categories.map((item, index) => (
            <div
              className={styles.categoryCard}
              key={index}
              onClick={() =>
                navigate(
                  `/our-products?category=${encodeURIComponent(
                    item.category
                  )}&application=${encodeURIComponent(item.application)}`
                )
              }
            >
              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
                  alt={item.label}
                  className={styles.categoryImage}
                />
                <div className={styles.cardOverlay}></div>
                <span className={styles.cardBadge}>{item.badge}</span>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.textContent}>
                  <h3>{item.label}</h3>
                  <p>{item.desc}</p>
                </div>

                <div className={styles.actionRow}>
                  <span className={styles.exploreText}>View Products</span>
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