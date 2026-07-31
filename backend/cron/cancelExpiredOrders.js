import cron from "node-cron";
import Order from "../models/orderModel.js";
import Product from "../models/Product.js";

export const startCancelExpiredOrdersCron = () => {
  console.log("Auto Cancel Orders Cron Started");

  // Runs every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    try {
      /* =====================================
          FIND ORDERS OLDER THAN 48 HOURS
         ===================================== */

      const expiryTime = new Date(Date.now() - 48 * 60 * 60 * 1000);
      

      const expiredOrders = await Order.find({
        orderStatus: "seller_confirmed",
        sellerConfirmedAt: {
          $lte: expiryTime,
        },
        isDeleted: false,
      });

      /* =====================================
          CANCEL EXPIRED ORDERS
         ===================================== */

      for (const order of expiredOrders) {
        /*  =====================================
             CHECK TOTAL UPLOADED BUYER PAYMENT
            ===================================== */

        const totalUploadedAmount = order.buyerPaymentReceipts.reduce(
          (total, receipt) => total + Number(receipt.amount || 0),
          0,
        );

        /* =====================================
             BUYER ALREADY UPLOADED FULL PAYMENT
           ===================================== */

        if (totalUploadedAmount >= Number(order.totalAmount)) {
          continue;
        }
        /* =====================================
              SHIPMENT ALREADY CREATED
          ===================================== */

          if ((order.shipments || []).length > 0) {
            continue;
          }
        order.orderStatus = "cancelled";
        order.cancelledAt = new Date();
        order.cancellationReason =
          "Buyer payment was not uploaded within 48 hours after seller confirmation.";

        await order.save();

        /* =====================================
            RESTORE PRODUCT STOCK
        ===================================== */

        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);

          if (!product) continue;

          product.quantity += Number(item.requiredQuantity);

          if (product.quantity > 0) {
            product.stockStatus = "available";
          }

          await product.save();
        }

        console.log(`Cancelled Order: ${order.orderId}`);
      }
    } catch (error) {
      console.error("Auto Cancel Orders Cron Error:", error);
    }
  });
};
