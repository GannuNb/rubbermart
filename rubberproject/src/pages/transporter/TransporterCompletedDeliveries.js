import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getCompletedDeliveriesThunk } from "../../redux/slices/transporter/getCompletedDeliveriesThunk";

function TransporterCompletedDeliveries() {
  const dispatch = useDispatch();

  const {
    completedDeliveries,

    completedDeliveriesLoading,

    completedDeliveriesError,
  } = useSelector((state) => state.transporter);

  /* =========================
     FETCH
  ========================= */

  useEffect(() => {
    dispatch(getCompletedDeliveriesThunk());
  }, [dispatch]);

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
        <h2 className="fw-bold">Completed Deliveries</h2>

        <p className="text-muted">Successfully delivered shipment history.</p>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {completedDeliveriesLoading && (
        <div className="alert alert-info">Loading completed deliveries...</div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {completedDeliveriesError && (
        <div className="alert alert-danger">{completedDeliveriesError}</div>
      )}

      {/* =========================
          EMPTY
      ========================= */}

      {!completedDeliveriesLoading && completedDeliveries.length === 0 && (
        <div className="alert alert-secondary">
          No completed deliveries found
        </div>
      )}

      {/* =========================
          LIST
      ========================= */}

      <div className="row g-4">
        {completedDeliveries.map((item) => (
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

                  <span className="badge bg-success">Delivered</span>
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

                {/* FROM */}

                <div className="mb-2">
                  <strong>From:</strong> {item.shipment?.shipmentFrom}
                </div>

                {/* TO */}

                <div className="mb-3">
                  <strong>To:</strong> {item.shipment?.shipmentTo}
                </div>

                {/* DELIVERED DATE */}

                <div className="mb-3">
                  <strong>Delivered At:</strong>{" "}
                  {item.shipment?.deliveredAt
                    ? new Date(item.shipment.deliveredAt).toLocaleDateString(
                        "en-IN",
                      )
                    : "-"}
                </div>

                {/* FILE BUTTONS */}

                <div className="d-flex gap-2 flex-wrap">
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
                      Weight Ticket
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
                      Packed Photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransporterCompletedDeliveries;
