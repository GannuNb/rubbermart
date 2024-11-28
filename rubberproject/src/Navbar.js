import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css'; // Ensure your custom CSS is imported correctly
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/login");
  };
 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Replace Navbar brand with an image */}
        <Link className="navbar-brand" to="/">
          <img src="/path-to-your-logo.png" alt="MyApp Logo" style={{ height: '40px' }} />
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Home with an icon */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home"></i> Home
              </Link>
            </li>

            {/* Products Dropdown with an icon */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="productsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-box-open"></i> Products
              </Link>
              <ul className="dropdown-menu" aria-labelledby="productsDropdown">
                {/* Tyre Scrap with Sub-products */}
                
                <li className="dropdown-submenu">
                  <Link className="dropdown-item" to="#">Tyre Scrap</Link>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/products/tyre-scrap/multiple-baled-tyres-pcr">Multiple Baled Tyres (PCR)</Link></li>
                    <li><Link className="dropdown-item" to="/products/tyre-scrap/baled-tyres-tbr">Baled Tyres (TBR)</Link></li>
                    <li><Link className="dropdown-item" to="/products/tyre-scrap/three-piece-pcr">Three Piece PCR</Link></li>
                    <li><Link className="dropdown-item" to="/products/tyre-scrap/three-piece-tbr">Three Piece TBR</Link></li>
                    <li><Link className="dropdown-item" to="/products/tyre-scrap/shreds">Shreds</Link></li>
                    <li><Link className="dropdown-item" to="/products/tyre-scrap/mulch">Mulch</Link></li>
                    <li><Link className="dropdown-item" to="/products/tyre-scrap/rubber-granules-crum">Rubber Granules/Crum</Link></li>
                  </ul>
                </li>
                <li><Link className="dropdown-item" to="/products/pyro-oil">Pyro Oil</Link></li>
                <li className="dropdown-submenu">
                  <Link className="dropdown-item" to="#">Tyre Steel Scrap</Link>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/products/tyre-steel-scrap/pyro-steel">Pyro Steel</Link></li>
                    <li><Link className="dropdown-item" to="/products/tyre-steel-scrap/crum-steel">Crum Steel</Link></li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Contact Us with an icon */}
            <li className="nav-item">
              <Link className="nav-link" to="/contact-us">
                <i className="fas fa-envelope"></i> Contact Us
              </Link>
            </li>


            {/* Sell with an icon */}
            <li className="nav-item">
              <Link className="nav-link" to="/sell">
                <i className="fas fa-dollar-sign"></i> Sell
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/BusinessProfile">
                <i className="fas fa-building"></i> Business Profile
              </Link>
            </li>
        
          </ul>
          

          {/* Search bar */}
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

          {/* Profile Dropdown */}
          {(!localStorage.getItem("token")) ? (
            <ul className="navbar-nav ms-3">
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fas fa-user"></i> Login/Signup
                </Link>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li><Link className="dropdown-item" to="/login">Login</Link></li>
                  <li><Link className="dropdown-item" to="/signup">Signup</Link></li>
                </ul>
              </li>
            </ul>
          ) : (
            <button onClick={handleLogout} className="btn bg-white text-success ms-3">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
    
  );
};

export default Navbar;
