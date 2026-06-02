import React from "react";
import {  BrowserRouter as Router,  Routes,  Route,  useLocation,  Navigate,} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//pages
import Homepage from "./pages/Homepage/Homepage";
import Signup from "./pages/Signup";
import BusinessProfile from "./pages/BusinessProfile";
import About from "./pages/About/About";
import Login from "./pages/Login";
import Contactus from "./pages/Contactus/Contactus";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

//components
import RoleNavbar from "./components/navbar/RoleNavbar";
import ProtectedRoute from "./components/protectroute/ProtectedRoute";
import TermsAndConditions from "./components/Terms&Conditions/TermsAndConditions";
import RoleFooter from "./components/footer/RoleFooter";
import PublicRoute from "./components/protectroute/PublicRoute";

//seller
import SellerDashboard from "./pages/seller/SellerDashboard/SellerDashboard";
import SellerAddproduct from "./pages/seller/SellerAddproduct";
import SellerPendingProducts from "./pages/seller/SellerPendingProducts";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerOrders from "./pages/seller/SellerOrders";
import Sellerordermanage from "./pages/seller/Sellerordermanage";
import SellerGuide from "./components/SellerGuide/SellerGuide";

//buyer
import Home from "./pages/Buyer/Home";
import OurProducts from "./pages/Buyer/OurProducts";
import ProductDetails from "./pages/Buyer/ProductDetails";
import OrderSummary from "./pages/Buyer/OrderSummary";
import SellerProductsBySeller from "./pages/Buyer/SellerProductsBySeller";
import PlaceOrder from "./pages/Buyer/PlaceOrder";
import OrderSuccess from "./pages/Buyer/OrderSuccess";
import BuyerProfile from "./pages/Buyer/BuyerProfile";
import BuyerOrders from "./pages/Buyer/BuyerOrders";
import BuyerOrderDetails from "./pages/Buyer/BuyerOrderDetails";
import BuyerShippingInvoices from "./pages/Buyer/BuyerShippingInvoices";
import BuyerSingleShippingInvoice from "./pages/Buyer/BuyerSingleShippingInvoice";
import BuyerGuide from "./components/BuyerGuide/BuyerGuide";

//Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApproveProducts from "./pages/admin/AdminPendingProducts";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAllOrders from "./pages/admin/AdminAllOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminAllInvoices from "./pages/admin/AdminAllInvoices";
import AdminSingleShippingInvoice from "./pages/admin/AdminSingleShippingInvoice";
import AllProducts from "./components/AllProducts/AllProducts";
import TyreScrap from "./components/AllProducts/TyreScrap";
import PyroOil from "./components/AllProducts/PyroOil";
import TyreSteelScrap from "./components/AllProducts/TyreSteelScrap";

// Scroll to top
import ScrollToTop from "./components/ScrollToTop";
import FAQPage from "./components/FAQPage/FAQPage";

// scrollto top arrow
import ScrollToTopArrow from "./components/ScrollToTop/ScrollToTopArrow";

import AdminApprovedProducts from "./pages/admin/AdminApprovedProducts";
import AdminPendingProducts from "./pages/admin/AdminPendingProducts";
import AdminRejectedProducts from "./pages/admin/AdminRejectedProducts";
import SellerApprovedProducts from "./pages/seller/SellerApprovedProducts";
import SellerRejectedProducts from "./pages/seller/SellerRejectedProducts";

//transporter
import TransporterDashboard from "./pages/transporter/TransporterDashboard";


function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/business-profile"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* 🚀 FIXED: Placed safely outside <Routes> so it acts on all path transitions smoothly */}
      <ScrollToTop />

      {!shouldHideNavbar && <RoleNavbar />}

      <Routes>
        {/* pages */}
        <Route
          path="/"
          element={(() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.role === "admin") {
              return <Navigate to="/admin-dashboard" replace />;
            }
            if (user?.role === "seller") {
              return <Navigate to="/seller-dashboard" replace />;
            }
            if (user?.role === "transporter") {
              return <Navigate to="/transporter-dashboard" replace />;
            }
            return <Homepage />;
          })()}
        />
        <Route path="/signup" element= {<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* buyer */}
        <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerProfile /></ProtectedRoute>} />
        <Route path="/our-products" element={<OurProducts />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/seller-products/:sellerId" element={<SellerProductsBySeller />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/buyer-orders" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerOrders /> </ProtectedRoute>} />
        <Route path="/buyer-orders/:id" element={<ProtectedRoute><BuyerOrderDetails /></ProtectedRoute>} />
        <Route path="/buyer/order/:orderId/shipping/:itemName" element={<BuyerShippingInvoices />} />
        <Route path="/buyer/order/:orderId/shipping-invoice/:shipmentId" element={<BuyerSingleShippingInvoice />} />
        <Route path="/buyer-guide" element={<BuyerGuide />} />

        {/* transporter */}
        <Route  path="/transporter-dashboard"  element={<TransporterDashboard />}/>

        {/* seller */}
        <Route path="/seller-dashboard" element={<ProtectedRoute allowedRole="seller"><SellerDashboard /></ProtectedRoute>} />
        <Route path="/seller-add-products" element={<ProtectedRoute allowedRole="seller"><SellerAddproduct /></ProtectedRoute>} />
        <Route path="/seller-pending-products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerPendingProducts /></ProtectedRoute>} />
        <Route path="/seller-approved-products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerApprovedProducts /></ProtectedRoute>} />
        <Route path="/seller-rejected-products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerRejectedProducts /></ProtectedRoute>} />
        <Route path="/seller-products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerProducts /></ProtectedRoute>} />
        <Route path="/seller-profile" element={<ProtectedRoute allowedRole="seller"><SellerProfile /></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute><SellerOrders /> </ProtectedRoute>} />
        <Route path="/seller/order-manage/:orderId" element={<ProtectedRoute> <Sellerordermanage /> </ProtectedRoute>} />
        <Route path="/seller-guide" element={<SellerGuide />} />

        {/* admin */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /> </ProtectedRoute>} />
        <Route path="/admin-approved-products" element={<ProtectedRoute allowedRole="admin"><AdminApprovedProducts /></ProtectedRoute>} />
        <Route path="/admin-pending-products" element={<ProtectedRoute allowedRole="admin"><AdminPendingProducts /></ProtectedRoute>} />
        <Route path="/admin-rejected-products" element={<ProtectedRoute allowedRole="admin"><AdminRejectedProducts /></ProtectedRoute>} />
        <Route path="/admin-products" element={<ProtectedRoute allowedRole="admin"><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin-users" element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}> <AdminAllOrders /> </ProtectedRoute>} />
        <Route path="/admin/order-details/:orderId" element={<AdminOrderDetails />} />
        <Route path="/admin/order/:orderId/invoices/:itemName" element={<AdminAllInvoices />} />
        <Route path="/admin/order/:orderId/shipping-invoice/:shipmentId" element={<AdminSingleShippingInvoice />} />

        {/* All Products */}
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/tyre-scrap" element={<TyreScrap />} />
        <Route path="/pyro-oil" element={<PyroOil />} />
        <Route path="/tyresteel-scrap" element={<TyreSteelScrap />} />

        {/* faq */}
        <Route path="/faq" element={<FAQPage />} />


      </Routes>
      <ScrollToTopArrow />
      <RoleFooter />
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