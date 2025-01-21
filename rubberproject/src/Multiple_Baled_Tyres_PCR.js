    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import MultipleBaledTyresPCRImage from './images/MultipleBaledTyresPCR.jpeg';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import { useNavigate, useLocation } from 'react-router-dom';
    import './Mulch.css'; // Import your CSS file
    import logo1 from './images/logo.png';

    const Multiple_Baled_Tyres_PCR = () => {
        const [scrapItems, setScrapItems] = useState([]);
        const [tyreData, setTyreData] = useState({
            chennai_quantity: 0,
            mundra_quantity: 0,
            nhavasheva_quantity: 0,
            price: 0,
            ex_chennai: 0,
            ex_nhavasheva: 0,
            ex_mundra: 0,
            hsn: '',
            default_price: 0,
        });
        const [requiredQuantity, setRequiredQuantity] = useState('');
        const [selectedPrice, setSelectedPrice] = useState(''); // Store selected price option
        const [formErrors, setFormErrors] = useState({}); // To store validation errors
        const [quantityExceeds, setQuantityExceeds] = useState(''); // New error state for quantity exceeding
        const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0); // State for total available quantity
        const navigate = useNavigate();
        const location = useLocation();

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                    const items = response.data.scrap_items;

                    // Find the Baled Tyres PCR data
                    const tyreItem = items.find(item => item.name === 'Baled Tyres PCR');

                    if (tyreItem) {
                        const totalQuantity = tyreItem.chennai_quantity + tyreItem.mundra_quantity + tyreItem.nhavasheva_quantity;

                        setTyreData({
                            chennai_quantity: tyreItem.chennai_quantity,
                            mundra_quantity: tyreItem.mundra_quantity,
                            nhavasheva_quantity: tyreItem.nhavasheva_quantity,
                            price: tyreItem.price,
                            ex_chennai: tyreItem.ex_chennai,
                            ex_nhavasheva: tyreItem.ex_nhavasheva,
                            ex_mundra: tyreItem.ex_mundra,
                            hsn: tyreItem.hsn,
                            default_price: tyreItem.default_price || tyreItem.price || tyreItem.ex_chennai,
                        });

                        // Set total available quantity (sum of all location quantities)
                        setTotalAvailableQuantity(totalQuantity);
                    }

                    setScrapItems(items);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }, []);

        // Handle price location change
        const handlePriceChange = (event) => {
            const selectedOption = event.target.value;
            setSelectedPrice(selectedOption);

            // Set the price based on the selected location
            if (selectedOption === 'ex_chennai') {
                setTyreData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
            } else if (selectedOption === 'ex_nhavasheva') {
                setTyreData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
            } else if (selectedOption === 'ex_mundra') {
                setTyreData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
            } else if (selectedOption === 'default') {
                setTyreData(prevState => ({ ...prevState, price: prevState.default_price }));
            }
        };

        // Handle quantity change and validation
        const handleQuantityChange = (event) => {
            const value = event.target.value;

            // If the value is empty, allow it
            if (value === '') {
                setRequiredQuantity('');
                setQuantityExceeds('');
                return;
            }

            // Parse the value to ensure it's a number
            const parsedValue = parseFloat(value);

            // If the value is a valid number and greater than 0, update the quantity
            if (!isNaN(parsedValue) && parsedValue > 0) {
                setRequiredQuantity(parsedValue);

                // If a location is selected, validate against the available quantity
                if (selectedPrice) {
                    let availableQuantity = 0;
                    if (selectedPrice === 'ex_chennai') {
                        availableQuantity = tyreData.chennai_quantity;
                    } else if (selectedPrice === 'ex_nhavasheva') {
                        availableQuantity = tyreData.nhavasheva_quantity;
                    } else if (selectedPrice === 'ex_mundra') {
                        availableQuantity = tyreData.mundra_quantity;
                    }

                    // Check if the required quantity exceeds the available quantity
                    if (parsedValue > availableQuantity) {
                        setQuantityExceeds('Required quantity exceeds available quantity at selected location.');
                    } else {
                        setQuantityExceeds('');
                    }
                }
            }
        };

        const validateForm = () => {
            let errors = {};

            // Check for required quantity
            if (requiredQuantity <= 0 || !requiredQuantity) {
                errors.requiredQuantity = "Required quantity is required and must be greater than zero.";
            }

            // Check for location selection
            if (!selectedPrice) {
                errors.selectedPrice = "Price selection is required.";
            }

            // Only validate against available quantity if a location is selected
            if (selectedPrice) {
                let availableQuantity = 0;
                if (selectedPrice === 'ex_chennai') {
                    availableQuantity = tyreData.chennai_quantity;
                } else if (selectedPrice === 'ex_nhavasheva') {
                    availableQuantity = tyreData.nhavasheva_quantity;
                } else if (selectedPrice === 'ex_mundra') {
                    availableQuantity = tyreData.mundra_quantity;
                }

                if (parseFloat(requiredQuantity) > availableQuantity) {
                    setQuantityExceeds('Required quantity exceeds available quantity at the selected location.');
                    errors.quantityExceeds = 'Please check available quantity at the selected location.';
                } else {
                    setQuantityExceeds(''); // Reset quantity exceeds error if valid
                }
            }

            return errors;
        };

        // Handle order submission
        const handleOrder = () => {
            const token = localStorage.getItem('token');

            const errors = validateForm();
            if (Object.keys(errors).length) {
                setFormErrors(errors);
                return; // Stop execution if there are validation errors
            }

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
                            tyreData: {
                                name: 'Baled Tyres PCR',
                                available_quantity: totalAvailableQuantity,
                                price: tyreData.price,
                                required_quantity: requiredQuantity,
                                hsn: tyreData.hsn,
                                selected_location: selectedPrice, // Pass selected location to login
                            },
                        },
                    });
                }, 0);
            } else {
                navigate('/Order', {
                    state: {
                        name: 'Baled Tyres PCR',
                        available_quantity: totalAvailableQuantity,
                        price: tyreData.price,
                        required_quantity: requiredQuantity,
                        hsn: tyreData.hsn,
                        selected_location: selectedPrice, // Pass selected location to the order page
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
                            src={MultipleBaledTyresPCRImage}
                            alt="Baled Tyres PCR"
                            className="img-fluid img-hover-effect"
                            style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h2>Baled Tyres PCR</h2>
                        <p>
                            Baled Tyres PCR are used in various recycling applications, such as energy recovery and raw material sourcing.
                            Proper disposal of tyres can significantly reduce the environmental impact.
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
                                <option value="ex_chennai" disabled={tyreData.chennai_quantity === 0}>
                                    Ex-Chennai
                                </option>
                                <option value="ex_nhavasheva" disabled={tyreData.nhavasheva_quantity === 0}>
                                    Ex-Nhavasheva
                                </option>
                                <option value="ex_mundra" disabled={tyreData.mundra_quantity === 0}>
                                    Ex-Mundra
                                </option>
                            </select>
                            {formErrors.selectedPrice && <small className="text-danger">{formErrors.selectedPrice}</small>}
                        </div>

                        {/* Available Quantity in Selected Location */}
                        <div className="col-md-6">
                            <label className="spec-label">AVAILABLE QUANTITY IN SELECTED LOCATION:</label>
                            <span className="spec-value">
                                {selectedPrice
                                    ? (selectedPrice === "ex_chennai" && tyreData.chennai_quantity) ||
                                    (selectedPrice === "ex_nhavasheva" && tyreData.nhavasheva_quantity) ||
                                    (selectedPrice === "ex_mundra" && tyreData.mundra_quantity)
                                    : 'Available Quantity'}
                            </span>
                        </div>


                    </div>

                    <div className="row mt-3">
                        {/* Price Per MT */}
                        <div className="col-md-6">
                            <label className="spec-label">PRICE PER (MT):</label>
                            <span className="spec-value">{selectedPrice ? `₹${tyreData[selectedPrice]}` : "Price"}</span>
                        </div>

                        {/* HSN */}
                        <div className="col-md-6">
                            <label className="spec-label">HSN:</label>
                            <span className="spec-value">{tyreData.hsn}</span>
                        </div>
                    </div>

                    {/* Centered Required Quantity Section */}
                    <div className="required-quantity-section text-center mt-3">
                        <label className="spec-label">REQUIRED QUANTITY IN (MT):</label>
                        <input
                            type="number"
                            value={requiredQuantity}
                            onChange={handleQuantityChange}
                            placeholder="Enter required quantity"
                            className="form-control required-quantity-input mx-auto"  /* Center the input field */
                            style={{ width: '50%' }}  /* Adjust the width if needed */
                        />
                        {formErrors.requiredQuantity && <small className="text-danger">{formErrors.requiredQuantity}</small>}
                        {quantityExceeds && <small className="text-danger">{quantityExceeds}</small>} {/* Display new error */}
                    </div>

                    {/* Centered Order Button Section */}
                    <div className="order-button-section text-center mt-3">
                        <button
                            className="btn"
                            onClick={handleOrder}
                            disabled={totalAvailableQuantity === 0}
                            style={{ backgroundColor: '#28a745', color: 'white' }} // Custom greenish background
                        >
                            {totalAvailableQuantity > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                        </button>
                    </div>

                </div>

            </div>
        );
    };

    export default Multiple_Baled_Tyres_PCR;
