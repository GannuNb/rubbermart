import React, {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { Link } from "react-router-dom";

import {
  getRecentSellerOrdersThunk,
} from "../../../../redux/slices/sellerDashboardThunk";

import styles from "./RecentOrdersSection.module.css";

function RecentOrdersSection() {
  const dispatch = useDispatch();

  const {
    recentOrders,
    recentOrdersLoading,
  } = useSelector(
    (state) => state.sellerDashboard
  );

  useEffect(() => {
    dispatch(
      getRecentSellerOrdersThunk()
    );
  }, [dispatch]);

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "completed":
        return styles.completed;

      case "pending":
        return styles.pending;

      case "partially_shipped":
        return styles.partial;

      case "cancelled":
        return styles.cancelled;

      default:
        return styles.default;
    }
  };

  return (
    <section className={styles.wrapper}>
      {/* =========================
          TOP BAR
      ========================= */}

      <div className={styles.topBar}>
        <div>
          <h2>Recent Orders</h2>

          <p>
            Latest buyer orders
          </p>
        </div>

        {/* VIEW ALL */}

        <Link
          to="/seller/orders"
          className={styles.viewAllBtn}
        >
          View All
        </Link>
      </div>

      {/* =========================
          TABLE CARD
      ========================= */}

      <div className={styles.tableCard}>
        {recentOrdersLoading ? (
          <div className={styles.loading}>
            Loading orders...
          </div>
        ) : recentOrders.length ===
          0 ? (
          <div className={styles.empty}>
            No recent orders found
          </div>
        ) : (
          <div
            className={
              styles.tableWrapper
            }
          >
            <table
              className={styles.table}
            >
              <thead>
                <tr>
                  <th>Order ID</th>

                  <th>Buyer</th>

                  <th>Status</th>

                  <th>Amount</th>

                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map(
                  (order) => (
                    <tr
                      key={order._id}
                    >
                      {/* ORDER ID */}

                      <td>
                        {order.orderId}
                      </td>

                      {/* BUYER */}

                      <td>
                        <div
                          className={
                            styles.buyerInfo
                          }
                        >
                          <div>
                            <h4>
                              {
                                order
                                  ?.buyer
                                  ?.fullName
                              }
                            </h4>

                            <p>
                              {
                                order
                                  ?.buyer
                                  ?.email
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`${
                            styles.status
                          } ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus.replace(
                            /_/g,
                            " "
                          )}
                        </span>
                      </td>

                      {/* AMOUNT */}

                      <td>
                        ₹
                        {order.totalAmount?.toLocaleString()}
                      </td>

                      {/* DATE */}

                      <td>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentOrdersSection;