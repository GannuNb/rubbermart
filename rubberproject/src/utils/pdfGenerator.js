// src/utils/pdfGenerator.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export const numberToWords = (num) => {
  if (num === 0) return "Zero";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100)
      return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " and " + numToWords(n % 100) : "")
      );
    return "";
  };

  const units = ["Crore", "Lakh", "Thousand", ""];
  const divisors = [10000000, 100000, 1000, 1];
  let result = "";
  for (let i = 0; i < divisors.length; i++) {
    const quotient = Math.floor(num / divisors[i]);
    num %= divisors[i];
    if (quotient > 0) {
      result += numToWords(quotient) + " " + units[i] + " ";
    }
  }
  return result.trim() + " Rupees Only";
};

export const generatePDF = (
  baseItems,
  orderItems,
  profile,
  isSameAsBilling,
  shippingAddress,
  logo,
  seal,
  sellerid,
  selected_location
) => {
  const doc = new jsPDF();

  if (logo) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Rubberscrapmart", 6, 18);
  }

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const companyAddress = [
    "Rubberscrapmart",
    "Ground Floor, Office No-52/ Plot No-44,",
    "Sai Chamber CHS Wing A, Sector -11",
    "Sai Chambers, CBD Belapur, Navi Mumbai,",
    "Thane, Maharashtra, 400614",
    "GSTN : 27AAVFV4635R1ZY",
  ];

  let addressYy = 9;
  companyAddress.forEach((line, i) =>
    doc.text(line, 40, addressYy + 2 + i * 3)
  );

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PROFORMA INVOICE", 115, addressYy + 1, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 190, 20, {
    align: "right",
  });
  doc.line(10, 30, 200, 30);

  // 🧾 Bill To & Ship To sections
  doc.setFontSize(12);
  doc.text("Bill To", 14, 35);
  doc.text("Ship To", 133, 35);
  doc.line(10, 38, 200, 38);

  const labelX = 14;
  const colonX = labelX + 20;
  const valueX = colonX + 5;
  doc.setFontSize(10);

  doc.text("Company", labelX, 45);
  doc.text(":", colonX, 45);
  doc.text(profile.companyName || "N/A", valueX, 45);

  doc.text("Address", labelX, 50);
  doc.text(":", colonX, 50);
  const billingAddress = doc.splitTextToSize(profile.billAddress || "N/A", 60);
  billingAddress.forEach((line, i) => doc.text(line, valueX, 50 + i * 5));

  doc.text("Phone", labelX, 50 + billingAddress.length * 5);
  doc.text(":", colonX, 50 + billingAddress.length * 5);
  doc.text(profile.phoneNumber || "N/A", valueX, 50 + billingAddress.length * 5);

  doc.text("E-mail", labelX, 55 + billingAddress.length * 5);
  doc.text(":", colonX, 55 + billingAddress.length * 5);
  doc.text(profile.email || "N/A", valueX, 55 + billingAddress.length * 5);

  doc.text("GSTN", labelX, 60 + billingAddress.length * 5);
  doc.text(":", colonX, 60 + billingAddress.length * 5);
  doc.text(profile.gstNumber || "N/A", valueX, 60 + billingAddress.length * 5);

  const shipToColonX = labelX + 20;
  let finalShippingAddress = isSameAsBilling
    ? profile.billAddress
    : shippingAddress || "N/A";
  const wrappedShippingAddress = doc.splitTextToSize(finalShippingAddress, 60);

  doc.text("Company", labelX + 95, 45);
  doc.text(":", shipToColonX + 95, 45);
  doc.text(profile.companyName || "N/A", valueX + 95, 45);

  doc.text("Address", labelX + 95, 50);
  doc.text(":", shipToColonX + 95, 50);
  wrappedShippingAddress.forEach((line, i) =>
    doc.text(line, valueX + 95, 50 + i * 5)
  );

  const billingAddressHeight = 20 + billingAddress.length * 5;
  const shippingAddressHeight = 20 + wrappedShippingAddress.length * 5;
  const totalAddressHeight = Math.max(
    billingAddressHeight,
    shippingAddressHeight
  );

  // 🧾 Product Table
  let productsStartY = 50 + totalAddressHeight;
  doc.setFontSize(12);
  doc.text("Products", 14, productsStartY);
  doc.line(10, productsStartY + 3, 200, productsStartY + 3);

  const gstRate =
    profile.gstNumber && profile.gstNumber.startsWith("27")
      ? { SGST: 0.09, CGST: 0.09, IGST: 0 }
      : { SGST: 0, CGST: 0, IGST: 0.18 };

  const subtotal = [...baseItems, ...orderItems].reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );
  const gstSGST = subtotal * gstRate.SGST;
  const gstCGST = subtotal * gstRate.CGST;
  const gstIGST = subtotal * gstRate.IGST;
  const total = subtotal + gstSGST + gstCGST + gstIGST;

  const totalAmountInWords = numberToWords(total);

  const combinedItems = [
    ...baseItems,
    ...orderItems.map((item) => {
      const total = item.total || item.price * item.quantity;
      const gst = gstRate.SGST > 0 ? gstSGST : gstIGST;
      return {
        sellerid,
        name: item.name,
        price: item.price,
        hsn: item.hsn,
        quantity: item.quantity,
        loading_location: item.loading_location || selected_location,
        total,
        gst,
      };
    }),
  ];

  doc.autoTable({
    startY: productsStartY + 5,
    head: [
      [
        "SellerID",
        "Item Name",
        "Price/Ton",
        "Loading Location",
        "HSN",
        "Quantity",
        "Subtotal",
        "Total GST ",
        "Total",
      ],
    ],
    body: combinedItems.map((item) => {
      const gstAmount = item.total * 0.18;
      const totalWithGST = item.total + gstAmount;
      return [
        item.sellerid,
        item.name,
        `RS ${item.price.toFixed(2)}`,
        item.loading_location,
        item.hsn,
        `${item.quantity} tons`,
        `RS ${item.total.toFixed(2)}`,
        `RS ${gstAmount.toFixed(2)}`,
        `RS ${totalWithGST.toFixed(2)}`,
      ];
    }),
    theme: "striped",
    styles: { fontSize: 8 },
  });

  // 🧾 Totals Table
  const firstTableFinalY = doc.lastAutoTable.finalY + 5;
  const secondTableStartY = firstTableFinalY + 2;

  doc.autoTable({
    startY: secondTableStartY,
    head: [["Description", "Amount"]],
    body: [
      ["Taxable value", `RS ${subtotal.toFixed(2)}`],
      profile.gstNumber && profile.gstNumber.startsWith("27")
        ? [
            `Total GST (SGST & CGST)`,
            `RS ${gstSGST.toFixed(2)} + RS ${gstCGST.toFixed(2)}`,
          ]
        : [`Total GST (IGST)`, `RS ${gstIGST.toFixed(2)}`],
      ["Total", `RS ${total.toFixed(2)}`],
    ],
    theme: "grid",
    styles: { fontSize: 8 },
  });

  const totalAmountY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Amount (In Words): ${totalAmountInWords}`, 14, totalAmountY);
  doc.text(`Total Balance : Rs ${total.toFixed(2)}`, 14, totalAmountY + 8);

  // 💳 Banking Details
  const bankingY = totalAmountY + 18;
  doc.setFontSize(12);
  doc.text("Banking Details", 14, bankingY);
  doc.line(10, bankingY + 3, 200, bankingY + 3);
  doc.setFontSize(8);

  const bankingStartX = 14;
  const colonXForBanking = bankingStartX + 45;
  const details = [
    ["Bank Name", "IDFC FIRST BANK"],
    ["Account Name", "VIKAH RUBBERS"],
    ["Account Number", "10113716761"],
    ["IFSC CODE", "IDFB0040132"],
    ["Account Type", "CURRENT A/C"],
    ["Branch", "NERUL BRANCH"],
  ];

  details.forEach(([label, value], i) => {
    const y = bankingY + 10 + i * 5;
    doc.text(label, bankingStartX, y);
    doc.text(":", colonXForBanking, y);
    doc.text(value, bankingStartX + 60, y);
  });

  // ⚙️ Terms
  const termsY = bankingY + 45;
  doc.setFont("helvetica", "bold");
  doc.text("Terms and Conditions:", 14, termsY);
  doc.line(10, termsY + 3, 200, termsY + 3);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const terms = [
    "1. The Seller shall not be liable to the Buyer for any loss or damage.",
    "2. The Seller warrants the product for one (1) year from the date of shipment.",
    "3. The purchase order will be interpreted as acceptance of this offer.",
  ];
  let yOffset = termsY + 10;
  terms.forEach((t) => {
    doc.text(t, 14, yOffset);
    yOffset += 5;
  });

  // 🪟 Seal
  if (seal) doc.addImage(seal, "PNG", 100, yOffset - 10, 80, 80);

  return doc.output("blob");
};
