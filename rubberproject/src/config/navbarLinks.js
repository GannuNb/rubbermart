import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaTachometerAlt,
  FaStore,
  FaBookOpen,
  FaLayerGroup,
  FaRegAddressBook,
  FaChartLine,
  FaUserShield,
  FaUserCog,
  FaUserCircle,
  FaShoppingCart,
  FaPlusCircle,
  FaCheckCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa";

/* =========================
    GUEST NAV LINKS
========================= */

export const guestLinks = [
  {
    label: "Home",
    path: "/",
    icon: FaHome,
  },

  {
    label: "About",
    path: "/about",
    icon: FaUsers,
  },

  {
    label: "Browse Products",
    path: "/our-products",
    icon: FaLayerGroup,
  },

  {
    label: "Buyer Guide",
    path: "/buyer-guide",
    icon: FaBookOpen,
  },

  {
    label: "Seller Guide",
    path: "/seller-guide",
    icon: FaStore,
  },

  {
    label: "Contact",
    path: "/contactus",
    icon: FaRegAddressBook,
  },
];

/* =========================
    BUYER NAV LINKS
========================= */

export const buyerLinks = [
  {
    label: "Home",
    path: "/",
    icon: FaHome,
  },

  {
    label: "About",
    path: "/about",
    icon: FaUsers,
  },

  {
    label: "Browse Products",
    path: "/our-products",
    icon: FaLayerGroup,
  },

  {
    label: "My Orders",
    path: "/buyer-orders",
    icon: FaShoppingCart,
  },

  {
    label: "Buyer Guide",
    path: "/buyer-guide",
    icon: FaBookOpen,
  },

  {
    label: "Contact",
    path: "/contactus",
    icon: FaRegAddressBook,
  },
  {
    label: "My Profile",
    path: "/buyer/profile",
    icon: FaUserCircle,
  },
];

/* =========================
    SELLER NAV LINKS
========================= */

export const sellerLinks = [
  {
    label: "Dashboard",
    path: "/seller-dashboard",
    icon: FaChartLine,
  },

  {
    label: "Add Product",
    path: "/seller-add-products",
    icon: FaPlusCircle,
  },

  {
    label: "Products",
    path: "/seller-products",
    icon: FaLayerGroup,
  },

  {
    label: "Pending",
    path: "/seller-pending-products",
    icon: FaClock,
  },
  {
    label: "Approved",
    path: "/seller-approved-products",
    icon: FaCheckCircle,
  },

  {
    label: "Orders",
    path: "/seller/orders",
    icon: FaClipboardList,
  },
];

/* =========================
    TRANSPORTER NAV LINKS
========================= */

export const transporterLinks = [
  {
    label: "Dashboard",
    path: "/transporter-dashboard",
    icon: FaTruck,
  },

  {
    label: "Available Shipments",
    path: "/transporter-shipments",
    icon: FaClipboardList,
  },

  {
    label: "My Quotes",
    path: "/transporter-my-quotes",
    icon: FaBoxOpen,
  },

  {
    label: "Pending Requests",
    path: "/transporter-pending-assignments",
    icon: FaClock,
  },

  {
    label: "Completed Deliveries",
    path: "/transporter-completed-deliveries",
    icon: FaCheckCircle,
  },

  {
    label: "My Profile",
    path: "/transporter-profile",
    icon: FaUserCircle,
  },
];

/* =========================
    ADMIN NAV LINKS
========================= */

export const adminLinks = [
  {
    label: "Dashboard",
    path: "/admin-dashboard",
    icon: FaTachometerAlt,
  },
  {
    label: "Total Products",
    path: "/admin-products",
    icon: FaBoxOpen,
  },
  {
    label: "Pending Products",
    path: "/admin-pending-products",
    icon: FaClock,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: FaClipboardList,
  },
  {
    label: "Users",
    path: "/admin-users",
    icon: FaUserCog,
  },
];
