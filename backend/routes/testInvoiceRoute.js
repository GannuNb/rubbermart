import express from "express";
import generateInvoicePdf from "../utils/pdf/generateInvoicePdf.js";

const router = express.Router();

router.get("/test-invoice", async (req, res) => {
  try {
    const fakeOrder = {
      orderId: "RSM-28-36-01",
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
            "Office No 101, Ganesh Businessyfhygfuygyi Park, Madhapyfhygfuygyi Park, Madhapur, Hyderabad, Telangana - 500081",
          shippingAddress:
            "Warehouse No 5, Industrial Estate, Hyderabad, Telangana - 500072",
        },
      },

      shippingAddress: {
        fullName: "Ganesh Kumar",
        mobileNumber: "9876543210",
        flatHouse: "Plot Noyvuyvuyvuyvuyvyuvuyvuyvuyvuyvuyvyuvuyvuyvuyvuyvuyvyuvuyvuyvuyvuyvuyvyuvuyvuyvuyvuyvuyvyuvuyvuyvuyvuyvuyvyuvuyvuyvuyvuyvuyvyuvuyvuyvuyvuy 21",
        areaStreet: "Industrial Area",
        landmark: "Near Main Road",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        fullAddress:
          "Plot No 21, Industrial Area,yvuyvuvu Near Main Road, Hyderabad, Telangana - 500001  ",
      },

      buyerGstNumber: "36ABCDE1234F1Z5",

      gstType: "igst",

      taxableAmount: 29200,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 5256,
      gstAmount: 5256,
      totalAmount: 34456,

      amountInWords:
        "Thirty Four Thousand Four Hundreddd Fifty Six Rupees Only",

      orderItems: [
        {
          application: "Baled Tyres PCR",
          requiredQuantity: 22,
          pricePerMT: 1000,
          subtotal: 22000,
          gstAmount: 3960,
        },
        {
          application: "Rubber Crumb Steel",
          requiredQuantity: 12,
          pricePerMT: 600,
          subtotal: 7200,
          gstAmount: 1296,
        },
      ],
    };

    const pdfBuffer = await generateInvoicePdf(fakeOrder);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=test-invoice.pdf",
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.log("Test Invoice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate test invoice",
      error: error.message,
    });
  }
});

export default router;