import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThreePiecePCRImage from './images/ThreePiecePCR.jpeg'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './Mulch.css'; 
import logo1 from './images/logo.png';

const ThreePiecePCR = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [threePiecePCRData, setThreePiecePCRData] = useState({
        available_quantity: 0,
        price: 0,
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0,
    });
    const [requiredQuantity, setRequiredQuantity] = useState();
    const [selectedPrice, setSelectedPrice] = useState('');
    const [errors, setErrors] = useState({ requiredQuantity: '', selectedPrice: '', quantityExceeds: '' });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the Three Piece PCR data
                const threePiecePCRItem = items.find(item => item.name === 'Three Piece PCR');

                if (threePiecePCRItem) {
                    const fetchedDefaultPrice = threePiecePCRItem.default_price || threePiecePCRItem.price || threePiecePCRItem.ex_chennai;

                    setThreePiecePCRData({
                        available_quantity: Number(threePiecePCRItem.available_quantity),
                        price: threePiecePCRItem.price,
                        ex_chennai: threePiecePCRItem.ex_chennai,
                        ex_nhavasheva: threePiecePCRItem.ex_nhavasheva,
                        ex_mundra: threePiecePCRItem.ex_mundra,
                        hsn: threePiecePCRItem.hsn,
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

    const handlePriceChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedPrice(selectedOption);

        if (selectedOption === 'ex_chennai') {
            setThreePiecePCRData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setThreePiecePCRData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setThreePiecePCRData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setThreePiecePCRData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    const validateFields = () => {
        let formIsValid = true;
        let errors = { requiredQuantity: '', selectedPrice: '', quantityExceeds: '' };

        if (!requiredQuantity || requiredQuantity < 1) {
            formIsValid = false;
            errors.requiredQuantity = 'Please fill out this required field';
        }

        if (!selectedPrice) {
            formIsValid = false;
            errors.selectedPrice = 'Please select a price option';
        }

        // Check if required quantity exceeds available quantity
        if (parseFloat(requiredQuantity) > parseFloat(threePiecePCRData.available_quantity)) {
            formIsValid = false;
            errors.quantityExceeds = 'Required quantity exceeds available quantity.';
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleOrder = () => {
        if (!validateFields()) {
            return; // Don't proceed if validation fails
        }

        const token = localStorage.getItem('token'); 
        const { available_quantity, hsn } = threePiecePCRData;

        if (!token) {
            // Handle unauthenticated user
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
                        threePiecePCRData: {
                            name: 'Three Piece PCR',
                            available_quantity,
                            price: threePiecePCRData.price,
                            required_quantity: requiredQuantity,
                            hsn,
                        }
                    }
                });
            }, 0);
        } else {
            // Proceed to Order page
            navigate('/Order', {
                state: {
                    name: 'Three Piece PCR',
                    available_quantity,
                    price: threePiecePCRData.price,
                    required_quantity: requiredQuantity,
                    hsn,
                },
            });
        }
    };

    const handleRequiredQuantityChange = (event) => {
        const value = event.target.value;
        if (value < 1) {
            setRequiredQuantity(1);
        } else {
            setRequiredQuantity(value);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="threepiecepcr-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img
                        src={ThreePiecePCRImage}
                        alt="Three Piece PCR"
                        className="img-fluid img-hover-effect"
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px', height: '300px' }}
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
            <div className="specifications-section">
                <h3 className="section-title">SPECIFICATIONS</h3>
                <div className="row specifications-row">
                    {/* Available Quantity */}
                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY IN (MT):</label>
                        <span className="spec-value">
                            {Number(threePiecePCRData.available_quantity) > 0 ? threePiecePCRData.available_quantity : 'No Stock'}
                        </span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">
                            {threePiecePCRData.hsn}
                        </span>
                    </div>
                </div>

                {/* Required Quantity Section */}
                <div className="required-quantity-section mt-3">
                    <label className="spec-label">REQUIRED QUANTITY IN (MT):</label>
                    <input
                        type="number"
                        value={requiredQuantity}
                        onChange={handleRequiredQuantityChange}
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
                    <div className="price-dropdown mt-1 col-md-6">
                        <label className="spec-label">LOADING LOCATION:</label>
                        <select
                            className="form-control"
                            value={selectedPrice}
                            onChange={handlePriceChange}
                        >
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
                        <span className="spec-value">
                            {selectedPrice ? `₹${threePiecePCRData[selectedPrice]}` : 'Select a location'}
                        </span>
                    </div>
                </div>

                {/* Order Button */}
                <div className="order-button-section mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleOrder}
                        disabled={Number(threePiecePCRData.available_quantity) === 0}
                    >
                        {Number(threePiecePCRData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThreePiecePCR;
