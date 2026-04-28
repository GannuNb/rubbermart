// backend/routes/testInvoiceRoute.js

import express from "express";
import generateInvoicePdf from "../utils/pdf/generateInvoicePdf.js";

const router = express.Router();

/* =========================================================
   NUMBER TO WORDS FUNCTION
========================================================= */

const ones = [
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

const tens = [
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

const convertTwoDigits = (num) => {
  if (num < 20) return ones[num];

  return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();
};

const convertThreeDigits = (num) => {
  let word = "";

  if (num > 99) {
    word += `${ones[Math.floor(num / 100)]} Hundred `;
    num %= 100;
  }

  if (num > 0) {
    word += convertTwoDigits(num);
  }

  return word.trim();
};

const convertNumberToWords = (num) => {
  if (!num || num === 0) return "Zero Rupees Only";

  num = Math.floor(num);

  let words = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundred = num;

  if (crore) words += `${convertThreeDigits(crore)} Crore `;
  if (lakh) words += `${convertThreeDigits(lakh)} Lakh `;
  if (thousand) words += `${convertThreeDigits(thousand)} Thousand `;
  if (hundred) words += `${convertThreeDigits(hundred)} `;

  return `${words.trim()} Rupees Only`;
};



/* =========================================================
   IGST TEST INVOICE
========================================================= */

router.get("/test-invoice-igst", async (req, res) => {
  try {
    const orderItems = [
      {
        application: "Baled Tyres PCR",
        requiredQuantity: 20,
        pricePerMT: 1000,
      },
      {
        application: "Rubber Crumb Steel",
        requiredQuantity: 10,
        pricePerMT: 600,
      },
    ];

    const calculatedItems = orderItems.map((item) => {
      const subtotal =
        Number(item.requiredQuantity) * Number(item.pricePerMT);

      const igst = subtotal * 0.18;

      const itemTotal = subtotal + igst;

      return {
        ...item,
        subtotal,
        gstAmount: igst,
        itemTotal,
      };
    });

    const taxableAmount = calculatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const igstAmount = calculatedItems.reduce(
      (sum, item) => sum + item.gstAmount,
      0
    );

    const gstAmount = igstAmount;
    const totalAmount = taxableAmount + gstAmount;

    const fakeOrder = {
      orderId: "RSM-IGST-01",
      createdAt: new Date(),

      buyer: {
        fullName: "Ganesh Kumar",
        email: "ganesh@example.com",

        businessProfile: {
          companyName: "Ganesh Industries Pvt Ltd",
          phoneNumber: "9876543210",
          email: "accounts@ganeshindustries.com",
          gstNumber: "36ABCDE1234F1Z5",

          billingAddress:
            "Office No 101, Ganesh Business Park, Madhapur, Hyderabad, Telangana - 500081",

          shippingAddress:
            "Warehouse No 5, Industrial Estate, Hyderabad, Telangana - 500072",
        },
      },

      shippingAddress: {
        fullName: "Ganesh Kumar",
        mobileNumber: "9876543210",
        flatHouse: "Plot No 21",
        areaStreet: "Industrial Area",
        landmark: "Near Main Road",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",

        fullAddress:
          "Plot No 21, Industrial Area, Near Main Road, Hyderabad, Telangana - 500001",
      },

      buyerGstNumber: "36ABCDE1234F1Z5",

      gstType: "igst",

      taxableAmount,
      igstAmount,
      cgstAmount: 0,
      sgstAmount: 0,
      gstAmount,
      totalAmount,

      amountInWords: convertNumberToWords(totalAmount),

      orderItems: calculatedItems,
    };

    const pdfBuffer = await generateInvoicePdf(fakeOrder);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=test-invoice-igst.pdf",
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.log("IGST Test Invoice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate IGST invoice",
      error: error.message,
    });
  }
});



/* =========================================================
   CGST + SGST TEST INVOICE
========================================================= */

router.get("/test-invoice-cgst-sgst", async (req, res) => {
  try {
    const orderItems = [
      {
        application: "Baled Tyres PCR",
        requiredQuantity: 22,
        pricePerMT: 1000,
      },
      {
        application: "Rubber Crumb Steel",
        requiredQuantity: 15,
        pricePerMT: 600,
      },
    ];

    const calculatedItems = orderItems.map((item) => {
      const subtotal =
        Number(item.requiredQuantity) * Number(item.pricePerMT);

      const cgst = subtotal * 0.09;
      const sgst = subtotal * 0.09;

      const gstAmount = cgst + sgst;
      const itemTotal = subtotal + gstAmount;

      return {
        ...item,
        subtotal,
        gstAmount,
        itemTotal,
      };
    });

    const taxableAmount = calculatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const cgstAmount = taxableAmount * 0.09;
    const sgstAmount = taxableAmount * 0.09;

    const gstAmount = cgstAmount + sgstAmount;
    const totalAmount = taxableAmount + gstAmount;

    const fakeOrder = {
      orderId: "RSM-CGST-01",
      createdAt: new Date(),

      buyer: {
        fullName: "Ganesh Kumar",
        email: "ganesh@example.com",

        businessProfile: {
          companyName: "Ganesh Industries Pvt Ltd",
          phoneNumber: "9876543210",
          email: "accounts@ganeshindustries.com",
          gstNumber: "36ABCDE1234F1Z5",

          billingAddress:
            "Office No 101, Ganesh Business Park, Madhapur, Hyderabad, Telangana - 500081",

          shippingAddress:
            "Warehouse No 5, Industrial Estate, Hyderabad, Telangana - 500072",
        },
      },

      shippingAddress: {
        fullName: "Ganesh Kumar",
        mobileNumber: "9876543210",
        flatHouse: "Plot No 21",
        areaStreet: "Industrial Area",
        landmark: "Near Main Road",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",

        fullAddress:
          "Plot No 21, Industrial Area, Near Main Road, Hyderabad, Telangana - 500001",
      },

      buyerGstNumber: "36ABCDE1234F1Z5",

      gstType: "cgst_sgst",

      taxableAmount,
      igstAmount: 0,
      cgstAmount,
      sgstAmount,
      gstAmount,
      totalAmount,

      amountInWords: convertNumberToWords(totalAmount),

      orderItems: calculatedItems,
    };

    const pdfBuffer = await generateInvoicePdf(fakeOrder);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        "inline; filename=test-invoice-cgst-sgst.pdf",
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.log("CGST+SGST Test Invoice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate CGST+SGST invoice",
      error: error.message,
    });
  }
});

export default router;