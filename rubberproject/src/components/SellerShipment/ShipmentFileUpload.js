import React from "react";

import styles from "../../styles/Seller/SellerShipmentForm.module.css";

const ShipmentFileUpload = ({
  packedItemPhotoRef,

  weightTicketRef,

  handleChange,
}) => {
  return (
    <>
      {/* PACKED ITEM PHOTO */}

      <div className={styles.field}>
        <label>Upload Packed Item Photo</label>

        <input
          ref={packedItemPhotoRef}
          type="file"
          name="packedItemPhoto"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
        />
      </div>

      {/* WEIGHT TICKET */}

      <div className={styles.field}>
        <label>Upload Weight Ticket</label>

        <input
          ref={weightTicketRef}
          type="file"
          name="weightTicket"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default ShipmentFileUpload;
