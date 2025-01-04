import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RubberGranulesImage from './images/RubberGranules.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './Mulch.css';
import logo1 from './images/logo.png';

const RubberGranules = () => {
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
    const [requiredQuantity, setRequiredQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                const rubberItem = items.find(item => item.name === 'Rubber Granules/Crum');

                if (rubberItem) {
                    const fetchedDefaultPrice = rubberItem.default_price || rubberItem.price || rubberItem.ex_chennai;

                    setRubberData({
                        available_quantity: rubberItem.available_quantity,
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

    const handleOrder = () => {
        const token = localStorage.getItem('token');

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
                            name: 'Rubber Granules/Crum',
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
                    name: 'Rubber Granules/Crum',
                    available_quantity: Number(rubberData.available_quantity),
                    price: rubberData.price, // Pass the updated price
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
        <>
            <div className="rubber-granules-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
                <div className="row align-items-center mt-5">
                    <div className="col-md-6">
                        <img
                            src={RubberGranulesImage}
                            alt="Rubber Granules"
                            className="img-fluid img-hover-effect"
                            style={{ borderRadius: '8px', width: '80%', marginLeft: '20px' }}
                        />
                    </div>
                    <div className="col-md-6">
                        <h2>Rubber Granules/Crum</h2>
                        <p>
                            Rubber granules are small particles derived from recycled rubber, commonly used in various applications including playgrounds, tracks, and as mulch.
                            They provide excellent shock absorption and moisture retention, making them ideal for landscaping and gardening purposes.
                            Additionally, using rubber granules can help in reducing waste and promoting sustainability.
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
                                {Number(rubberData.available_quantity) > 0 ? rubberData.available_quantity : 'No Stock'}
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
                    <div className="row mt-3">
                    {/* Price Selection Dropdown */}
                    <div className="price-dropdown col-md-6">
                        <label className="spec-label">SELECT PRICE:</label>
                        <select
                            className="form-control"
                            value={selectedPrice}
                            onChange={handlePriceChange} // Use the handler for price change
                        >
                            {/* Placeholder option */}
                            <option value="" disabled>
                                Select a location
                            </option>
                            <option value="ex_chennai">Ex-Chennai</option>
                            <option value="ex_nhavasheva">Ex-Nhavasheva</option>
                            <option value="ex_mundra">Ex-Mundra</option>
                        </select>
                    </div>
                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="spec-value">
                            {selectedPrice ? `₹${rubberData[selectedPrice]}` : "Select a location"}
                        </span>
                    </div>
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
        </>
    );
};

export default RubberGranules;
