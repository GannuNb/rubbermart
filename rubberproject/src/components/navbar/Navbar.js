import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Added Link and NavLink
import styles from '../../styles/Components/Navbar.module.css';
import { LogOut } from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import Tyre from "../../assests/categoryimages/Tyre.jpeg";
import Logo from "../../assests/Logo.png";

const Navbar = () => {
    return (
        <nav className={styles.navWrapper}>
            <div 
                className={styles.fullWidthDarkStep} 
                style={{ backgroundImage: `url(${Tyre})` }}
            >
                {/* LOGO UNIT */}
                <div className={styles.logoOverlay}>
                    {/* Wrap the logo in a Link to return to home/dashboard */}
                    <Link to="/" className={styles.logoText}>
                        <img src={Logo} alt="Rubber Scrap Mart Logo" className={styles.logoImg} />
                    </Link>
                    <div className={styles.stepUnderLogo}></div>
                    <div className={styles.cornerScoop}></div>
                </div>

                {/* MENU SECTION */}
                <div className={styles.menuContainer}>
                    <div className={styles.navPill}>
                        <ul className={styles.navLinks}>
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/add-products" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                    Add Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/manage-products" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                    Manage Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/orders" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                    Orders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pending-orders" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                    Pending Orders
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                                    Profile
                                </NavLink>
                            </li>
                        </ul>

                        <div className={styles.rightSection}>
                            <button className={styles.logoutBtn} onClick={() => console.log("Logging out...")}>
                                <LogOut size={16} /> <span>Logout</span>
                            </button>
                            <div className={styles.socialIcons}>
                                <a href="https://www.instagram.com/vikahecotech/" target="_blank" rel="noreferrer" className={styles.icon}>
                                    <FaInstagram />
                                </a>
                                <a href="https://www.facebook.com/people/Vikah-Ecotech/61580657742969/" target="_blank" rel="noreferrer" className={styles.icon}>
                                    <FaFacebookF />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;