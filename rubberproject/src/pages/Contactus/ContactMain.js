import React, { useState, useEffect } from "react";
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
  FiCheckCircle, 
  FiAlertCircle, 
  FiX,           
} from "react-icons/fi";

import styles from "../../styles/Contactus/ContactMain.module.css";

const ContactMain = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Alert State: holds { type: 'success' | 'error' | null, text: '' }
  const [alert, setAlert] = useState({ type: null, text: "" });

  /* =========================
        AUTO-DISMISS TIMEOUT
     ========================= */
  useEffect(() => {
    if (alert.type) {
      const timer = setTimeout(() => {
        setAlert({ type: null, text: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert.type]);

  /* =========================
        HANDLE CHANGE
     ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
        HANDLE SUBMIT
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: null, text: "" }); 

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/contact/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAlert({ type: "success", text: "Message sent successfully!" });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setAlert({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch (error) {
      setAlert({ type: "error", text: "Failed to send message. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.mainGrid}>
        {/* FORM */}
        <div className={styles.formCard}>
          <div className={styles.cardTitle}>
            <FiMessageSquare />
            <h3>Get In Touch</h3>
          </div>

          <p>Fill out the form below and we’ll get back to you soon.</p>

          <form onSubmit={handleSubmit} className={styles.contactFormWrapper}>
            <div className={styles.inputGroup}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="Support">Support</option>
                <option value="Business">Business</option>
                <option value="General Query">General Query</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Type your message here..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* RELATIVE ACTIONS CONTAINER FOR THE BUTTON ALERT POPUP */}
            <div className={styles.formActionsContainer}>
              {/* ALERT BOX APPEARS IMMEDIATELY ABOVE SEND MESSAGE BUTTON */}
              {alert.type && (
                <div className={`${styles.alertBox} ${styles[alert.type]}`}>
                  <div className={styles.alertAccentBar}></div>

                  <div className={styles.alertContent}>
                    <div className={styles.alertIconWrapper}>
                      {alert.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                    </div>

                    <div className={styles.alertTextGroup}>
                      <strong className={styles.alertTitle}>
                        {alert.type === "success" ? "Success" : "Error Occurred"}
                      </strong>
                      <span className={styles.alertDescription}>{alert.text}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.alertCloseBtn}
                    onClick={() => setAlert({ type: null, text: "" })}
                  >
                    <FiX />
                  </button>
                </div>
              )}

              <button type="submit" className={styles.sendBtn} disabled={loading}>
                <FiSend />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {/* INFO */}
        <div className={styles.infoCard}>
          <div className={styles.cardTitle}>
            <FiPhone />
            <h3>Contact Information</h3>
          </div>

          <p>Reach us through any of the following channels.</p>

          <div className={styles.infoBox}>
            <FiMapPin />
            <div>
              <h4>Address</h4>
              <span>
                Office No. 217 Skylark Premises Co-operative Society Ltd.
                Plot No. 63, Sector 11 CBD Belapur Navi Mumbai – 400614
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
              <span>Monday - Saturday: 10:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div className={styles.mapBox}>
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7543.968993740852!2d73.03417530000003!3d19.020404800000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3ac8d1c04a3%3A0x3a2e56582e9947f4!2sSky%20Lark!5e0!3m2!1sen!2sin!4v1779101995587!5m2!1sen!2sin"
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
          <span className={styles.featureTag}>Why Choose Us</span>
          <h2>Reliable Support Experience</h2>
          <p>
            We provide fast communication, professional guidance, and secure
            assistance for every customer inquiry.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureGlow}></div>
            <div className={styles.featureIcon}>
              <FiZap />
            </div>
            <h4>Fast Response</h4>
            <p>Get quick replies and instant assistance from our responsive support team.</p>
            <span>Usually within 24 hours</span>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureGlow}></div>
            <div className={styles.featureIcon}>
              <FiShield />
            </div>
            <h4>Expert Support</h4>
            <p>Our experienced professionals are always ready to help your business.</p>
            <span>Professional assistance</span>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureGlow}></div>
            <div className={styles.featureIcon}>
              <FiUsers />
            </div>
            <h4>Secure Communication</h4>
            <p>Your personal and business information stays completely protected.</p>
            <span>Privacy focused</span>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureGlow}></div>
            <div className={styles.featureIcon}>
              <FiHelpCircle />
            </div>
            <h4>Always Available</h4>
            <p>We’re here to guide and support you whenever you need assistance.</p>
            <span>Dedicated customer care</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactMain;