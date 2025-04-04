import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import RubberGranulesImage from './images/RubberGranules.jpeg';
import ShreddsImage from './images/Shredds.jpeg';
import MultipleBaledTyresPCRImage from './images/MultipleBaledTyresPCR.jpeg';
import BaledTyresTBRImage from './images/BaledTyresTBR.jpg';
import BaledTyresTBRImage2 from './images/BaledTyresTBR_2.jpg';
import ThreePiecePCRImage from './images/ThreePiecePCR.jpeg';
import ThreePieceTBRImage from './images/ThreePieceTBR.jpeg';
import ThreePieceTBRImage2 from './images/ThreePieceTBR2.webp';
import mulchImage from './images/mulch.jpeg';
import mulchImage2 from './images/mulch1.jpg';
import rubbercrumimg2 from "./images/rubbercrumbtw4.jpg";
import baledtrespcrimg1 from "./images/baledtrespcr2.jpg";
import baledtrespcrimg2 from "./images/baledtrespcr3.jpg";
import RubberCrumSteelImage1 from './images/RubberCrumSteel1.jpg';
import RubberGranuelsimg2 from './images/RubberGranules2.jpeg';
import pcr2 from './images/3piecepcr2.jpg';
import tbr2 from './images/3piecetbr2.jpg';

import './TyreScrap.css';

const TyreScrap = () => {
    const [tyreScrapItems, setTyreScrapItems] = useState([]);
    const navigate = useNavigate();

    // Map product names to their corresponding image arrays
    const imagesMap = {
        "Rubber Granules/Crum": [RubberCrumSteelImage1, RubberGranuelsimg2],
        "Shreds": [ShreddsImage, ShreddsImage],
        "Baled Tyres PCR": [baledtrespcrimg1, baledtrespcrimg2],
        "Baled Tyres TBR": [BaledTyresTBRImage, BaledTyresTBRImage2],
        "Three Piece PCR": [ThreePiecePCRImage, pcr2],
        "Three Piece TBR": [ThreePieceTBRImage, tbr2],
        "Mulch PCR": [mulchImage, mulchImage2],
    };

      useEffect(() => {
          // Directly set the scroll position to the top of the page
          document.documentElement.scrollTop = 0; 
          document.body.scrollTop = 0;  // For compatibility with older browsers
        }, []); // Empty dependency array ensures it runs only once on page load
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                const tyreScrap = response.data.scrap_items.filter(item => item.type === 'Tyre scrap');

                // Define the desired order
                const desiredOrder = [
                    "Baled Tyres PCR",
                    "Three Piece PCR",
                    "Shreds",
                    "Baled Tyres TBR",
                    "Three Piece TBR",
                    "Mulch PCR",
                    "Rubber Granules/Crum"
                ];

                // Sort tyreScrap items based on the desired order
                const sortedTyreScrap = tyreScrap.sort((a, b) => {
                    return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
                });

                setTyreScrapItems(sortedTyreScrap);
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
                            
                            <button
                                className="btn btn-primary"
                                onClick={() => handleOrderClick(item.name)}
                                disabled={item.available_quantity === 0}
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
