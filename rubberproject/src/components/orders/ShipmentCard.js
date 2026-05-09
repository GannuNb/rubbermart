import React, {
  useState,
} from "react";

import styles from "../../styles/Seller/ShipmentCard.module.css";

import {
  FiTruck,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
} from "react-icons/fi";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  markShipmentDeliveredBySellerThunk,
} from "../../redux/slices/sellerOrderThunk";

const ShipmentCard = ({
  shipment,
  orderId,
}) => {
  const dispatch =
    useDispatch();

  const [showDetails, setShowDetails] =
    useState(false);

  const {
    markDeliveredLoading,
  } = useSelector(
    (state) =>
      state.sellerOrders
  );

  const isDelivered =
    shipment.shipmentStatus ===
    "delivered";

  /* =========================
     VIEW FILE
  ========================= */

  const handleViewShipmentFile = (
    file
  ) => {
    if (
      !file ||
      !file.data
    ) {
      alert(
        "Shipment file not found"
      );

      return;
    }

    try {
      const byteArray =
        file.data.data;

      if (
        !byteArray ||
        !Array.isArray(byteArray)
      ) {
        alert(
          "Invalid shipment file data"
        );

        return;
      }

      const uint8Array =
        new Uint8Array(
          byteArray
        );

      const blob = new Blob(
        [uint8Array],
        {
          type:
            file.contentType ||
            "application/pdf",
        }
      );

      const fileURL =
        window.URL.createObjectURL(
          blob
        );

      window.open(
        fileURL,
        "_blank"
      );
    } catch (error) {
      console.log(
        "View Shipment File Error:",
        error
      );

      alert(
        "Failed to open shipment file"
      );
    }
  };

  /* =========================
     MARK DELIVERED
  ========================= */

  const handleMarkDelivered =
    () => {
      dispatch(
        markShipmentDeliveredBySellerThunk(
          {
            orderId,
            shipmentId:
              shipment._id,
          }
        )
      );
    };

  return (
    <div className={styles.card}>
      {/* HEADER */}

      <div
        className={
          styles.cardHeader
        }
      >
        <div>
          <h3>
            <FiTruck />

            {shipment.selectedItem ||
              "Shipment"}
          </h3>

          <p>
            {shipment.shipmentInvoiceId ||
              "N/A"}
          </p>
        </div>

        <button
          className={
            styles.toggleButton
          }
          onClick={() =>
            setShowDetails(
              !showDetails
            )
          }
        >
          {showDetails ? (
            <>
              Hide Details{" "}
              <FiChevronUp />
            </>
          ) : (
            <>
              View Shipping
              Details{" "}
              <FiChevronDown />
            </>
          )}
        </button>
      </div>

      {/* DETAILS */}

      {showDetails && (
        <div
          className={
            styles.details
          }
        >
          <div
            className={
              styles.row
            }
          >
            <span>
              Vehicle Number
            </span>

            <strong>
              {shipment.vehicleNumber ||
                "N/A"}
            </strong>
          </div>

          <div
            className={
              styles.row
            }
          >
            <span>
              Driver Name
            </span>

            <strong>
              {shipment.driverName ||
                "N/A"}
            </strong>
          </div>

          <div
            className={
              styles.row
            }
          >
            <span>
              Driver Contact
            </span>

            <strong>
              {shipment.driverMobile ||
                "N/A"}
            </strong>
          </div>

          <div
            className={
              styles.row
            }
          >
            <span>
              Shipped
              Quantity
            </span>

            <strong>
              {shipment.shippedQuantity ||
                0}
            </strong>
          </div>

          <div
            className={
              styles.row
            }
          >
            <span>
              Shipment From
            </span>

            <strong>
              {shipment.shipmentFrom ||
                "N/A"}
            </strong>
          </div>

          <div
            className={
              styles.row
            }
          >
            <span>
              Shipment To
            </span>

            <strong>
              {shipment.shipmentTo ||
                "N/A"}
            </strong>
          </div>

          <div
            className={
              styles.row
            }
          >
            <span>Status</span>

            <strong
              className={
                styles.status
              }
            >
              {shipment.shipmentStatus ||
                "pending"}
            </strong>
          </div>

          {/* SUB PRODUCTS */}

          {shipment
            .selectedSubProducts
            ?.length > 0 && (
            <div
              className={
                styles.subProducts
              }
            >
              <span>
                Sub Products
              </span>

              <div
                className={
                  styles.tags
                }
              >
                {shipment.selectedSubProducts.map(
                  (
                    subProduct,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className={
                        styles.tag
                      }
                    >
                      {
                        subProduct
                      }
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* VIEW FILE */}

          {shipment
            ?.shipmentFile
            ?.data && (
            <button
              type="button"
              className={
                styles.viewButton
              }
              onClick={() =>
                handleViewShipmentFile(
                  shipment.shipmentFile
                )
              }
            >
              View Weight
              Ticket
            </button>
          )}

          {/* DELIVERED BUTTON */}

          <button
            type="button"
            className={
              isDelivered
                ? styles.deliveredButton
                : styles.deliverButton
            }
            onClick={
              handleMarkDelivered
            }
            disabled={
              isDelivered ||
              markDeliveredLoading
            }
          >
            <FiCheckCircle />

            {markDeliveredLoading
              ? "Updating..."
              : isDelivered
              ? "Delivered"
              : "Mark As Delivered"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipmentCard;