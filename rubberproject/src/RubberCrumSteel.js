import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RubberCrumSteelImage from './images/RubberCrumSteel.jpeg'; // Ensure to have an image for Rubber Crum Steel
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file

const RubberCrumSteel = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [rubberData, setRubberData] = useState({ available_quantity: 0, price: 0 }); // Store the rubber data
    const [requiredQuantity, setRequiredQuantity] = useState(1); // Default required quantity to 1
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the rubber data
                const rubberItem = items.find(item => item.name === 'Rubber Crum Steel');

                // Set the rubber data if it exists
                if (rubberItem) {
                    setRubberData({
                        available_quantity: rubberItem.available_quantity,
                        price: rubberItem.price,
                        hsn: rubberItem.hsn,
                    });
                }

                setScrapItems(items); // You can still store all scrap items if needed
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleOrder = () => {
        // Navigate to the Order page with the rubber data and required quantity
        navigate('/Order', {
            state: {
                name: 'Rubber Crum Steel',
                available_quantity: rubberData.available_quantity,
                price: rubberData.price,
                required_quantity: requiredQuantity,
                hsn: rubberData.hsn,
            },
        });
    };

    return (
        <div className="mulch-container" style={{ padding: '20px', marginTop: '20px' , marginLeft: '115px'}} >
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img 
                        src={RubberCrumSteelImage} 
                        alt="Rubber Crum Steel" 
                        className="img-fluid img-hover-effect" // Add img-hover-effect class
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px',height :'300px' }} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>Rubber Crum Steel</h2>
                    <p>
                        Rubber Crum Steel is a crucial component in the recycling process. 
                        It is used in various applications including material recovery and energy generation. 
                        The proper recycling of rubber crum steel significantly reduces environmental impact and promotes sustainability.
                    </p>
                </div>
            </div>

{/* Specifications Section */}
<h3 style={{ marginTop: '40px', color: 'black' }}>SPECIFICATIONS</h3>
<div className="row" style={{ marginTop: '10px' }}>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>AVAILABLE QUANTITY IN (MT):</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            {rubberData.available_quantity}
        </span>
    </div>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>PRICE PER (MT):</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            ₹{rubberData.price}
        </span>
    </div>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>HSN:</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            {rubberData.hsn}
        </span>
    </div>
</div>

{/* Required Quantity Section */}
<div className="mt-3">
    <label style={{ color: 'black', fontWeight: 'bold' }}>REQUIRED QUANTITY IN (MT):</label>
    <input
        type="number"
        value={requiredQuantity}
        onChange={(e) => setRequiredQuantity(e.target.value)}
        placeholder="Enter required quantity"
        className="form-control"
        style={{
            border: '1px solid #ccc',
            padding: '8px',
            marginTop: '5px',
            width: '48%', /* Adjust width to make it smaller */

        }}
    />
</div>


            {/* Order Button */}
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleOrder}>Please Proceed to Order</button>
            </div>
        </div>
    );
};

export default RubberCrumSteel;
