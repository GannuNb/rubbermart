import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import styles from "../../styles/Navbar/NavbarSearch.module.css";
import { SEARCH_SUGGESTIONS, CATEGORY_LINKS } from "../../config/navbarConfig";

function NavbarSearch() {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const searchRef = useRef();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);


const filteredSuggestions = (() => {
  const cleanSearch = searchText.trim().toLowerCase();
  if (!cleanSearch) return [];
  const searchWords = cleanSearch.split(/\s+/);
    
  return SEARCH_SUGGESTIONS.filter((item) => {
    const target = item.toLowerCase();
    // Allow suggestions if ANY word matches
    return searchWords.some((word) => target.includes(word));
  });
})();

  const handleSearch = (value) => {
    if (!value.trim()) return;
    navigate(`/our-products?search=${encodeURIComponent(value)}`);
    setSearchText("");
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (filteredSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) handleSearch(filteredSuggestions[highlightedIndex]);
      else handleSearch(searchText);
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.categoryWrapper} ref={dropdownRef}>
        <div className={styles.categoryBox} onClick={() => setCategoryOpen(!categoryOpen)}>
          <div className={styles.categoryLeft}>
            <span className={styles.menuIcon}>☰</span>
            <span className={styles.categoryText}>All Categories</span>
          </div>
          <span className={`${styles.dropdownIcon} ${categoryOpen ? styles.rotateArrow : ""}`}>❯</span>
        </div>
        {categoryOpen && (
          <div className={styles.categoryDropdown}>
            {CATEGORY_LINKS.map((item, index) => (
              <Link key={index} to={item.path} className={styles.dropdownItem} onClick={() => setCategoryOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.searchSection} ref={searchRef}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setHighlightedIndex(-1); }}
            onKeyDown={handleKeyDown}
          />
          {filteredSuggestions.length > 0 && (
            <div className={styles.searchSuggestions}>
              {filteredSuggestions.map((item, index) => (
                <div 
                  key={index} 
                  className={`${styles.searchSuggestionItem} ${index === highlightedIndex ? styles.active : ""}`} 
                  onClick={() => handleSearch(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className={styles.searchBtn} onClick={() => handleSearch(searchText)}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
}

export default NavbarSearch;