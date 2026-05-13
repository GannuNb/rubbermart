// CategoriesSection.jsx

import React, { useRef } from "react";

import { useNavigate } from "react-router-dom";

import { MoveRight, Store, ChevronLeft, ChevronRight } from "lucide-react";

import tyreImg from "../../../assests/categoryimages/Tyre.jpeg";

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
    },

    {
      label: "Baled Tyres TBR",
      desc: "Truck & bus radial tyres",
      image: bttbr,
      category: "Tyre Scrap",
      application: "Baled Tyres TBR",
    },

    {
      label: "Three Piece PCR",
      desc: "Processed PCR rubber",
      image: tppcr,
      category: "Tyre Scrap",
      application: "Three Piece PCR",
    },

    {
      label: "Three Piece TBR",
      desc: "Industrial TBR material",
      image: tptbr,
      category: "Tyre Scrap",
      application: "Three Piece TBR",
    },

    {
      label: "Shredds",
      desc: "Premium tyre shredds",
      image: shreddsImg,
      category: "Tyre Scrap",
      application: "Shredds",
    },

    {
      label: "Pyro Oil",
      desc: "Industrial pyrolysis oil",
      image: pyroOilImg,
      category: "Pyro Oil",
      application: "Pyro Oil",
    },

    {
      label: "Pyro Steel",
      desc: "Recovered industrial steel",
      image: pyroSteelImg,
      category: "Pyro Oil",
      application: "Pyro Steel",
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
        {/* HEADER */}

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
                  Browse high-quality rubber derived products from verified
                  global suppliers.
                </p>
              </div>

              <button
                className={styles.viewAllBtn}
                onClick={() => navigate("/our-products")}
              >
                View all Categories
                <MoveRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* SLIDER TOP */}

        <div className={styles.sliderTop}>
          <div className={styles.sliderArrows}>
            <button className={styles.arrowControl} onClick={scrollLeft}>
              <ChevronLeft size={18} />
            </button>

            <button className={styles.arrowControl} onClick={scrollRight}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* SLIDER */}

        <div className={styles.categoriesSlider} ref={scrollRef}>
          {categories.map((item, index) => (
            <div
              className={styles.categoryCard}
              key={index}
              onClick={() =>
                navigate(
                  `/our-products?category=${encodeURIComponent(
                    item.category,
                  )}&application=${encodeURIComponent(item.application)}`,
                )
              }
            >
              {/* IMAGE */}

              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
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
