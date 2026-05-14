import React, {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getTopSellingProductsThunk,
} from "../../../../redux/slices/sellerDashboardThunk";

import styles from "./TopSellingProductsSection.module.css";

function TopSellingProductsSection() {
  const dispatch = useDispatch();

  const {
    topSellingProducts,
    topSellingProductsLoading,
  } = useSelector(
    (state) => state.sellerDashboard
  );

  useEffect(() => {
    dispatch(
      getTopSellingProductsThunk()
    );
  }, [dispatch]);

  return (
    <section className={styles.wrapper}>
      {/* =========================
          TOP BAR
      ========================= */}

      <div className={styles.topBar}>
        <div>
          <h2>
            Top Selling Products
          </h2>

          <p>
            Best performing products
          </p>
        </div>
      </div>

      {/* =========================
          CARD
      ========================= */}

      <div className={styles.card}>
        {topSellingProductsLoading ? (
          <div className={styles.loading}>
            Loading products...
          </div>
        ) : topSellingProducts.length ===
          0 ? (
          <div className={styles.empty}>
            No sales data found
          </div>
        ) : (
          <div className={styles.productsList}>
            {topSellingProducts.map(
              (product, index) => (
                <div
                  className={
                    styles.productItem
                  }
                  key={index}
                >
                  {/* LEFT */}

                  <div
                    className={
                      styles.leftContent
                    }
                  >
                    {/* RANK */}

                    <div
                      className={
                        styles.rankBadge
                      }
                    >
                      {index + 1}
                    </div>

                    {/* INFO */}

                    <div
                      className={
                        styles.productInfo
                      }
                    >
                      <h4>
                        {
                          product.productName
                        }
                      </h4>

                      <p>
                        {
                          product.totalQuantity
                        }{" "}
                        MT Sold
                      </p>
                    </div>
                  </div>

                  {/* REVENUE */}

                  <div
                    className={
                      styles.revenueBox
                    }
                  >
                    ₹
                    {product.totalRevenue?.toLocaleString()}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default TopSellingProductsSection;