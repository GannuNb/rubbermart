import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Pyro_oil = () => {
    const [pyroOilItems, setPyroOilItems] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const pyroOil = response.data.scrap_items.filter(item => item.type === 'Pyro oil');
                setPyroOilItems(pyroOil);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleOrderClick = (itemName) => {
        if (!isLoggedIn) {
            alert("Please log in to order.");
            navigate('/Login');
        } else {
            navigate(`/${itemName.replaceAll(" ", "")}`);
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    

    return (
        <div className="container mt-5">
            <h2 className="fw-bold text-center mb-4">Pyro Oil Products</h2>
            <div className="row">
                {pyroOilItems.map((item, index) => (
                    <div key={index} className="col-lg-4 col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{item.name}</h5>
                                <p className="card-text">Quantity: {item.available_quantity}</p>
                                <button className="btn btn-primary" onClick={() => handleOrderClick(item.name)}>
                                    Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pyro_oil;
