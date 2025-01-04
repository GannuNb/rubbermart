import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PyroSteelImage from './images/PyroSteel.jpeg'; // Ensure to have an image for PyroSteel
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate, useLocation } from 'react-router-dom'; // useNavigate instead of useHistory
import './Mulch.css'; // Import your CSS file
import logo1 from './images/logo.png';

const PyroSteel = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [pyroSteelData, setPyroSteelData] = useState({
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

                // Find the PyroSteel data
                const pyroSteelItem = items.find(item => item.name === 'Pyro Steel');

                // Ensure we have the PyroSteel item and default price
                if (pyroSteelItem) {
                    // If backend does not send default_price, fallback to a price (e.g., pyroSteelItem.price or ex_chennai)
                    const fetchedDefaultPrice = pyroSteelItem.default_price || pyroSteelItem.price || pyroSteelItem.ex_chennai;

                    setPyroSteelData({
                        available_quantity: Number(pyroSteelItem.available_quantity),
                        price: pyroSteelItem.price, // Set initial price from 'price'
                        ex_chennai: pyroSteelItem.ex_chennai,
                        ex_nhavasheva: pyroSteelItem.ex_nhavasheva,
                        ex_mundra: pyroSteelItem.ex_mundra,
                        hsn: pyroSteelItem.hsn,
                        default_price: fetchedDefaultPrice, // Use fetched default price or fallback
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
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.ex_chennai }));
        } else if (selectedOption === 'ex_nhavasheva') {
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.ex_nhavasheva }));
        } else if (selectedOption === 'ex_mundra') {
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.ex_mundra }));
        } else if (selectedOption === 'default') {
            // If default price is selected, use the correct value
            setPyroSteelData(prevState => ({ ...prevState, price: prevState.default_price }));
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
                        pyroSteelData: {
                            name: 'Pyro Steel',
                            available_quantity: pyroSteelData.available_quantity,
                            price: pyroSteelData.price,
                            required_quantity: requiredQuantity,
                            hsn: pyroSteelData.hsn,
                        }
                    }
                });
            }, 0);

        } else {
            navigate('/Order', {
                state: {
                    name: 'Pyro Steel',
                    available_quantity: pyroSteelData.available_quantity,
                    price: pyroSteelData.price, // Pass the updated price
                    required_quantity: requiredQuantity,
                    hsn: pyroSteelData.hsn,
                },
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="pyroSteel-container" style={{ padding: '20px', marginTop: '20px', marginLeft: '180px' }}>
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

                {/* Specifications Section */}
                <div className="specifications-section">
                    <h3 className="section-title">SPECIFICATIONS</h3>

                    <div className="row specifications-row">
                        {/* Available Quantity */}
                        <div className="col-md-6">
                            <label className="spec-label">AVAILABLE QUANTITY IN (MT):</label>
                          
                            <span className="spec-value">
                     {Number(pyroSteelData.available_quantity) > 0 ? pyroSteelData.available_quantity : 'No Stock'}                         
                     </span>   
                        </div>


                        {/* HSN */}
                        <div className="col-md-6">
                            <label className="spec-label">HSN:</label>
                            <span className="spec-value">
                                {pyroSteelData.hsn}
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
                            {selectedPrice ? `₹${pyroSteelData[selectedPrice]}` : "Price"}
                            </span>
                        </div>
                        </div>
                    {/* Order Button */}
                    <div className="order-button-section mt-3">
                   
                        <button
                                className="btn btn-primary"
                                onClick={handleOrder}
                                disabled={Number(pyroSteelData.available_quantity) === 0} // Ensure it's treated as a number
                            >
                                {Number(pyroSteelData.available_quantity) > 0 ? 'Please Proceed to Order' : 'Out of Stock'}
                            </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PyroSteel;
