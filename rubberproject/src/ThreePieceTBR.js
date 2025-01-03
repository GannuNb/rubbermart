import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThreePieceTBRImage from './images/ThreePieceTBR.jpeg'; // Ensure to have an image
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file
import logo1 from './images/logo.png';

const ThreePieceTBR = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [tbrData, setTbrData] = useState({
        available_quantity: 0,
        price: 0,
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0, // Default price fetched from backend
    });
    const [requiredQuantity, setRequiredQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState(''); // Store selected price option (ex_chennai, ex_nhavasheva, ex_mundra)
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the ThreePieceTBR data
                const tbrItem = items.find(item => item.name === 'Three Piece TBR');

                // Ensure we have the TBR item and default price
                if (tbrItem) {
                    const fetchedDefaultPrice = tbrItem.default_price || tbrItem.price || tbrItem.ex_chennai;

                    setTbrData({
                        available_quantity: tbrItem.available_quantity,
                        price: tbrItem.price,
                        ex_chennai: tbrItem.ex_chennai,
                        ex_nhavasheva: tbrItem.ex_nhavasheva,
                        ex_mundra: tbrItem.ex_mundra,
                        hsn: tbrItem.hsn,
                        default_price: fetchedDefaultPrice,
                    });
                }

                setScrapItems(items); // You can still store all scrap items if needed
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
            setTbrData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setTbrData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setTbrData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setTbrData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    const handleOrder = () => {
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
                        tbrData: {
                            name: 'Three Piece TBR',
                            available_quantity: tbrData.available_quantity,
                            price: tbrData.price,
                            required_quantity: requiredQuantity,
                            hsn: tbrData.hsn,
                        }
                    }
                });
            }, 0);
        } else {
            navigate('/Order', {
                state: {
                    name: 'Three Piece TBR',
                    available_quantity: tbrData.available_quantity,
                    price: tbrData.price,
                    required_quantity: requiredQuantity,
                    hsn: tbrData.hsn,
                },
            });
        }
    };

    return (
        <div className="mulch-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
            <div className="row align-items-center mt-5">
                <div className="col-md-6">
                    <img
                        src={ThreePieceTBRImage}
                        alt="Three Piece TBR"
                        className="img-fluid img-hover-effect"
                        style={{ borderRadius: '8px', width: '72%', marginLeft: '20px' }}
                    />
                </div>
                <div className="col-md-6">
                    <h2 className="mulch-title">Three Piece TBR</h2>
                    <p className="mulch-description">
                        The Three Piece TBR (Truck and Bus Radial) tire is designed for heavy-duty vehicles, offering excellent durability and performance on both highways and off-road terrains.
                        With a robust construction, it provides superior traction, stability, and load-bearing capacity, making it ideal for long-distance transport and industrial applications.
                        Engineered for longevity, the Three Piece TBR tire ensures reduced wear and increased fuel efficiency, making it a cost-effective choice for fleet operators.
                    </p>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="specifications-section">
                <h3 className="specifications-title" style={{ marginTop: '40px' }}>SPECIFICATIONS</h3>
                <div className="row specifications-row" style={{ marginTop: '10px' }}>
                    {/* Available Quantity */}
                    <div className="col-md-6">
                        <label className="spec-label" style={{ color: 'black', fontWeight: 'bold' }}>AVAILABLE QUANTITY IN (MT):</label>
                        <span className="spec-value d-block p-2 border rounded">
                            {tbrData.available_quantity > 0 ? tbrData.available_quantity : 'No Stock'}
                        </span>
                    </div>

                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label" style={{ color: 'black', fontWeight: 'bold' }}>PRICE PER (MT):</label>
                        <span className="spec-value d-block p-2 border rounded">
                            ₹{tbrData.price}
                        </span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label" style={{ color: 'black', fontWeight: 'bold' }}>HSN:</label>
                        <span className="spec-value d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
                            {tbrData.hsn}
                        </span>
                    </div>
                </div>

                {/* Required Quantity Section */}
                {tbrData.available_quantity > 0 && (
                    <div className="required-quantity-section mt-3">
                        <label className="spec-label" style={{ color: 'black', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                            REQUIRED QUANTITY IN (MT):
                        </label>
                        <input
                            type="number"
                            value={requiredQuantity}
                            onChange={(e) => setRequiredQuantity(e.target.value)}
                            placeholder="Enter required quantity"
                            className="form-control required-quantity-input"
                            style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                marginTop: '5px',
                                width: '48%',
                            }}
                        />
                    </div>
                )}

                {/* Price Selection Dropdown */}
                <div className="price-dropdown mt-3">
                    <label className="spec-label">SELECT PRICE:</label>
                    <select
                        className="form-control"
                        value={selectedPrice}
                        onChange={handlePriceChange}
                    >
                        <option value="default">Default Price: ₹{tbrData.default_price || 'N/A'}</option>
                        <option value="ex_chennai">Ex-Chennai: ₹{tbrData.ex_chennai}</option>
                        <option value="ex_nhavasheva">Ex-Nhavasheva: ₹{tbrData.ex_nhavasheva}</option>
                        <option value="ex_mundra">Ex-Mundra: ₹{tbrData.ex_mundra}</option>
                    </select>
                </div>

                {/* Order Button */}
                <div className="order-button-section mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleOrder}
                        disabled={tbrData.available_quantity === 0}
                    >
                        {tbrData.available_quantity > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThreePieceTBR;
