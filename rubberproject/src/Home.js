import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import tyreScrap from './images/tyre_scrap.jpeg';
import pyroOil from './images/pyro_oil2.jpeg';
import istock from './images/istockphoto.webp';
import './Home.css';
import axios from 'axios';
import home from './images/home.jpeg';
import logo from './images/logo.jpeg';
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import car1 from "./images/Shredds.jpeg"
import car2 from "./images/pyro_oil.jpeg"
import car3 from "./images/PyroSteel.jpeg"
import car4 from "./images/c4.jpg"
import { useNavigate } from 'react-router-dom';
import TechnologyCards from './TechnologyCards';
import HeroSection from './HeroSection';
import HappyClients from './Clients';
import SrenComponent from './SrenComponent';
import mulchImage from './images/mulch.jpeg';
import MultipleBaledTyresPCRImage from './images/MultipleBaledTyresPCR.jpeg';
import BaledTyresTBRImage from './images/BaledTyresTBR.jpeg';
import pyrooilImage from './images/pyro_oil2.jpeg';
import rubbercrumimg1 from "./images/rubbercrumbtw3.jpg";
import RubberGranulesImage from './images/RubberGranules.jpeg';
import ShreddsImage from './images/Shredds.jpeg';

const Home = () => {
    const [scrapItems, setScrapItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
                console.log('Fetched data:', response.data);
                setScrapItems(response.data.scrap_items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const categorizedItems = scrapItems.reduce((acc, item) => {
        if (!acc[item.type]) {
            acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
    }, {});
    const navigate = useNavigate();  // Initialize navigate for programmatic navigation
    const isLoggedIn = localStorage.getItem('token');  // Check if user is logged in by verifying 'userToken' in local storage

    const handleOrderClick = (itemName) => {
        if (!isLoggedIn) {
            alert("please login to order")
            navigate('/Login');
        } else {
            // Otherwise, proceed with the order action (e.g., navigate to the item page)
            navigate(`/${itemName.replaceAll(" ", "")}`);
        }
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className='abt'>
                <div className='setter'>
                    
                    {/* <div className='head'
                        style={{
                            textAlign: 'center',
                            margin: '20px',
                            padding: '10px',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'black', // Set text color to black
                            border: '2px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: '#e0f7e0',  // Light green background
                            width: '90%'
                        }}
                    >
                        India's Exclusive Marketplace for Rubber-Derived Products
                    </div> */}
                    <HeroSection />
                </div>
                {/* <div className="bg-container-home">

                    <div className="image-container">
                        <div className="slider">
                            <img src={car1} alt="Car 1" className="slider-image" />
                            <img src={pyroOil} alt="Pyro Oil" className="slider-image" />
                            <img src={car3} alt="Car 3" className="slider-image" />
                            <img src={mulchImage} alt="Mulch Image" className="slider-image" />
                            <img src={MultipleBaledTyresPCRImage} alt="Multiple Baled Tyres PCR" className="slider-image" />
                            <img src={BaledTyresTBRImage} alt="Baled Tyres TBR" className="slider-image" />
                            <img src={pyrooilImage} alt="Pyro Oil Image" className="slider-image" />
                            <img src={rubbercrumimg1} alt="Rubber Crumb" className="slider-image" />
                            <img src={RubberGranulesImage} alt="Rubber Granules" className="slider-image" />
                            <img src={ShreddsImage} alt="Shredds" className="slider-image" />

                            <img src={pyroOil} alt="Pyro Oil" className="slider-image" />
                            <img src={car3} alt="Car 3" className="slider-image" />
                            <img src={car1} alt="Car 1" className="slider-image" />
                            <img src={mulchImage} alt="Mulch Image" className="slider-image" />
                            <img src={MultipleBaledTyresPCRImage} alt="Multiple Baled Tyres PCR" className="slider-image" />
                            <img src={BaledTyresTBRImage} alt="Baled Tyres TBR" className="slider-image" />
                            <img src={pyrooilImage} alt="Pyro Oil Image" className="slider-image" />
                            <img src={rubbercrumimg1} alt="Rubber Crumb" className="slider-image" />
                            <img src={RubberGranulesImage} alt="Rubber Granules" className="slider-image" />
                            <img src={ShreddsImage} alt="Shredds" className="slider-image" />
                        </div>
                        <div className="overlay-text">BUY & SELL YOUR PRODUCTS</div>
                    </div>
                </div> */}
                <div>
                    <div className="row">
                        {/* Apply margin-left on larger screens and adjust on small screens */}
                        <div className="col-lg-10 offset-lg-2 col-md-12">
                            <div className="container mt-5">
                                <h2 className="display-4 fw-bold mb-3 text-black products-heading text-center d-flex  justify-content-center align-items-center">Available To Buy</h2>
                                <div className="row justify-content-center align-items-center">
                                    {/* Tyre Scrap Card */}
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="flip-card">
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front text-center">
                                                    <img
                                                        className="rounded-circle mt-3"
                                                        src={tyreScrap}
                                                        alt="Tyre Scrap"
                                                        width="140"
                                                        height="140"
                                                    />
                                                    <h2 className="mt-3 headings">Tyre Scrap</h2>
                                                </div>
                                                <div className="flip-card-back">
                                                    <h3>Products</h3>
                                                    <ul className="product-list text-start">
                                                        <li>Multiple_Baled_Tyres_PCR</li>
                                                        <li>Baled Tyres TBR</li>
                                                        <li>ThreePiecePCR</li>
                                                        <li>ThreePieceTBR</li>
                                                        <li>Shredds</li>
                                                        <li>Mulch</li>
                                                        <li>RubberGranules/crum</li>
                                                    </ul>
                                                    <Link to="/Tyrescrap">
                                                        <button className="btn btn-light btn-sm">
                                                            View Products
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pyro Oil Card */}
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="flip-card">
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front text-center">
                                                    <img
                                                        className="rounded-circle mt-3"
                                                        src={pyroOil}
                                                        alt="Pyro Oil"
                                                        width="140"
                                                        height="140"
                                                    />
                                                    <h2 className="mt-3 headings">Pyro Oil</h2>
                                                </div>
                                                <div className="flip-card-back">
                                                    <h3>Products</h3>
                                                    <ul className="product-list text-start">
                                                        <li>Pyro Oil</li>
                                                    </ul>
                                                    <Link to='/pyrooil'>
                                                        <button className="btn btn-light btn-sm">
                                                            View Products
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tyre Steel Scrap Card */}
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="flip-card">
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front text-center">
                                                    <img
                                                        className="rounded-circle mt-3"
                                                        src={istock}
                                                        alt="Tyre Steel Scrap"
                                                        width="140"
                                                        height="140"
                                                    />
                                                    <h2 className="mt-3 headings">Tyre Steel Scrap</h2>
                                                </div>
                                                <div className="flip-card-back">
                                                    <h3>Products</h3>
                                                    <ul className="product-list text-start">
                                                        <li>Pyro Steel</li>
                                                        <li>Rubber Crum Steel</li>
                                                    </ul>
                                                    <Link to="/TyresteelScrap">
                                                        <button className="btn btn-light btn-sm">
                                                            View Products
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <TechnologyCards />



                            <SrenComponent />
                            <Link style={{ textDecoration: "none" }} to="/Sell">
                                <button
                                    className="btn btn-primary mt-4 d-block mx-auto"
                                    style={{ fontSize: '16px', padding: '10px 20px', maxWidth: '300px' }}>
                                    Start Selling
                                </button></Link>

                            <HappyClients />

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home
