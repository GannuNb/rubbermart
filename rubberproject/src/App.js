import React from "react";
import {BrowserRouter as Router,Routes,Route, useLocation,} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//pages
import CommonHome from "./pages/CommonHome";
import Signup from "./pages/Signup";
import BusinessProfile from "./pages/BusinessProfile";
import About from "./pages/About";
import Login from "./pages/Login";

//components
import RoleNavbar from "./components/RoleNavbar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

//seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerAddproduct from "./pages/seller/SellerAddproduct";
import SellerPendingProducts from "./pages/seller/SellerPendingProducts";


//buyer
import Home from "./pages/Home";


//Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/business-profile"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* pages */}
        <Route path="/common-home" element={<CommonHome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/about" element={<About />} />

        {/* buyer */}
        <Route path="/"  element={<ProtectedRoute allowedRole="buyer"><Home /></ProtectedRoute>} />

        {/* seller */}
        <Route path="/seller-dashboard" element={<ProtectedRoute allowedRole="seller"><SellerDashboard /></ProtectedRoute>}/>
        <Route path="/seller-add-products" element={<ProtectedRoute allowedRole="seller"><SellerAddproduct /></ProtectedRoute>}/>
        <Route path="/seller-pending-products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerPendingProducts /></ProtectedRoute>}/>

        {/* admin */}
        <Route path="/admin-dashboard" element={ <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}/>
        

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