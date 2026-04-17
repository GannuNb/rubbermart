import { invoiceColors } from "../styles.js";

const { primaryPurple, darkText } = invoiceColors;

export const drawCustomerSection = (doc, order) => {
  const customerY = 242;

  doc.rect(72, 200, 120, 24).fill(primaryPurple);
  doc.fillColor("#fff").font("Helvetica-Bold").fontSize(9).text("Customer", 105, 208);

  doc.rect(375, 200, 120, 24).fill(primaryPurple);
  doc.fillColor("#fff").text("Ship To", 415, 208);

  const buyerCompany = order.buyer?.businessProfile?.companyName || "-";
  const buyerPhone =
    order.buyer?.businessProfile?.phoneNumber ||
    order.shippingAddress?.mobileNumber ||
    "-";

  const buyerEmail = order.buyer?.email || "-";

  const buyerGst =
    order.buyer?.businessProfile?.gstNumber ||
    order.buyerGstNumber ||
    "-";

  const customerAddress =
    order.buyer?.businessProfile?.billingAddress || "-";

  const shipToAddress =
    order.shippingAddress?.fullAddress ||
    [
      order.shippingAddress?.flatHouse,
      order.shippingAddress?.areaStreet,
      order.shippingAddress?.landmark,
      order.shippingAddress?.city,
      order.shippingAddress?.state,
      order.shippingAddress?.pincode,
    ]
      .filter(Boolean)
      .join(", ") ||
    "-";

  doc
    .fillColor(darkText)
    .fontSize(8)

    .text("Name", 72, customerY)
    .text(order.buyer?.fullName || "-", 145, customerY)

    .text("Company", 72, customerY + 20)
    .text(buyerCompany, 145, customerY + 20)

    .text("Address", 72, customerY + 40)
    .text(customerAddress, 145, customerY + 40, { width: 150 })

    .text("Phone", 72, customerY + 90)
    .text(buyerPhone, 145, customerY + 90)

    .text("E-mail", 72, customerY + 110)
    .text(buyerEmail, 145, customerY + 110)

    .text("GSTN", 72, customerY + 130)
    .text(buyerGst, 145, customerY + 130);

  doc
    .text("Name", 382, customerY)
    .text(order.shippingAddress?.fullName || "-", 455, customerY)

    .text("Address", 382, customerY + 40)
    .text(shipToAddress, 455, customerY + 40, { width: 95 });
};