import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaledTyresTBRImage from './images/BaledTyresTBR.jpeg'; // Ensure to have an image for mulch
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate,useLocation } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file

const BaledTyresTBR = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [mulchData, setMulchData] = useState({ available_quantity: 0, price: 0 }); // Store the mulch data
    const [requiredQuantity, setRequiredQuantity] = useState(1); // Default required quantity to 1
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const location = useLocation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the mulch data
                const mulchItem = items.find(item => item.name === 'Baled Tyres TBR');

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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    const handleOrder = () => {
        const token = localStorage.getItem('token'); // Replace 'authToken' with your token key
    
 
        if (!token) {
            // If user isn't logged in, navigate to the login page
            setTimeout(() => {
                alert("Please log in to proceed");
                navigate('/login', { 
                    state: { 
                        from: location.pathname, // Pass the current path to return after login
                        mulchData: {
                            name: 'Baled Tyres TBR',
                available_quantity: mulchData.available_quantity,
                price: mulchData.price,
                required_quantity: requiredQuantity,
                hsn: mulchData.hsn,
                        }
                    }
                });
            }, 0);
            
        } else {
                    navigate('/Order', {
            state: {
                name: 'Baled Tyres TBR',
                available_quantity: mulchData.available_quantity,
                price: mulchData.price,
                required_quantity: requiredQuantity,
                hsn: mulchData.hsn,
            },
        });
    }
    };

    return (
        <div className=" mulch-container" style={{ padding: '20px', marginTop: '20px' , marginLeft: '180px'}} >
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img 
                        src={BaledTyresTBRImage} 
                        alt="Mulch" 
                        className="img-fluid img-hover-effect" // Add img-hover-effect class
                        style={{ borderRadius: '8px', width: '90%', marginLeft:'20px' ,height :'300px'}} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>Baled Tyres TBR</h2>
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
        <label style={{ color: 'black', fontWeight: 'bold' }}>PRICE per (MT)</label>
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
    <label style={{ color: 'black', fontWeight: 'bold' }}>REQUIRED QUANTITY in (MT)</label>
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
                <button className="btn btn-primary" onClick={handleOrder}>Please proceed to Order</button>
            </div>
        </div>
    );
};

export default BaledTyresTBR;
