import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThreePiecePCRImage from './images/ThreePiecePCR.jpeg'; // Ensure to have an image for Three Piece PCR
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file

const ThreePiecePCR = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [threePiecePCRData, setThreePiecePCRData] = useState({ available_quantity: 0, price: 0 }); // Store the Three Piece PCR data
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

                // Find the Three Piece PCR data
                const threePiecePCRItem = items.find(item => item.name === 'Three Piece PCR');

                // Set the Three Piece PCR data if it exists
                if (threePiecePCRItem) {
                    setThreePiecePCRData({
                        available_quantity: threePiecePCRItem.available_quantity,
                        price: threePiecePCRItem.price,
                        hsn: threePiecePCRItem.hsn,
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
        // Navigate to the Order page with the Three Piece PCR data and required quantity
        navigate('/Order', {
            state: {
                name: 'Three Piece PCR',
                available_quantity: threePiecePCRData.available_quantity,
                price: threePiecePCRData.price,
                required_quantity: requiredQuantity,
                hsn: threePiecePCRData.hsn,
            },
        });
    };

    return (
        <div className=" mulch-container" style={{ padding: '20px', marginTop: '20px' , marginLeft: '115px'}}>
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img 
                        src={ThreePiecePCRImage} 
                        alt="Three Piece PCR" 
                        className="img-fluid img-hover-effect" // Add img-hover-effect class
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' ,height :'300px'}} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>Three Piece PCR</h2>
                    <p>
                        Three Piece PCR refers to a type of processed material widely used in recycling and manufacturing. 
                        This material is known for its durability and versatility, making it suitable for various applications, including automotive and construction industries. 
                        Utilizing high-quality Three Piece PCR can contribute to sustainable practices by reducing waste and promoting recycling efforts.
                    </p>
                </div>
            </div>

{/* Specifications Section */}
<h3 className="specifications-title" style={{ marginTop: '40px' }}>SPECIFICATIONS</h3>
<div className="row specifications-row" style={{ marginTop: '10px' }}>
    <div className="col-md-6">
    <label style={{ color: 'black', fontWeight: 'bold' }}>AVAILABLE QUANTITY IN (MT):</label>
    <span className="d-block p-2 border rounded specification-value">
            {threePiecePCRData.available_quantity} 
        </span>
    </div>
    <div className="col-md-6">
    <label style={{ color: 'black', fontWeight: 'bold' }}>PRICE PER (MT):</label>
        <span className="d-block p-2 border rounded specification-value">
            ₹{threePiecePCRData.price} 
        </span>
    </div>
    <div className="col-md-6">
        <label style={{ color: 'black', fontWeight: 'bold' }}>HSN:</label>
        <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
            {threePiecePCRData.hsn}
        </span>
    </div>
</div>

{/* Required Quantity Section */}
<div className="mt-3">
    <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
        REQUIRED QUANTITY IN (MT):
    </label>
    <input 
        type="number" 
        value={requiredQuantity}
        onChange={(e) => setRequiredQuantity(e.target.value)} 
        placeholder="Enter required quantity" 
        className="form-control specification-input" 
        style={{
            border: '1px solid #ccc',
            padding: '8px',
            marginTop: '5px',
            width: '48%', /* Adjust width for a smaller field */
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

export default ThreePiecePCR;
