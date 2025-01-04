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

                // Find the shredds data
                const shreddsItem = items.find(item => item.name === 'Shredds');

                if (shreddsItem) {
                    // If backend does not send default_price, fallback to another price option
                    const fetchedDefaultPrice = shreddsItem.default_price || shreddsItem.price || shreddsItem.ex_chennai;

                    setShreddsData({
                        available_quantity: Number(shreddsItem.available_quantity),
                        price: shreddsItem.price,
                        ex_chennai: shreddsItem.ex_chennai,
                        ex_nhavasheva: shreddsItem.ex_nhavasheva,
                        ex_mundra: shreddsItem.ex_mundra,
                        hsn: shreddsItem.hsn,
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
            setShreddsData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setShreddsData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setShreddsData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            setShreddsData(prevState => ({ ...prevState, price: prevState.default_price }));
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
                        shreddsData: {
                            name: 'Shredds',
                            available_quantity: shreddsData.available_quantity,
                            price: shreddsData.price,
                            required_quantity: requiredQuantity,
                            hsn: shreddsData.hsn,
                        }
                    }
                });
            }, 0);
        } else {
            navigate('/Order', {
                state: {
                    name: 'Shredds',
                    available_quantity: shreddsData.available_quantity,
                    price: shreddsData.price,
                    required_quantity: requiredQuantity,
                    hsn: shreddsData.hsn,
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
                    <h2>Shredds</h2>
                    <p>
                        Shredds are processed organic materials commonly used as mulch in gardening and landscaping.
                        They help retain moisture, suppress weeds, and regulate soil temperature while providing nutrients as they decompose.
                        Utilizing shredds can significantly improve soil health and enhance the appearance of gardens.
                    </p>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="specifications-section">
                <h3 className="section-title" style={{ marginTop: '40px', color: 'black' }}>SPECIFICATIONS</h3>
                <div className="row" style={{ marginTop: '10px' }}>
                    {/* Available Quantity */}
                    <div className="col-md-6">
                        <label className="spec-label" style={{ color: 'black', fontWeight: 'bold' }}>AVAILABLE QUANTITY IN (MT):</label>
                        <span className="spec-value d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
                        {Number(shreddsData.available_quantity) > 0 ? shreddsData.available_quantity : 'No Stock'}                        </span>
                    </div>

                    {/* HSN */}
                    <div className="col-md-6">
                        <label className="spec-label" style={{ color: 'black', fontWeight: 'bold' }}>HSN:</label>
                        <span className="spec-value d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
                            {shreddsData.hsn}
                        </span>
                    </div>
                </div>

                {/* Required Quantity Section */}
                <div className="required-quantity-section mt-3">
                    <label className="spec-label" style={{ color: 'black', fontWeight: 'bold' }}>REQUIRED QUANTITY IN (MT):</label>
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
                                </option>                         
                                <option value="ex_chennai">Ex-Chennai</option>
                        <option value="ex_nhavasheva">Ex-Nhavasheva</option>
                        <option value="ex_mundra">Ex-Mundra</option>
                    </select>
                </div>

                    {/* Price Per MT */}
                    <div className="col-md-6">
                        <label className="spec-label" style={{ color: 'black', fontWeight: 'bold' }}>PRICE PER (MT):</label>
                        <span className="spec-value d-block p-2 border rounded" style={{ border: '1px solid #ccc' }}>
                        {selectedPrice ? `₹${shreddsData[selectedPrice]}` : "Price"}
                        </span>
                    </div>
</div>
                {/* Order Button */}
                <div className="order-button-section mt-3">
                <button
    className="btn btn-primary"
    onClick={handleOrder}
    disabled={Number(shreddsData.available_quantity) === 0} // Ensure it's treated as a number
>
    {Number(shreddsData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
</button>
                </div>
            </div>
        </div>
    );
};

export default Shredds;
