import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pyrooilImage from './images/pyro_oil2.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import logo1 from './images/logo.png';
import './Mulch.css';

const Pyrooil = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [pyrooilData, setPyrooilData] = useState({
        available_quantity: 0,
        price: 0,
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0,
        chennai_quantity: 0,
        mundra_quantity: 0,
        nhavasheva_quantity: 0,
    });
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');
    const [errors, setErrors] = useState({ requiredQuantity: '', selectedPrice: '', quantityExceeds: '' });
    const navigate = useNavigate();
    const location = useLocation();
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                const pyrooilItem = items.find(item => item.name === 'Pyro Oil');
                if (pyrooilItem) {
                    const fetchedDefaultPrice = pyrooilItem.default_price || pyrooilItem.price || pyrooilItem.ex_chennai;
                    const totalQuantity = pyrooilItem.chennai_quantity + pyrooilItem.mundra_quantity + pyrooilItem.nhavasheva_quantity;

                    setPyrooilData({
                        chennai_quantity: pyrooilItem.chennai_quantity,
                        mundra_quantity: pyrooilItem.mundra_quantity,
                        nhavasheva_quantity: pyrooilItem.nhavasheva_quantity,
                        available_quantity: Number(pyrooilItem.available_quantity),
                        price: pyrooilItem.price,
                        ex_chennai: pyrooilItem.ex_chennai,
                        ex_nhavasheva: pyrooilItem.ex_nhavasheva,
                        ex_mundra: pyrooilItem.ex_mundra,
                        hsn: pyrooilItem.hsn,
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
            setPyrooilData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setPyrooilData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setPyrooilData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setPyrooilData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;

        // Ensure only valid numbers greater than 0 are allowed
        if (value === '' || (value > 0 && !isNaN(value))) {
            setRequiredQuantity(value);
            setErrors((prevState) => ({ ...prevState, quantityExceeds: '' }));

            // Check if the quantity exceeds available quantity at selected location
            if (selectedPrice) {
                let availableQuantity = 0;
                if (selectedPrice === 'ex_chennai') {
                    availableQuantity = pyrooilData.chennai_quantity;
                } else if (selectedPrice === 'ex_nhavasheva') {
                    availableQuantity = pyrooilData.nhavasheva_quantity;
                } else if (selectedPrice === 'ex_mundra') {
                    availableQuantity = pyrooilData.mundra_quantity;
                }

                if (parseFloat(value) > availableQuantity) {
                    setErrors((prevState) => ({
                        ...prevState,
                        quantityExceeds: 'Required quantity exceeds available quantity at selected location.',
                    }));
                }
            }
        } else {
            setErrors((prevState) => ({
                ...prevState,
                requiredQuantity: 'Please enter a valid quantity greater than 0.',
            }));
        }
    };

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

        if (parseFloat(requiredQuantity) > parseFloat(pyrooilData.available_quantity)) {
            formIsValid = false;
            errors.quantityExceeds = 'Required quantity exceeds available quantity.';
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
                        pyrooilData: {
                            name: 'Pyro Oil',
                            available_quantity: pyrooilData.available_quantity,
                            price: pyrooilData.price,
                            required_quantity: requiredQuantity,
                            hsn: pyrooilData.hsn,
                            selected_location: selectedPrice,
                        },
                    },
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
                    selected_location: selectedPrice,
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
                        src={pyrooilImage}
                        alt="Pyrooil"
                        className="img-fluid img-hover-effect"
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>Pyro Oil</h2>
                    <p>
                        Pyrooil is a by-product of pyrolysis, used for fuel, lubricants, and chemical processing.
                        It offers a sustainable alternative to traditional fuels and contributes to effective waste management.
                    </p>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="specifications-section mt-4">
                <h3 className="section-title text-center">SPECIFICATIONS</h3>

                {/* Total Available Quantity */}
                <div className="total-available-quantity text-center mb-4">
                    <label className="spec-label">TOTAL AVAILABLE QUANTITY (MT):</label>
                    <span className="spec-value">{totalAvailableQuantity > 0 ? totalAvailableQuantity : 'No Stock'}</span>
                </div>

                <div className="row specifications-row">
                    {/* Loading Location */}
                    <div className="col-md-6">
                        <label className="spec-label">LOADING LOCATION:</label>
                        <select className="form-control" value={selectedPrice} onChange={handlePriceChange}>
                            <option value="" disabled>Select a location</option>
                            <option value="ex_chennai" disabled={pyrooilData.chennai_quantity === 0}>
                                Ex-Chennai
                            </option>
                            <option value="ex_nhavasheva" disabled={pyrooilData.nhavasheva_quantity === 0}>
                                Ex-Nhavasheva
                            </option>
                            <option value="ex_mundra" disabled={pyrooilData.mundra_quantity === 0}>
                                Ex-Mundra
                            </option>
                        </select>
                        {errors.selectedPrice && <small className="text-danger">{errors.selectedPrice}</small>}
                    </div>

                    {/* Available Quantity in Selected Location */}
                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY IN SELECTED LOCATION:</label>
                        <span className="spec-value">
                            {selectedPrice
                                ? (selectedPrice === "ex_chennai" && pyrooilData.chennai_quantity) ||
                                  (selectedPrice === "ex_nhavasheva" && pyrooilData.nhavasheva_quantity) ||
                                  (selectedPrice === "ex_mundra" && pyrooilData.mundra_quantity)
                                : 'Available Quantity'}
                        </span>
                    </div>
                </div>

                <div className="row mt-3">
                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="spec-value">
                            {selectedPrice ? `₹${pyrooilData[selectedPrice]}` : "Price"}
                        </span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">{pyrooilData.hsn}</span>
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
                        disabled={Number(pyrooilData.available_quantity) === 0 || errors.quantityExceeds}
                        style={{ backgroundColor: '#28a745', color: 'white' }}
                    >
                        {Number(pyrooilData.available_quantity) > 0 && !errors.quantityExceeds ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pyrooil;
