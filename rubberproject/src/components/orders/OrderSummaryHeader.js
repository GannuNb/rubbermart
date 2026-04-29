import React from "react";
import { FaBox, FaCalendarAlt, FaFileAlt, FaRupeeSign } from "react-icons/fa";
import { useDispatch } from "react-redux";

import styles from "../../styles/Buyer/BuyerOrderDetails.module.css";
import { downloadProformaInvoiceThunk } from "../../redux/slices/buyerOrderThunk";

function OrderSummaryHeader({ order }) {
  const dispatch = useDispatch();

  const handleDownloadInvoice = () => {
    dispatch(downloadProformaInvoiceThunk(order._id));
  };

  return (
    <div className={styles.summaryCard}>
      {/* ORDER ID */}
      <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
          <FaBox />
        </div>
        <div>
          <p className={styles.label}>Order ID</p>
          <h4 className={styles.linkText}>{order.orderId}</h4>
        </div>
      </div>

      {/* TOTAL AMOUNT */}
      <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
          <FaRupeeSign />
        </div>
        <div>
          <p className={styles.label}>Total Amount</p>
          <h3 className={styles.amount}>
            ₹{Number(order.totalAmount).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* ORDER DATE */}
      <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
          <FaCalendarAlt />
        </div>
        <div>
          <p className={styles.label}>Ordered Date</p>
          <h4>{new Date(order.createdAt).toLocaleDateString()}</h4>
        </div>
      </div>

      {/* REPORTS */}
      <div className={styles.summaryItem}>
        <div className={styles.iconBox}>
          <FaFileAlt />
        </div>
        <div>
          <p className={styles.label}>Reports</p>
          <h4 className={styles.linkText}>Buy Reports</h4>
        </div>
      </div>

      {/* PROFORMA INVOICE */}

      <div
        className={styles.summaryItem}
        onClick={handleDownloadInvoice}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.iconBox}>
          <FaFileAlt />
        </div>

        <div>
          <p className={styles.label}>Invoice</p>

          <h4 className={styles.linkText}>Proforma Invoice</h4>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryHeader;
