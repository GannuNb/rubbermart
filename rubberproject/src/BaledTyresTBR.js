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
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0); // State for total available quantity

    // Fetch Baled Tyres TBR data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                const item = items.find(item => item.name === 'Baled Tyres TBR');

                if (item) {
                    const fetchedDefaultPrice = item.default_price || item.price || item.ex_chennai;
                    const totalQuantity = item.chennai_quantity + item.mundra_quantity + item.nhavasheva_quantity;

                    setMulchData({
                        chennai_quantity: item.chennai_quantity,
                        mundra_quantity: item.mundra_quantity,
                        nhavasheva_quantity: item.nhavasheva_quantity,
                        available_quantity: Number(item.available_quantity),
                        price: fetchedDefaultPrice,
                        ex_chennai: item.ex_chennai,
                        ex_nhavasheva: item.ex_nhavasheva,
                        ex_mundra: item.ex_mundra,
                        hsn: item.hsn,
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

    // Check if location option should be disabled
    const isLocationDisabled = (location) => {
        switch(location) {
            case 'ex_chennai':
                return mulchData.chennai_quantity === 0;
            case 'ex_nhavasheva':
                return mulchData.nhavasheva_quantity === 0;
            case 'ex_mundra':
                return mulchData.mundra_quantity === 0;
            default:
                return false;
        }
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

        // Check if required quantity exceeds available quantity for the selected location
        let availableQuantityForLocation = 0;

        if (selectedPrice === 'ex_chennai') {
            availableQuantityForLocation = mulchData.chennai_quantity;
        } else if (selectedPrice === 'ex_nhavasheva') {
            availableQuantityForLocation = mulchData.nhavasheva_quantity;
        } else if (selectedPrice === 'ex_mundra') {
            availableQuantityForLocation = mulchData.mundra_quantity;
        }

        if (parseFloat(requiredQuantity) > parseFloat(availableQuantityForLocation)) {
            formIsValid = false;
            errors.quantityExceeds = 'Required quantity exceeds available quantity at the selected location.';
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
                            available_quantity: totalAvailableQuantity,
                            price: mulchData.price,
                            required_quantity: requiredQuantity,
                            hsn: mulchData.hsn,
                            selected_location: selectedPrice,
                        }
                    }
                });
            }, 0);
        } else {
            navigate('/Order', {
                state: {
                    name: 'Baled Tyres TBR',
                    available_quantity: totalAvailableQuantity,
                    price: mulchData.price,
                    required_quantity: requiredQuantity,
                    hsn: mulchData.hsn,
                    selected_location: selectedPrice,
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
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>Baled Tyres TBR</h2>
                    <p>
                        Baled Tyres TBR are compressed Tyre bundles primarily used for recycling purposes, construction, and environmental applications. These bales are highly durable and cost-efficient.
                    </p>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="specifications-section">
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
                            <option value="ex_chennai" disabled={isLocationDisabled('ex_chennai')}>Ex-Chennai</option>
                            <option value="ex_nhavasheva" disabled={isLocationDisabled('ex_nhavasheva')}>Ex-Nhavasheva</option>
                            <option value="ex_mundra" disabled={isLocationDisabled('ex_mundra')}>Ex-Mundra</option>
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
                        <span className="spec-value">{selectedPrice ? `₹${mulchData[selectedPrice]}` : "Price"}</span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">{mulchData.hsn}</span>
                    </div>
                </div>

                {/* Centered Required Quantity Section */}
                <div className="required-quantity-section text-center mt-3">
                    <label className="spec-label">REQUIRED QUANTITY IN (MT):</label>
                    <input
                        type="number"
                        value={requiredQuantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Ensure that the input is either a positive number or zero
                            if (value >= 0) {
                                setRequiredQuantity(value);
                            }
                        }}
                        placeholder="Enter required quantity"
                        className="form-control required-quantity-input mx-auto"  /* Center the input field */
                        style={{ width: '50%' }}  /* Adjust the width if needed */
                        min="1"  /* Ensure input cannot go below 0 */
                        step="1"  /* Optional: Only allow integer values */
                    />

                    {errors.requiredQuantity && <small className="text-danger">{errors.requiredQuantity}</small>}
                    {errors.quantityExceeds && <small className="text-danger">{errors.quantityExceeds}</small>}
                </div>

                {/* Centered Order Button Section */}
                <div className="order-button-section text-center mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleOrder}
                        disabled={mulchData.available_quantity === 0}
                    >
                        {mulchData.available_quantity > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BaledTyresTBR;
