import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./FeaturedProductsSection.module.css";
// Path to your local image
import tyreImg from "../../../assests/Tyre.jpeg"; 

function FeaturedProductsSection() {
  const scrollRef = useRef(null);

  const products = [
    { name: "Baled Tyres PCR", qty: "20 MT", loc: "Ex-Chennai, India", price: "₹ 2,200 / MT" },
    { name: "Baled Tyres TBR", qty: "18 MT", loc: "Ex-Mundra, India", price: "₹ 2,800 / MT" },
    { name: "Three Piece PCR", qty: "15 MT", loc: "Ex-Nhavasheva, India", price: "₹ 3,500 / MT" },
    { name: "Three Piece TBR", qty: "25 MT", loc: "Ex-Delhi, India", price: "₹ 4,100 / MT" },
    { name: "Shredds", qty: "100 MT", loc: "Ex-Surat, India", price: "₹ 1,800 / MT" },
    { name: "Mulch PCR", qty: "12 MT", loc: "Ex-Pune, India", price: "₹ 5,500 / MT" },
    { name: "Rubber Granules/crumb", qty: "30 MT", loc: "Ex-Kolkata, India", price: "₹ 8,200 / MT" },
    { name: "Pyro oil", qty: "10 KL", loc: "Ex-Chennai, India", price: "₹ 42 / Litre" },
    { name: "Pyro Steel", qty: "50 MT", loc: "Ex-Mundra, India", price: "₹ 32,000 / MT" },
    { name: "Rubber Crum Steel", qty: "40 MT", loc: "Ex-Vizag, India", price: "₹ 28,500 / MT" },
  ];

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  return (
    <section className={styles.sectionWrapper}>
      <div className="container-fluid px-md-5">
        <div className={styles.headerRow}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <button className={styles.viewAllBtnHeader}>view all products</button>
        </div>

        <div className={styles.sliderOuterContainer}>
          <button 
            className={`${styles.navBtn} ${styles.prev}`} 
            onClick={() => scroll("left")}
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className={`${styles.navBtn} ${styles.next}`} 
            onClick={() => scroll("right")}
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          <div className={styles.productsSlider} ref={scrollRef}>
            {products.map((p, idx) => (
              <div 
                key={idx} 
                className={styles.productCard}
                style={{ "--idx": idx }} // For staggered animation
              >
                <div className={styles.imgWrapper}>
                  <img src={tyreImg} alt={p.name} className={styles.productImg} />
                </div>

                <div className={styles.cardBody}>
                  <h5 className={styles.productName}>{p.name}</h5>
                  <p className={styles.metaText}>{p.qty}</p>
                  <p className={styles.metaText}>{p.loc}</p>
                  <p className={styles.priceText}>{p.price}</p>
                  <button className={styles.viewDetailsBtn}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSection;