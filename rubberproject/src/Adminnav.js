
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import logo from "./images/logo.png"
import './Adminnav.css';
import { Link } from 'react-router-dom';

function Adminnav() {




    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(true);

    const toggleNavbar = () => {
      setIsNavbarCollapsed(!isNavbarCollapsed);
    };
  return (
    <>
    <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-2">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={() => setIsNavbarCollapsed(true)}>
          <img className='logo' src={logo} alt="LG Industry Logo" /> 
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isNavbarCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isNavbarCollapsed ? '' : 'show'}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-2">
              <Link to="/Admin" className="nav-link nav-hover" onClick={() => setIsNavbarCollapsed(true)}>
                Scrapitems
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link to="/Adminshipping" className="nav-link nav-hover" onClick={() => setIsNavbarCollapsed(true)}>
                Orders Shipping
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link nav-hover" to="/Uploaded" onClick={() => setIsNavbarCollapsed(true)}>
                Uploadedscrsap
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link nav-hover" to="/adminpayment" onClick={() => setIsNavbarCollapsed(true)}>
                Payments
              </Link>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
    </div>
    </>
      
   
  )
}

export default Adminnav
