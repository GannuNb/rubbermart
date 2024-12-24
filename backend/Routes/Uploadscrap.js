// routes/uploadscrap.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose'); // Needed for transactions
const Uploadscrap = require('../models/Uploadscrap');

const ScrapItem = require('../models/ScrapItem');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/User');
const nodemailer = require('nodemailer');



router.post('/uploadscrap', [
    authenticateToken,
    body('material').isIn(['Tyre scrap', 'pyro oil', 'Tyre steel scrap']).withMessage('Invalid material type'),
    body('application').notEmpty().withMessage('Application is required'),
    body('quantity').isFloat({ gt: 0 }).withMessage('Quantity must be a positive number'),
    body('companyName').notEmpty().withMessage('Company Name is required'),
    body('phoneNumber').notEmpty().withMessage('Phone Number is required'),
    body('email').isEmail().withMessage('Valid Email is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { material, application, quantity, companyName, phoneNumber, email } = req.body;

    try {
        // Find user by ID extracted from token
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Create new scrap item with associated user ID
        const newScrap = new Uploadscrap({
            user: req.user.id, // Save user ID with scrap item
            material,
            application,
            quantity,
            companyName,
            phoneNumber,
            email
        });

        await newScrap.save();

        // Send email to admin
 // Send email to admin
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Scrap Submission Received',
    text: `Dear Admin,

We have received a new scrap submission. Below are the details:

- Material Type: ${material}
- Application: ${application}
- Quantity: ${quantity}
- Company Name: ${companyName}
- Contact Number: ${phoneNumber}
- Email Address: ${email}

Please log in to the admin portal to review and process this submission.

Best regards,  
The Scrap Management Team`
};




        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ success: false, message: 'Scrap uploaded but failed to send email.' });
            }
            console.log('Email sent:', info.response);
            res.status(201).json({ success: true, message: 'Scrap details uploaded successfully and email sent.', scrap: newScrap });
        });
    } catch (error) {
        console.error('Error uploading scrap details:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



router.get('/getuploadedscrap', authenticateToken, async (req, res) => {
    try {
        const uploadedScrapItems = await Uploadscrap.find()
            .populate('user', '_id name'); // Adjust to include specific fields if needed
        if (!uploadedScrapItems.length) {
            return res.status(404).json({ message: 'No uploaded scrap items found' });
        }
        res.json({ uploadedScrapItems });
    } catch (err) {
        console.error('Error fetching uploaded scrap items:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});


const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password
    }
});

const Approval = require('../models/Approval'); // Import Approval model

// routes/uploadscrap.js

router.post('/approveScrap/:id', authenticateToken, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const uploadedScrap = await Uploadscrap.findById(req.params.id).session(session);
        if (!uploadedScrap) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Scrap item not found' });
        }

        const { material, application, quantity, email, companyName } = uploadedScrap;

        const existingScrapItem = await ScrapItem.findOne({
            type: { $regex: new RegExp(`^${material}$`, 'i') },
            name: { $regex: new RegExp(`^${application}$`, 'i') },
        }).session(session);

        if (existingScrapItem) {
            existingScrapItem.available_quantity += quantity;
            await existingScrapItem.save({ session });

            // Save approval record with only posted user ID
            const approval = new Approval({
                scrapItem: uploadedScrap._id,
                postedBy: uploadedScrap.user, // Store the user ID of the posted user
                material,
                application,
                quantity,
                companyName,
                email
            });
            await approval.save({ session });

            // Remove approved scrap from Uploadscrap collection
            await Uploadscrap.findByIdAndDelete(req.params.id).session(session);

            // Prepare scrap details for the email
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

            // Send confirmation email
            const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: email,
                subject: 'Scrap Product Approval Notification – Vikah Rubber',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #1e88e5;">Scrap Product Approval Notification</h2>
                        <p>Dear ${companyName || 'Customer'},</p>
                        <p>Thank you for submitting your scrap product details to <strong>Vikah Rubber</strong>.</p>
                        <p>We are pleased to inform you that your scrap items have been successfully approved by our admin team. Below are the details of your approved scrap:</p>
                        ${scrapDetailsHtml}
                        <p>If you have any questions or need further assistance, feel free to contact us. We are here to support you through every stage of the process.</p>
                        <p style="margin-top: 20px;">Thank you for choosing <strong>Vikah Rubber</strong>. We look forward to continuing our business relationship.</p>
                        <p style="margin-top: 20px;">Best regards,</p>
                        <p><strong>Vikah Rubber</strong></p>
                        <div style="margin-top: 20px; padding: 10px; background-color: #f4f4f4; border-radius: 5px;">
                            <p><strong>Admin Office:</strong></p>
                            <p>#406, 4th Floor, Patel Towers,<br>
                               Above EasyBuy, Beside Nagole RTO Office,<br>
                               Nagole, Hyderabad, Telangana-500035</p>
                            <p><strong>Phone:</strong> +91 4049471616</p>
                            <p><strong>Email:</strong> <a href="mailto:vikahrubber@gmail.com" style="color: #1e88e5;">vikahrubber@gmail.com</a></p>
                            <p><strong>Website:</strong> <a href="https://vikahrubber.com" style="color: #1e88e5;">https://vikahrubber.com</a></p>
                        </div>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

            await session.commitTransaction();
            session.endSession();

            // Include approved scrap details in the response
            return res.status(200).json({
                message: 'Scrap approved, quantity updated, and email sent.',
                approvedScrap: {
                    material,
                    application,
                    quantity,
                    companyName
                }
            });
        } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'No matching scrap item found; approval failed.' });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error approving scrap item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});





