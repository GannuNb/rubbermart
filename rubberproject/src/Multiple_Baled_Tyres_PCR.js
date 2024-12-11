import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MultipleBaledTyresPCRImage from './images/MultipleBaledTyresPCR.jpeg'; // Ensure to have an image for multiple baled tyres
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate ,useLocation} from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file
import baledtrespcrimg1 from "./images/baledtrespcr2.jpg"

const Multiple_Baled_Tyres_PCR = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [tyreData, setTyreData] = useState({ available_quantity: 0, price: 0 }); // Store the tyre data
    const [requiredQuantity, setRequiredQuantity] = useState(1); // Default required quantity to 1
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const location = useLocation();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the tyre data
                const tyreItem = items.find(item => item.name === 'Multiple Baled Tyres PCR');

                // Set the tyre data if it exists
                if (tyreItem) {
                    setTyreData({
                        available_quantity: tyreItem.available_quantity,
                        price: tyreItem.price,
                        hsn: tyreItem.hsn,
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
        const token = localStorage.getItem('token'); // Replace 'authToken' with your token key
    
 
        if (!token) {
            // If user isn't logged in, navigate to the login page
            setTimeout(() => {
                alert("Please log in to proceed");
                navigate('/login', { 
                    state: { 
                        from: location.pathname, // Pass the current path to return after login
                        tyreData: {
                            name: 'Multiple Baled Tyres PCR',
                available_quantity: tyreData.available_quantity,
                price: tyreData.price,
                required_quantity: requiredQuantity,
                hsn: tyreData.hsn,
                        }
                    }
                });
            }, 0);
            
        } else {
                    navigate('/Order', {
            state: {
                name: 'Multiple Baled Tyres PCR',
                available_quantity: tyreData.available_quantity,
                price: tyreData.price,
                required_quantity: requiredQuantity,
                hsn: tyreData.hsn,
            },
        });
    }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    

    return (
        <div className=" mulch-container" style={{ padding: '20px', marginTop: '20px' , marginLeft: '180px'}} >
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img 
                        src={baledtrespcrimg1} 
                        alt="Multiple Baled Tyres PCR" 
                        className="img-fluid img-hover-effect" // Add img-hover-effect class
                        style={{ borderRadius: '8px', width: '85%', marginLeft: '20px' }} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>Multiple Baled Tyres PCR</h2>
                    <p>
                        Multiple Baled Tyres PCR are a vital component in the recycling process. 
                        They help in various applications, including energy recovery and raw material sourcing. 
                        Proper disposal and recycling of these tyres can significantly reduce environmental impact.
                    </p>
                </div>
            </div>

{/* Specifications Section */}
<h3 style={{ marginTop: '40px', color: 'black' }}>SPECIFICATIONS</h3>
<div className="row" style={{ marginTop: '10px' }}>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>AVAILABLE QUANTITY IN (MT):</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            {tyreData.available_quantity} 
        </span>
    </div>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>PRICE PER (MT):</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            ₹{tyreData.price} 
        </span>
    </div>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>HSN:</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            {tyreData.hsn}
        </span>
    </div>
</div>

{/* Required Quantity Section */}
<div className="mt-3">
    <label style={{ color: 'black', fontWeight: 'bold' }}>REQUIRED QUANTITY IN (MT)</label>
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

export default Multiple_Baled_Tyres_PCR;
