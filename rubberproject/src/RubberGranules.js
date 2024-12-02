import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RubberGranulesImage from './images/RubberGranules.jpeg'; // Ensure to have an image for Rubber Granules
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file
import rubbercrumimg1 from "./images/rubbercrumbtw3.jpg"



const RubberGranules = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [rubberData, setRubberData] = useState({ available_quantity: 0, price: 0,hsn:0 }); // Store the rubber data
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
                const rubberItem = items.find(item => item.name === 'Rubber Granules/Crum');

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
                name: 'Rubber Granules/Crum',
                available_quantity: rubberData.available_quantity,
                price: rubberData.price,
                required_quantity: requiredQuantity,
                hsn: rubberData.hsn,
            },
        });
    };

    return (
        <div className=" mulch-container"style={{ padding: '20px', marginTop: '20px' , marginLeft: '180px'}} >
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img 
                        src={rubbercrumimg1} 
                        alt="Rubber Granules" 
                        className="img-fluid img-hover-effect" // Add img-hover-effect class
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>Rubber Granules/Crum</h2>
                    <p>
                        Rubber granules are small particles derived from recycled rubber, commonly used in various applications including playgrounds, tracks, and as mulch. 
                        They provide excellent shock absorption and moisture retention, making them ideal for landscaping and gardening purposes. 
                        Additionally, using rubber granules can help in reducing waste and promoting sustainability.
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

export default RubberGranules;
