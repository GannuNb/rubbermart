const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ScrapItem = require('../models/ScrapItem'); // Import the model
const jwt = require('jsonwebtoken');
router.get('/admin/scrap', async (req, res) => {
    try {
        const scrapItems = await ScrapItem.find({});
        res.json({ scrap_items: scrapItems });
    } catch (error) {
        console.error("Error fetching scrap items:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE /api/admin/scrap/:id - Delete a scrap item by ID
router.delete('/admin/scrap/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const result = await ScrapItem.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }
        res.json({ message: 'Scrap item deleted successfully' });
    } catch (error) {
        console.error("Error deleting scrap item:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT /api/admin/scrap/:id - Update a scrap item by ID
router.put('/admin/scrap/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, available_quantity, price,hsn,ex_mundra,ex_nhavasheva,ex_chennai,chennai_quantity,mundra_quantity,nhavasheva_quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const updatedScrapItem = await ScrapItem.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                type: type.trim(),
                available_quantity: Number(available_quantity),
                price: Number(price),
                ex_mundra: Number(ex_mundra),
                ex_chennai: Number(ex_chennai),
                ex_nhavasheva: Number(ex_nhavasheva),
                hsn:hsn.trim(),
                chennai_quantity:Number(chennai_quantity),
                mundra_quantity:Number(mundra_quantity),
                nhavasheva_quantity:Number(nhavasheva_quantity),
            },
            { new: true, runValidators: true }
        );

        if (!updatedScrapItem) {
            return res.status(404).json({ message: 'Scrap item not found' });
        }

        res.json({ message: 'Scrap item updated successfully', scrap_item: updatedScrapItem });
    } catch (error) {
        console.error("Error updating scrap item:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// POST /api/admin/scrap - Create a new scrap item
router.post('/admin/scrap', async (req, res) => {
    const { name, type, available_quantity, price, hsn,ex_mundra,ex_nhavasheva,ex_chennai,chennai_quantity,mundra_quantity,nhavasheva_quantity } = req.body;

    try {
        // Validate input
        if (!name || !type || isNaN(available_quantity) || available_quantity < 0 || isNaN(price) || price < 0 || (hsn && typeof hsn !== 'string')) {
            return res.status(400).json({ message: 'Invalid input data' });
        }
    
        const newScrapItem = new ScrapItem({
            name: name.trim(),
            type: type.trim(),
            available_quantity: Number(available_quantity),
            price: Number(price),
            hsn: hsn ? hsn.trim() : '', 
            ex_chennai_quantity:Number(ex_chennai),
            ex_mundra:Number(ex_mundra_quantity),
            ex_nhavasheva:Number(ex_nhavasheva),
            chennai_quantity:Number(chennai_quantity),
            mundra_quantity:Number(mundra_quantity),
            nhavasheva_quantity:Number(nhavasheva_quantity)
        });
    
        const savedScrapItem = await newScrapItem.save();
        res.json({ message: 'Scrap item added successfully', scrap_item: savedScrapItem });
    } catch (error) {
        console.error("Error adding scrap item:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
});


router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await mongoose.connection.db.collection("Adminlogin").findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
