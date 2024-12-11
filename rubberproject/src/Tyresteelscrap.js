import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import PyroSteelImage from './images/PyroSteel.jpeg';
import PyroSteelImage2 from './images/PyroSteel2.webp';
import RubberCrumSteelImage from './images/RubberCrumSteel.jpeg';
import RubberCrumSteelImage1 from './images/RubberCrumSteel1.jpg';
import rubbercrumimg1 from "./images/rubbercrumbtw3.jpg"

const Tyresteelscrap = () => {
    const [tyreSteelScrapItems, setTyreSteelScrapItems] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');

    const imagesMap = {
        "Rubber Crum Steel": [RubberCrumSteelImage, rubbercrumimg1], // Add multiple images per product here
        "Pyro Steel": [PyroSteelImage, PyroSteelImage2], // Replace with real images
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const tyreSteelScrap = response.data.scrap_items.filter(item => item.type === 'Tyre steel scrap');
                setTyreSteelScrapItems(tyreSteelScrap);
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

    // Custom Arrow Components
    const NextArrow = ({ onClick }) => {
        return (
            <div className="custom-arrow custom-arrow-next" onClick={onClick}>
                ❯
            </div>
        );
    };

    const PrevArrow = ({ onClick }) => {
        return (
            <div className="custom-arrow custom-arrow-prev" onClick={onClick}>
                ❮
            </div>
        );
    };

    // Carousel settings with custom arrows
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="tyre-scrap-layout mt-5">
            <h2 className="tyre-scrap-heading headings">Tyre Steel Scrap</h2>
            <p className="tyre-scrap-description">
                Tyre Steel Scrap is a high-quality byproduct of tyre recycling, primarily used in 
                industrial applications such as construction and manufacturing. Products like 
                **Pyro Steel** and **Rubber Crum Steel** are valuable raw materials for various 
                engineering and industrial processes. These materials are sustainably sourced, 
                making them a cost-effective and eco-friendly choice for businesses.
            </p>
            <div className="tyre-scrap-grid">
                {tyreSteelScrapItems.map((item, index) => (
                    <div key={index} className="tyre-card">
                        <Slider {...settings}>
                            {imagesMap[item.name]?.map((image, imgIndex) => (
                                <div key={imgIndex}>
                                    <img
                                        src={image}
                                        className="tyre-image"
                                        alt={`${item.name}-${imgIndex}`}
                                    />
                                </div>
                            ))}
                        </Slider>
                        <div className="tyre-card-body">
                            <h5 className="tyre-card-title">{item.name}</h5>
                            <p className="tyre-card-text">Quantity: {item.available_quantity}</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleOrderClick(item.name)}
                            >
                                Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tyresteelscrap;
