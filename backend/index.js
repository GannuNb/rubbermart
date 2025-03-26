const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const mailRoutes = require('./Routes/Mail');
const placeOrderRoute = require('./Routes/PlaceOrder');
const contactRoute = require('./Routes/Contactus');
const app = express();
const port = process.env.PORT || 4000;
const User = require('./models/User');
const shippingRoutes = require('./Routes/shippingRoutes');
const allowedOrigins = process.env.CLIENT_URL?.split(',') || [];
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');

// Use bodyParser to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    startPeriodicSave();
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const startPeriodicSave = () => {
    setInterval(async () => {
        try {
            const scrapItems = await mongoose.connection.db.collection("scrapitems").find({}).toArray();
            global.scrap_items = scrapItems;
            console.log("Data refreshed and saved:", scrapItems.length, "items.");
        } catch (err) {
            console.error("Error during periodic save:", err);
        }
    }, 5000); // 5 seconds
};

app.get('/business-profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const user = await User.findById(userId);
        if (!user || !user.businessProfiles || user.businessProfiles.length === 0) {
            return res.status(200).json({ profileExists: false, message: 'Business profile not found' });
        }

        const businessProfile = user.businessProfiles[0];
        return res.status(200).json({ profileExists: true, businessProfile });
    } catch (error) {
        console.error('Error fetching business profile:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

const BusinessProfileCounter = require('./models/BusinessProfileCounter');
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage: storage });

app.post('/business-profile', upload.fields([
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'panCertificate', maxCount: 1 }
]), async (req, res) => {
    try {
        const { companyName, registeredgst, phoneNumber, email, gstNumber, pan, billAddress, shipAddress, selectedProducts } = req.body;

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if a business profile already exists for this user
        if (user.businessProfiles && user.businessProfiles.length > 0) {
            return res.status(400).json({ success: false, message: "Business profile already exists" });
        }

        // Extract the company prefix (first 3 letters of company name, uppercase)
        const companyPrefix = companyName.substring(0, 3).toUpperCase();

        // Fetch or create the global counter
        let counterDoc = await BusinessProfileCounter.findOne();
        if (!counterDoc) {
            // If no counter exists, create one with an initial value of 1
            counterDoc = new BusinessProfileCounter();
            await counterDoc.save();
        }

        // Generate the profile ID in the format VKRS_<PREFIX>_<COUNTER>
        const profileId = `VKRS_${companyPrefix}_${String(counterDoc.counter).padStart(2, '0')}`;

        // Increment the global counter for the next business profile
        counterDoc.counter += 1;
        await counterDoc.save();

        // Check for uploaded files and store them as Buffer along with fileName and fileType
        const gstCertificate = req.files['gstCertificate'] ? {
            file: req.files['gstCertificate'][0].buffer,
            fileName: req.files['gstCertificate'][0].originalname,
            fileType: req.files['gstCertificate'][0].mimetype,
        } : null;

        const panCertificate = req.files['panCertificate'] ? {
            file: req.files['panCertificate'][0].buffer,
            fileName: req.files['panCertificate'][0].originalname,
            fileType: req.files['panCertificate'][0].mimetype,
        } : null;

        // Create the new business profile
        const newProfile = {
            profileId,
            registeredgst,
            companyName,
            phoneNumber,
            email,
            gstNumber,
            pan,
            billAddress,
            shipAddress,
            gstCertificate,  // Store file as Buffer with fileName and fileType
            panCertificate,  // Store file as Buffer with fileName and fileType
            selectedProducts: selectedProducts ? selectedProducts.split(',') : [], // Convert to array of strings
        };

        // Add the new business profile to the user
        user.businessProfiles.push(newProfile);
        await user.save();

        res.status(201).json({ success: true, message: "Business profile created successfully", profileId });
    } catch (error) {
        console.error("Error creating business profile:", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    }
});

app.get('/scrap', (req, res) => {
    res.json({
        scrap_items: global.scrap_items,
    });
});

// Import and use routes
const uploadscrapRoute = require('./Routes/Uploadscrap');
const createUserRoute = require('./Routes/CreateUser');
const PaymentRoutes = require('./Routes/Payment');
app.use('/payment', PaymentRoutes);

const adminRoutes = require('./Routes/AdminRoutes'); // Corrected variable name
app.use('/api', require('./Routes/OrderRoutes'));
app.use('/api', adminRoutes); // Mount AdminRoutes at /api
app.use('/api', placeOrderRoute);
app.use('/api', contactRoute);
app.use('/api', mailRoutes);
app.use('/api', uploadscrapRoute);
app.use('/api', createUserRoute);
app.use('/api', shippingRoutes);
const userDetailsRoute = require('./Routes/userdetails'); // Import the route
app.use('/api', userDetailsRoute);

app.get('/', (req, res) => {
    res.send('Hello Welcome to Mart!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
