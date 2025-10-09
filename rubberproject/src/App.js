import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
import Registeredgst from './Registeredgst.js';
import Unregisteredgst from './Unregistered.js';
import GetPay from './getpay.js';
import AdminPayment from './Adminpayment.js';
import Pyrooil from './Pyrooil.js';
import ForgetMailPass from './forgetmailpass.js';
import Moredetails from './Moredetails.js';
import Homepage from './Homepage.js';
import Cate from './Cate.js';
import Scrapstyles from './Scrapstyles.js';
import ScrollToTopButton from './ScrollToTopButton';
import WhyChooseUs from './WhyChooseUs.js';
import Adminusers from './Adminusers.js';
import TermsPage from './TermsPage.js';

function App() {
  const location = useLocation();

  // Sidebar hidden for specific admin routes
  const isSidebarHidden = /^\/(admin|uploaded|Adminshipping|adminpayment|Adminusers)$/i.test(location.pathname);

  // Detect mobile screens
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Sidebar */}
      {!isSidebarHidden && <Sidebar />}

      {/* Main Content */}
      <div
        className="container-fluid"
        style={{
          paddingTop: isMobile ? "27%" : isSidebarHidden ? "0px" : "1%",
        }}
      >
        <Routes>
          <Route exact path="/" element={<Scrapstyles />} />
          <Route exact path="/registered" element={<Registeredgst />} />
          <Route exact path="/unregistered" element={<Unregisteredgst />} />
          <Route exact path="/getpay" element={<GetPay />} />
          <Route exact path="/adminpayment" element={<AdminPayment />} />
          <Route exact path="/new" element={<New />} />
          <Route exact path="/Admin" element={<Admin />} />
          <Route exact path="/Uploaded" element={<Uploaded />} />
          <Route exact path="/Adminshipping" element={<Adminshipping />} />
          <Route exact path="/Adminusers" element={<Adminusers />} />
          <Route exact path="/Shippingdetails" element={<ShippingDetails />} />
          <Route exact path="/Ship" element={<Ship />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/Signup" element={<Signup />} />
          <Route exact path="/ForgetMailPass" element={<ForgetMailPass />} />
          <Route exact path="/Productspage" element={<Productspage />} />
          <Route exact path="/Contact" element={<ContactUs />} />
          <Route exact path="/Sell" element={<Sell />} />
          <Route exact path="/BusinessProfile" element={<BusinessProfile />} />
          <Route exact path="/MulchPCR" element={<Mulch />} />
          <Route exact path="/Pyrooil" element={<Pyrooil />} />
          <Route exact path="/Order" element={<Order />} />
          <Route exact path="/Getorders" element={<Getorders />} />
          <Route exact path="/BaledTyresPCR" element={<Multiple_Baled_Tyres_PCR />} />
          <Route exact path="/ThreePieceTBR" element={<ThreePieceTBR />} />
          <Route exact path="/ThreePiecePCR" element={<ThreePiecePCR />} />
          <Route exact path="/RubberGranules/crum" element={<RubberGranules />} />
          <Route exact path="/BaledTyresTBR" element={<BaledTyresTBR />} />
          <Route exact path="/Shreds" element={<Shredds />} />
          <Route exact path="/PyroSteel" element={<PyroSteel />} />
          <Route exact path="/TermsPage" element={<TermsPage />} />
          <Route exact path="/RubberCrumSteel" element={<RubberCrumSteel />} />
          <Route exact path="/Buyreport" element={<Buyreport />} />
          <Route exact path="/Sellerreport" element={<Sellreport />} />
          <Route exact path="/userprofile" element={<Userprofile />} />
          <Route exact path="/Tyrescrap" element={<TyreScrap />} />
          <Route exact path="/pyro_oil" element={<Pyro_oil />} />
          <Route exact path="/TyresteelScrap" element={<Tyresteelscrap />} />
          <Route exact path="/AboutUsPage" element={<AboutUsPage />} />
          <Route exact path="/Alert" element={<Alert />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route exact path="/moredetails" element={<Moredetails />} />
          <Route exact path="/homepage" element={<Homepage />} />
          <Route exact path="/cate" element={<Cate />} />
          <Route exact path="/WhyChooseUs" element={<WhyChooseUs />} />
        </Routes>
      </div>

      {/* Footer and Widgets */}
      <Footer />
      <ScrollToTopButton />
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
