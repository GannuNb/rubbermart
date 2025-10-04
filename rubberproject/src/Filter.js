import React from 'react';
import styles from './Filter.module.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Filter = ({
  tyreScrapItems,
  selectedProducts,
  onProductFilterChange,
  locations = [],
  selectedLocations,
  onLocationFilterChange,
  categoryName,
  priceRange,
  onPriceRangeChange,
  priceLimits,
  priceFilterActive,
  onPriceFilterToggle
}) => {
  const handleSliderChange = (range) => {
    onPriceRangeChange({ min: range[0], max: range[1] });
  };

  const handlePriceFilterToggle = (e) => {
    onPriceFilterToggle(e.target.checked);
  };

  return (
    <div className={styles.filterContainer}>
      <h4 className={styles.filterSectionHeading}>Category: {categoryName}</h4>

      {/* Product Filters */}
      <div>
        <h5 className={styles.filterSubHeading}>Products</h5>
        {tyreScrapItems.map(item => (
          <div key={item.name} className={styles.filterSection}>
            <label htmlFor={`product-${item.name}`} className={styles.filterLabel}>
              {item.name}
            </label>
            <input
              type="checkbox"
              id={`product-${item.name}`}
              checked={selectedProducts.includes(item.name)}
              onChange={() => onProductFilterChange(item.name)}
            />
          </div>
        ))}
      </div>

      {/* Location Filters */}
      <div style={{ marginTop: '1.5rem' }}>
        <h5 className={styles.filterSubHeading}>Locations</h5>
        {locations.length === 0 ? (
          <div className={styles.noLocations}>No locations available</div>
        ) : (
          locations.map(location => (
            <div key={location} className={styles.filterSection}>
              <label htmlFor={`loc-${location}`} className={styles.filterLabel}>
                {location}
              </label>
              <input
                type="checkbox"
                id={`loc-${location}`}
                checked={selectedLocations.includes(location)}
                onChange={() => onLocationFilterChange(location)}
              />
            </div>
          ))
        )}
      </div>

      {/* Price Range Filter */}
      <div style={{ marginTop: '1.5rem' }}>
        <h5 className={styles.filterSubHeading}>Price Range</h5>
        {priceLimits.min !== undefined && priceLimits.max !== undefined ? (
          <>
            <Slider
              range
              min={priceLimits.min}
              max={priceLimits.max}
              defaultValue={[priceLimits.min, priceLimits.max]}
              value={[priceRange.min, priceRange.max]}
              onChange={handleSliderChange}
              trackStyle={[{ backgroundColor: '#007bff' }]}
              handleStyle={[
                { borderColor: '#007bff' },
                { borderColor: '#007bff' }
              ]}
            />
            <div className={styles.priceRangeValues}>
              ₹{priceRange.min} — ₹{priceRange.max}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="enablePriceFilter"
                checked={priceFilterActive}
                onChange={handlePriceFilterToggle}
              />
              <label htmlFor="enablePriceFilter" style={{ marginLeft: '0.5rem', color: '#333' }}>
                Apply Price Filter
              </label>
            </div>
          </>
        ) : (
          <p>Loading price range...</p>
        )}
      </div>
    </div>
  );
};

export default Filter;
