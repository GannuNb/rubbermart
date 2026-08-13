import cron from "node-cron";
import Order from "../models/orderModel.js";
import Product from "../models/Product.js";
import { sendBuyerPaymentReminderEmail } from "../utils/email/buyerPaymentReminderEmail.js";

export const startCancelExpiredOrdersCron = () => {
  console.log("Auto Cancel Orders Cron Started");

  // Runs every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    try {
      /* =====================================
          TIME CALCULATIONS
      ===================================== */

      const now = Date.now();

      // 24 hours after seller confirmation
      const reminderTime = new Date(
        now - 24 * 60 * 60 * 1000
      );

      // 48 hours after seller confirmation
      const expiryTime = new Date(
        now - 48 * 60 * 60 * 1000
      );

      /* =====================================
          FIND SELLER CONFIRMED ORDERS
      ===================================== */

      const orders = await Order.find({
        orderStatus: "seller_confirmed",
        sellerConfirmedAt: {
          $lte: reminderTime,
        },
        isDeleted: false,
      }).populate(
        "buyer",
        "fullName email"
      );

      /* =====================================
          PROCESS ORDERS
      ===================================== */

      for (const order of orders) {
        /* =====================================
            CHECK TOTAL BUYER PAYMENT
        ===================================== */

        const totalUploadedAmount =
          order.buyerPaymentReceipts.reduce(
            (total, receipt) =>
              total + Number(receipt.amount || 0),
            0
          );

        /* =====================================
            BUYER ALREADY FULLY PAID
        ===================================== */

        if (
          totalUploadedAmount >=
          Number(order.totalAmount)
        ) {
          continue;
        }

        /* =====================================
            24-HOUR PAYMENT REMINDER
        ===================================== */

        const sellerConfirmedAt =
          new Date(order.sellerConfirmedAt);

        const hoursSinceConfirmation =
          (now - sellerConfirmedAt.getTime()) /
          (1000 * 60 * 60);

        if (
          hoursSinceConfirmation >= 24 &&
          hoursSinceConfirmation < 48 &&
          !order.buyerPaymentReminderSentAt
        ) {
          try {
            if (
              order.buyer &&
              order.buyer.email
            ) {
              await sendBuyerPaymentReminderEmail({
                buyerEmail: order.buyer.email,

                buyerName:
                  order.buyer.fullName,

                orderId:
                  order.orderId,

                totalAmount:
                  Number(order.totalAmount),

                buyerPaidAmount:
                  totalUploadedAmount,

                buyerPendingAmount:
                  Math.max(
                    Number(order.totalAmount) -
                      totalUploadedAmount,
                    0
                  ),
              });

              /* =====================================
                  MARK REMINDER AS SENT
              ===================================== */

              order.buyerPaymentReminderSentAt =
                new Date();

              await order.save();

              console.log(
                `Payment reminder sent for Order: ${order.orderId}`
              );
            }
          } catch (emailError) {
            console.error(
              `Payment reminder email failed for Order ${order.orderId}:`,
              emailError
            );
          }
        }

        /* =====================================
            48-HOUR EXPIRY CHECK
        ===================================== */

        if (
          sellerConfirmedAt <= expiryTime
        ) {
          /* =====================================
              ADMIN APPROVED SELLER PACKING
          ===================================== */

          if (
            order.sellerPackingPermission === true
          ) {
            console.log(
              `Order ${order.orderId} not cancelled because admin approved seller packing.`
            );

            continue;
          }

          /* =====================================
              SHIPMENT ALREADY CREATED
          ===================================== */

          if (
            (order.shipments || []).length > 0
          ) {
            console.log(
              `Order ${order.orderId} not cancelled because shipment already exists.`
            );

            continue;
          }

          /* =====================================
              CANCEL ORDER
          ===================================== */

          order.orderStatus = "cancelled";

          order.cancelledAt = new Date();

          order.cancellationReason =
            "Buyer payment was not uploaded within 48 hours after seller confirmation.";

          await order.save();

          /* =====================================
              RESTORE PRODUCT STOCK
          ===================================== */

          for (const item of order.orderItems) {
            const product =
              await Product.findById(item.product);

            if (!product) continue;

            product.quantity += Number(
              item.requiredQuantity
            );

            if (product.quantity > 0) {
              product.stockStatus =
                "available";
            }

            await product.save();
          }

          console.log(
            `Cancelled Order: ${order.orderId}`
          );
        }
      }
    } catch (error) {
      console.error(
        "Auto Cancel Orders Cron Error:",
        error
      );
    }
  });
};