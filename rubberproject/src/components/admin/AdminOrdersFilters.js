// src/components/admin/AdminOrdersFilters.js

import React from "react";
import styles from "../../styles/Admin/AdminOrdersFilters.module.css";

const AdminOrdersFilters = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dateGroup}>
        {/* From Date */}
        <div className={styles.dateBox}>
          <span className={styles.label}>
            From
          </span>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
            className={styles.dateInput}
          />
        </div>

        {/* To Date */}
        <div className={styles.dateBox}>
          <span className={styles.label}>
            To
          </span>

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
            className={styles.dateInput}
          />
        </div>
      </div>

      <button className={styles.filterBtn}>
        Apply Filters
      </button>
    </div>
  );
};

export default AdminOrdersFilters;