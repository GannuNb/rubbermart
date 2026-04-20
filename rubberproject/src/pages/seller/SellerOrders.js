import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSellerOrdersThunk } from "../../redux/slices/sellerOrderThunk";
import styles from "../../styles/Seller/SellerOrders.module.css";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    sellerOrders,
    sellerOrdersLoading,
    sellerOrdersError,
  } = useSelector((state) => state.sellerOrders);

  useEffect(() => {
    dispatch(getSellerOrdersThunk());
  }, [dispatch]);

  if (sellerOrdersLoading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (sellerOrdersError) {
    return <div className={styles.error}>{sellerOrdersError}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Seller Orders</h1>

      {sellerOrders.length === 0 ? (
        <div className={styles.empty}>No orders found</div>
      ) : (
        <div className={styles.ordersGrid}>
          {sellerOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.row}>
                <span>Order ID:</span>
                <strong>{order.orderId}</strong>
              </div>

              <div className={styles.row}>
                <span>Buyer:</span>
                <strong>{order.buyer?.fullName}</strong>
              </div>

              <div className={styles.row}>
                <span>Email:</span>
                <strong>{order.buyer?.email}</strong>
              </div>

              <div className={styles.row}>
                <span>Total Products:</span>
                <strong>{order.orderItems?.length}</strong>
              </div>

              <div className={styles.row}>
                <span>Total Amount:</span>
                <strong>₹ {order.totalAmount}</strong>
              </div>

              <div className={styles.row}>
                <span>Status:</span>
                <strong className={styles.status}>
                  {order.orderStatus}
                </strong>
              </div>

              <div className={styles.row}>
                <span>Created:</span>
                <strong>
                  {new Date(order.createdAt).toLocaleDateString()}
                </strong>
              </div>

              <button
                className={styles.viewButton}
                onClick={() =>
                  navigate(`/seller/order-manage/${order._id}`)
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;