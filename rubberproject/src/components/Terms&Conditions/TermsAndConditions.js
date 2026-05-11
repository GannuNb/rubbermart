import React from "react";
import styles from "../../styles/Terms&conditions/Terms&conditions.module.css";

const TermsAndConditions = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Terms and Conditions</h1>
        
        <div className={styles.content}>
          <p className={styles.intro}>
            Welcome to RubberScrapMart! By accessing or using our
            website, you agree to comply with and be bound by these Terms and Conditions.
            Please read them carefully. If you do not agree with these terms, you should
            not use the website.
          </p>

          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              These Terms and Conditions govern your use of
              RubberScrapMart platform rubberscrapmart.com where buyers and sellers can
              transact in tyre scrap, pyro oil, and tyre steel scrap. By creating a business
              profile and transacting on the Website, you agree to adhere to these terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Account Registration</h2>
            <p>
              To access the services on RubberScrapMart you must create a
              business profile. You are responsible for providing accurate, current, and
              complete information about your business, including the Company Name, Phone
              Number, Email, GST Number, PAN, and business addresses. Any false or misleading
              information may result in the termination of your account.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. User Responsibilities</h2>
            <ul className={styles.list}>
              <li>To only list genuine, legal, and quality products for sale.</li>
              <li>Not to engage in fraudulent activities, misrepresentation, or unethical conduct on the platform.</li>
              <li>To maintain confidentiality regarding your account and login credentials.</li>
              <li>To comply with all applicable local, state, and national laws when buying or selling products.</li>
              <li>To update your profile information regularly to ensure its accuracy.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Buying and Selling</h2>
            <p>
              Sellers are obligated to provide accurate and detailed
              information regarding the products listed on the platform, including, but not
              limited to, product descriptions, pricing, and stock availability. Sellers must
              maintain real-time inventory records to reflect the actual stock levels. Any
              misrepresentation or failure to accurately update inventory details, product
              quality, or availability may result in the immediate suspension or termination
              of the seller's account without prior notice. Additionally, sellers are
              required to provide supporting documentation for each consignment, including
              way tickets and photographic evidence taken during and after the loading
              process of each vehicle. All relevant consignment data must be uploaded
              promptly to ensure proper tracking and verification of the transaction.
            </p>
            <p>
              Buyers agree to verify the product details before making a
              purchase and ensure that payment terms are understood. RubberScrapMart is not
              responsible for any disputes between buyers and sellers, but we encourage users
              to resolve such issues amicably.
            </p>

            <h3>4.A. Payment Terms</h3>
            <p>
              RubberScrapMart does not use any online payment gateway.
              Buyers must make payments directly to the official bank account provided by
              RubberScrapMart. After transferring the amount, buyers must upload valid
              payment proof for verification. Payments will be marked as pending, partial,
              or completed based on the verified amount.
            </p>
            <p>
              RubberScrapMart releases the payment to the seller only
              after the buyer’s payment is verified and all required documents or shipment
              conditions are fulfilled. Any incorrect payment details, fake receipts, or
              delays in uploading proof may result in order delays or account action.
            </p>
            <p>
              RubberScrapMart may hold or delay seller payments if buyer
              payments are unverified or if shipment-related issues occur. Fraudulent payment
              activity will lead to immediate suspension or termination of the user’s
              account.
            </p>

            <h3>4.B. Banking Details Usage</h3>
            <p>
              RubberScrapMart provides its official banking details only
              through the platform’s secured channels for the purpose of receiving buyer
              payments. Buyers must transfer the order amount only to the bank account
              specified by RubberScrapMart for that order. Any payments made to accounts
              outside the officially provided details will not be considered valid.
            </p>
            <p>
              Buyers must ensure the accuracy of the bank details before
              initiating payment. RubberScrapMart will not be responsible for losses due to
              payments made to incorrect or unofficial accounts. Banking details must not be
              shared or used for any purpose other than completing the transaction related to
              the order.
            </p>

            <div className={styles.bankDetailsBox}>
              <h4>Bank Details</h4>
              <pre className={styles.pre}>
Bank Name           :  IDFC FIRST BANK{"\n"}
Account Name        :  VIKAH RUBBERS{"\n"}
Account Number      :  10113716761{"\n"}
IFSC CODE           :  IDFB0040132{"\n"}
Account Type        :  CURRENT A/C{"\n"}
Branch              :  NERUL BRANCH
              </pre>
            </div>
          </section>

          <section className={styles.section}>
            <h2>5. Product Listings</h2>
            <p>
              Sellers must ensure that their products comply with the
              legal requirements and standards for sale. RubberScrapMart reserves the right
              to remove any listings that violate our terms, are deemed illegal, or are not
              in line with our ethical standards. RubberScrapMart does not guarantee the
              quality, pricing, or availability of any product listed on the platform.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Delivery and Shipping</h2>
            <p>
              All shipments on RubberScrapMart must follow the platform’s
              documented process, including uploading way tickets, vehicle details, and
              shipment photos. Every shipment must be updated in the system, and sellers are
              responsible for providing accurate and timely shipment information.
            </p>
            <p>
              RubberScrapMart verifies shipment documents before approving
              dispatch but is not responsible for delays, damages, or disputes arising during
              transportation. Buyers and sellers must mutually agree on pickup or delivery
              terms. Sellers must ensure the product is shipped in good condition and
              according to the agreed schedule. Shipments without required documentation may
              be delayed or rejected.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Confidentiality and Data Protection</h2>
            <p>
              RubberScrapMart will handle personal and business data in
              compliance with applicable data protection laws. You agree not to share any
              sensitive data or proprietary information without the appropriate
              authorization.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Intellectual Property</h2>
            <p>
              All content on RubberScrapMart, including trademarks, logos,
              text, graphics, and software, is the property of RubberScrapMart or its
              licensors and is protected by intellectual property laws. You may not use or
              reproduce any content from the platform without prior written consent from
              RubberScrapMart.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Termination</h2>
            <p>
              RubberScrapMart reserves the right to suspend or terminate
              your account if you violate any terms of this agreement or engage in behavior
              deemed harmful to the community. You may terminate your account by contacting
              our support team.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Amendments to Terms</h2>
            <p>
              RubberScrapMart reserves the right to modify or update these
              Terms and Conditions at any time. Any changes will be posted on this page, and
              your continued use of the Website after such changes constitutes your
              acceptance of the revised terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions,
              please contact us at:{"\n"}
              Email: info@rubberscrapmart.com{"\n"}
              Tel: 022-46030343
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Limitation of Liability</h2>
            <p>
              RubberScrapMart acts only as a digital marketplace connecting buyers and
              sellers. We do not own, manufacture, or physically inspect any products listed
              on the platform. RubberScrapMart is not liable for any direct, indirect,
              incidental, or consequential damages arising from transactions, payments,
              product quality, delays, or disputes between buyers and sellers. Users agree to
              use the platform at their own risk.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Dispute Resolution</h2>
            <p>
              In the event of any dispute related to transactions, shipment, or payments,
              users must first contact RubberScrapMart support for review and assistance.
              RubberScrapMart will attempt to mediate the issue but is not legally
              responsible for enforcing agreements between buyers and sellers. If disputes
              cannot be resolved mutually, they shall be handled under the jurisdiction and
              laws of India.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the
              laws of India. Any legal proceedings arising out of the use of RubberScrapMart
              shall fall under the jurisdiction of the courts located in Mumbai, Maharashtra.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;