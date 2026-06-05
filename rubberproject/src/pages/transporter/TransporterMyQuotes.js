import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getTransporterQuotesThunk } from "../../redux/slices/transporter/transporterThunk";

function TransporterMyQuotes() {
  const dispatch = useDispatch();

  const {
    myQuotes,

    myQuotesLoading,

    myQuotesError,
  } = useSelector((state) => state.transporter);

  useEffect(() => {
    dispatch(getTransporterQuotesThunk());
  }, [dispatch]);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">My Submitted Quotes</h2>

        <p className="text-muted">
          Track all shipment quotes submitted by you.
        </p>
      </div>

      {myQuotesLoading && (
        <div className="alert alert-info">Loading quotes...</div>
      )}

      {myQuotesError && (
        <div className="alert alert-danger">{myQuotesError}</div>
      )}

      {!myQuotesLoading && myQuotes.length === 0 && (
        <div className="alert alert-secondary">No quotes submitted yet</div>
      )}

      <div className="row g-4">
        {myQuotes.map((quote) => (
          <div key={quote._id} className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">Shipment Quote</h5>

                    <small className="text-muted">
                      Shipment Invoice:{" "}
                      {
                        quote.orderId?.shipments?.find(
                          (shipment) => shipment._id === quote.shipmentId,
                        )?.shipmentInvoiceId
                      }
                    </small>
                  </div>

                  <span
                    className={`badge ${
                      quote.quoteStatus === "selected"
                        ? "bg-success"
                        : quote.quoteStatus === "rejected"
                          ? "bg-danger"
                          : "bg-dark"
                    }`}
                  >
                    {quote.quoteStatus}
                  </span>
                </div>

                <div className="mb-2">
                  <strong>Quoted Price:</strong> ₹{quote.quotedPrice}
                </div>

                <div className="mb-2">
                  <strong>Estimated Days:</strong> {quote.estimatedDeliveryDays}
                </div>

                <div className="mb-2">
                  <strong>Note:</strong> {quote.note || "No note"}
                </div>

                <div className="mb-2">
                  <strong>Submitted:</strong>{" "}
                  {new Date(quote.submittedAt).toLocaleString()}
                </div>

                <div className="mt-3 pt-3 border-top">
                  <div className="mb-2">
                    <strong>Order ID:</strong> {quote.orderId?.orderId}
                  </div>

                  <div>
                    Shipment Invoice:{" "}
                    {
                      quote.orderId?.shipments?.find(
                        (shipment) =>
                          shipment._id?.toString() ===
                          quote.shipmentId?.toString(),
                      )?.shipmentInvoiceId
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransporterMyQuotes;