// @route   DELETE /api/denyScrap/:id
// @desc    Deny scrap submission
// @access  Private (Authorized users)
router.post('/denyScrap/:id', authenticateToken, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const uploadedScrap = await Uploadscrap.findById(req.params.id).session(session);
        if (!uploadedScrap) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Scrap item not found' });
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
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'Scrap Product Denial Notification – Vikah Rubber',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #e53935;">Scrap Product Denial Notification</h2>
                    <p>Dear ${companyName || 'Customer'},</p>
                    <p>We regret to inform you that your scrap submission has been denied by our admin team.</p>
                    <p>Below are the details of your denied scrap:</p>
                    ${scrapDetailsHtml}
                    <p>If you have any questions or need further clarification, feel free to contact us.</p>
                    <p style="margin-top: 20px;">Best regards,</p>
                    <p><strong>Vikah Rubber</strong></p>
                    <div style="margin-top: 20px; padding: 10px; background-color: #f4f4f4; border-radius: 5px;">
                        <p><strong>Admin Office:</strong></p>
                        <p>#406, 4th Floor, Patel Towers,<br>
                           Above EasyBuy, Beside Nagole RTO Office,<br>
                           Nagole, Hyderabad, Telangana-500035</p>
                        <p><strong>Phone:</strong> +91 4049471616</p>
                        <p><strong>Email:</strong> <a href="mailto:vikahrubber@gmail.com" style="color: #1e88e5;">vikahrubber@gmail.com</a></p>
                        <p><strong>Website:</strong> <a href="https://vikahrubber.com" style="color: #1e88e5;">https://vikahrubber.com</a></p>
                    </div>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Denial email sent:', info.response);
            }
        });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: 'Scrap denied and email sent.',
            deniedScrap: {
                material,
                application,
                quantity,
                companyName
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error denying scrap item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/getApprovedScrap', authenticateToken, async (req, res) => {
    try {
        // Find approvals for scraps uploaded by the logged-in user
        const approvedScrap = await Approval.find({ postedBy: req.user.id }) // Filter by user ID
            .populate('scrapItem', 'material application quantity companyName email') // Populate scrap item details
            .select('-postedBy'); // Optionally exclude the postedBy from the response if not needed

        if (!approvedScrap.length) {
            return res.status(404).json({ message: 'No approved scrap items found for this user.' });
        }

        res.json({ approvedScrap });
    } catch (error) {
        console.error('Error fetching approved scrap:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;
