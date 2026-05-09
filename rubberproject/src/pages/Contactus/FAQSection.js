import React from "react";
import {
    FiChevronDown,
    FiHelpCircle,
} from "react-icons/fi";
import styles from "../../styles/Contactus/FAQSection.module.css";

import { faqs } from "./contactData";

const FAQSection = () => {
    const [openIndex, setOpenIndex] = React.useState(null);

    return (
        <div className={styles.faqSection}>

    {/* BACKGROUND FLOATING ELEMENTS */}
    <div className={styles.bgMessage}></div>
    <div className={styles.bgMail}></div>
    <div className={styles.bgChat}></div>

    <div className={styles.sectionTop}>
        <span className={styles.smallTag}>
            Support Questions
        </span>

        <h2>
            Frequently Asked Questions
        </h2>

        <p>
            Everything you need to know about support,
            communication, response times and services.
        </p>
    </div>

    {faqs.map((faq, index) => (
        <div
            key={index}
            className={styles.faqCard}
        >
            <div
                className={styles.faqItem}
                onClick={() =>
                    setOpenIndex(
                        openIndex === index
                            ? null
                            : index
                    )
                }
            >
                <div className={styles.questionLeft}>

                    <div className={styles.questionIcon}>
                        <FiHelpCircle />
                    </div>

                    <span>{faq.question}</span>
                </div>

                <FiChevronDown
                    className={
                        openIndex === index
                            ? styles.rotateIcon
                            : ""
                    }
                />
            </div>

            {openIndex === index && (
                <div className={styles.answer}>
                    {faq.answer}
                </div>
            )}
        </div>
    ))}
</div>
    );
};

export default FAQSection;