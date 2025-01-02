import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mulchImage from './images/mulch.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import './Mulch.css';
import logo1 from './images/logo.png';

const Mulch = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [mulchData, setMulchData] = useState({
        available_quantity: 0,
        price: 0, // dynamic price based on selection
        ex_chennai: 0,
        ex_nhavasheva: 0,
        ex_mundra: 0,
        hsn: '',
        default_price: 0, // Default price fetched from backend
    });
    const [requiredQuantity, setRequiredQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState(''); // Store selected price option (ex_chennai, ex_nhavasheva, ex_mundra)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const items = response.data.scrap_items;

                // Find the mulch data
                const mulchItem = items.find(item => item.name === 'Mulch PCR');

                // Ensure we have the mulch item and default price
                if (mulchItem) {
                    // If backend does not send default_price, fallback to a price (e.g., mulchItem.price or ex_chennai)
                    const fetchedDefaultPrice = mulchItem.default_price || mulchItem.price || mulchItem.ex_chennai;

                    setMulchData({
                        available_quantity: Number(mulchItem.available_quantity),
                        price: mulchItem.price,
                        ex_chennai: mulchItem.ex_chennai,
                        ex_nhavasheva: mulchItem.ex_nhavasheva,
                        ex_mundra: mulchItem.ex_mundra,
                        hsn: mulchItem.hsn,
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

        // Update the main price based on the selected dropdown option, but don't modify the constant default price
        if (selectedOption === 'ex_chennai') {
            setMulchData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setMulchData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setMulchData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            // If default price is selected, use the correct value
            setMulchData(prevState => ({ ...prevState, price: prevState.default_price }));
        }
    };

    const handleOrder = () => {
        const token = localStorage.getItem('token'); // Replace 'authToken' with your token key

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
                        mulchData: {
                            name: 'Mulch PCR',
                            available_quantity: mulchData.available_quantity,
                            price: mulchData.price,
                            required_quantity: requiredQuantity,
                            hsn: mulchData.hsn,
                        }
                    }
                });
            }, 0);

        } else {
            navigate('/Order', {
                state: {
                    name: 'Mulch PCR',
                    available_quantity: mulchData.available_quantity,
                    price: mulchData.price, // Pass the updated price
                    required_quantity: requiredQuantity,
                    hsn: mulchData.hsn,
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
                    <h3 className="section-title">SPECIFICATIONS</h3>

                    <div className="row specifications-row">
                        {/* Available Quantity */}
                        <div className="col-md-6">
                            <label className="spec-label">AVAILABLE QUANTITY IN (MT):</label>
                            <span className="spec-value">
    {Number(mulchData.available_quantity) > 0 ? mulchData.available_quantity : 'No Stock'}
</span>

                        </div>

                        {/* Price Per MT */}
                        <div className="col-md-6">
                            <label className="spec-label">PRICE PER (MT):</label>
                            <span className="spec-value">
                                ₹{mulchData.price}
                            </span>
                        </div>

                        {/* HSN */}
                        <div className="col-md-6">
                            <label className="spec-label">HSN:</label>
                            <span className="spec-value">
                                {mulchData.hsn}
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

                    {/* Price Selection Dropdown */}
                    <div className="price-dropdown mt-3">
                        <label className="spec-label">SELECT PRICE:</label>
                        <select
                            className="form-control"
                            value={selectedPrice}
                            onChange={handlePriceChange} // Use the handler for price change
                        >
                            {/* Allow the user to select the default price */}
                            <option value="default">Default Price: ₹{mulchData.default_price || 'N/A'}</option>
                            <option value="ex_chennai">Ex-Chennai: ₹{mulchData.ex_chennai}</option>
                            <option value="ex_nhavasheva">Ex-Nhavasheva: ₹{mulchData.ex_nhavasheva}</option>
                            <option value="ex_mundra">Ex-Mundra: ₹{mulchData.ex_mundra}</option>
                        </select>
                    </div>

                    {/* Order Button */}
                    <div className="order-button-section mt-3">
                    <button
    className="btn btn-primary"
    onClick={handleOrder}
    disabled={Number(mulchData.available_quantity) === 0} // Ensure it's treated as a number
>
    {Number(mulchData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
</button>



                    </div>
                </div>
            </div>
        </>
    );
};

export default Mulch;
