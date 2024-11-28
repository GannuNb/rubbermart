import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PyroSteelImage from './images/PyroSteel.jpeg'; // Ensure to have an image for mulch
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file

const PyroSteel = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [mulchData, setMulchData] = useState({ available_quantity: 0, price: 0 }); // Store the mulch data
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

                // Find the mulch data
                const mulchItem = items.find(item => item.name === 'Pyro Steel');

                // Set the mulch data if it exists
                if (mulchItem) {
                    setMulchData({
                        available_quantity: mulchItem.available_quantity,
                        price: mulchItem.price,
                        hsn: mulchItem.hsn,
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
        // Navigate to the Order page with the mulch data and required quantity
        navigate('/Order', {
            state: {
                name: 'Pyro Steel',
                available_quantity: mulchData.available_quantity,
                price: mulchData.price,
                required_quantity: requiredQuantity,
                hsn: mulchData.hsn,
            }, 
        });
    };

    return (
        <div className=" mulch-container" style={{ padding: '20px', marginTop: '20px' , marginLeft: '115px'}}>
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img 
                        src={PyroSteelImage} 
                        alt="Mulch" 
                        className="img-fluid img-hover-effect" 
                        style={{ borderRadius: '8px', width: '80%', marginLeft:'20px',height :'300px' }} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>Pyro Steel</h2>
                    <p>
                        Mulch is a material applied to the surface of soil. It serves several purposes, including moisture retention, temperature regulation, and weed suppression. 
                        Organic mulches, such as wood chips, straw, and leaves, decompose over time, adding nutrients to the soil. 
                        Utilizing mulch can enhance the aesthetic appeal of gardens while also promoting healthy plant growth.
                    </p>
                </div>
            </div>

{/* Specifications Section */}
<h3 style={{ marginTop: '40px', color: 'black' }}>SPECIFICATIONS</h3>
<div className="row" style={{ marginTop: '10px' }}>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>AVAILABLE QUANTITY IN (MT):</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            {mulchData.available_quantity} 
        </span>
    </div>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>PRICE PER (MT):</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            ₹{mulchData.price} 
        </span>
    </div>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>HSN:</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            {mulchData.hsn}
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
                <button className="btn btn-primary" onClick={handleOrder}> Please Proceed to Order</button>
            </div>
        </div>
    );
};

export default PyroSteel;
