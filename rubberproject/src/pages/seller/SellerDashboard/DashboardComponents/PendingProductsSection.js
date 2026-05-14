import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

import { getSellerPendingProductsThunk } from "../../../../redux/slices/sellerDashboardThunk";

import styles from "./PendingProductsSection.module.css";

function PendingProductsSection() {
  const dispatch = useDispatch();

  const { pendingProducts, pendingProductsLoading } = useSelector(
    (state) => state.sellerDashboard,
  );

  useEffect(() => {
    dispatch(getSellerPendingProductsThunk());
  }, [dispatch]);

  return (
    <section className={styles.wrapper}>
      {/* =========================
          TOP BAR
      ========================= */}

      <div className={styles.topBar}>
        <div>
          <h2>My Pending Products</h2>

          <p>Products awaiting approval</p>
        </div>

        <Link to="/seller-pending-products" className={styles.viewAllBtn}>
          View All
        </Link>
      </div>

      {/* =========================
          TABLE CARD
      ========================= */}

      <div className={styles.card}>
        {pendingProductsLoading ? (
          <div className={styles.loading}>Loading products...</div>
        ) : pendingProducts.length === 0 ? (
          <div className={styles.empty}>No pending products</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>

                  <th>Category</th>

                  <th>Status</th>

                  <th>Price/MT</th>
                </tr>
              </thead>

              <tbody>
                {pendingProducts.map((product) => (
                  <tr key={product._id}>
                    {/* PRODUCT */}

                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.imageWrapper}>
                          <img
                            src={product?.images?.[0]?.image}
                            alt={product.application}
                          />
                        </div>

                        <div className={styles.productInfo}>
                          <h4>{product.application}</h4>

                          <p>{product.loadingLocation}</p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>{product.category}</td>

                    {/* STATUS */}

                    <td>
                      <span className={styles.pendingBadge}>Pending</span>
                    </td>

                    {/* PRICE */}

                    <td className={styles.priceBox}>
                      ₹{product.pricePerMT?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default PendingProductsSection;
