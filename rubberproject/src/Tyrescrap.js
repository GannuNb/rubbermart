import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import RubberGranulesImage from './images/RubberGranules.jpeg';
import ShreddsImage from './images/Shredds.jpeg';
import MultipleBaledTyresPCRImage from './images/MultipleBaledTyresPCR.jpeg';
import BaledTyresTBRImage from './images/BaledTyresTBR.jpeg';
import ThreePiecePCRImage from './images/ThreePiecePCR.jpeg';
import ThreePieceTBRImage from './images/ThreePieceTBR.jpeg';
import mulchImage from './images/mulch.jpeg';
import './TyreScrap.css';

const TyreScrap = () => {
    const [tyreScrapItems, setTyreScrapItems] = useState([]);
    const navigate = useNavigate();

    // Map product names to their corresponding image arrays
    const imagesMap = {
        "Rubber Granules/Crum": [RubberGranulesImage, mulchImage],
        "Shredds": [ShreddsImage, RubberGranulesImage],
        "Multiple Baled Tyres PCR": [MultipleBaledTyresPCRImage, ThreePiecePCRImage],
        "Baled Tyres TBR": [BaledTyresTBRImage, ThreePieceTBRImage],
        "Three Piece PCR": [ThreePiecePCRImage, MultipleBaledTyresPCRImage],
        "Three Piece TBR": [ThreePieceTBRImage, BaledTyresTBRImage],
        "Mulch": [mulchImage, RubberGranulesImage],
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const tyreScrap = response.data.scrap_items.filter(item => item.type === 'Tyre scrap');
                setTyreScrapItems(tyreScrap);
                console.log(tyreScrapItems);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleOrderClick = (itemName) => {
        navigate(`/${itemName.replaceAll(" ", "")}`);
    };

    // Custom Arrow Components
    const NextArrow = ({ onClick }) => (
        <div className="custom-arrow custom-arrow-next" onClick={onClick}>
            ❯
        </div>
    );

    const PrevArrow = ({ onClick }) => (
        <div className="custom-arrow custom-arrow-prev" onClick={onClick}>
            ❮
        </div>
    );

    // Carousel settings
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
            <h2 className="tyre-scrap-heading animated-heading">
                Tyre Scrap Products
            </h2>
            <p className="tyre-scrap-description animated-description">
                We offer a wide variety of tyre scrap products tailored to meet your industrial needs. 
                From durable rubber granules to baled tyres, our collection ensures quality and reliability. 
                Perfect for recycling and manufacturing, these products are an ideal choice for sustainable solutions. 
                Browse through the options below and place your order hassle-free.
            </p>

         

            <div className="tyre-scrap-grid">
                {tyreScrapItems.map((item, index) => (
                    <div key={index} className="tyre-card animated-card">
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

export default TyreScrap;
