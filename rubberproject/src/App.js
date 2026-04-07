import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Buyersignup from './pages/Buyersignup';
import About from './pages/About';
import SellerSignup from './pages/SellerSignup';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buyer-signup" element={<Buyersignup />} />
          <Route path="/seller-signup" element={<SellerSignup />} />

          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;