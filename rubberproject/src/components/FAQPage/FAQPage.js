import React, { useState } from "react";
import {
    FiSearch,
    FiPlus,
    FiMinus,
    FiGrid,
    FiUser,
    FiShoppingBag,
    FiTruck,
    FiCreditCard,
    FiHeadphones,
    FiArrowRight,
    FiShield,
    FiCheckCircle
} from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./FAQPage.module.css";
import faqHeroImg from "../../assests/faq.png"; // Dynamic import for your asset path

const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState("All Questions");
    const [openFaqId, setOpenFaqId] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const faqData = [
        {
            id: 1,
            num: "01",
            category: "All Questions",
            question: "What is RubberScrapMart?",
            answer: "RubberScrapMart is a trusted B2B marketplace for rubber scrap, tyre scraps, crumb rubber, pyrolysis oil, and other rubber related materials. We connect verified buyers and sellers from around the country, ensuring safe, transparent and reliable trade."
        },
        {
            id: 2,
            num: "02",
            category: "Account & Profile",
            question: "How do I create an account on RubberScrapMart?",
            answer: "Click the Sign Up button at the top right of the homepage. Select your primary role (Buyer or Seller), fill in your official business email, and configure your password infrastructure to initiate instant onboarding."
        },
        {
            id: 3,
            num: "03",
            category: "Buying & Orders",
            question: "How can I list my products for sale?",
            answer: "Registered sellers can navigate to their seller inventory panel, click 'Add Listing', specify material grade parameters (e.g., loose crumb rubber sizing or PCR tyre metrics), upload bulk images, and publish."
        },
        {
            id: 4,
            num: "04",
            category: "Buying & Orders",
            question: "How can I find products to buy?",
            answer: "Utilize our marketplace search index or check the specific 'More For You' automated discovery section to instantly query, compare, and filter listings by region, metric tonnage, and recycling grade."
        },
        {
            id: 5,
            num: "05",
            category: "Payments & Invoices",
            question: "What payment methods are supported?",
            answer: "We support institutional banking channels including secure domestic/international escrow arrangements, validated Letters of Credit (LC), and immediate automated clearing house transfers."
        },
        {
            id: 6,
            num: "06",
            category: "Shipping & Delivery",
            question: "How does shipping and delivery work?",
            answer: "Logistics options are specified at checkout. You can leverage our verified freight shipping partners or enter precise custom cargo ports manually using independent logistics systems."
        },
        {
            id: 7,
            num: "07",
            category: "Buying & Orders",
            question: "Can I track my order?",
            answer: "Yes, every transaction automatically outputs milestone status trackers linked directly to global carrier logistics numbers or bulk container waybills visible directly on your dashboard."
        },
        {
            id: 8,
            num: "08",
            category: "Support & Others",
            question: "What if I face an issue with my order?",
            answer: "Our immediate dispute management workflow can be activated from your order sheet details. A marketplace manager will review weight bridge logs and parameters to mediate fast resolution."
        },
        {
            id: 9,
            num: "09",
            category: "Account & Profile",
            question: "Is my business information safe?",
            answer: "Absolutely. Legal company documentation, operational registration licenses, and private message channels are encrypted under strict role-based verification controls."
        },
        {
            id: 10,
            num: "10",
            category: "Support & Others",
            question: "How can I contact customer support?",
            answer: "You can click our 'Contact Support' anchors on the side utility widget to enter a fast direct ticket, or ping our customer service desk operational round-the-clock."
        }
    ];

    // Helper function to dynamically count item density per category mapping
    const getCategoryCount = (categoryName) => {
        if (categoryName === "All Questions") {
            return faqData.length;
        }
        return faqData.filter(faq => faq.category === categoryName).length;
    };

    const categories = [
        { name: "All Questions", count: getCategoryCount("All Questions"), icon: <FiGrid /> },
        { name: "Account & Profile", count: getCategoryCount("Account & Profile"), icon: <FiUser /> },
        { name: "Buying & Orders", count: getCategoryCount("Buying & Orders"), icon: <FiShoppingBag /> },
        { name: "Shipping & Delivery", count: getCategoryCount("Shipping & Delivery"), icon: <FiTruck /> },
        { name: "Payments & Invoices", count: getCategoryCount("Payments & Invoices"), icon: <FiCreditCard /> },
        { name: "Support & Others", count: getCategoryCount("Support & Others"), icon: <FiHeadphones /> },
    ];

    const handleFaqToggle = (id) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const filteredFaqs = faqData.filter(faq => {
        const matchesCategory = activeCategory === "All Questions" || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.faqPageContext}>

            {/* HERO HEADER SECTION */}
            <div className={styles.heroBanner}>
                <div className={styles.heroContent}>
                    <span className={styles.topSubline}>FAQ CENTER</span>
                    <h1>We're here to answer your <span className={styles.greenText}>questions</span></h1>
                    <p>Find answers to the most common questions about RubberScrapMart, our platform, products and services.</p>

                    <div className={styles.searchContainer}>
                        <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <button className={styles.searchBtn} aria-label="Submit search query">
                            <FiSearch />
                        </button>
                    </div>
                </div>

                {/* Dynamic Image Wrapper using src/images/faq.png */}
                <div className={styles.heroGraphicsWrap}>
                    <img
                        src={faqHeroImg}
                        alt="RubberScrapMart Tyres and Recycling Visual Graphics"
                        className={styles.faqDecorationImg}
                    />
                </div>
            </div>

            {/* TOP CATEGORIES ROW GRID */}
            <div className={styles.categoriesOuterWrap}>
                <div className={styles.categoriesGridGrid}>
                    {categories.map((cat, index) => {
                        const isSelected = activeCategory === cat.name;
                        return (
                            <button
                                key={index}
                                className={`${styles.categoryTabBox} ${isSelected ? styles.selectedTabBox : ""}`}
                                onClick={() => setActiveCategory(cat.name)}
                            >
                                <div className={styles.tabIconContext}>{cat.icon}</div>
                                <span className={styles.tabNameText}>{cat.name}</span>
                                <span className={styles.tabCountText}>
                                    {cat.count} {cat.count === 1 ? "Question" : "Questions"}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MIDDLE BODY CONTENT SPLIT */}
            <div className={styles.mainBodyLayout}>

                {/* Left Side Navigation Links Panel */}
                <div className={styles.sideBarPanel}>
                    <div className={styles.sideNavBox}>
                        <span className={styles.sideTitle}>Browse by category</span>
                        <div className={styles.sideNavLinksStack}>
                            {categories.map((cat, index) => {
                                const isSelected = activeCategory === cat.name;
                                return (
                                    <button
                                        key={index}
                                        className={`${styles.sideNavLinkBtn} ${isSelected ? styles.activeSideLink : ""}`}
                                        onClick={() => setActiveCategory(cat.name)}
                                    >
                                        <span className={styles.linkIconLeft}>{cat.icon}</span>
                                        <span className={styles.linkNameMiddle}>{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Assistance Box */}
                    <div className={styles.supportPromoCard}>
                        <div className={styles.headsetCircleIcon}>
                            <FiHeadphones />
                        </div>
                        <h3>Can't find what you're looking for?</h3>
                        <p>Our support team is ready to help you.</p>
                        <Link to="/contactus" className={styles.promoContactBtn}>
                            Contact Support <FiArrowRight />
                        </Link>
                    </div>
                </div>

                {/* Right Dynamic Accordion List */}
                <div className={styles.accordionStreamContainer}>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => {
                            const isCurrentOpen = openFaqId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`${styles.accordionBlockRow} ${isCurrentOpen ? styles.rowBlockExpanded : ""}`}
                                >
                                    <button
                                        className={styles.accordionHeaderTrigger}
                                        onClick={() => handleFaqToggle(faq.id)}
                                        aria-expanded={isCurrentOpen}
                                    >
                                        <div className={styles.triggerLeftContent}>
                                            <span className={`${styles.itemNumBadge} ${isCurrentOpen ? styles.activeNumBadge : ""}`}>
                                                {faq.num}
                                            </span>
                                            <h3 className={styles.questionTextTitle}>{faq.question}</h3>
                                        </div>
                                        <div className={`${styles.plusMinusCircle} ${isCurrentOpen ? styles.activeCircleToggle : ""}`}>
                                            {isCurrentOpen ? <FiMinus /> : <FiPlus />}
                                        </div>
                                    </button>

                                    <div className={`${styles.drawerSliderWrapper} ${isCurrentOpen ? styles.drawerOpenState : ""}`}>
                                        <div className={styles.drawerInnerTextPadding}>
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.noDataStateBox}>
                            <p>No answers found matching those filter constraints.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* BOTTOM SEGMENTED VALUE TRUST FOOTER */}
            <div className={styles.trustBannerFooter}>
                <div className={styles.trustLeftWrapper}>
                    <div className={styles.shieldIconWrapper}>
                        <FiShield />
                    </div>
                    <div className={styles.trustHeadingText}>
                        <h2>Your trust is our priority</h2>
                        <p>We ensure secure transactions, verified users and reliable support at every step.</p>
                    </div>
                </div>

                <div className={styles.trustBadgesRowGrid}>
                    <div className={styles.badgeFeatureItem}>
                        <FiCheckCircle className={styles.badgeTickIcon} />
                        <div className={styles.badgeMetaContent}>
                            <strong>Verified Users</strong>
                            <span>100% verified buyers and sellers</span>
                        </div>
                    </div>

                    <div className={styles.badgeFeatureItem}>
                        <FiCheckCircle className={styles.badgeTickIcon} />
                        <div className={styles.badgeMetaContent}>
                            <strong>Secure Payments</strong>
                            <span>Safe & encrypted payment methods</span>
                        </div>
                    </div>

                    <div className={styles.badgeFeatureItem}>
                        <FiCheckCircle className={styles.badgeTickIcon} />
                        <div className={styles.badgeMetaContent}>
                            <strong>24/7 Support</strong>
                            <span>We're here to help anytime</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FAQPage;