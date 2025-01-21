import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PyroSteelImage from './images/PyroSteel.jpeg'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import './Mulch.css'; 
import logo1 from './images/logo.png';

const PyroSteel = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [pyroSteelData, setPyroSteelData] = useState({
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
    const [selectedPrice, setSelectedPrice] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [quantityExceeds, setQuantityExceeds] = useState('');
    const [totalAvailableQuantity, setTotalAvailableQuantity] = useState(0); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                const pyroSteelItem = items.find(item => item.name === 'Pyro Steel');
                if (pyroSteelItem) {
                    const totalQuantity = pyroSteelItem.chennai_quantity + pyroSteelItem.mundra_quantity + pyroSteelItem.nhavasheva_quantity;
                    setPyroSteelData({
                        chennai_quantity: pyroSteelItem.chennai_quantity,
                        mundra_quantity: pyroSteelItem.mundra_quantity,
                        nhavasheva_quantity: pyroSteelItem.nhavasheva_quantity,
                        price: pyroSteelItem.price,
                        ex_chennai: pyroSteelItem.ex_chennai,
                        ex_nhavasheva: pyroSteelItem.ex_nhavasheva,
                        ex_mundra: pyroSteelItem.ex_mundra,
                        hsn: pyroSteelItem.hsn,
                        default_price: pyroSteelItem.default_price || pyroSteelItem.price || pyroSteelItem.ex_chennai,
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
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;
        if (value === '') {
            setRequiredQuantity('');
            setQuantityExceeds('');
            return;
        }

        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue) && parsedValue > 0) {
            setRequiredQuantity(parsedValue);

            if (selectedPrice) {
                let availableQuantity = 0;
                if (selectedPrice === 'ex_chennai') {
                    availableQuantity = pyroSteelData.chennai_quantity;
                } else if (selectedPrice === 'ex_nhavasheva') {
                    availableQuantity = pyroSteelData.nhavasheva_quantity;
                } else if (selectedPrice === 'ex_mundra') {
                    availableQuantity = pyroSteelData.mundra_quantity;
                }

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

        if (requiredQuantity <= 0 || !requiredQuantity) {
            errors.requiredQuantity = "Required quantity is required and must be greater than zero.";
        }

        if (!selectedPrice) {
            errors.selectedPrice = "Price selection is required.";
        }

        if (selectedPrice) {
            let availableQuantity = 0;
            if (selectedPrice === 'ex_chennai') {
                availableQuantity = pyroSteelData.chennai_quantity;
            } else if (selectedPrice === 'ex_nhavasheva') {
                availableQuantity = pyroSteelData.nhavasheva_quantity;
            } else if (selectedPrice === 'ex_mundra') {
                availableQuantity = pyroSteelData.mundra_quantity;
            }

            if (parseFloat(requiredQuantity) > availableQuantity) {
                setQuantityExceeds('Required quantity exceeds available quantity at the selected location.');
                errors.quantityExceeds = 'Please check available quantity at the selected location.';
            } else {
                setQuantityExceeds('');
            }
        }

        return errors;
    };

    const handleOrder = () => {
        const token = localStorage.getItem('token');
        const errors = validateForm();

        if (Object.keys(errors).length) {
            setFormErrors(errors);
            return;
        }

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
                        pyroSteelData: {
                            name: 'Pyro Steel',
                            available_quantity: totalAvailableQuantity,
                            price: pyroSteelData.price,
                            required_quantity: requiredQuantity,
                            hsn: pyroSteelData.hsn,
                            selected_location: selectedPrice,
                        },
                    },
                });
            }, 0);
        } else {
            navigate('/Order', {
                state: {
                    name: 'Pyro Steel',
                    available_quantity: totalAvailableQuantity,
                    price: pyroSteelData.price,
                    required_quantity: requiredQuantity,
                    hsn: pyroSteelData.hsn,
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
                        src={PyroSteelImage}
                        alt="Pyro Steel"
                        className="img-fluid img-hover-effect"
                        style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2>Pyro Steel</h2>
                    <p>
                        Pyro Steel is a material used in various industrial applications. It serves several purposes, including enhanced durability and strength.
                        Pyro Steel is essential for industries requiring high-performance materials.
                    </p>
                </div>
            </div>

            <div className="specifications-section">
                <h3 className="section-title text-center">SPECIFICATIONS</h3>

                <div className="total-available-quantity text-center mb-4">
                    <label className="spec-label">TOTAL AVAILABLE QUANTITY (MT):</label>
                    <span className="spec-value">{totalAvailableQuantity > 0 ? totalAvailableQuantity : 'No Stock'}</span>
                </div>

                <div className="row specifications-row">
                    <div className="col-md-6">
                        <label className="spec-label">LOADING LOCATION:</label>
                        <select className="form-control" value={selectedPrice} onChange={handlePriceChange}>
                            <option value="" disabled>Select a location</option>
                            <option value="ex_chennai" disabled={pyroSteelData.chennai_quantity === 0}>Ex-Chennai</option>
                            <option value="ex_nhavasheva" disabled={pyroSteelData.nhavasheva_quantity === 0}>Ex-Nhavasheva</option>
                            <option value="ex_mundra" disabled={pyroSteelData.mundra_quantity === 0}>Ex-Mundra</option>
                        </select>
                        {formErrors.selectedPrice && <small className="text-danger">{formErrors.selectedPrice}</small>}
                    </div>

                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY IN SELECTED LOCATION:</label>
                        <span className="spec-value">
                            {selectedPrice
                                ? (selectedPrice === "ex_chennai" && pyroSteelData.chennai_quantity) ||
                                  (selectedPrice === "ex_nhavasheva" && pyroSteelData.nhavasheva_quantity) ||
                                  (selectedPrice === "ex_mundra" && pyroSteelData.mundra_quantity)
                                : 'Available Quantity'}
                        </span>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="spec-value">{selectedPrice ? `₹${pyroSteelData[selectedPrice]}` : "Price"}</span>
                    </div>

                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">{pyroSteelData.hsn}</span>
                    </div>
                </div>

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
                    {formErrors.requiredQuantity && <small className="text-danger">{formErrors.requiredQuantity}</small>}
                    {quantityExceeds && <small className="text-danger">{quantityExceeds}</small>}
                </div>

                <div className="order-button-section text-center mt-3">
                    <button
                        className="btn"
                        onClick={handleOrder}
                        disabled={selectedPrice && (
                            (selectedPrice === 'ex_chennai' && pyroSteelData.chennai_quantity === 0) ||
                            (selectedPrice === 'ex_nhavasheva' && pyroSteelData.nhavasheva_quantity === 0) ||
                            (selectedPrice === 'ex_mundra' && pyroSteelData.mundra_quantity === 0)
                        )}
                        style={{ backgroundColor: '#28a745', color: 'white' }}
                    >
                        {
                            (selectedPrice && (
                                (selectedPrice === 'ex_chennai' && pyroSteelData.chennai_quantity > 0) ||
                                (selectedPrice === 'ex_nhavasheva' && pyroSteelData.nhavasheva_quantity > 0) ||
                                (selectedPrice === 'ex_mundra' && pyroSteelData.mundra_quantity > 0)
                            )) 
                            ? 'Please Proceed to Order' 
                            : 'Out of Stock'
                        }
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PyroSteel;
