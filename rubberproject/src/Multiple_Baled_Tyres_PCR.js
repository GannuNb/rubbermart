import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MultipleBaledTyresPCRImage from './images/MultipleBaledTyresPCR.jpeg'; // Ensure to have an image for multiple baled tyres
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './Mulch.css'; // Import your CSS file
import logo1 from './images/logo.png';

const Multiple_Baled_Tyres_PCR = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [tyreData, setTyreData] = useState({
        available_quantity: 0,
        price: 0,
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0,
    });
    const [requiredQuantity, setRequiredQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState(''); // Store selected price option
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the Baled Tyres PCR data
                const tyreItem = items.find(item => item.name === 'Baled Tyres PCR');

                // Ensure we have the tyre item and default price
                if (tyreItem) {
                    const fetchedDefaultPrice = tyreItem.default_price || tyreItem.price || tyreItem.ex_chennai;

                    setTyreData({
                        available_quantity: Number(tyreItem.available_quantity),
                        price: tyreItem.price,
                        ex_chennai: tyreItem.ex_chennai,
                        ex_nhavasheva: tyreItem.ex_nhavasheva,
                        ex_mundra: tyreItem.ex_mundra,
                        hsn: tyreItem.hsn,
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
            setTyreData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setTyreData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setTyreData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setTyreData(prevState => ({ ...prevState, price: prevState.default_price }));
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
                        tyreData: {
                            name: 'Baled Tyres PCR',
                            available_quantity: tyreData.available_quantity,
                            price: tyreData.price,
                            required_quantity: requiredQuantity,
                            hsn: tyreData.hsn,
                        },
                    },
                });
            }, 0);
        } else {
            navigate('/Order', {
                state: {
                    name: 'Baled Tyres PCR',
                    available_quantity: tyreData.available_quantity,
                    price: tyreData.price,
                    required_quantity: requiredQuantity,
                    hsn: tyreData.hsn,
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
                <h3 className="section-title">SPECIFICATIONS</h3>

                <div className="row specifications-row">
                    {/* Available Quantity */}
                    <div className="col-md-6">
                        <label className="spec-label">AVAILABLE QUANTITY IN (MT):</label>

                        <span className="spec-value">
                            {Number(tyreData.available_quantity) > 0 ? tyreData.available_quantity : 'No Stock'}
                        </span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label">HSN:</label>
                        <span className="spec-value">
                            {tyreData.hsn}
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
                    <div className="price-dropdown mt-1 col-md-6">
                        <label className="spec-label">SELECT PRICE:</label>
                        <select
                            className="form-control"
                            value={selectedPrice}
                            onChange={handlePriceChange}
                        >
                            {/* Placeholder option */}
                            <option value="" disabled>
                                Select a location
                            </option>                         <option value="ex_chennai">Ex-Chennai: ₹{tyreData.ex_chennai}</option>
                            <option value="ex_nhavasheva">Ex-Nhavasheva: ₹{tyreData.ex_nhavasheva}</option>
                            <option value="ex_mundra">Ex-Mundra: ₹{tyreData.ex_mundra}</option>
                        </select>
                    </div>
                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label">PRICE PER (MT):</label>
                        <span className="spec-value">
                            {selectedPrice ? `₹${tyreData[selectedPrice]}` : "Price"}
                        </span>
                    </div>
                </div>

                {/* Order Button */}
                <div className="order-button-section mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleOrder}
                        disabled={Number(tyreData.available_quantity) === 0} // Ensure it's treated as a number
                    >
                        {Number(tyreData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Multiple_Baled_Tyres_PCR;
