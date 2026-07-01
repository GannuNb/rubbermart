// src/components/seller/ShipmentCard.js

import React, { useState } from "react";

import styles from "../../styles/Seller/ShipmentCard.module.css";

import {
  FiTruck,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiPackage,
} from "react-icons/fi";

import { useDispatch, useSelector } from "react-redux";

import {
  markShipmentDeliveredBySellerThunk,
  markShipmentShippedBySellerThunk,
  uploadShipmentProofsThunk,
  getSellerSingleOrderThunk,
} from "../../redux/slices/sellerOrderThunk";

const ShipmentCard = ({ shipment, orderId }) => {
  const dispatch = useDispatch();

  const [showDetails, setShowDetails] = useState(false);
  const [packedItemPhoto, setPackedItemPhoto] = useState(null);

  const [weightTicket, setWeightTicket] = useState(null);

  const { shipmentLoading,markDeliveredLoading, markShippedLoading, activeShipmentId } =
    useSelector((state) => state.sellerOrders);

  /* =========================
     STATUS
  ========================= */

  const isDelivered = shipment.shipmentStatus === "delivered";
  const hasDocuments =
    shipment?.packedItemPhoto?.data && shipment?.weightTicket?.data;

  const isShipped =
    shipment.shipmentStatus === "shipped" ||
    shipment.shipmentStatus === "in_transit";

  const canMarkShipped =
    shipment.transportStatus === "transporter_assigned" &&
    hasDocuments &&
    !isShipped &&
    !isDelivered;

  const canMarkDelivered =
    (shipment.shipmentStatus === "shipped" ||
      shipment.shipmentStatus === "in_transit") &&
    !isDelivered;

  /* =========================
     OPEN FILE
  ========================= */

  const handleOpenFile = (file, fileName) => {
    if (!file?.data) {
      alert(`${fileName} not found`);

      return;
    }

    try {
      const byteArray = file.data.data;

      const uint8Array = new Uint8Array(byteArray);

      const blob = new Blob([uint8Array], {
        type: file.contentType || "application/pdf",
      });

      const fileURL = window.URL.createObjectURL(blob);

      window.open(fileURL, "_blank");
    } catch (error) {
      console.log("Open File Error:", error);

      alert(`Failed to open ${fileName}`);
    }
  };

  /* =========================
     MARK DELIVERED
  ========================= */

  const handleMarkDelivered = () => {
    dispatch(
      markShipmentDeliveredBySellerThunk({
        orderId,

        shipmentId: shipment._id,
      }),
    );
  };

  /* =========================
     MARK SHIPPED
  ========================= */

  const handleMarkShipped = () => {
    dispatch(
      markShipmentShippedBySellerThunk({
        orderId,

        shipmentId: shipment._id,
      }),
    );
  };
  const handleUploadProofs = () => {
    if (!packedItemPhoto) {
      return alert("Please select packed item photo");
    }

    if (!weightTicket) {
      return alert("Please select weight ticket");
    }

    const proofData = new FormData();

    proofData.append("packedItemPhoto", packedItemPhoto);

    proofData.append("weightTicket", weightTicket);

    dispatch(
      uploadShipmentProofsThunk({
        orderId,

        shipmentId: shipment._id,

        proofData,
      }),
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        alert("Shipment proofs uploaded successfully");

        dispatch(getSellerSingleOrderThunk(orderId));
      }
    });
  };

  return (
    <div className={styles.card}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.cardHeader}>
        <div>
          <h3>
            <FiTruck />

            {shipment.selectedItem || "Shipment"}
          </h3>

          <p>{shipment.shipmentInvoiceId || "N/A"}</p>
        </div>

        <button
          className={styles.toggleButton}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              Hide Details <FiChevronUp />
            </>
          ) : (
            <>
              View Shipping Details <FiChevronDown />
            </>
          )}
        </button>
      </div>

      {/* =========================
          DETAILS
      ========================= */}

      {showDetails && (
        <div className={styles.details}>
          {/* QUANTITY */}

          <div className={styles.row}>
            <span>Shipped Quantity</span>

            <strong>{shipment.shippedQuantity || 0} MT</strong>
          </div>

          {/* FROM */}

          <div className={styles.row}>
            <span>Shipment From</span>

            <strong>{shipment.shipmentFrom || "N/A"}</strong>
          </div>

          {/* TO */}

          <div className={styles.row}>
            <span>Shipment To</span>

            <strong>{shipment.shipmentTo || "N/A"}</strong>
          </div>

          {/* SHIPMENT STATUS */}

          <div className={styles.row}>
            <span>Shipment Status</span>

            <strong className={styles.status}>
              {shipment.shipmentStatus || "pending"}
            </strong>
          </div>

          {/* TRANSPORT STATUS */}

          <div className={styles.row}>
            <span>Transport Status</span>

            <strong className={styles.status}>
              {shipment.transportStatus || "N/A"}
            </strong>
          </div>

          {/* ASSIGNED TRANSPORTER */}

          <div className={styles.row}>
            <span>Assigned Transporter</span>

            <strong>
              {shipment?.assignedTransporter?.fullName || "Not Assigned"}
            </strong>
          </div>

          {/* ASSIGNMENT METHOD */}

          <div className={styles.row}>
            <span>Assignment Method</span>

            <strong>
              {shipment?.assignmentMethod?.replaceAll("_", " ") || "N/A"}
            </strong>
          </div>

          {/* TRANSPORT PRICE */}

          <div className={styles.row}>
            <span>Transport Amount</span>

            <strong>
              ₹{" "}
              {Number(
                shipment?.transportFinalAmount ||
                  shipment?.adminAssignedPrice ||
                  0,
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          {/* SUB PRODUCTS */}

          {shipment.selectedSubProducts?.length > 0 && (
            <div className={styles.subProducts}>
              <span>Sub Products</span>

              <div className={styles.tags}>
                {shipment.selectedSubProducts.map((subProduct, index) => (
                  <div key={index} className={styles.tag}>
                    {subProduct}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================
              UPLOAD PROOFS
          ========================= */}

          {shipment.transportStatus === "transporter_assigned" &&
            !hasDocuments && (
              <div className={styles.uploadSection}>
                <h4 className={styles.uploadHeading}>Upload Shipment Proofs</h4>

                {/* PACKED PHOTO */}

                <div className={styles.uploadField}>
                  <label>Packed Item Photo</label>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPackedItemPhoto(e.target.files[0])}
                  />
                </div>

                {/* WEIGHT TICKET */}

                <div className={styles.uploadField}>
                  <label>Weight Ticket</label>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setWeightTicket(e.target.files[0])}
                  />
                </div>

                <button
                  type="button"
                  className={styles.uploadButton}
                  onClick={handleUploadProofs}
                  disabled={shipmentLoading}
                >
                  {shipmentLoading ? "Uploading..." : "Upload Proof Documents"}
                </button>
              </div>
            )}

          {/* FILES */}

          <div className={styles.fileButtons}>
            {/* WEIGHT */}

            {shipment?.weightTicket?.data && (
              <button
                type="button"
                className={styles.viewButton}
                onClick={() =>
                  handleOpenFile(shipment.weightTicket, "Weight Ticket")
                }
              >
                View Weight Ticket
              </button>
            )}

            {/* PHOTO */}

            {shipment?.packedItemPhoto?.data && (
              <button
                type="button"
                className={styles.viewButton}
                onClick={() =>
                  handleOpenFile(shipment.packedItemPhoto, "Packed Item Photo")
                }
              >
                View Packed Photo
              </button>
            )}
          </div>

          {/* =========================
              MARK SHIPPED
          ========================= */}

          {canMarkShipped && (
            <button
              type="button"
              className={styles.shippedButton}
              onClick={handleMarkShipped}
              disabled={
                !canMarkShipped ||
                (markShippedLoading && activeShipmentId === shipment._id)
              }
            >
              <FiPackage />

              {markShippedLoading && activeShipmentId === shipment._id
                ? "Updating..."
                : isShipped
                  ? "Shipment Shipped"
                  : "Mark As Shipped"}
            </button>
          )}

          {/* =========================
              DELIVERED
          ========================= */}

          {(isShipped || isDelivered) && (
            <button
              type="button"
              className={
                isDelivered ? styles.deliveredButton : styles.deliverButton
              }
              onClick={handleMarkDelivered}
              disabled={
                !canMarkDelivered ||
                isDelivered ||
                (markDeliveredLoading && activeShipmentId === shipment._id)
              }
            >
              <FiCheckCircle />

              {markDeliveredLoading && activeShipmentId === shipment._id
                ? "Updating..."
                : isDelivered
                  ? "Delivered"
                  : "Mark As Delivered"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentCard;
