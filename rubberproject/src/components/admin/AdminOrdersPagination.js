import React from "react";
import styles from "../../styles/Admin/AdminOrdersPagination.module.css";

const AdminOrdersPagination = ({
  page,
  setPage,
  totalPages,
  totalOrders,
}) => {
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const startEntry = (page - 1) * 10 + 1;
  const endEntry = Math.min(page * 10, totalOrders);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        Showing {startEntry} to {endEntry} of{" "}
        {totalOrders} entries
      </div>

      <div className={styles.centerSection}>
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className={styles.navBtn}
        >
          Previous
        </button>

        <button className={styles.activePage}>
          {page}
        </button>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className={styles.navBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrdersPagination;