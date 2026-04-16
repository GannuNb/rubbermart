// backend/utils/generateOrderId.js

import Order from "../models/orderModel.js";

const generateOrderId = async () => {
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

  const existingOrdersCount = await Order.countDocuments({
    orderId: {
      $regex: `^RSM_${financialYearCode}_`,
    },
  });

  const nextOrderNumber = existingOrdersCount + 1;

  const formattedOrderNumber = String(nextOrderNumber).padStart(2, "0");

  const orderId = `RSM_${financialYearCode}_${formattedOrderNumber}`;

  return orderId;
};

export default generateOrderId;