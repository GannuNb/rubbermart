import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShreddsImage from './images/Shredds.jpeg'; // Ensure to have an image for Shredds
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file
import logo1 from './images/logo.png';

const Shredds = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [shreddsData, setShreddsData] = useState({
        available_quantity: 0,
        price: 0,
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0,
        chennai_quantity: 0,
        nhavasheva_quantity: 0,
        mundra_quantity: 0,
    });
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(''); // Store selected price option
    const [errors, setErrors] = useState({
        requiredQuantity: '',
        selectedPrice: '',
        quantityExceeds: '' // New error state for quantity check
    }); // Track errors
    const navigate = useNavigate();
    const location = useLocation();
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0); // State for total available quantity


    // Fetch scrap data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the shredds data
                const shreddsItem = items.find(item => item.name === 'Shreds');

                if (shreddsItem) {
                    // If backend does not send default_price, fallback to another price option
                    const fetchedDefaultPrice = shreddsItem.default_price || shreddsItem.price || shreddsItem.ex_chennai;
                    const totalQuantity = shreddsItem.chennai_quantity + shreddsItem.mundra_quantity + shreddsItem.nhavasheva_quantity;

                    setShreddsData({
                        chennai_quantity: shreddsItem.chennai_quantity,
                        mundra_quantity: shreddsItem.mundra_quantity,
                        nhavasheva_quantity: shreddsItem.nhavasheva_quantity,
                        available_quantity: Number(shreddsItem.available_quantity),
                        price: shreddsItem.price,
                        ex_chennai: shreddsItem.ex_chennai,
                        ex_nhavasheva: shreddsItem.ex_nhavasheva,
                        ex_mundra: shreddsItem.ex_mundra,
                        hsn: shreddsItem.hsn,
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

    // Handle price selection change
    const handlePriceChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedPrice(selectedOption);

        if (selectedOption === 'ex_chennai') {
            setShreddsData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setShreddsData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setShreddsData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setShreddsData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    // Validate form fields
    const validateFields = () => {
        let formIsValid = true;
        let errors = { requiredQuantity: '', selectedPrice: '', quantityExceeds: '' };

        if (!requiredQuantity || requiredQuantity <= 0) {
            formIsValid = false;
            errors.requiredQuantity = 'Required quantity must be greater than 0.';
        }

        if (!selectedPrice) {
            formIsValid = false;
            errors.selectedPrice = 'Please select a price option';
        }

        // Check if required quantity exceeds available quantity based on the selected location
        let availableQuantity = 0;
        if (selectedPrice === 'ex_chennai') {
            availableQuantity = shreddsData.chennai_quantity;
        } else if (selectedPrice === 'ex_nhavasheva') {
            availableQuantity = shreddsData.nhavasheva_quantity;
        } else if (selectedPrice === 'ex_mundra') {
            availableQuantity = shreddsData.mundra_quantity;
        } else {
            availableQuantity = shreddsData.available_quantity;
        }

        if (parseFloat(requiredQuantity) > availableQuantity) {
            formIsValid = false;
            errors.quantityExceeds = 'Required quantity exceeds available quantity in the selected location.';
        }

        setErrors(errors);
        return formIsValid;
    };

    // Handle order submission
    const handleOrder = () => {
        if (!validateFields()) {
            return; // Don't proceed if validation fails
        }

        const token = localStorage.getItem('token'); // Replace 'authToken' with your token key

        if (!token) {
            // Redirect to login if the user is not logged in
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
                        shreddsData: {
                            name: 'Shreds',
                            available_quantity: totalAvailableQuantity,
                            price: shreddsData.price,
                            required_quantity: requiredQuantity,
                            hsn: shreddsData.hsn,
                            selected_location: selectedPrice,
                        }
                    }
                });
            }, 0);
        } else {
            // Redirect to order page with necessary data
            navigate('/Order', {
                state: {
                    name: 'Shreds',
                    available_quantity: totalAvailableQuantity,
                    price: shreddsData.price,
                    required_quantity: requiredQuantity,
                    hsn: shreddsData.hsn,
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
                        src={ShreddsImage}
                        alt="Shredds"
                        className="img-fluid img-hover-effect"
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px', height: '300px' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>Shreds</h2>
                    <p>
                        Shreds are processed organic materials commonly used as mulch in gardening and landscaping.
                        They help retain moisture, suppress weeds, and regulate soil temperature while providing nutrients as they decompose.
                        Utilizing shreds can significantly improve soil health and enhance the appearance of gardens.
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
                            <option value="ex_chennai" disabled={shreddsData.chennai_quantity === 0}>Ex-Chennai</option>
                            <option value="ex_nhavasheva" disabled={shreddsData.nhavasheva_quantity === 0}>Ex-Nhavasheva</option>
                            <option value="ex_mundra" disabled={shreddsData.mundra_quantity === 0}>Ex-Mundra</option>
                        </select>
                        {errors.selectedPrice && <small className="text-danger">{errors.selectedPrice}</small>}
                    </div>

                    {/* Available Quantity in Selected Location */}
                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY IN SELECTED LOCATION:</label>
                        <span className="spec-value">
                            {selectedPrice
                                ? (selectedPrice === "ex_chennai" && shreddsData.chennai_quantity) ||
                                  (selectedPrice === "ex_nhavasheva" && shreddsData.nhavasheva_quantity) ||
                                  (selectedPrice === "ex_mundra" && shreddsData.mundra_quantity)
                                : 'Available Quantity'}
                        </span>
                    </div>
                </div>

                <div className="row mt-3">
                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="spec-value">{selectedPrice ? `₹${shreddsData[selectedPrice]}` : "Price"}</span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">{shreddsData.hsn}</span>
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
                            if (value > 0) {
                                setRequiredQuantity(value); // Update with valid input
                            } else {
                                setRequiredQuantity(''); // Prevent 0 or negative numbers
                            }
                        }}
                        placeholder="Enter required quantity"
                        className="form-control required-quantity-input mx-auto"
                        style={{ width: '50%' }}
                    />
                    {errors.requiredQuantity && <small className="text-danger">{errors.requiredQuantity}</small>}
                    {errors.quantityExceeds && <small className="text-danger">{errors.quantityExceeds}</small>}
                </div>

                {/* Centered Order Button Section */}
                <div className="order-button-section text-center mt-3">
                    <button
                        className="btn"
                        onClick={handleOrder}
                        disabled={shreddsData.available_quantity === 0}
                        style={{ backgroundColor: '#28a745', color: 'white' }}
                    >
                        {shreddsData.available_quantity > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Shredds;
