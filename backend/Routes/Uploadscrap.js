// routes/uploadscrap.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose"); // Needed for transactions
const Uploadscrap = require("../models/Uploadscrap");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");
const ScrapItem = require("../models/ScrapItem"); // Adjust the path based on your project structure
const Approval = require("../models/Approval");


// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage(); // Use memory storage for uploaded files
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept image files
    } else {
      cb(new Error('Not an image! Please upload an image file.'), false);
    }
  }
});

router.post(
  "/uploadscrap",
  upload.array("images", 3), // This middleware processes the file uploads with memory storage
  [
    authenticateToken,
    body("material")
      .isIn(["Tyre scrap", "pyro oil", "Tyre steel scrap"])
      .withMessage("Invalid material type"),
    body("application").notEmpty().withMessage("Application is required"),
    body("quantity")
      .isFloat({ gt: 0 })
      .withMessage("Quantity must be a positive number"),
    body("companyName").notEmpty().withMessage("Company Name is required"),
    body("phoneNumber").notEmpty().withMessage("Phone Number is required"),
    body("email").isEmail().withMessage("Valid Email is required"),
    body("loadingLocation")
      .isIn(["Ex_Chennai", "Ex_Mundra", "Ex_Nhavasheva"])
      .withMessage("Invalid loading location"),
    body("countryOfOrigin")
      .notEmpty()
      .withMessage("Country of Origin is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    body("description").optional().isString().withMessage("Description must be a string"),
  ],
  async (req, res) => {
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Validation Errors:", errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      material,
      application,
      quantity,
      companyName,
      phoneNumber,
      email,
      loadingLocation,
      countryOfOrigin,
      price,
      description, // Add description field from body
    } = req.body;

    // Ensure that files are stored as buffers in memory, not saved to disk
    if (!req.files || req.files.length === 0) {
      console.error("No images uploaded.");
      return res
        .status(400)
        .json({
          success: false,
          message: "No images uploaded. Please upload up to 3 images.",
        });
    }

    // Create an array of buffers for images to store directly in MongoDB
    const images = await Promise.all(
      req.files.map((file) => {
        return {
          data: file.buffer, // Store the file content as a buffer
          contentType: file.mimetype, // Store the file's mimetype (e.g., 'image/jpeg')
        };
      })
    );

    try {
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });

      // Save the scrap details, including the description and images as binary data
      const newScrap = new Uploadscrap({
        user: req.user.id,
        material,
        application,
        quantity,
        companyName,
        phoneNumber,
        email,
        loadingLocation,
        countryOfOrigin,
        price,
        description, // Save description
        images, // Save images as binary buffers in MongoDB
      });

      await newScrap.save();

      console.log("Scrap saved successfully:", newScrap);
      res.status(201).json({
        success: true,
        message: "Scrap details uploaded successfully.",
        scrap: newScrap,
      });
    } catch (error) {
      console.error("Error uploading scrap details:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);





// Updated Route to Fetch Scrap Items (Including Images in Base64 Format)
router.get("/getuploadedscrap", async (req, res) => {
  try {
    const uploadedScrapItems = await Uploadscrap.find().populate(
      "user",
      "_id name"
    );

    if (!uploadedScrapItems.length) {
      return res.status(404).json({ message: "No uploaded scrap items found" });
    }

    // Fetch images in base64 format
    const scrapItemsWithImages = await Promise.all(
      uploadedScrapItems.map(async (scrap) => {
        const imagesBase64 = await Promise.all(
          scrap.images.map(async (image) => {
            const base64Image = image.data.toString("base64");
            return `data:${image.contentType};base64,${base64Image}`;
          })
        );
        return { ...scrap.toObject(), imagesBase64 };
      })
    );

    res.json({ uploadedScrapItems: scrapItemsWithImages });
  } catch (err) {
    console.error("Error fetching uploaded scrap items:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//       rejectUnauthorized: false, // This allows the use of self-signed certificates
//     },
//   });


// Configure the transporter with Hostinger's SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587, // Use port 465 if using SSL
  secure: false, // Use true for SSL (465), false for TLS (587)
  auth: {
    user: process.env.EMAIL_USER, // Full email address
    pass: process.env.EMAIL_PASS, // Email password
  },
  tls: {
    rejectUnauthorized: false, // To handle self-signed certificates if needed
  },
});

// Send test email to verify setup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Server Error:', error);
  } else {
    console.log('SMTP Server is ready to take messages');
  }
});

  

  
router.post("/approveScrap/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const uploadedScrap = await Uploadscrap.findById(req.params.id).session(session);
    if (!uploadedScrap) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Scrap item not found" });
    }

    const {
      material,
      application,
      quantity,
      email,
      companyName,
      price,
      loadingLocation,
      countryOfOrigin,
      description,
      images,
    } = uploadedScrap;

    if (!images || images.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No images provided in uploaded scrap." });
    }

    // Process images from Buffer to base64
    const imageBuffers = images
      .map((image) => {
        if (image.data) {
          const base64Image = image.data.toString("base64");
          return {
            contentType: image.contentType,
            data: Buffer.from(base64Image, "base64"),
          };
        }
        return null;
      })
      .filter((image) => image !== null);

    if (imageBuffers.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No valid images found in uploaded scrap." });
    }

    // Check if an approval with the same material, application, price, loadingLocation, countryOfOrigin, companyName, and email already exists
    const existingApproval = await Approval.findOne({
      material,
      application,
      price,
      loadingLocation,
      countryOfOrigin,
      companyName,
      email,
    }).session(session);

    let approval;

    if (existingApproval) {
      // If an approval exists, just update the quantity
      existingApproval.quantity += quantity;
      await existingApproval.save({ session });

      // Remove the approved scrap item from Uploadscrap collection
      await Uploadscrap.findByIdAndDelete(req.params.id).session(session);

      approval = existingApproval;
    } else {
      // If no existing approval, create a new approval record
      approval = new Approval({
        scrapItem: uploadedScrap._id,
        postedBy: uploadedScrap.user,
        material,
        application,
        quantity,
        companyName,
        email,
        price,
        loadingLocation,
        countryOfOrigin,
        description,
        images: imageBuffers,
      });

      await approval.save({ session });

      // Remove approved scrap item from Uploadscrap collection
      await Uploadscrap.findByIdAndDelete(req.params.id).session(session);
    }

    // Commit the transaction only after success
    await session.commitTransaction();
    session.endSession();

    // Send approval email to the user
    const mailOptions = {
      from: `"Rubberscrapmart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Scrap Approval Confirmation",
      html: `
        <h1>Scrap Item Approved</h1>
        <p>Dear ${companyName},</p>
        <p>Your scrap item with the following details has been successfully approved:</p>
        <ul>
          <li><strong>Material:</strong> ${material}</li>
          <li><strong>Application:</strong> ${application}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Price:</strong> ${price}</li>
          <li><strong>Loading Location:</strong> ${loadingLocation}</li>
          <li><strong>Country of Origin:</strong> ${countryOfOrigin}</li>
        </ul>
        <p>Thank you for your submission!</p>
        <p>Best regards,<br/>Your Scrap Approval Team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending approval email:", error);
      } else {
        console.log("Approval confirmation email sent:", info.response);
      }
    });

    // Now, match the application's selected products and notify users
    const users = await User.find({ "businessProfiles.selectedProducts": application });

    users.forEach(user => {
      user.businessProfiles.forEach(profile => {
        if (profile.selectedProducts.includes(application)) {
          // Send email to the user about the new scrap item
          const notificationMailOptions = {
            from: `"Rubberscrapmart" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "New Scrap Item Application Match",
            html: `
              <h1>New Scrap Item Application</h1>
              <p>Dear ${user.name},</p>
              <p>A new scrap item with the following details has been approved and matches your selected product:</p>
              <ul>
                <li><strong>Material:</strong> ${material}</li>
                <li><strong>Application:</strong> ${application}</li>
                <li><strong>Quantity:</strong> ${quantity}</li>
                <li><strong>Price:</strong> ${price}</li>
                <li><strong>Loading Location:</strong> ${loadingLocation}</li>
                <li><strong>Country of Origin:</strong> ${countryOfOrigin}</li>
              </ul>
              <p>Thank you for using Rubberscrapmart!</p>
              <p>Best regards,<br/>Your Scrap Approval Team</p>
            `,
          };

          transporter.sendMail(notificationMailOptions, (error, info) => {
            if (error) {
              console.error("Error sending notification email:", error);
            } else {
              console.log("Notification email sent to user:", info.response);
            }
          });
        }
      });
    });

    return res.status(200).json({
      message: "Scrap approved, images saved, and notification sent to users.",
      approvedScrap: approval,
    });
  } catch (error) {
    // Abort the transaction and end the session in case of error
    await session.abortTransaction();
    session.endSession();
    console.error("Error approving scrap item:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

  



router.post("/denyScrap/:id", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const uploadedScrap = await Uploadscrap.findById(req.params.id).session(session);
      if (!uploadedScrap) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: "Scrap item not found" });
      }
  
      const { material, application, quantity, email, companyName } = uploadedScrap;
  
      // Remove the scrap item from the Uploadscrap collection
      await Uploadscrap.findByIdAndDelete(req.params.id).session(session);
  
      // Prepare denial email details
      const scrapDetailsHtml = `
        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Material</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Application</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f4f4f4;">Quantity</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${material}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${application}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${quantity}</td>
          </tr>
        </table>
      `;
  
      // Send denial email
      const mailOptions = {
        from: '"Rubberscrapmart" <' + process.env.ADMIN_EMAIL + '>', 
        to: email,
        subject: "Scrap Product Denial Notification – Rubberscrapmart",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #e53935;">Scrap Product Denial Notification</h2>
            <p>Dear ${companyName || "Customer"},</p>
            <p>We regret to inform you that your scrap submission has been denied by our admin team.</p>
            <p>Below are the details of your denied scrap:</p>
            ${scrapDetailsHtml}
            <p>If you have any questions or need further clarification, feel free to contact us.</p>
            <p style="margin-top: 20px;">Best regards,</p>
            <p><strong>Rubberscrapmart</strong></p>
            <div style="margin-top: 20px; padding: 10px; background-color: #f4f4f4; border-radius: 5px;">
              <p><strong>Admin Office:</strong></p>
              <p>Ground Floor, Office No-52/ Plot No-44, <br>
                Sai Chamber CHS Wing A, Sector -11,
                Sai Chambers, CBD Belapur, <br>
                Navi Mumbai, Thane, Maharashtra, 400614,
                GSTN:27AAVFV4635R1ZY
                </p>
              <p><strong>Tel:</strong> 040-49511293</p>
              <p><strong>Email:</strong> <a href="mailto:info@rubberscrapmart.com" style="color: #1e88e5;">info@rubberscrapmart.com</a></p>
              <p><strong>Website:</strong> <a href="https://rubberscrapmart.com/" style="color: #1e88e5;">https://rubberscrapmart.com</a></p>
            </div>
          </div>
        `,
      };
  
      // Wait for the email to be sent before committing the transaction and responding
      await transporter.sendMail(mailOptions);
  
      // Commit the transaction after the email is sent
      await session.commitTransaction();
      session.endSession();
  
      return res.status(200).json({
        message: "Scrap denied and email sent.",
        deniedScrap: {
          material,
          application,
          quantity,
          companyName,
        },
      });
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error denying scrap item:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  

router.get("/getApprovedScrap", authenticateToken, async (req, res) => {
  try {
    // Find approvals for scraps uploaded by the logged-in user
    const approvedScrap = await Approval.find({ postedBy: req.user.id }) // Filter by user ID
      .populate("scrapItem", "material application quantity companyName email") // Populate scrap item details
      .select("-postedBy"); // Optionally exclude the postedBy from the response if not needed

    if (!approvedScrap.length) {
      return res
        .status(404)
        .json({ message: "No approved scrap items found for this user." });
    }

    res.json({ approvedScrap });
  } catch (error) {
    console.error("Error fetching approved scrap:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// Updated route for fetching approval details with image
router.get("/approvals", async (req, res) => {
  try {
    const { application } = req.query; // Fetch 'application' query parameter

    // Fetch all approval details matching the application
    const approvals = await Approval.find({ application })
      .populate("postedBy", "name email businessProfiles") // Populate the user data
      .exec();

    if (approvals.length === 0) {
      return res
        .status(404)
        .json({ message: "No approvals found for this application" });
    }

    // Convert image buffer to Base64 for all approvals
    const approvalsWithImages = approvals.map((approval) => {
      const imagesBase64 = approval.images.map(
        (image) =>
          `data:${image.contentType};base64,${image.data.toString("base64")}`
      );

      return { ...approval.toObject(), images: imagesBase64 };
    });

    // Send the array of approval details
    res.json({ approvals: approvalsWithImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user details by ID
router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Return the user details
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
