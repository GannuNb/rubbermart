import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { MoveRight } from "lucide-react"; 

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import tyreImg from "../../../assests/Tyre.jpeg";
import styles from "./CategoriesSection.module.css";

function CategoriesSection() {
    const categories = [
        { label: "Rubber Crumb" },
        { label: "Baled Tyres PCR" },
        { label: "Baled Tyres TBR" },
        { label: "Mulch PCR" },
        { label: "Three Piece PCR" },
        { label: "Three Piece TBR" },
        { label: "Shredds" },
        { label: "Pyro Oil" },
    ];

    return (
        <section className={styles.categoriesSection}>
            <div className="container-fluid px-md-5">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <span className={styles.topTag}>MARKETPLACE</span>
                        <h2 className={styles.sectionHeading}>Explore Top Categories</h2>
                    </div>
                    <button className={styles.viewAllBtn}>
                        View all <MoveRight size={14} className="ms-2" />
                    </button>
                </div>

                {/* Slider Wrapper with safety padding */}
                <div className={styles.sliderWrapper}>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        loop={true}
                        spaceBetween={15}
                        slidesPerView={2.2}
                        className={styles.swiperInstance} // Apply specific swiper class
                        breakpoints={{
                            768: { slidesPerView: 4.5 },
                            1024: { slidesPerView: 5.5 }, 
                            1440: { slidesPerView: 6.5 },
                        }}
                    >
                        {categories.map((item, index) => (
                            <SwiperSlide key={index} className={styles.swiperSlideCustom}>
                                <div className={styles.categoryCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.imgContainer}>
                                            <img 
                                                src={tyreImg} 
                                                alt={item.label} 
                                                className={styles.categoryImg} 
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.categoryLabel}>{item.label}</span>
                                        <div className={styles.smallArrow}>
                                            <MoveRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default CategoriesSection;