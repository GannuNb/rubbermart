import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Buyersignup from './pages/Buyersignup';
import About from './pages/About';
import Buyerbusinessprofile from "./pages/Buyerbusinessprofile";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buyer-signup" element={<Buyersignup />} />
          <Route path="/buyer-business-profile" element={<Buyerbusinessprofile />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;