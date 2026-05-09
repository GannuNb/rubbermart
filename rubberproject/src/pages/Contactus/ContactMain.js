import React from "react";

import {
    FiMapPin,
    FiPhone,
    FiMail,
    FiClock,
    FiSend,
    FiMessageSquare,
    FiShield,
    FiZap,
    FiUsers,
    FiHelpCircle,
} from "react-icons/fi";

import styles from "../../styles/Contactus/ContactMain.module.css";

const ContactMain = () => {
    return (
        <>
            <div className={styles.mainGrid}>
                {/* FORM */}
                <div className={styles.formCard}>
                    <div className={styles.cardTitle}>
                        <FiMessageSquare />
                        <h3>Get In Touch</h3>
                    </div>

                    <p>
                        Fill out the form below and we’ll get back to you soon.
                    </p>

                    <form>
                        <div className={styles.inputGroup}>
                            <label>Name</label>
                            <input type="text" placeholder="Your full name" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Subject</label>

                            <select>
                                <option>Select a subject</option>
                                <option>Support</option>
                                <option>Business</option>
                                <option>General Query</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Message</label>

                            <textarea
                                placeholder="Type your message here..."
                                rows="5"
                            />
                        </div>

                        <div className={styles.checkboxRow}>
                            <input type="checkbox" />
                            <span>I agree to the privacy policy</span>
                        </div>

                        <button
                            type="submit"
                            className={styles.sendBtn}
                        >
                            <FiSend />
                            Send Message
                        </button>
                    </form>
                </div>

                {/* INFO */}
                <div className={styles.infoCard}>
                    <div className={styles.cardTitle}>
                        <FiPhone />
                        <h3>Contact Information</h3>
                    </div>

                    <p>
                        Reach us through any of the following channels.
                    </p>

                    <div className={styles.infoBox}>
                        <FiMapPin />

                        <div>
                            <h4>Address</h4>

                            <span>
                                Ground Floor, Office No-52/ Plot No-44,
                                sai Chamber CHS, Wing A, Sector 11,
                                sai Chambers, Nerul, Navi Mumbai - 400706
                            </span>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <FiPhone />

                        <div>
                            <h4>Phone</h4>
                            <span>022-46033434</span>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <FiMail />

                        <div>
                            <h4>Email</h4>
                            <span>info@rubberscrapmart.com</span>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        <FiClock />

                        <div>
                            <h4>Business Hours</h4>
                            <span>
                                Monday - Saturday: 10:00 AM - 6:00 PM
                            </span>
                        </div>
                    </div>

                    <div className={styles.mapBox}>
                        <iframe
                            title="Company Location"
                            src="https://www.google.com/maps?ll=19.016089,73.039651&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=6816502611823718719&output=embed"
                            width="100%"
                            height="280"
                            style={{
                                border: 0,
                                borderRadius: "16px",
                            }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* FEATURES */}
            <div className={styles.featuresSection}>

                <div className={styles.featuresTop}>
                    <span className={styles.featureTag}>
                        Why Choose Us
                    </span>

                    <h2>
                        Reliable Support Experience
                    </h2>

                    <p>
                        We provide fast communication, professional guidance,
                        and secure assistance for every customer inquiry.
                    </p>
                </div>

                <div className={styles.featuresGrid}>

                    <div className={styles.featureCard}>
                        <div className={styles.featureGlow}></div>

                        <div className={styles.featureIcon}>
                            <FiZap />
                        </div>

                        <h4>Fast Response</h4>

                        <p>
                            Get quick replies and instant assistance from our
                            responsive support team.
                        </p>

                        <span>Usually within 24 hours</span>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureGlow}></div>

                        <div className={styles.featureIcon}>
                            <FiShield />
                        </div>

                        <h4>Expert Support</h4>

                        <p>
                            Our experienced professionals are always ready
                            to help your business.
                        </p>

                        <span>Professional assistance</span>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureGlow}></div>

                        <div className={styles.featureIcon}>
                            <FiUsers />
                        </div>

                        <h4>Secure Communication</h4>

                        <p>
                            Your personal and business information stays
                            completely protected.
                        </p>

                        <span>Privacy focused</span>
                    </div>

                    <div className={styles.featureCard}>
                        <div className={styles.featureGlow}></div>

                        <div className={styles.featureIcon}>
                            <FiHelpCircle />
                        </div>

                        <h4>Always Available</h4>

                        <p>
                            We’re here to guide and support you whenever
                            you need assistance.
                        </p>

                        <span>Dedicated customer care</span>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ContactMain;