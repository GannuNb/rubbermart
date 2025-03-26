const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

dotenv.config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET; // Use environment variable for JWT secret

// Route to create a new user
router.post('/createuser', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // Check if the user already exists
       
        let user = await User.findOne({ email: req.body.email.toLowerCase() });

        if (user) {
            return res.status(400).json({ success, error: "User with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            location: req.body.location
        });

        // Generate JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, jwtSecret, { expiresIn: '24h' }); 

        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Route for user login
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Invalid email or password" });
        }

        // Compare the password
        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Invalid email or password" });
        }

        // Generate JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, jwtSecret, { expiresIn: '24h' }); 

        success = true;
        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});




// Route to handle forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "User with this email does not exist" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        user.resetToken = resetToken;
        user.tokenExpiry = tokenExpiry;
        await user.save();

        // Send reset email
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        // const transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 587, 
        //     secure: false, 
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS,
        //     },
        // });
        
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
        

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Password Reset Request</h2>
                    <p>Dear User,</p>
                    <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
                    <p>To reset your password, please click the link below:</p>
                    <p style="text-align: center;">
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset My Password</a>
                    </p>
                    <p>This link will expire in 1 hour. If you have any issues, please contact our support team.</p>
                    <br>
                    <p>Kind regards,</p>
                    <p><strong>Rubberscrapmart Team</strong></p>
                    <p>For assistance, feel free to contact us at <a href="mailto:info@rubberscrapmart">info@rubberscrapmart.com</a></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Password reset email sent" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal server Error" });
    }
});

// Route to handle password reset
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Find user by reset token and check expiry
        const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid or expired token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = securePass;
        user.resetToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();

        res.json({ success: true, message: "Password has been updated" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});




module.exports = router;
