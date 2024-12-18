import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Buyreport() {
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMergeShippingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shippinguser`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const shippingDetails = response.data.shippingDetails;

        // Group data by orderId
        const groupedData = shippingDetails.reduce((acc, detail) => {
          const orderId = detail.orderId?._id || 'Unknown Order ID';

          if (!acc[orderId]) {
            acc[orderId] = {
              orderId,
              totalRequiredQuantity: {}, // Add total required quantity for each product
              shippedQuantity: {},
              remainingQuantity: {},
              email: detail.email || 'N/A',
              gst: 0,
              totalPrice: 0,
              itemDetails: [],
              pdfs: [],
            };
          }

          acc[orderId].gst += detail.gst;
          acc[orderId].totalPrice += detail.totalPrice;

          // Merge shipped quantities for each product and calculate remaining quantity
          if (detail.itemDetails) {
            detail.itemDetails.forEach((item) => {
              const productName = item.name;
              const totalRequiredQty = item.quantity; // Total required quantity
              const selectedProductQty = detail.selectedProduct === item.name ? detail.quantity : 0; // Shipped quantity for selected product

              // Store total required quantity
              acc[orderId].totalRequiredQuantity[productName] = totalRequiredQty;

              // Update shipped quantity and calculate remaining quantity
              acc[orderId].shippedQuantity[productName] = (acc[orderId].shippedQuantity[productName] || 0) + selectedProductQty;
              acc[orderId].remainingQuantity[productName] = totalRequiredQty - acc[orderId].shippedQuantity[productName];
            });
          }

          // Add PDFs if available
          if (detail.billPdf && detail.billPdf.base64) {
            acc[orderId].pdfs.push({
              base64: detail.billPdf.base64,
              contentType: detail.billPdf.contentType,
            });
          }

          return acc;
        }, {});

        // Convert the grouped data into an array
        setMergedData(Object.values(groupedData));
      } catch (error) {
        console.error('Error fetching and merging shipping details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergeShippingDetails();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className='setter'>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Buy Reports</h2>
        {mergedData.length === 0 ? (
          <p className="text-center">No data available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Required Quantity</th>
                  <th>Shipped Quantity</th>
                  <th>Remaining Quantity</th>
                  <th>Email</th>
                  <th>GST</th>
                  <th>Total Price</th>
                  <th>Submitted PDFs</th>
                </tr>
              </thead>
              <tbody>
                {mergedData.map((data) => (
                  <tr key={data.orderId}>
                    <td>{data.orderId}</td>
                    <td>
                      {data.totalRequiredQuantity && Object.entries(data.totalRequiredQuantity).map(([product, totalQty], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {totalQty}
                        </div>
                      ))}
                    </td>
                    <td>
                      {data.shippedQuantity && Object.entries(data.shippedQuantity).map(([product, quantity], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {quantity}
                        </div>
                      ))}
                    </td>
                    <td>
                      {data.remainingQuantity && Object.entries(data.remainingQuantity).map(([product, remainingQty], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {remainingQty}
                        </div>
                      ))}
                    </td>
                    <td>{data.email}</td>
                    <td>₹{data.gst.toFixed(2)}</td>
                    <td>₹{data.totalPrice.toFixed(2)}</td>
                    <td>
                      {data.pdfs.length > 0 ? (
                        data.pdfs.map((pdf, index) => (
                          <button
                            key={index}
                            className="btn btn-info me-2"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `data:${pdf.contentType};base64,${pdf.base64}`;
                              link.download = `order_${data.orderId}_pdf_${index + 1}.pdf`;
                              link.click();
                            }}
                          >
                            PDF {index + 1}
                          </button>
                        ))
                      ) : (
                        <span>No PDFs</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

export default Buyreport;
