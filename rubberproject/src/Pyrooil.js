import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pyrooilImage from './images/pyro_oil2.jpeg'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import logo1 from './images/logo.png';

const Pyrooil = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [pyrooilData, setPyrooilData] = useState({ available_quantity: 0, price: 0 });
    const [requiredQuantity, setRequiredQuantity] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the Pyrooil data
                const pyrooilItem = items.find(item => item.name === 'Pyro Oil');

                // Set the Pyrooil data if it exists
                if (pyrooilItem) {
                    setPyrooilData({
                        available_quantity: pyrooilItem.available_quantity,
                        price: pyrooilItem.price,
                        hsn: pyrooilItem.hsn,
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
                const alertDiv = document.createElement('div');
                alertDiv.className = 'custom-alert';

                const logoImg = document.createElement('img');
                logoImg.src = logo1; // Use the imported logo here
                logoImg.alt = 'Company Logo';
                logoImg.className = 'alert-logo';

                const alertMessage = document.createElement('span');
                alertMessage.textContent = 'Please log in to proceed';
                alertMessage.className = 'alert-message';

                alertDiv.appendChild(logoImg);
                alertDiv.appendChild(alertMessage);

                document.body.appendChild(alertDiv);

                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);

                navigate('/login', {
                    state: {
                        from: location.pathname, // Pass the current path to return after login
                        pyrooilData: {
                            name: 'Pyro Oil',
                            available_quantity: pyrooilData.available_quantity,
                            price: pyrooilData.price,
                            required_quantity: requiredQuantity,
                            hsn: pyrooilData.hsn,
                        }
                    }
                });
            }, 0);
        } else {
            navigate('/Order', {
                state: {
                    name: 'Pyro Oil',
                    available_quantity: pyrooilData.available_quantity,
                    price: pyrooilData.price,
                    required_quantity: requiredQuantity,
                    hsn: pyrooilData.hsn,
                },
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
        <div className="pyrooil-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img 
                        src={pyrooilImage} 
                        alt="Pyrooil" 
                        className="img-fluid img-hover-effect" 
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }} 
                    />
                </div>
                <div className="col-md-6">
                    <h2>Pyro oil</h2>
                    <p>
                        Pyrooil is a by-product of pyrolysis, a chemical process that breaks down organic material in the absence of oxygen. 
                        It is an oil-like substance that can be used for various applications, such as fuel, lubricants, and even as a base for 
                        other chemical products. Pyrooil offers a sustainable alternative to fossil fuels and can contribute to waste management.
                    </p>
                </div>
            </div>

            {/* Specifications Section */}
            <h3 style={{ marginTop: '40px' }}>SPECIFICATIONS</h3>
            <div className="row" style={{ marginTop: '10px' }}>
                <div className="col-md-6">
                    <label style={{ color: 'black', fontWeight: 'bold' }}>AVAILABLE QUANTITY IN (MT):</label>
                    <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
                        {pyrooilData.available_quantity}
                    </span>
                </div>
                <div className="col-md-6">
                    <label style={{ color: 'black', fontWeight: 'bold' }}>PRICE PER (MT):</label>
                    <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
                        ₹{pyrooilData.price}
                    </span>
                </div>
                <div className="col-md-6">
                    <label style={{ color: 'black', fontWeight: 'bold' }}>HSN:</label>
                    <span className="d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
                        {pyrooilData.hsn}
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
                        width: '48%', /* Adjust width to make it smaller */
                        padding: '5px', /* Decrease padding */
                        fontSize: '0.9rem', /* Reduce font size */
                        marginTop: '5px' /* Add some space between label and input */
                    }} 
                />
            </div>

            {/* Order Button */}
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleOrder}>Please proceed to Order</button>
            </div>
        </div>
        </>
    );
};

export default Pyrooil;
