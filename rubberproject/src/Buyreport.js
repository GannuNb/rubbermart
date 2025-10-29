import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import logo1 from './images/logo.png';
import { useNavigate,useLocation } from 'react-router-dom';
import logo from './images/logo.png';
import { jsPDF } from "jspdf";
import { FaFilePdf } from 'react-icons/fa';

function Buyreport() {
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();  // Correctly use the hook to get the location
      const [shippingDetails, setShippingDetails] = useState([]);
        const [profile, setProfile] = useState(null);
      
      useEffect(() => {
          // Directly set the scroll position to the top of the page
          document.documentElement.scrollTop = 0; 
          document.body.scrollTop = 0;  // For compatibility with older browsers
        }, []); // Empty dependency array ensures it runs only once on page load
    

      // Fetch business profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/business-profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        }
      } catch (err) {
        console.error('Error fetching business profile:', err);
      }
    };
    fetchProfile();
  }, []);

  // Group the shipping details by Order ID
  const groupedByOrder = shippingDetails.reduce((acc, detail) => {
    const orderId = detail.orderId?._id;
    if (orderId) {
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(detail);
    } else {
      console.warn('Missing orderId for detail:', detail);
    }
    return acc;
  }, {});

    useEffect(() => {
       const token = localStorage.getItem('token');
       if (!token) {
         setTimeout(() => {
           // Create a custom alert with inline styling or a class
           const alertDiv = document.createElement('div');
           alertDiv.className = 'custom-alert';
     
           // Create an image element for the logo
           const logoImg = document.createElement('img');
           logoImg.src = logo1;  // Use the imported logo here
           logoImg.alt = 'Company Logo';
           logoImg.className = 'alert-logo';  // Add a class for logo styling
     
           // Create a text message for the alert
           const alertMessage = document.createElement('span');
           alertMessage.textContent = 'Please log in to Check Buy Reports.';
           alertMessage.className = 'alert-message';  // Class for message styling
     
           // Append logo and message to the alert div
           alertDiv.appendChild(logoImg);
           alertDiv.appendChild(alertMessage);
     
           // Append alert div to the body
           document.body.appendChild(alertDiv);
     
           // Remove the alert after 5 seconds
           setTimeout(() => {
             alertDiv.remove();
           }, 5000);
     
           navigate('/Login', { state: { from: location.pathname } }); // Navigate to login if no token
         }, 0);
         return;
       }
     }, [navigate, location]);


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
              totalRequiredQuantity: {},
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
              const totalRequiredQty = item.quantity;
              const selectedProductQty = detail.selectedProduct === item.name ? detail.quantity : 0;

              acc[orderId].totalRequiredQuantity[productName] = totalRequiredQty;
              acc[orderId].shippedQuantity[productName] =
                (acc[orderId].shippedQuantity[productName] || 0) + selectedProductQty;
              acc[orderId].remainingQuantity[productName] =
                totalRequiredQty - acc[orderId].shippedQuantity[productName];
            });
          }

          if (detail.billPdf && detail.billPdf.base64) {
            acc[orderId].pdfs.push({
              base64: detail.billPdf.base64,
              contentType: detail.billPdf.contentType,
            });
          }

          return acc;
        }, {});

        setMergedData(Object.values(groupedData));
      } catch (error) {
        console.error('Error fetching and merging shipping details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergeShippingDetails();
  }, []);

  const mergePDFs = async (pdfs) => {
    try {
      const mergedPdf = await PDFDocument.create();
  
      for (const pdf of pdfs) {
        try {
          const existingPdf = await PDFDocument.load(Uint8Array.from(atob(pdf.base64), (char) => char.charCodeAt(0)));
          const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (err) {
          console.error("Error loading PDF:", err);
        }
      }
  
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_report.pdf';
      link.click();
    } catch (err) {
      console.error("Error merging PDFs:", err);
    }
  };
  

  if (loading) {
    return (
      <div className='setter'>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      </div>
    );
  }

  return (
      <div className="container-fluid mt-3">
        <h2 className="text-center mb-4">Buy Reports</h2>
        {mergedData.length === 0 ? (
          <p className="text-center">No data available.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Order Quantity</th>
                  <th>Shipped Quantity</th>
                  <th>Remaining Quantity</th>
                  <th>Email</th>
                  <th>GST</th>
                  <th>Total Price</th>
                  <th>Buy Report</th>
                  {/* <th>Invoice</th> */}
                </tr>
              </thead>
              <tbody>
                {mergedData.map((data) => (
                  <tr key={data.orderId}>
                    <td>{data.orderId}</td>
                    <td>
                      {Object.entries(data.totalRequiredQuantity).map(([product, totalQty], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {totalQty}
                        </div>
                      ))}
                    </td>
                    <td>
                      {Object.entries(data.shippedQuantity).map(([product, quantity], index) => (
                        <div key={index}>
                          <strong>{product}</strong>: {quantity}
                        </div>
                      ))}
                    </td>
                    <td>
                      {Object.entries(data.remainingQuantity).map(([product, remainingQty], index) => (
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
    <>
      
      <button className="btn btn-primary" onClick={() => mergePDFs(data.pdfs)}>
                                                                  <FaFilePdf />
                                                                </button>
    </>
  ) : (
    <span>No PDFs</span>
  )}
</td>
                    {/* <td>
                    <button className="btn btn-primary" onClick={() => generatePDF(data)}>Invoice PDF</button>
                  </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
}

export default Buyreport;
