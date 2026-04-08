import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import BusinessProfile from "./pages/BusinessProfile";
import About from "./pages/About";
import Login from "./pages/Login";
import SellerDashboard from "./pages/seller/SellerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleNavbar from "./components/RoleNavbar";

function AppContent() {
  const location = useLocation();

  const hideNavbarRoutes = ["/business-profile"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <RoleNavbar />}

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business-profile" element={<BusinessProfile />} />

        <Route path="/"
          element={
            <ProtectedRoute allowedRole="buyer">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute allowedRole="buyer">
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute allowedRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;