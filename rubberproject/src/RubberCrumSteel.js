import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './Mulch.css';
import rubbercrumimg1 from "./images/rubbercrumbtw3.jpg";
import logo1 from './images/logo.png';

const RubberCrumSteel = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [rubberData, setRubberData] = useState({
        available_quantity: 0,
        price: 0,
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0,
    });
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(''); // Default as empty
    const [errors, setErrors] = useState({
        requiredQuantity: '',
        selectedPrice: '',
        quantityExceeds: '' // To track if quantity exceeds available stock
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the Rubber Crum Steel data
                const rubberItem = items.find(item => item.name === 'Rubber Crum Steel');

                if (rubberItem) {
                    const fetchedDefaultPrice = rubberItem.default_price || rubberItem.price || rubberItem.ex_chennai;
                    setRubberData({
                        available_quantity: Number(rubberItem.available_quantity),
                        price: rubberItem.price, 
                        ex_chennai: rubberItem.ex_chennai,
                        ex_nhavasheva: rubberItem.ex_nhavasheva,
                        ex_mundra: rubberItem.ex_mundra,
                        hsn: rubberItem.hsn,
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

        // Update price based on the selected location
        if (selectedOption === 'ex_chennai') {
            setRubberData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setRubberData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setRubberData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setRubberData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    // Validate form fields
    const validateFields = () => {
        let formIsValid = true;
        let errors = { requiredQuantity: '', selectedPrice: '', quantityExceeds: '' };

        if (!requiredQuantity || requiredQuantity <= 0) {
            formIsValid = false;
            errors.requiredQuantity = 'Please fill out this required field';
        }

        if (!selectedPrice) {
            formIsValid = false;
            errors.selectedPrice = 'Please select a price option';
        }

        // Check if required quantity exceeds available quantity
        if (parseFloat(requiredQuantity) > parseFloat(rubberData.available_quantity)) {
            formIsValid = false;
            errors.quantityExceeds = 'Required quantity exceeds available quantity.';
        }

        setErrors(errors);
        return formIsValid;
    };

    // Handle order submission
    const handleOrder = () => {
        if (!validateFields()) {
            return; // Don't proceed if validation fails
        }

        const token = localStorage.getItem('token');

        if (!token) {
            // Show alert and redirect to login
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
            // Proceed to the order page with the necessary data
            navigate('/Order', {
                state: {
                    name: 'Rubber Crum Steel',
                    available_quantity: rubberData.available_quantity,
                    price: rubberData.price,
                    required_quantity: requiredQuantity,
                    hsn: rubberData.hsn,
                },
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

            <div className="specifications-section">
                <h3 className="specifications-title">SPECIFICATIONS</h3>
                <div className="row specifications-row">
                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY IN (MT):</label>
                        <span className="spec-value">
                            {Number(rubberData.available_quantity) > 0 ? rubberData.available_quantity : 'No Stock'}
                        </span>
                    </div>

                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">{rubberData.hsn}</span>
                    </div>
                </div>

                <div className="required-quantity-section mt-3">
                    <label className="spec-label">REQUIRED QUANTITY IN (MT):</label>
                    <input
                        type="number"
                        value={requiredQuantity}
                        onChange={(e) => {
                            // Only update if the value is not negative
                            if (e.target.value >= 0 || e.target.value === '') {
                                setRequiredQuantity(e.target.value);
                            }
                        }}
                        placeholder="Enter required quantity"
                        className="form-control required-quantity-input"
                        min="0" // Ensure input cannot go below 0
                    />
                    {errors.requiredQuantity && <small className="text-danger">{errors.requiredQuantity}</small>}
                    {errors.quantityExceeds && <small className="text-danger">{errors.quantityExceeds}</small>}
                </div>

                <div className="row mt-3">
                    <div className="price-dropdown mt-1 col-md-6">
                        <label className="spec-label">SELECT PRICE:</label>
                        <select
                            className="form-control"
                            value={selectedPrice}
                            onChange={handlePriceChange}
                        >
                            <option value="" disabled>Select a location</option>
                            <option value="ex_chennai">Ex-Chennai</option>
                            <option value="ex_nhavasheva">Ex-Nhavasheva</option>
                            <option value="ex_mundra">Ex-Mundra</option>
                        </select>
                        {errors.selectedPrice && <small className="text-danger">{errors.selectedPrice}</small>}
                    </div>

                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="spec-value">
                            {selectedPrice ? `₹${rubberData[selectedPrice]}` : "Price"}
                        </span>
                    </div>
                </div>

                <div className="order-button-section mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleOrder}
                        disabled={Number(rubberData.available_quantity) === 0}
                    >
                        {Number(rubberData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RubberCrumSteel;
