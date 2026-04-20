import { invoiceColors } from "../styles.js";
const { primaryPurple, darkText } = invoiceColors;

export const drawCustomerSection = (doc, order, startY) => {
  let currentY = startY;
  const startX = 35;
  const col1Width = 100;
  const col2Width = 212;
  const col3Width = 213;
  const tableWidth = col1Width + col2Width + col3Width;
  const headerHeight = 25;

  // 1. Header Backgrounds
  doc.rect(startX, currentY, col1Width, headerHeight).fill("#F2F2F7");
  doc.rect(startX + col1Width, currentY, col2Width, headerHeight).fill(primaryPurple);
  doc.rect(startX + col1Width + col2Width, currentY, col3Width, headerHeight).fill(primaryPurple);

  // 2. Header Text
  doc.fillColor(darkText).font("Helvetica-Bold").fontSize(10);
  doc.text("Details", startX, currentY + 8, { width: col1Width, align: "center" });
  doc.fillColor("#ffffff").text("Customer", startX + col1Width, currentY + 8, { width: col2Width, align: "center" });
  doc.text("Ship To", startX + col1Width + col2Width, currentY + 8, { width: col3Width, align: "center" });

  currentY += headerHeight;

  // 3. Data Rows
  const labels = ["Name", "Company", "Address", "Phone", "E-mail", "GSTN"];
  const buyerData = [
    order.buyer?.fullName || "-",
    order.buyer?.businessProfile?.companyName || "-",
    order.buyer?.businessProfile?.billingAddress || "-",
    order.buyer?.businessProfile?.phoneNumber || "-",
    order.buyer?.businessProfile?.email || "-",
    order.buyer?.businessProfile?.gstNumber || "-"
  ];
  
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
  order.buyer?.businessProfile?.shippingAddress ||
  order.buyer?.businessProfile?.billingAddress ||
  "-";

  const shipData = [
    order.shippingAddress?.fullName || "-",
    order.buyer?.businessProfile?.companyName || "-",
    shipToAddress,
    order.shippingAddress?.mobileNumber || "-",
    order.buyer?.email || "-",
    order.buyer?.businessProfile?.gstNumber || "-"
  ];

  doc.lineWidth(0.5).strokeColor("#444444");

  labels.forEach((label, i) => {
    const rowStartY = currentY;
    doc.font("Helvetica").fontSize(8);
    
    // Calculate Height
    const h2 = doc.heightOfString(buyerData[i], { width: col2Width - 20 });
    const h3 = doc.heightOfString(shipData[i], { width: col3Width - 20 });
    const dynamicRowHeight = Math.max(h2, h3, 15) + 10; 

    // Draw row lines
    doc.moveTo(startX, rowStartY).lineTo(startX + tableWidth, rowStartY).stroke();
    doc.rect(startX, rowStartY, col1Width, dynamicRowHeight).stroke();
    doc.rect(startX + col1Width, rowStartY, col2Width, dynamicRowHeight).stroke();
    doc.rect(startX + col1Width + col2Width, rowStartY, col3Width, dynamicRowHeight).stroke();

    // Text
    doc.fillColor(darkText).font("Helvetica-Bold").fontSize(9).text(label, startX + 10, rowStartY + 7);
    doc.font("Helvetica").fontSize(8);
    doc.text(buyerData[i], startX + col1Width + 10, rowStartY + 7, { width: col2Width - 20 });
    doc.text(shipData[i], startX + col1Width + col2Width + 10, rowStartY + 7, { width: col3Width - 20 });

    currentY += dynamicRowHeight;
  });

  return currentY + 15; // Return ending Y + some gap
};