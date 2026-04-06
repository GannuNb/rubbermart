import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Buyersignup from './pages/Buyersignup';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buyersignup" element={<Buyersignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;