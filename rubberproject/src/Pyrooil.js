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
        price: 0, // dynamic price based on selection
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

                // Find the Pyrooil data
                const pyrooilItem = items.find(item => item.name === 'Pyro Oil');

                if (pyrooilItem) {
                    const fetchedDefaultPrice = pyrooilItem.default_price || pyrooilItem.price || pyrooilItem.ex_chennai;

                    setPyrooilData({
                        available_quantity: Number(pyrooilItem.available_quantity),
                        price: pyrooilItem.price, // Initial price
                        ex_chennai: pyrooilItem.ex_chennai,
                        ex_nhavasheva: pyrooilItem.ex_nhavasheva,
                        ex_mundra: pyrooilItem.ex_mundra,
                        hsn: pyrooilItem.hsn,
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
            setPyrooilData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setPyrooilData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setPyrooilData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setPyrooilData(prevState => ({ ...prevState, price: prevState.default_price }));
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
                        pyrooilData: {
                            name: 'Pyro Oil',
                            available_quantity: pyrooilData.available_quantity,
                            price: pyrooilData.price,
                            required_quantity: requiredQuantity,
                            hsn: pyrooilData.hsn,
                        }
                    }
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
                },
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="pyrooil-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
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
                    <h3>SPECIFICATIONS</h3>

                    <div className="row">
                        {/* Available Quantity */}
                        <div className="col-md-6">
                            <label>AVAILABLE QUANTITY IN (MT):</label>

                            <span className="spec-value">
                                {Number(pyrooilData.available_quantity) > 0 ? pyrooilData.available_quantity : 'No Stock'}
                            </span>
                        </div>

                        {/* HSN */}
                        <div className="col-md-6">
                            <label>HSN:</label>
                            <span className="d-block p-2 border rounded spec-value">{pyrooilData.hsn}</span>
                        </div>
                    </div>

                    {/* Required Quantity */}
                    <div className="mt-3">
                        <label>REQUIRED QUANTITY IN (MT):</label>
                        <input
                            type="number"
                            value={requiredQuantity}
                            onChange={(e) => setRequiredQuantity(e.target.value)}
                            placeholder="Enter required quantity"
                            className="form-control"
                        />
                    </div>

                    <div className="row mt-3">
                        {/* Price Selection Dropdown */}
                        <div className="mt-1 col-md-6">
                            <label>SELECT PRICE:</label>
                            <select
                                className="form-control"
                                value={selectedPrice}
                                onChange={handlePriceChange}
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
                            <label>PRICE PER (MT):</label>
                            <span className="d-block p-2 border rounded spec-value">
                                {selectedPrice ? `₹${pyrooilData[selectedPrice]}` : "Price"}

                            </span>
                        </div>
                    </div>
                    {/* Order Button */}
                    <div className="mt-3">

                        <button
                            className="btn btn-primary"
                            onClick={handleOrder}
                            disabled={Number(pyrooilData.available_quantity) === 0} // Ensure it's treated as a number
                        >
                            {Number(pyrooilData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pyrooil;
