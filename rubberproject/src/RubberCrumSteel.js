import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RubberCrumSteelImage from './images/RubberCrumSteel.jpeg'; // Ensure to have an image for Rubber Crum Steel
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file
import RubberCrumSteelImage1 from './images/RubberCrumSteel1.jpg';
import rubbercrumimg1 from "./images/rubbercrumbtw3.jpg"
import logo1 from './images/logo.png';

const RubberCrumSteel = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [rubberData, setRubberData] = useState({
        available_quantity: 0,
        price: 0, // Price will be fetched from the backend
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
    });
    const [requiredQuantity, setRequiredQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState('default'); // Store selected price option (default)
    const navigate = useNavigate();
    const location = useLocation();

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
                        available_quantity: Number(rubberItem.available_quantity),
                        price: rubberItem.price, // Fetch price from backend (default price)
                        ex_chennai: rubberItem.ex_chennai,
                        ex_nhavasheva: rubberItem.ex_nhavasheva,
                        ex_mundra: rubberItem.ex_mundra,
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

    const handlePriceChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedPrice(selectedOption);
    };

    const handleOrder = () => {
        const token = localStorage.getItem('token'); // Replace 'authToken' with your token key

        if (!token) {
            // If user isn't logged in, navigate to the login page
            setTimeout(() => {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'custom-alert';

                const logoImg = document.createElement('img');
                logoImg.src = logo1;
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
                        from: location.pathname,
                        rubberData: {
                            name: 'Rubber Crum Steel',
                            available_quantity: rubberData.available_quantity,
                            price: rubberData.price,
                            required_quantity: requiredQuantity,
                            hsn: rubberData.hsn,
                        }
                    }
                });
            }, 0);

        } else {
            navigate('/Order', {
                state: {
                    name: 'Rubber Crum Steel',
                    available_quantity: rubberData.available_quantity,
                    price: rubberData.price, // Use the fetched price
                    required_quantity: requiredQuantity,
                    hsn: rubberData.hsn,
                },
            });
        }
    };

    return (
        <div className="mulch-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img
                        src={rubbercrumimg1}
                        alt="Rubber Crum Steel"
                        className="img-fluid img-hover-effect"
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px', height: '300px' }}
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
            <div className="specifications-section">
                <h3 className="specifications-title">SPECIFICATIONS</h3>
                <div className="row specifications-row">
                    {/* Available Quantity */}
                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY IN (MT):</label>
                        
                        <span className="spec-value">
    {Number(rubberData.available_quantity) > 0 ? rubberData.available_quantity : 'No Stock'}
</span>
                    </div>

                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="spec-value">
                            ₹{rubberData.price || 'Loading...'} {/* Display fetched price or loading */}
                        </span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">
                            {rubberData.hsn}
                        </span>
                    </div>
                </div>

                {/* Required Quantity Section */}
                <div className="required-quantity-section mt-3">
                    <label className="spec-label">REQUIRED QUANTITY IN (MT):</label>
                    <input
                        type="number"
                        value={requiredQuantity}
                        onChange={(e) => setRequiredQuantity(e.target.value)}
                        placeholder="Enter required quantity"
                        className="form-control required-quantity-input"
                    />
                </div>

                {/* Price Selection Dropdown */}
                <div className="price-dropdown mt-3">
                    <label className="spec-label">SELECT PRICE:</label>
                    <select
                        className="form-control"
                        value={selectedPrice}
                        onChange={handlePriceChange}
                    >
                        {/* Dropdown options, but price remains constant as per the backend */}
                        <option value="default">Default Price: ₹{rubberData.price || 'Loading...'}</option>
                        <option value="ex_chennai">Ex-Chennai: ₹{rubberData.ex_chennai}</option>
                        <option value="ex_nhavasheva">Ex-Nhavasheva: ₹{rubberData.ex_nhavasheva}</option>
                        <option value="ex_mundra">Ex-Mundra: ₹{rubberData.ex_mundra}</option>
                    </select>
                </div>

                {/* Order Button */}
                <div className="order-button-section mt-3">
                    
                    <button
    className="btn btn-primary"
    onClick={handleOrder}
    disabled={Number(rubberData.available_quantity) === 0} // Ensure it's treated as a number
>
    {Number(rubberData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
</button>
                </div>
            </div>
        </div>
    );
};

export default RubberCrumSteel;
