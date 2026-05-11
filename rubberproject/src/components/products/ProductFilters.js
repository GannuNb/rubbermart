import React from "react";

import {
  FaFilter,
  FaSearch,
} from "react-icons/fa";

import styles from "../../styles/Buyer/ProductFilters.module.css";

function ProductFilters({
  filters,
  setFilters,
}) {

  /* =========================
      CATEGORY OPTIONS
  ========================== */

  const categoryOptions = [

    "Tyre Scrap",

    "Pyro Oil",

    "Tyre Steel Scrap",
  ];


  /* =========================
      APPLICATION OPTIONS
  ========================== */

  const applicationOptions = {

    "Tyre Scrap": [

      "Baled Tyres PCR",

      "Baled Tyres TBR",

      "Three Piece PCR",

      "Three Piece TBR",

      "Shredds",

      "Mulch PCR",

      "Rubber Granules/Crum",
    ],

    "Pyro Oil": [

      "Pyro Oil",

      "Pyro Steel",
    ],

    "Tyre Steel Scrap": [

      "Rubber Crum Steel",
    ],
  };


  /* =========================
      AVAILABLE APPLICATIONS
  ========================== */

  const availableApplications =

    filters.category

      ? applicationOptions[
          filters.category
        ] || []

      : [

          "Baled Tyres PCR",

          "Baled Tyres TBR",

          "Three Piece PCR",

          "Three Piece TBR",

          "Shredds",

          "Mulch PCR",

          "Rubber Granules/Crum",

          "Pyro Oil",

          "Pyro Steel",

          "Rubber Crum Steel",
        ];


  /* =========================
      HANDLE CHANGE
  ========================== */

const handleChange = (e) => {

  const {
    name,
    value,
  } = e.target;


  /* =========================
      CATEGORY
  ========================== */

  if (name === "category") {

    setFilters({

      ...filters,

      category: value,

      // CLEAR SEARCH
      search: "",

      // RESET APPLICATION
      application: "",
    });

    return;
  }


  /* =========================
      APPLICATION
  ========================== */

  if (name === "application") {

    setFilters({

      ...filters,

      // CLEAR SEARCH
      search: "",

      application: value,
    });

    return;
  }


  /* =========================
      SEARCH
  ========================== */

  if (name === "search") {

    setFilters({

      ...filters,

      search: value,

      application: "",
    });

    return;
  }


  /* =========================
      OTHER FILTERS
  ========================== */

  setFilters({

    ...filters,

    [name]: value,
  });
};


  /* =========================
      CLEAR FILTERS
  ========================== */

  const clearFilters = () => {

    setFilters({

      category: "",

      application: "",

      loadingLocation: "",

      stockStatus: "",

      minPrice: "",

      maxPrice: "",

      search: "",
    });
  };


  return (

    <div
      className={
        styles.filterCard
      }
    >


      {/* HEADER */}

      <div
        className={
          styles.filterHeader
        }
      >

        <FaFilter />

        <h3>
          Filters
        </h3>

      </div>


      {/* SEARCH */}

      <div
        className={
          styles.searchBox
        }
      >

        <FaSearch
          className={
            styles.searchIcon
          }
        />

        <input
          type="text"
          name="search"
          placeholder="Search products..."
          value={filters.search}
          onChange={handleChange}
        />

      </div>


      {/* CATEGORY */}

      <div
        className={
          styles.filterGroup
        }
      >

        <label>
          Category
        </label>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >

          <option value="">
            All Categories
          </option>

          {categoryOptions.map(
            (category) => (

              <option
                key={category}
                value={category}
              >

                {category}

              </option>
            )
          )}

        </select>

      </div>


      {/* APPLICATION */}

      <div
        className={
          styles.filterGroup
        }
      >

        <label>
          Application
        </label>

        <select
          name="application"
          value={
            filters.application
          }
          onChange={handleChange}
        >

          <option value="">
            All Applications
          </option>

          {availableApplications.map(
            (application) => (

              <option
                key={application}
                value={application}
              >

                {application}

              </option>
            )
          )}

        </select>

      </div>


      {/* LOCATION */}

      <div
        className={
          styles.filterGroup
        }
      >

        <label>
          Loading Location
        </label>

        <select
          name="loadingLocation"
          value={
            filters.loadingLocation
          }
          onChange={handleChange}
        >

          <option value="">
            All Locations
          </option>

          <option value="Ex Chennai">
            Ex Chennai
          </option>

          <option value="Ex Mundra">
            Ex Mundra
          </option>

          <option value="Ex Nhavasheva">
            Ex Nhavasheva
          </option>

        </select>

      </div>


      {/* STOCK */}

      <div
        className={
          styles.filterGroup
        }
      >

        <label>
          Stock Status
        </label>

        <select
          name="stockStatus"
          value={
            filters.stockStatus
          }
          onChange={handleChange}
        >

          <option value="">
            All Status
          </option>

          <option value="available">
            Available
          </option>

          <option value="soldout">
            Sold Out
          </option>

        </select>

      </div>


      {/* PRICE */}

      <div
        className={
          styles.priceSection
        }
      >

        <label>
          Price Range (₹ / MT)
        </label>

        <div
          className={
            styles.priceInputs
          }
        >

          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleChange}
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleChange}
          />

        </div>

      </div>


      {/* CLEAR */}

      <button
        className={
          styles.clearBtn
        }
        onClick={clearFilters}
      >

        Clear Filters

      </button>

    </div>
  );
}

export default ProductFilters;