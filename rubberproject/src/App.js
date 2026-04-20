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
import RoleNavbar from "./components/navbar/RoleNavbar";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./components/protectroute/ProtectedRoute";

//seller
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerAddproduct from "./pages/seller/SellerAddproduct";
import SellerPendingProducts from "./pages/seller/SellerPendingProducts";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProfile from "./pages/seller/SellerProfile";

//buyer
import Home from "./pages/Buyer/Home";
import OurProducts from "./pages/Buyer/OurProducts";
import ProductDetails from "./pages/Buyer/ProductDetails";
import OrderSummary from "./pages/Buyer/OrderSummary";
import SellerProductsBySeller from "./pages/Buyer/SellerProductsBySeller";
import PlaceOrder from "./pages/Buyer/PlaceOrder";
import OrderSuccess from "./pages/Buyer/OrderSuccess";
import BuyerProfile from "./pages/Buyer/BuyerProfile";

//Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApproveProducts from "./pages/admin/AdminApproveProducts";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/business-profile"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <RoleNavbar />}

      <Routes>
        {/* pages */}
        <Route path="/" element={<CommonHome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/about" element={<About />} />

        {/* buyer */}
        <Route path="/home"  element={<ProtectedRoute allowedRole="buyer"><Home /></ProtectedRoute>} />
        <Route  path="/buyer/profile"  element={    <ProtectedRoute allowedRoles={["buyer"]}>      <BuyerProfile />    </ProtectedRoute>  }/>
        <Route path="/our-products" element={<OurProducts />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/seller-products/:sellerId" element={<SellerProductsBySeller />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* seller */}
        <Route path="/seller-dashboard" element={<ProtectedRoute allowedRole="seller"><SellerDashboard /></ProtectedRoute>}/>
        <Route path="/seller-add-products" element={<ProtectedRoute allowedRole="seller"><SellerAddproduct /></ProtectedRoute>}/>
        <Route path="/seller-pending-products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerPendingProducts /></ProtectedRoute>}/>
        <Route path="/seller-products" element={ <ProtectedRoute allowedRoles={["seller"]}><SellerProducts /></ProtectedRoute>}/>
        <Route  path="/seller-profile"  element={<ProtectedRoute allowedRole="seller"><SellerProfile /></ProtectedRoute>  }/>

        {/* admin */}
        <Route path="/admin-dashboard" element={ <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/admin-approve-products" element={<ProtectedRoute allowedRole="admin"><AdminApproveProducts /></ProtectedRoute>}/>
        <Route  path="/admin-products" element={<ProtectedRoute allowedRole="admin"><AdminProducts /></ProtectedRoute>}/>
        <Route  path="/admin-users"  element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>}/>
        
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