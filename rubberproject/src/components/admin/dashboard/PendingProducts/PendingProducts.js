import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import styles from "./PendingProducts.module.css";

function PendingProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin-dashboard/pending-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log("Pending Products Error:", error);
    }
  };

  return (
    <div className={styles.pendingProducts}>
      {/* TOP */}

      <div className={styles.pendingProductsTop}>
        <div>
          <h2>Pending Products</h2>

          <p>Products waiting for approval</p>
        </div>

        <button
          className={styles.viewAllButton}
          onClick={() => navigate("/admin-approve-products")}
        >
          View All
        </button>
      </div>

      {/* TABLE */}

      <div className={styles.tableWrapper}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Product</th>

              <th>Seller</th>

              <th>Category</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                {/* PRODUCT */}

                <td>
                  <div className={styles.productInfo}>
                    <img src={product?.images?.[0]?.image} alt="product" />

                    <div>
                      <h4>{product.productName}</h4>

                      <p>{product.application}</p>
                    </div>
                  </div>
                </td>

                {/* SELLER */}

                <td>{product?.seller?.fullName}</td>

                {/* CATEGORY */}

                <td>{product.category}</td>

                {/* STATUS */}

                <td>
                  <span className={styles.pendingBadge}>Pending</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PendingProducts;
