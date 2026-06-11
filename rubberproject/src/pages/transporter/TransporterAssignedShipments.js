// src/pages/transporter/TransporterAssignedShipments.jsx

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getAssignedShipmentsThunk } from "../../redux/slices/transporter/getAssignedShipmentsThunk";

import { markShipmentShippedThunk } from "../../redux/slices/transporter/markShipmentShippedThunk";

function TransporterAssignedShipments() {
  const dispatch = useDispatch();

  const [activeShipmentId, setActiveShipmentId] = useState(null);

  const {
    assignedShipments,

    assignedShipmentsLoading,

    assignedShipmentsError,

    markShippedLoading,
  } = useSelector((state) => state.transporter);

  /* =========================
     FETCH
  ========================= */

  useEffect(() => {
    dispatch(getAssignedShipmentsThunk());
  }, [dispatch]);

  /* =========================
     MARK SHIPPED
  ========================= */

  const handleMarkShipped = (item) => {
    setActiveShipmentId(item.shipment._id);

    dispatch(
      markShipmentShippedThunk({
        orderId: item.orderId,

        shipmentId: item.shipment._id,
      }),
    ).then(() => {
      setActiveShipmentId(null);
    });
  };

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
      console.log(error);

      alert(`Failed to open ${fileName}`);
    }
  };

  return (
    <div className="container py-4">
      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-4">
        <h2 className="fw-bold">Assigned Shipments</h2>

        <p className="text-muted">
          Active shipment deliveries assigned to you.
        </p>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {assignedShipmentsLoading && (
        <div className="alert alert-info">Loading assigned shipments...</div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {assignedShipmentsError && (
        <div className="alert alert-danger">{assignedShipmentsError}</div>
      )}

      {/* =========================
          EMPTY
      ========================= */}

      {!assignedShipmentsLoading && assignedShipments.length === 0 && (
        <div className="alert alert-secondary">No assigned shipments found</div>
      )}

      {/* =========================
          LIST
      ========================= */}

      <div className="row g-4">
        {assignedShipments.map((item) => (
          <div key={item.shipment?._id} className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                {/* TOP */}

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">
                      {item.shipment?.shipmentInvoiceId}
                    </h5>

                    <small className="text-muted">
                      Order: {item.orderInvoiceId}
                    </small>
                  </div>

                  <span className="badge bg-primary">
                    {item.shipment?.shipmentStatus}
                  </span>
                </div>

                {/* SELLER */}

                <div className="mb-2">
                  <strong>Seller:</strong>{" "}
                  {item.seller?.businessProfile?.companyName}
                </div>

                {/* ITEM */}

                <div className="mb-2">
                  <strong>Item:</strong> {item.shipment?.selectedItem}
                </div>

                {/* QUANTITY */}

                <div className="mb-2">
                  <strong>Quantity:</strong> {item.shipment?.shippedQuantity} MT
                </div>
                <div className="mb-2">
                  <strong>Transport HSN:</strong>{" "}
                  {item.shipment?.transportHSNCode}
                </div>

                {/* FROM */}

                <div className="mb-2">
                  <strong>From:</strong> {item.shipment?.shipmentFrom}
                </div>

                {/* TO */}

                <div className="mb-3">
                  <strong>To:</strong> {item.shipment?.shipmentTo}
                </div>

                {/* FILE BUTTONS */}

                <div className="d-flex gap-2 flex-wrap mb-3">
                  {/* WEIGHT */}

                  {item.shipment?.weightTicket?.data && (
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        handleOpenFile(
                          item.shipment.weightTicket,
                          "Weight Ticket",
                        )
                      }
                    >
                      View Weight Ticket
                    </button>
                  )}

                  {/* PHOTO */}

                  {item.shipment?.packedItemPhoto?.data && (
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        handleOpenFile(
                          item.shipment.packedItemPhoto,
                          "Packed Photo",
                        )
                      }
                    >
                      View Packed Photo
                    </button>
                  )}
                </div>

                {/* SHIPPED BUTTON */}

                {item.shipment?.shipmentStatus === "shipped" ? (
                  <button className="btn btn-secondary w-100" disabled>
                    Shipment Shipped
                  </button>
                ) : (
                  <button
                    className="btn btn-dark w-100"
                    onClick={() => handleMarkShipped(item)}
                    disabled={
                      markShippedLoading &&
                      activeShipmentId === item.shipment._id
                    }
                  >
                    {markShippedLoading &&
                    activeShipmentId === item.shipment._id
                      ? "Updating..."
                      : "Mark As Shipped"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransporterAssignedShipments;
