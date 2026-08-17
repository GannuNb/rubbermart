import axios from "axios";

export const downloadTransporterPaymentHistoryPdfThunk =
  () => async (dispatch, getState) => {
    try {
      const token = getState().auth.token;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/transporter/payment-history/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        },
      );

      const fileURL =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = fileURL;

      link.download =
        "transporter-payment-history.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(fileURL);
      }, 1000);

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Download Transporter Payment History PDF Error:",
        error,
      );

      throw error;
    }
  };