import React, { useRef } from "react";

import {
  ChevronLeft,
  ChevronRight,
  MoveRight,
  ShieldCheck,
  Leaf,
  Truck,
  BadgeDollarSign,
  Star,
  MapPin,
  Sparkles,
} from "lucide-react";

import styles from "./FeaturedProductsSection.module.css";

import bgImage from "../../../assests/fp7.png";

import tyreImg from "../../../assests/Tyre.jpeg";

function FeaturedProductsSection() {

  const scrollRef = useRef(null);

  const products = [
    {
      name: "Baled Tyres PCR",
      qty: "20 MT",
      loc: "Ex-Chennai, India",
      price: "₹ 2,200 / MT",
      color: "purple",
    },

    {
      name: "Baled Tyres TBR",
      qty: "18 MT",
      loc: "Ex-Mundra, India",
      price: "₹ 2,800 / MT",
      color: "green",
    },

    {
      name: "Three Piece PCR",
      qty: "15 MT",
      loc: "Ex-Nhava Sheva, India",
      price: "₹ 3,500 / MT",
      color: "purple",
    },

    {
      name: "Three Piece TBR",
      qty: "25 MT",
      loc: "Ex-Delhi, India",
      price: "₹ 4,100 / MT",
      color: "green",
    },

    {
      name: "Shredds",
      qty: "100 MT",
      loc: "Ex-Surat, India",
      price: "₹ 1,800 / MT",
      color: "purple",
    },

    {
      name: "Mulch PCR",
      qty: "12 MT",
      loc: "Ex-Pune, India",
      price: "₹ 5,500 / MT",
      color: "green",
    },

    {
      name: "Rubber Granules",
      qty: "30 MT",
      loc: "Ex-Kolkata, India",
      price: "₹ 8,200 / MT",
      color: "purple",
    },
  ];

  const scroll = (direction) => {

    const { current } = scrollRef;

    if (current) {

      const scrollAmount = 340;

      current.scrollBy({
        left:
          direction === "left"
            ? -scrollAmount
            : scrollAmount,

        behavior: "smooth",
      });
    }
  };

  return (

    <section className={styles.sectionWrapper}>

      {/* BACKGROUND */}
      <div
        className={styles.bgOverlay}
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      <div className="container-fluid px-xl-5 px-lg-4 px-3">

        {/* =========================
            HEADER
        ========================= */}

        <div className={styles.topHeader}>

          <div>

            <div className={styles.topTag}>
              <Sparkles size={13} />
              PREMIUM QUALITY
            </div>

            <h2 className={styles.sectionTitle}>
              Featured <span>Products</span>
            </h2>

            <p className={styles.sectionDesc}>
              Explore our top quality rubber products,
              trusted by businesses worldwide.
            </p>

          </div>

        </div>

        {/* =========================
            VIEW ALL BUTTON
        ========================= */}

        <div className={styles.viewAllWrapper}>

          <button className={styles.viewAllBtn}>
            View all products
            <MoveRight size={16} />
          </button>

        </div>

        {/* =========================
            PRODUCTS
        ========================= */}

        <div className={styles.sliderWrapper}>

          {/* LEFT BUTTON */}
          <button
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={20} />
          </button>

          {/* RIGHT BUTTON */}
          <button
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={() => scroll("right")}
          >
            <ChevronRight size={20} />
          </button>

          {/* PRODUCTS */}
          <div
            className={styles.productsSlider}
            ref={scrollRef}
          >

            {products.map((item, index) => (

              <div
                className={styles.productCard}
                key={index}
              >

                {/* IMAGE */}
                <div className={styles.imageWrapper}>

                  <img
                    src={tyreImg}
                    alt={item.name}
                    className={styles.productImage}
                  />

                  {/* BADGE */}
                  <div
                    className={`${styles.badgeIcon}
                    ${
                      item.color === "green"
                        ? styles.greenBadge
                        : styles.purpleBadge
                    }`}
                  >

                    {item.color === "green"
                      ? <ShieldCheck size={15} />
                      : <Leaf size={15} />
                    }

                  </div>

                </div>

                {/* BODY */}
                <div className={styles.cardBody}>

                  <h3 className={styles.productTitle}>
                    {item.name}
                  </h3>

                  <p className={styles.qtyText}>
                    {item.qty}
                  </p>

                  <div className={styles.locationRow}>
                    <MapPin size={13} />
                    <span>{item.loc}</span>
                  </div>

                  <h4
                    className={
                      item.color === "green"
                        ? styles.greenPrice
                        : styles.purplePrice
                    }
                  >
                    {item.price}
                  </h4>

                  <button className={styles.detailsBtn}>
                    View Details
                    <MoveRight size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* =========================
            BOTTOM INFO
        ========================= */}

        <div className={styles.bottomInfoWrapper}>

          {/* ITEM */}
          <div className={styles.infoItem}>

            <div className={styles.infoIconPurple}>
              <ShieldCheck size={22} />
            </div>

            <div>
              <h5>Verified Suppliers</h5>
              <p>All suppliers are verified for your safety</p>
            </div>

          </div>

          {/* ITEM */}
          <div className={styles.infoItem}>

            <div className={styles.infoIconGreen}>
              <Leaf size={22} />
            </div>

            <div>
              <h5 className={styles.greenText}>
                Best Quality
              </h5>

              <p>Premium quality rubber products</p>
            </div>

          </div>

          {/* ITEM */}
          <div className={styles.infoItem}>

            <div className={styles.infoIconPurple}>
              <Truck size={22} />
            </div>

            <div>
              <h5>Global Shipping</h5>
              <p>Fast & reliable delivery worldwide</p>
            </div>

          </div>

          {/* ITEM */}
          <div className={styles.infoItem}>

            <div className={styles.infoIconGreen}>
              <BadgeDollarSign size={22} />
            </div>

            <div>
              <h5 className={styles.greenText}>
                Secure Payments
              </h5>

              <p>100% secure transactions and payments</p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default FeaturedProductsSection;