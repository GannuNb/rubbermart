import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaledTyresTBRImage from './images/BaledTyresTBR.jpg'; // Image for Baled Tyres TBR
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { useNavigate, useLocation } from 'react-router-dom';
import './Mulch.css'; // Shared CSS
import logo1 from './images/logo.png';

const BaledTyresTBR = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [mulchData, setMulchData] = useState({
        available_quantity: 0,
        price: 0, // dynamic price based on selection
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0,
    });
    const [requiredQuantity, setRequiredQuantity] = useState();
    const [selectedPrice, setSelectedPrice] = useState(''); // Default as empty to show "Select a location"
    const [errors, setErrors] = useState({ requiredQuantity: '', selectedPrice: '', quantityExceeds: '' }); // Error states
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch Baled Tyres TBR data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                const item = items.find(item => item.name === 'Baled Tyres TBR');

                if (item) {
                    const fetchedDefaultPrice = item.default_price || item.price || item.ex_chennai;

                    setMulchData({
                        available_quantity: Number(item.available_quantity),
                        price: fetchedDefaultPrice,
                        ex_chennai: item.ex_chennai,
                        ex_nhavasheva: item.ex_nhavasheva,
                        ex_mundra: item.ex_mundra,
                        hsn: item.hsn,
                        default_price: fetchedDefaultPrice,
                    });
                }
                setScrapItems(items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Handle price selection from dropdown
    const handlePriceChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedPrice(selectedOption);

        setMulchData(prevState => ({
            ...prevState,
            price:
                selectedOption === 'ex_chennai' ? prevState.ex_chennai :
                    selectedOption === 'ex_nhavasheva' ? prevState.ex_nhavasheva :
                        selectedOption === 'ex_mundra' ? prevState.ex_mundra :
                            prevState.default_price
        }));
    };

    // Validation of form fields
    const validateFields = () => {
        let formIsValid = true;
        let errors = { requiredQuantity: '', selectedPrice: '', quantityExceeds: '' };

        // Validate required quantity
        if (!requiredQuantity || requiredQuantity <= 0) {
            formIsValid = false;
            errors.requiredQuantity = 'Please fill out this required field';
        }

        // Validate selected price
        if (!selectedPrice) {
            formIsValid = false;
            errors.selectedPrice = 'Please select a price option';
        }

        // Check if required quantity exceeds available quantity
        if (parseFloat(requiredQuantity) > parseFloat(mulchData.available_quantity)) {
            formIsValid = false;
            errors.quantityExceeds = 'Required quantity exceeds available quantity.';
        }

        setErrors(errors);
        return formIsValid;
    };

    // Handle Order Button Click
    const handleOrder = () => {
        if (!validateFields()) {
            return; // Don't proceed if validation fails
        }

        const token = localStorage.getItem('token');

        if (!token) {
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
        <div className="mulch-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img
                        src={BaledTyresTBRImage}
                        alt="Baled Tyres TBR"
                        className="img-fluid img-hover-effect"
                        style={{ borderRadius: '8px', width: '90%', marginLeft: '20px', height: '300px' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>Baled Tyres TBR</h2>
                    <p>
                        Baled Tyres TBR are
                         compressed Tyre bundles primarily used for recycling purposes, construction, and environmental applications. These bales are highly durable and cost-efficient.
                    </p>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="specifications-section">
                <h3 className="specifications-title">SPECIFICATIONS</h3>
                <div className="row specifications-row">
                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY (MT):</label>

                        <span className="spec-value">
                            {Number(mulchData.available_quantity) > 0 ? mulchData.available_quantity : 'No Stock'}
                        </span>

                    </div>
                    
                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">{mulchData.hsn}</span>
                    </div>
                </div>

                {/* Required Quantity */}
<div className="required-quantity-section mt-3">
    <label className="spec-label">REQUIRED QUANTITY (MT):</label>
    <input
        type="number"
        value={requiredQuantity}
        onChange={(e) => {
            const value = e.target.value;
            if (value < 0) {
                setRequiredQuantity(0); // Reset to 0 if negative
            } else {
                setRequiredQuantity(value); // Update with valid input
            }
        }}
        placeholder="Enter required quantity"
        className="form-control required-quantity-input"
    />
    
    {errors.requiredQuantity && (
        <small className="text-danger">{errors.requiredQuantity}</small>
    )}
    {errors.quantityExceeds && (
        <small className="text-danger">{errors.quantityExceeds}</small>
    )}
</div>


                <div className="row mt-3">
                    {/* Price Selection Dropdown */}
                    <div className="mt-1 col-md-6">
                        <label className="spec-label">LOADING LOCATION:</label>
                        <select
                            className="form-control"
                            value={selectedPrice}
                            onChange={handlePriceChange}
                        >
                            {/* Placeholder option */}
                            <option value="" disabled>
                                Select a location
                            </option>
                            <option value="ex_chennai">Ex-Chennai</option>
                            <option value="ex_nhavasheva">Ex-Nhavasheva</option>
                            <option value="ex_mundra">Ex-Mundra</option>
                        </select>
                        {errors.selectedPrice && (
                            <small className="text-danger">{errors.selectedPrice}</small>
                        )}
                    </div>

                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="d-block p-2 border rounded spec-value">
                            {selectedPrice ? `₹${mulchData[selectedPrice]}` : "Price"}
                        </span>
                    </div>
                </div>

                {/* Order Button */}
                <div className="order-button-section mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleOrder}
                        disabled={Number(mulchData.available_quantity) === 0} // Ensure it's treated as a number
                    >
                        {Number(mulchData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BaledTyresTBR;
