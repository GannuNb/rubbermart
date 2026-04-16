// utils/generateOrderId.js

import Order from "../models/orderModel.js";

const generateOrderId = async () => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const shortCurrentYear = currentYear.toString().slice(-2);
  const shortNextYear = (currentYear + 1).toString().slice(-2);

  const financialYearCode = `${shortCurrentYear}_${shortNextYear}`;

  const totalOrders = await Order.countDocuments();

  const nextOrderNumber = totalOrders + 1;

  const formattedOrderNumber = String(nextOrderNumber).padStart(2, "0");

  const orderId = `RSM_${financialYearCode}_${formattedOrderNumber}`;

  return orderId;
};

export default generateOrderId;