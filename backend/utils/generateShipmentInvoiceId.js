import Order from "../models/orderModel.js";

const generateShipmentInvoiceId = async () => {
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  let financialStartYear;
  let financialEndYear;

  if (currentMonth >= 4) {
    financialStartYear = currentYear;
    financialEndYear = currentYear + 1;
  } else {
    financialStartYear = currentYear - 1;
    financialEndYear = currentYear;
  }

  const shortStartYear = financialStartYear.toString().slice(-2);
  const shortEndYear = financialEndYear.toString().slice(-2);

  const financialYearCode = `${shortStartYear}_${shortEndYear}`;

  const orders = await Order.find({
    "shipments.shipmentInvoiceId": {
      $exists: true,
    },
  }).select("shipments.shipmentInvoiceId");

  let shipmentCount = 0;

  orders.forEach((order) => {
    order.shipments.forEach((shipment) => {
      if (
        shipment.shipmentInvoiceId &&
        shipment.shipmentInvoiceId.startsWith(
          `RSMI_${financialYearCode}_`
        )
      ) {
        shipmentCount++;
      }
    });
  });

  const nextShipmentNumber = shipmentCount + 1;

  const formattedShipmentNumber = String(
    nextShipmentNumber
  ).padStart(2, "0");

  const shipmentInvoiceId = `RSMI_${financialYearCode}_${formattedShipmentNumber}`;

  return shipmentInvoiceId;
};

export default generateShipmentInvoiceId;