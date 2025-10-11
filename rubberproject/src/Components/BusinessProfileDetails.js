import React, { useState } from "react";

const BusinessProfileDetails = ({ profile, shippingAddress, setShippingAddress }) => {
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setIsSameAsBilling(!isSameAsBilling);
    if (!isSameAsBilling) {
      setShippingAddress(profile?.billAddress || ""); // Copy billing address to shipping
    } else {
      setShippingAddress(""); // Clear if unchecked
    }
  };

  // Handle manual shipping address input
  const handleShippingAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };

  return (
    <div className="row mb-4">
      {/* Left Column: Business Profile Details */}
      <div className="col-md-6">
        <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
          <strong>Company Name:</strong> {profile?.companyName || "N/A"}
        </p>
        <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
          <strong>Billing Address:</strong> {profile?.billAddress || "N/A"}
        </p>
        <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
          <strong>Phone:</strong> {profile?.phoneNumber || "N/A"}
        </p>
        <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
          <strong>E-Mail:</strong> {profile?.email || "N/A"}
        </p>
        <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
          <strong>GSTN:</strong> {profile?.gstNumber || "N/A"}
        </p>
      </div>

      {/* Right Column: Shipping Details */}
      <div className="col-md-6">
        <h5 className="mb-3 fs-5 fw-bold">Shipping Details</h5>

        {/* Same as Billing Checkbox */}
        <div className="mb-3 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            id="sameAsBilling"
            checked={isSameAsBilling}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="sameAsBilling" className="form-label mb-0">
            Same as Billing Address
          </label>
        </div>

        {/* Shipping Address Input */}
        <div className="mb-3">
          <textarea
            id="shippingAddress"
            className="form-control"
            rows="4"
            value={shippingAddress}
            onChange={handleShippingAddressChange}
            placeholder="Enter Shipping Address"
            disabled={isSameAsBilling}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileDetails;
