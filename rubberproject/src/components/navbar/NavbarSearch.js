// src/components/navbar/NavbarSearch.js

import React, { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import styles from "../../styles/Navbar/RoleNavbar.module.css";

import { SEARCH_SUGGESTIONS, CATEGORY_LINKS } from "../../config/navbarConfig";

function NavbarSearch() {
  const navigate = useNavigate();

  const dropdownRef = useRef();

  const searchRef = useRef();

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [searchText, setSearchText] = useState("");

  /* =========================
      FILTER SUGGESTIONS
  ========================== */

  const filteredSuggestions =
    searchText.trim() === ""
      ? []
      : SEARCH_SUGGESTIONS.filter((item) =>
          item.toLowerCase().includes(searchText.toLowerCase()),
        );

  /* =========================
      CLOSE DROPDOWNS
  ========================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchText("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
      SEARCH
  ========================== */

  const handleSearch = (value) => {
    if (!value.trim()) return;

    navigate(`/our-products?search=${encodeURIComponent(value)}`);

    setSearchText("");
  };

  return (
    <div className={styles.searchWrapper}>
      {/* =========================
          CATEGORY
      ========================== */}

      <div className={styles.categoryWrapper} ref={dropdownRef}>
        <div
          className={styles.categoryBox}
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          <div className={styles.categoryLeft}>
            <span className={styles.menuIcon}>☰</span>

            <span className={styles.categoryText}>All Categories</span>
          </div>

          <span
            className={`${styles.dropdownIcon} ${
              categoryOpen ? styles.rotateArrow : ""
            }`}
          >
            ❯
          </span>
        </div>

        {/* =========================
            DROPDOWN
        ========================== */}

        {categoryOpen && (
          <div className={styles.categoryDropdown}>
            {CATEGORY_LINKS.map((item, index) => (
              <Link key={index} to={item.path} className={styles.dropdownItem}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* =========================
          SEARCH
      ========================== */}

      <div className={styles.searchSection} ref={searchRef}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchText);
              }
            }}
          />

          {/* =========================
              SEARCH SUGGESTIONS
          ========================== */}

          {filteredSuggestions.length > 0 && (
            <div className={styles.searchSuggestions}>
              {filteredSuggestions.map((item, index) => (
                <div
                  key={index}
                  className={styles.searchSuggestionItem}
                  onClick={() => handleSearch(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            SEARCH BUTTON
        ========================== */}

        <button
          className={styles.searchBtn}
          onClick={() => handleSearch(searchText)}
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default NavbarSearch;
