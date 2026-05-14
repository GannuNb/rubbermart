import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import styles from "../../styles/AllProducts/AllProducts.module.css";

const ProductCategory = ({ title, description, image, features, buttonText, icon: FloatingIcon }) => {
  return (
    <div className={styles.categoryCard}>
      <div className={styles.dotGridDecoration}></div>
      
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.productImg} />
      </div>

      {FloatingIcon && (
        <div className={styles.floatingIcon}>
          <FloatingIcon size={28} color="white" />
        </div>
      )}

      <div className={styles.contentWrapper}>
        <div className={styles.textContent}>
          <h3 className={styles.categoryTitle}>{title}</h3>
          <div className={styles.titleUnderlineSmall}></div>
          <p className={styles.categoryDescription}>{description}</p>
        </div>

        <div className={styles.featureListWrapper}>
          {features.map((feature, idx) => {
            const FeatureIcon = feature.icon; 
            return (
              <div key={idx} className={styles.featureItemRow}>
                <div className={styles.featureIconCircle}>
                  <FeatureIcon size={20} color="#6332ad" /> 
                </div>
                <div className={styles.featureText}>
                  <strong>{feature.label}</strong>
                  <span>{feature.desc}</span>
                </div>
              </div>
            );
          })}
          <button className={styles.exploreBtn}>
            {buttonText} <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;