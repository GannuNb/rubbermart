import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './Login.js';
import Signup from './Signup.js';
import Footer from './Footer.js';
import Home from './Home.js';
import Sell from './Sell.js';
import BusinessProfile from './BusinessProfile.js';
import Mulch from './Mulch';
import Order from './Order.js';
import Admin from './Admin.js';
import Multiple_Baled_Tyres_PCR from './Multiple_Baled_Tyres_PCR.js';
import ThreePieceTBR from './ThreePieceTBR.js';
import ThreePiecePCR from './ThreePiecePCR.js';
import RubberGranules from './RubberGranules.js';
import BaledTyresTBR from './BaledTyresTBR.js';
import Shredds from './Shredds.js';
import PyroSteel from './PyroSteel.js';
import RubberCrumSteel from './RubberCrumSteel.js';
import Sidebar from './Sidebar.js';
import New from './New.js';
import Uploaded from './Uploaded.js';
import Buyreport from './Buyreport.js';
import ContactUs from './ContactUs.js';
import Getorders from './Getorders.js';
import Sellreport from './Sellreport.js';
import Userprofile from './Userprofile.js';
import TyreScrap from './Tyrescrap.js';
import Pyro_oil from './Pyro_oil.js';
import Tyresteelscrap from './Tyresteelscrap.js';
import ChatWidget from './Components/ChatWidget.js';
import AboutUsPage from './AboutUsPage.js';
import ScrollToTop from './Components/ScrollToTop.js';
import Alert from './Components/Alert.js';
import ForgotPassword from './ForgotPassword.js';
import ResetPassword from './Reset Password.js';
import Productspage from './Productspage.js';
import Adminshipping from './Adminshipping.js';
import ShippingDetails from './Shippingdetails.js';
import Ship from './Ship.js';
import Gst from './gst.js';
import GstDetails from './GstDetails.js';
import Registeredgst from './Registeredgst.js';
import Unregisteredgst from './Unregistered.js';

function App() {
  const location = useLocation();

  // Check if the current path is "/Admin" or "/Uploaded", case-insensitive
  const isSidebarHidden = /^\/(admin|uploaded|Adminshipping)$/i.test(location.pathname);

  return (
    <>
      {/* Conditionally render Sidebar based on the current route */}
      {!isSidebarHidden && <Sidebar />}
      <div className="container">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/gst" element={<Gst />} />
          <Route exact path="/gstdetails" element={<GstDetails />} />
          <Route exact path="/registered" element={<Registeredgst />} />
          <Route exact path="/unregistered" element={<Unregisteredgst />} />

       
          <Route exact path="/new" element={<New />} />
          <Route exact path="/Admin" element={<Admin />} />
          <Route exact path="/Uploaded" element={<Uploaded />} />
          <Route exact path="/Adminshipping" element={<Adminshipping />} />
          <Route exact path="/Shippingdetails" element={<ShippingDetails />} />
          <Route exact path="/Ship" element={<Ship />} />


          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/Signup" element={<Signup />} />
          <Route exact path="/Productspage" element={<Productspage/>} />
          <Route exact path="/Contact" element={<ContactUs />} />
          <Route exact path="/Sell" element={<Sell />} />
          <Route exact path="/BusinessProfile" element={<BusinessProfile />} /> 
          <Route exact path="/Mulch" element={<Mulch />} /> 
          <Route exact path="/Order" element={<Order />} /> 
          <Route exact path="/Getorders" element={<Getorders />} /> 
          <Route exact path="/MultipleBaledTyresPCR" element={<Multiple_Baled_Tyres_PCR />} /> 
          <Route exact path="/ThreePieceTBR" element={<ThreePieceTBR />} /> 
          <Route exact path="/ThreePiecePCR" element={<ThreePiecePCR />} /> 
          <Route exact path="/RubberGranules/crum" element={<RubberGranules />} />
          <Route exact path="/BaledTyresTBR" element={<BaledTyresTBR />} /> 
          <Route exact path="/Shredds" element={<Shredds />} /> 
          <Route exact path="/PyroSteel" element={<PyroSteel />} /> 
          <Route exact path="/RubberCrumSteel" element={<RubberCrumSteel />} /> 
          <Route exact path="/Buyreport" element={<Buyreport />} />
          <Route exact path="/Sellerreport" element={<Sellreport />} />
          <Route exact path="/userprofile" element={<Userprofile />} />
          <Route exact path="/Tyrescrap" element={<TyreScrap/>} />
          <Route exact path="/pyro_oil" element={<Pyro_oil/>} />
          <Route exact path="/TyresteelScrap" element={<Tyresteelscrap/>} />
          <Route exact path="/AboutUsPage" element={<AboutUsPage/>} />
          <Route exact path='/Alert' element={<Alert/>}/>
          <Route exact path='/forgot-password' element={<ForgotPassword/>}/>
          
          <Route path="/reset-password/:token" element={<ResetPassword />} />


        </Routes>
      </div>
      <Footer />
      <ChatWidget />
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <ScrollToTop /> 
      <App />
    </Router>
  );
}

export default AppWrapper;
