// src/pages/transporter/TransporterShipments.jsx

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  getOpenTransportShipmentsThunk,
  submitTransportQuoteThunk,
} from "../../redux/slices/transporter/transporterThunk";

function TransporterShipments() {
  const dispatch = useDispatch();

  const {
    openShipments,

    openShipmentsLoading,

    openShipmentsError,

    submitQuoteLoading,
  } = useSelector((state) => state.transporter);

  const [quoteData, setQuoteData] = useState({});

  /* =========================
     FETCH SHIPMENTS
  ========================= */

  useEffect(() => {
    dispatch(getOpenTransportShipmentsThunk());
  }, [dispatch]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */

  const handleQuoteChange = (shipmentId, field, value) => {
    setQuoteData((prev) => ({
      ...prev,

      [shipmentId]: {
        ...prev[shipmentId],

        [field]: value,
      },
    }));
  };

  /* =========================
     SUBMIT QUOTE
  ========================= */

  const handleSubmitQuote = (item) => {
    const shipmentId = item.shipment._id;

    const quote = quoteData[shipmentId];

    if (!quote?.quotedPrice) {
      return alert("Please enter quote price");
    }

    dispatch(
      submitTransportQuoteThunk({
        orderId: item.orderId,

        shipmentId,

        quoteData: quote,
      }),
    );
  };

  return (
    <div className="container py-4">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-4">
        <h2 className="fw-bold">Available Marketplace Shipments</h2>

        <p className="text-muted mb-0">
          View shipment details and submit your transport quote.
        </p>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {openShipmentsLoading && (
        <div className="alert alert-info">Loading shipments...</div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {openShipmentsError && (
        <div className="alert alert-danger">{openShipmentsError}</div>
      )}

      {/* =========================
          EMPTY STATE
      ========================= */}

      {!openShipmentsLoading && openShipments.length === 0 && (
        <div className="alert alert-secondary">
          No marketplace shipments available
        </div>
      )}

      {/* =========================
          SHIPMENTS GRID
      ========================= */}

      <div className="row g-4">
        {openShipments.map((item) => (
          <div key={item.shipment._id} className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                {/* =========================
                      HEADER
                  ========================= */}

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">
                      {item.shipment.shipmentInvoiceId}
                    </h5>

                    <small className="text-muted">
                      Order ID: {item.orderInvoiceId}
                    </small>
                  </div>

                  <span className="badge bg-dark">Open</span>
                </div>

                {/* =========================
                      SHIPMENT DETAILS
                  ========================= */}

                <div className="mb-2">
                  <strong>Item:</strong> {item.shipment.selectedItem}
                </div>

                <div className="mb-2">
                  <strong>Quantity:</strong> {item.shipment.shippedQuantity} MT
                </div>

                <div className="mb-2">
                  <strong>From:</strong> {item.shipment.shipmentFrom}
                </div>

                <div className="mb-4">
                  <strong>To:</strong> {item.shipment.shipmentTo}
                </div>

                {/* =========================
                      QUOTE FORM
                  ========================= */}

                <div className="border-top pt-3">
                  <h6 className="fw-semibold mb-3">Submit Quote</h6>

                  <input
                    type="number"
                    placeholder="Enter quote price"
                    value={quoteData[item.shipment._id]?.quotedPrice || ""}
                    onChange={(e) =>
                      handleQuoteChange(
                        item.shipment._id,
                        "quotedPrice",
                        e.target.value,
                      )
                    }
                    className="form-control mb-3"
                  />

                  <input
                    type="number"
                    placeholder="Estimated delivery days"
                    value={
                      quoteData[item.shipment._id]?.estimatedDeliveryDays || ""
                    }
                    onChange={(e) =>
                      handleQuoteChange(
                        item.shipment._id,
                        "estimatedDeliveryDays",
                        e.target.value,
                      )
                    }
                    className="form-control mb-3"
                  />

                  <textarea
                    placeholder="Additional note"
                    value={quoteData[item.shipment._id]?.note || ""}
                    onChange={(e) =>
                      handleQuoteChange(
                        item.shipment._id,
                        "note",
                        e.target.value,
                      )
                    }
                    className="form-control mb-3"
                    rows={3}
                  />

                  <button
                    className="btn btn-dark w-100"
                    onClick={() => handleSubmitQuote(item)}
                    disabled={submitQuoteLoading}
                  >
                    {submitQuoteLoading ? "Submitting..." : "Submit Quote"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransporterShipments;
