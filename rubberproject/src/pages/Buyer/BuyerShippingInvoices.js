import React from "react";
import {
  FaArrowLeft,
  FaFileInvoice,
  FaCalendarAlt,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "../../styles/Buyer/BuyerShippingInvoices.module.css";

const BuyerShippingInvoices = () => {
  const navigate = useNavigate();
  const { orderId, itemName } = useParams();
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>Order details not found</h2>
        </div>
      </div>
    );
  }

  const approvedShipments =
    order.shipments?.filter(
      (shipment) =>
        shipment.selectedItem === decodeURIComponent(itemName) &&
        shipment.approvedByAdmin === true
    ) || [];

  return (
    <div className={styles.container}>
      {/* TOP SECTION */}
      <div className={styles.topSection}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back to Order Details
        </button>

        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.heading}>
              Shipping Details
            </h1>

            <p className={styles.subText}>
              Complete Shipment Invoice Information and
              Tracking Details
            </p>
          </div>

          <div className={styles.orderIdBox}>
            <span>Order ID</span>
            <strong>{order.orderId}</strong>
          </div>
        </div>
      </div>

      {/* LIST */}
      {approvedShipments.length === 0 ? (
        <div className={styles.empty}>
          No approved shipment invoices found
        </div>
      ) : (
        <div className={styles.invoiceList}>
          {approvedShipments.map((shipment) => (
            <div
              key={shipment._id}
              className={styles.invoiceCard}
            >
              <div className={styles.cardLeft}>
                {/* Invoice ID */}
                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaFileInvoice />
                  </div>

                  <div>
                    <p className={styles.label}>
                      Invoice ID
                    </p>
                    <h4>
                      {shipment.shipmentInvoiceId}
                    </h4>
                  </div>
                </div>

                {/* Shipment Date */}
                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className={styles.label}>
                      Shipment Date
                    </p>
                    <h4>
                      {shipment.shippedAt
                        ? new Date(
                            shipment.shippedAt
                          ).toLocaleDateString()
                        : "-"}
                    </h4>
                  </div>
                </div>

                {/* Item */}
                <div className={styles.infoBlock}>
                  <div className={styles.iconBox}>
                    <FaBoxOpen />
                  </div>

                  <div>
                    <p className={styles.label}>
                      Item
                    </p>
                    <h4>{shipment.selectedItem}</h4>
                  </div>
                </div>
              </div>

              <button
                className={styles.viewButton}
                onClick={() =>
                  navigate(
                    `/buyer/shipping-invoice/${shipment._id}`,
                    {
                      state: {
                        shipment,
                        order,
                      },
                    }
                  )
                }
              >
                View More
                <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerShippingInvoices;