import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getPendingAssignmentsThunk } from "../../redux/slices/transporter/getPendingAssignmentsThunk";

import { acceptAssignmentThunk } from "../../redux/slices/transporter/acceptAssignmentThunk";

import { rejectAssignmentThunk } from "../../redux/slices/transporter/rejectAssignmentThunk";

function TransporterPendingAssignments() {
  const dispatch = useDispatch();

  const {
    pendingAssignments,

    pendingAssignmentsLoading,

    pendingAssignmentsError,

    assignmentActionLoading,

    assignmentActionError,
  } = useSelector((state) => state.transporter);

  /* =========================
     FETCH ASSIGNMENTS
  ========================= */

  useEffect(() => {
    dispatch(getPendingAssignmentsThunk());
  }, [dispatch]);

  /* =========================
     ACCEPT
  ========================= */

  const handleAccept = (item) => {
    dispatch(
      acceptAssignmentThunk({
        orderId: item.orderId,

        shipmentId: item.shipment._id,
      }),
    );
  };

  /* =========================
     REJECT
  ========================= */

  const handleReject = (item) => {
    dispatch(
      rejectAssignmentThunk({
        orderId: item.orderId,

        shipmentId: item.shipment._id,
      }),
    );
  };

  return (
    <div className="container py-4">
      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-4">
        <h2 className="fw-bold">Pending Assignment Requests</h2>

        <p className="text-muted">Accept or reject admin assigned shipments.</p>
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {pendingAssignmentsLoading && (
        <div className="alert alert-info">Loading assignments...</div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {pendingAssignmentsError && (
        <div className="alert alert-danger">{pendingAssignmentsError}</div>
      )}

      {/* =========================
          ACTION ERROR
      ========================= */}

      {assignmentActionError && (
        <div className="alert alert-danger">{assignmentActionError}</div>
      )}

      {/* =========================
          EMPTY
      ========================= */}

      {!pendingAssignmentsLoading && pendingAssignments.length === 0 && (
        <div className="alert alert-secondary">
          No pending assignment requests
        </div>
      )}

      {/* =========================
          ASSIGNMENT LIST
      ========================= */}

      <div className="row g-4">
        {pendingAssignments.map((item) => (
          <div key={item.shipment?._id} className="col-lg-6">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                {/* =========================
                      TOP
                  ========================= */}

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">
                      {item.shipment?.shipmentInvoiceId}
                    </h5>

                    <small className="text-muted">
                      Order: {item.orderInvoiceId}
                    </small>
                  </div>

                  <span className="badge bg-warning text-dark">Pending</span>
                </div>

                {/* =========================
                      DETAILS
                  ========================= */}

                <div className="mb-2">
                  <strong>Item:</strong> {item.shipment?.selectedItem}
                </div>

                <div className="mb-2">
                  <strong>Quantity:</strong> {item.shipment?.shippedQuantity} MT
                </div>

                <div className="mb-2">
                  <strong>From:</strong> {item.shipment?.shipmentFrom}
                </div>

                <div className="mb-4">
                  <strong>To:</strong> {item.shipment?.shipmentTo}
                </div>

                {/* =========================
                      ACTION BUTTONS
                  ========================= */}

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success flex-grow-1"
                    onClick={() => handleAccept(item)}
                    disabled={assignmentActionLoading}
                  >
                    {assignmentActionLoading ? "Processing..." : "Accept"}
                  </button>

                  <button
                    className="btn btn-danger flex-grow-1"
                    onClick={() => handleReject(item)}
                    disabled={assignmentActionLoading}
                  >
                    {assignmentActionLoading ? "Processing..." : "Reject"}
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

export default TransporterPendingAssignments;
