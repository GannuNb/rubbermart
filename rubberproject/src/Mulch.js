import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mulchImage from './images/mulch.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './Mulch.css';

const Mulch = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [mulchData, setMulchData] = useState({
        available_quantity: 0,
        price: 0,
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0,
    });
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [errors, setErrors] = useState({
        requiredQuantity: '',
        selectedPrice: '',
        quantityExceeds: ''
    });
    const navigate = useNavigate();
    const location = useLocation();
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                const mulchItem = items.find(item => item.name === 'Mulch PCR');

                if (mulchItem) {
                    const fetchedDefaultPrice = mulchItem.default_price || mulchItem.price || mulchItem.ex_chennai;
                    const totalQuantity = mulchItem.chennai_quantity + mulchItem.mundra_quantity + mulchItem.nhavasheva_quantity;

                    setMulchData({
                        chennai_quantity: mulchItem.chennai_quantity,
                        mundra_quantity: mulchItem.mundra_quantity,
                        nhavasheva_quantity: mulchItem.nhavasheva_quantity,
                        available_quantity: Number(mulchItem.available_quantity),
                        price: mulchItem.price,
                        ex_chennai: mulchItem.ex_chennai,
                        ex_nhavasheva: mulchItem.ex_nhavasheva,
                        ex_mundra: mulchItem.ex_mundra,
                        hsn: mulchItem.hsn,
                        default_price: fetchedDefaultPrice,
                    });
                    setTotalAvailableQuantity(totalQuantity);
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
            setMulchData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setMulchData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setMulchData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setMulchData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;

        // Validate quantity input (reject 0 or negative)
        if (value === '' || parseFloat(value) > 0) {
            setRequiredQuantity(value);

            // Validate quantity against available quantity at selected location
            if (selectedPrice) {
                let availableQuantity = 0;

                // Check selected location and get available quantity accordingly
                if (selectedPrice === 'ex_chennai') {
                    availableQuantity = mulchData.chennai_quantity;
                } else if (selectedPrice === 'ex_nhavasheva') {
                    availableQuantity = mulchData.nhavasheva_quantity;
                } else if (selectedPrice === 'ex_mundra') {
                    availableQuantity = mulchData.mundra_quantity;
                }

                // Check if required quantity exceeds available quantity at selected location
                if (parseFloat(value) > availableQuantity) {
                    setErrors({ ...errors, quantityExceeds: 'Required quantity exceeds available quantity at selected location.' });
                } else {
                    setErrors({ ...errors, quantityExceeds: '' });
                }
            }
        }
    };

    const validateFields = () => {
        let formIsValid = true;
        let errors = { requiredQuantity: '', selectedPrice: '', quantityExceeds: '' };

        // Validate required quantity
        if (!requiredQuantity || requiredQuantity <= 0) {
            formIsValid = false;
            errors.requiredQuantity = 'Required quantity is required and must be greater than zero.';
        }

        // Validate selected price
        if (!selectedPrice) {
            formIsValid = false;
            errors.selectedPrice = 'Price selection is required.';
        }

        // Validate quantity against available quantity at selected location
        let availableQuantity = 0;
        if (selectedPrice === 'ex_chennai') {
            availableQuantity = mulchData.chennai_quantity;
        } else if (selectedPrice === 'ex_nhavasheva') {
            availableQuantity = mulchData.nhavasheva_quantity;
        } else if (selectedPrice === 'ex_mundra') {
            availableQuantity = mulchData.mundra_quantity;
        }

        if (parseFloat(requiredQuantity) > availableQuantity) {
            formIsValid = false;
            errors.quantityExceeds = 'Required quantity exceeds available quantity at selected location.';
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleOrder = () => {
        if (!validateFields()) {
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login', {
                state: {
                    from: location.pathname,
                    mulchData: {
                        name: 'Mulch PCR',
                        available_quantity: totalAvailableQuantity,
                        price: mulchData.price,
                        required_quantity: requiredQuantity,
                        hsn: mulchData.hsn,
                        selected_location: selectedPrice,
                    }
                }
            });
        } else {
            navigate('/Order', {
                state: {
                    name: 'Mulch PCR',
                    available_quantity: totalAvailableQuantity,
                    price: mulchData.price,
                    required_quantity: requiredQuantity,
                    hsn: mulchData.hsn,
                    selected_location: selectedPrice,
                },
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="mulch-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
                <div className="row align-items-center mt-5">
                    <div className="col-md-6">
                        <img
                            src={mulchImage}
                            alt="Mulch"
                            className="img-fluid img-hover-effect"
                            style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h2>Mulch PCR</h2>
                        <p>
                            Mulch PCR is a material applied to the surface of soil. It serves several purposes, including moisture retention, temperature regulation, and weed suppression.
                            Organic mulches, such as wood chips, straw, and leaves, decompose over time, adding nutrients to the soil.
                            Utilizing mulch can enhance the aesthetic appeal of gardens while also promoting healthy plant growth.
                        </p>
                    </div>
                </div>

                {/* Specifications Section */}
                <div className="specifications-section">
                    <h3 className="section-title text-center">SPECIFICATIONS</h3>

                    {/* Total Available Quantity */}
                    <div className="total-available-quantity text-center mb-4">
                        <label className="spec-label">TOTAL AVAILABLE QUANTITY (MT):</label>
                        <span className="spec-value">
                            {totalAvailableQuantity > 0 ? totalAvailableQuantity : 'No Stock'}
                        </span>
                    </div>

                    <div className="row specifications-row">
                        {/* Loading Location */}
                        <div className="col-md-6">
                            <label className="spec-label">LOADING LOCATION:</label>
                            <select className="form-control" value={selectedPrice} onChange={handlePriceChange}>
                                <option value="" disabled>Select a location</option>
                                <option value="ex_chennai" disabled={mulchData.chennai_quantity === 0}>Ex-Chennai</option>
                                <option value="ex_nhavasheva" disabled={mulchData.nhavasheva_quantity === 0}>Ex-Nhavasheva</option>
                                <option value="ex_mundra" disabled={mulchData.mundra_quantity === 0}>Ex-Mundra</option>
                            </select>
                            {errors.selectedPrice && <small className="text-danger">{errors.selectedPrice}</small>}
                        </div>

                        {/* Available Quantity in Selected Location */}
                        <div className="col-md-6">
                            <label className="spec-label">AVAILABLE QUANTITY IN SELECTED LOCATION:</label>
                            <span className="spec-value">
                                {selectedPrice
                                    ? (selectedPrice === "ex_chennai" && mulchData.chennai_quantity) ||
                                    (selectedPrice === "ex_nhavasheva" && mulchData.nhavasheva_quantity) ||
                                    (selectedPrice === "ex_mundra" && mulchData.mundra_quantity)
                                    : 'Available Quantity'}
                            </span>
                        </div>
                    </div>

                    <div className="row mt-3">
                        {/* Price Per MT */}
                        <div className="col-md-6">
                            <label className="spec-label">PRICE PER (MT):</label>
                            <span className="spec-value">
                                {selectedPrice ? `₹${mulchData[selectedPrice]}` : "Price"}
                            </span>
                        </div>

                        {/* HSN */}
                        <div className="col-md-6">
                            <label className="spec-label">HSN:</label>
                            <span className="spec-value">{mulchData.hsn}</span>
                        </div>
                    </div>

                    {/* Required Quantity Section */}
                    <div className="required-quantity-section text-center mt-3">
                        <label className="spec-label">REQUIRED QUANTITY IN (MT):</label>
                        <input
                            type="number"
                            value={requiredQuantity}
                            onChange={handleQuantityChange}
                            placeholder="Enter required quantity"
                            className="form-control required-quantity-input mx-auto"
                            style={{ width: '50%' }}
                        />
                        {errors.requiredQuantity && <small className="text-danger">{errors.requiredQuantity}</small>}
                        {errors.quantityExceeds && <small className="text-danger">{errors.quantityExceeds}</small>}
                    </div>

                    {/* Order Button */}
                    <div className="order-button-section text-center mt-3">
                        <button
                            className="btn"
                            onClick={handleOrder}
                            style={{ backgroundColor: '#28a745', color: 'white' }}
                        >
                            Please Proceed to Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mulch;
