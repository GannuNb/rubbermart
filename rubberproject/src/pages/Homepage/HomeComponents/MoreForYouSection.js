import React from "react";

import {
  UserPlus,
  ShoppingBag,
  PackageCheck,
  PhoneCall,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import styles from "./MoreForYouSection.module.css";

const MoreForYouSection = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <UserPlus size={26} />,
      title: "Register as Buyer / Seller",
      desc: "Create your business account and start connecting with verified buyers and suppliers worldwide.",
      btn: "Create Account",
      green: false,
      action: () => navigate("/signup"),
    },

    {
      icon: <ShoppingBag size={26} />,
      title: "Explore Products",
      desc: "Browse premium rubber products, tyre scraps, crumb rubber, pyrolysis materials and more.",
      btn: "Browse Products",
      green: true,
      action: () => navigate("/our-products"),
    },

    {
      icon: <PackageCheck size={26} />,
      title: "Track My Orders",
      desc: "Monitor confirmations, shipments, payments and delivery updates in one secure dashboard.",
      btn: "View Orders",
      green: false,
      action: () => navigate("/buyer-orders"),
    },

    {
      icon: <PhoneCall size={26} />,
      title: "Contact Support",
      desc: "Need help with orders or suppliers? Our support team is always ready to assist your business.",
      btn: "Contact Us",
      green: true,
      action: () => navigate("/contactus"),
    },
  ];

  return (
    <section className={styles.sectionWrapper}>
      {/* BACKGROUND SHAPES */}
      <div className={styles.glowOne}></div>
      <div className={styles.glowTwo}></div>

      <div className="container-fluid px-md-5">
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.badge}>More For You</div>

          <h2 className={styles.title}>
            Everything You Need <span>In One Place</span>
          </h2>

          <p className={styles.subtitle}>
            Manage your buying, selling and order activities through a secure
            and trusted rubber trading marketplace.
          </p>
        </div>

        {/* CARDS */}
        <div className="row g-4">
          {cards.map((item, index) => (
            <div className="col-xl-3 col-lg-6 col-md-6" key={index}>
              <motion.div
                className={`${styles.cardBox} ${
                  item.green ? styles.greenCard : ""
                }`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -8 }}
              >
                {/* ICON */}
                <div
                  className={`${styles.iconBox} ${
                    item.green ? styles.greenIcon : ""
                  }`}
                >
                  {item.icon}
                </div>

                {/* CONTENT */}
                <h4>{item.title}</h4>

                <p>{item.desc}</p>

                {/* BUTTON */}
                <button
                  className={`${styles.actionBtn} ${
                    item.green ? styles.greenBtn : ""
                  }`}
                  onClick={item.action}
                >
                  {item.btn}
                  <ArrowRight size={17} />
                </button>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreForYouSection;
