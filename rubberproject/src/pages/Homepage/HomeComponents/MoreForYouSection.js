import React from "react";
import {
  UserPlus,
  ShoppingBag,
  PackageCheck,
  PhoneCall,
  ArrowRight,
  UserCheck, // Clean icon for a logged-in user profile/dashboard view
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./MoreForYouSection.module.css";

const MoreForYouSection = () => {
  const navigate = useNavigate();

  // --- CONNECT TO YOUR AUTHENTICATION HERE ---
  // Replace this with your actual auth state (e.g., const { user } = useAuth();)
  // For now, it checks if a token exists in localStorage so you can test it:
  const isLoggedIn = !!localStorage.getItem("token"); 

  // --- CARD DEFINITIONS ---

  // Card 1 Options (Depends on Auth status)
  const registerCard = {
    icon: <UserPlus size={26} />,
    title: "Register as Buyer / Seller",
    desc: "Create your business account and start connecting with verified buyers and suppliers worldwide.",
    btn: "Create Account",
    green: false,
    action: () => navigate("/signup"),
  };

  const myProfileCard = {
    icon: <UserCheck size={26} />,
    title: "Manage My Profile",
    desc: "Update your business details, view verification badges, and adjust your trading preferences.",
    btn: "Go to Profile",
    green: false,
    action: () => navigate("/buyer/profile"), // Adjust route as needed
  };

  // Card 2 (Always shows)
  const exploreCard = {
    icon: <ShoppingBag size={26} />,
    title: "Explore Products",
    desc: "Browse premium rubber products, tyre scraps, crumb rubber, pyrolysis materials and more.",
    btn: "Browse Products",
    green: true,
    action: () => navigate("/our-products"),
  };

  // Card 3 Options (Depends on Auth status)
  const trackOrdersCard = {
    icon: <PackageCheck size={26} />,
    title: "Track My Orders",
    desc: "Monitor confirmations, shipments, payments and delivery updates in one secure dashboard.",
    btn: "View Orders",
    green: false,
    action: () => navigate("/buyer-orders"),
  };

  // Replaces Track Orders when user is logged out (As shown in your Image 1)
  const marketInsightsCard = {
    icon: <ArrowRight size={26} />, // Change icon here if desired
    title: "Market Insights",
    desc: "Stay updated with the latest trends, pricing indices, and global rubber industry updates.",
    btn: "View Trends",
    green: false,
    action: () => navigate("/market-trends"),
  };

  // Card 4 (Always shows)
  const contactCard = {
    icon: <PhoneCall size={26} />,
    title: "Contact Support",
    desc: "Need help with orders or suppliers? Our support team is always ready to assist your business.",
    btn: "Contact Us",
    green: true,
    action: () => navigate("/contactus"),
  };

  // --- BUILD DYNAMIC CARDS ARRAY ---
  const cards = [
    isLoggedIn ? myProfileCard : registerCard,       // Slot 1: Changes on login
    exploreCard,                                     // Slot 2: Always same
    isLoggedIn ? trackOrdersCard : marketInsightsCard, // Slot 3: Changes on login
    contactCard,                                     // Slot 4: Always same
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