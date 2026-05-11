// src/pages/Buyer/OurProducts.js

import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import ProductFilters from "../../components/products/ProductFilters";

import ProductGrid from "../../components/products/ProductGrid";

import styles from "../../styles/Buyer/OurProducts.module.css";

function OurProducts() {

  const location = useLocation();

  const [filters, setFilters] =
    useState({

      category: "",

      application: "",

      loadingLocation: "",

      stockStatus: "",

      minPrice: "",

      maxPrice: "",

      search: "",
    });


  /* =========================
      URL SEARCH PARAMS
  ========================== */

  useEffect(() => {

    const queryParams =
      new URLSearchParams(
        location.search
      );

    const category =
      queryParams.get(
        "category"
      ) || "";

    const search =
      queryParams.get(
        "search"
      ) || "";


    /* AUTO CATEGORY */

    let autoCategory = "";

    if (
      search
        .toLowerCase()
        .includes("pyro")
    ) {

      autoCategory =
        "Pyro Oil";
    }

    else if (

      search
        .toLowerCase()
        .includes("steel")

    ) {

      autoCategory =
        "Tyre Steel Scrap";
    }

    else if (search) {

      autoCategory =
        "Tyre Scrap";
    }


    setFilters({

      category:
        category ||
        autoCategory,

      // IMPORTANT FIX
      application: "",

      loadingLocation: "",

      stockStatus: "",

      minPrice: "",

      maxPrice: "",

      // SEARCH ONLY
      search: search,
    });

  }, [location.search]);


  return (

    <div className={styles.pageWrapper}>


      {/* TOP */}

      <div className={styles.topSection}>

        <h1>
          Our Products
        </h1>

        <p>
          Explore premium rubber
          scrap products uploaded
          by verified sellers.
        </p>

      </div>


      {/* CONTENT */}

      <div
        className={
          styles.contentWrapper
        }
      >


        {/* LEFT */}

        <div
          className={
            styles.leftSection
          }
        >

          <ProductFilters
            filters={filters}
            setFilters={setFilters}
          />

        </div>


        {/* RIGHT */}

        <div
          className={
            styles.rightSection
          }
        >

          <ProductGrid
            filters={filters}
          />

        </div>

      </div>

    </div>
  );
}

export default OurProducts;