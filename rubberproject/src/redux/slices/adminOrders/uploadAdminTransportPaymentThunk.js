export const uploadAdminTransportPaymentThunk =
  ({ orderId, shipmentId, formData }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: "adminOrders/uploadAdminTransportPaymentPending",
      });

      const token = getState().auth.token;

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/admin/orders/${orderId}/shipment/${shipmentId}/transport-payment`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        },
      );

      /* =========================
         SAFE RESPONSE
      ========================= */

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.log("SERVER RESPONSE:", text);

        throw new Error("Server returned invalid response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload transporter payment");
      }

      dispatch({
        type: "adminOrders/uploadAdminTransportPaymentSuccess",

        payload: data,
      });
    } catch (error) {
      console.log("Upload Admin Transport Payment Error:", error);

      dispatch({
        type: "adminOrders/uploadAdminTransportPaymentFail",

        payload: error.message,
      });
    }
  };
