import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Sell.css';
import logo from "./images/logo.png"
import "./Order.css";



const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { name, available_quantity, price, required_quantity,hsn } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAvailable, setCurrentAvailable] = useState(available_quantity);
  const [loadingButton, setLoadingButton] = useState(false); // Loading state for button

  const [tyreScrapItems, setTyreScrapItems] = useState([]);
  const [tyreSteelScrapItems, setTyreSteelScrapItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [additionalQuantity, setAdditionalQuantity] = useState('');
  const [additionalItems, setAdditionalItems] = useState([]);
 
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
      setTyreScrapItems(response.data.scrap_items.filter((item) => item.type === 'Tyre scrap'));
      setTyreSteelScrapItems(response.data.scrap_items.filter((item) => item.type === 'Tyre steel scrap'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

const handleAddClick = () => {
  setShowDropdown(!showDropdown);
  setSelectedCategory('');
  setFilteredProducts([]);
};

const handleCategorySelect = (category) => {
  setSelectedCategory(category);
  setFilteredProducts(category === 'Tyre scrap' ? tyreScrapItems : tyreSteelScrapItems);
};

const handleProductSelect = (product) => {
  setSelectedProduct(product);
};

const handleQuantityChange = (e) => {
  setAdditionalQuantity(e.target.value);
};

const addToOrder = () => {
  if (selectedProduct && additionalQuantity > 0) {
    const newItem = {
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: additionalQuantity,
      total: selectedProduct.price * additionalQuantity,
      hsn: selectedProduct.hsn,
    };

    setAdditionalItems([...additionalItems, newItem]);
    setShowDropdown(false); // Close dropdown after adding
    setSelectedProduct(null); // Reset selected product
    setAdditionalQuantity(''); // Reset quantity input
    alert(`Added ${newItem.name} with quantity ${newItem.quantity} tons to the order.`);
  } else {
    alert('Please select a product and enter a valid quantity.');
  }
};

// Render Order Summary
const renderOrderSummary = () => {
  const gstRate = 0.18;

  const baseItems = [
    {
      name,
      price,
      hsn,
      quantity: required_quantity,
      total: price * required_quantity,
    },
  ];

  const allItems = [...baseItems, ...additionalItems];
  const subtotal = allItems.reduce((sum, item) => sum + item.total, 0);
  const gst = subtotal * gstRate;
  const total = subtotal + gst;

  return (
<div className="border p-4 rounded bg-white mt-4">
  <h4>Order Details</h4>
  <div
    className="table-responsive"
    style={{
      overflowX: "scroll", // Enables the scrollbar
      display: "block", // Ensures the scrollbar container is block-level
      whiteSpace: "nowrap", // Prevents table wrapping
    }}
  >
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price/Ton</th>
          <th>HSN</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {allItems.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>₹{item.price}</td>
            <td>{item.hsn}</td>
            <td>{item.quantity} tons</td>
            <td>₹{item.total.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>


{/* Additional Items Section */}
<div className="additional-items mt-4">
  <button
    className="add-button mb-3"
    onClick={handleAddClick}
  >
    + {/* Large plus sign */}
  </button>

  {showDropdown && (
    <div className="dropdown-container p-4 border rounded shadow-lg bg-light">
      <h5 className="mb-3">Select Category & Product</h5>

      {/* Category Dropdown */}
      <div className="mb-3">
        <label className="form-label">Select Category</label>
        <select
          className="form-select"
          onChange={(e) => handleCategorySelect(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Choose Category</option>
          <option value="Tyre scrap">Tyre Scrap</option>
          <option value="Tyre steel scrap">Tyre Steel Scrap</option>
        </select>
      </div>

      {/* Product Dropdown (Based on Selected Category) */}
      {selectedCategory && (
        <div className="mb-3">
          <label className="form-label">Select Product</label>
          <select
            className="form-select"
            onChange={(e) => handleProductSelect(JSON.parse(e.target.value))}
          >
            <option value="">Select a product</option>
            {(selectedCategory === 'Tyre scrap' ? tyreScrapItems : tyreSteelScrapItems).map((product) => (
              <option key={product.id} value={JSON.stringify(product)}>
                {product.name} - ₹{product.price}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity Input and Add Button */}
      {selectedProduct && (
        <>
          <h5 className="mt-4">Enter Quantity</h5>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Quantity (tons)"
              value={additionalQuantity}
              onChange={handleQuantityChange}
            />
          </div>

          <button className="btn btn-success" onClick={addToOrder} style={{ width: '100%' }}>
            Add to Order
          </button>
        </>
      )}
    </div>
  )}
</div>
<tr>
    <td colSpan="4" className="text-right"><strong>Subtotal:</strong></td>
    <td>₹{subtotal.toFixed(2)}</td>
  </tr>
  <tr>
    <td colSpan="4" className="text-right"><strong>GST (18%):</strong></td>
    <td>₹{gst.toFixed(2)}</td>
  </tr>
  <tr>
    <td colSpan="4" className="text-right"><strong>Total:</strong></td>
    <td>₹{total.toFixed(2)}</td>
  </tr>

      </tfoot>
    </table>
  </div>
</div>


  );
};



useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
      setTimeout(() => {
          alert("Please log in to Order");
          navigate('/Login', { state: { from: location.pathname } }); // Navigate to login if no token
      }, 0);
      return;
  }
}, [navigate,location]);


  // Redirect to home if required data is missing
  useEffect(() => {
    if (!name || !price || !required_quantity ||!hsn) {
      navigate('/', { replace: true });
    }
  }, [name, price, required_quantity,hsn, navigate]);

  // Calculate total price with GST
  useEffect(() => {
    if (price > 0 && required_quantity > 0) {
      const gstRate = 0.18;
      const subtotal = price * required_quantity;
      const gstAmount = subtotal * gstRate;
      setTotalPrice((subtotal + gstAmount).toFixed(2));
    } else {
      setTotalPrice(0);
    }
  }, [price, required_quantity]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated.');
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, config);

        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        } else {
          navigate('/BusinessProfile', { replace: true });
        }
      } catch (err) {
        setError('Failed to fetch profile.');
        console.error('Error fetching business profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const numberToWords = (num) => {
    if (num === 0) return 'zero';
  
    const a = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
      'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
      return '';
    };
  
    const units = ['crore', 'lakh', 'thousand', ''];
    const divisors = [10000000, 100000, 1000, 1];
  
    let result = '';
    for (let i = 0; i < divisors.length; i++) {
      const quotient = Math.floor(num / divisors[i]);
      num %= divisors[i];
      if (quotient > 0) {
        result += numToWords(quotient) + ' ' + units[i] + ' ';
      }
    }
  
    return result.trim() + ' rupees only';
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    if (logo) {
      doc.addImage(logo, 'JPEG', 11, 6, 40, 20); // Adjust the width and height of the logo
    }
    const baseItems = [
      {
        name,
        price,
        hsn,
        quantity: required_quantity,
        total: price * required_quantity,
      },
    ];
  
    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 86, 20);
    doc.setFontSize(10);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 190, 20, { align: 'right' });
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 25, 200, 25); // Underline
  
    // Billing and Shipping Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold'); // Set font to bold
    doc.text('Billing Information', 14, 35);
    doc.text('Shipping Information', 110, 35);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 38, 200, 38); // Underline
  
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal'); // Reset font to normal
    if (profile) {
      // Billing Info
      doc.text(`Company: ${profile.companyName || 'N/A'}`, 14, 45);
      doc.text(`Email: ${profile.email || 'N/A'}`, 14, 55);
      doc.text(`Address: ${profile.billAddress || 'N/A'}`, 14, 50);
      
  
      // Shipping Info
      doc.text(`Address: ${profile.shipAddress || 'N/A'}`, 110, 45);
    }
  
    // Products Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Products', 14, 70);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 73, 200, 73); // Underline
  
    const gstRate = 0.18;
    const subtotalBase = baseItems.reduce((sum, item) => sum + item.total, 0); // For base items
    const subtotalAdditional = additionalItems.reduce((sum, item) => sum + item.total, 0); // For additional items
    const subtotal = subtotalBase + subtotalAdditional;
    const gst = subtotal * gstRate;
    const total = subtotal + gst;
    const totalAmountInWords = numberToWords(total);
  
    doc.setFont('helvetica', 'normal');
    // Combine base and additional items for table
    const combinedItems = [
      ...baseItems.map(item => ({
        name: item.name,
        price: item.price,
        hsn:item.hsn,
        quantity: item.quantity,
        total: item.total,
        gst: item.total * gstRate,
      })),
      ...additionalItems.map(item => ({
        name: item.name,
        price: item.price,
        hsn:item.hsn,
        quantity: item.quantity,
        total: item.total,
        gst: item.total * gstRate,
      })),
    ];
  
    doc.autoTable({
      startY: 75,
      head: [
        ['Item Name', 'Price/Ton','HSN', 'Quantity', 'Subtotal', 'GST (18%)', 'Total']
      ],
      body: combinedItems.map(item => [
        item.name,
        
        `RS ${item.price.toFixed(2)}`,
        item.hsn,
        `${item.quantity} tons`,
        `RS ${item.total.toFixed(2)}`,
        `RS ${item.gst.toFixed(2)}`,
        `RS ${(item.total + item.gst).toFixed(2)}`,
      ]),
      theme: 'striped',
      styles: { fontSize: 8 },
    });
  
    // Total Amount in Words
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Amount (in words): ${totalAmountInWords}`, 14, finalY);
    // Total Amount in Numbers
    doc.text(`Total Balanace : Rs ${total.toFixed(2)}`, 14, finalY + 8); 
  
    // Address Details Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const addressY = finalY + 15;
    doc.text('Address Details', 14, addressY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, addressY + 3, 200, addressY + 3); // Underline
  
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('From:', 14, addressY + 10);
    doc.text('VIKAH RUBBERS', 14, addressY + 15);
    doc.text('Hyderabad', 14, addressY + 20);
    doc.text('Dispatch From:', 14, addressY + 25);
    doc.text('#406, 4th Floor, Patel Towers,', 14, addressY + 30);
    doc.text('Above EasyBuy Beside Nagole RTO Office,', 14, addressY + 35);
    doc.text('Nagole Hyderabad, Telangana-500035', 14, addressY + 40);
    doc.text('Hyderabad.', 14, addressY + 45);
  
    // Shipping Info Section
    doc.setFont('helvetica', 'bold');
    doc.text('Shipping Information', 110, addressY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text('To:', 110, addressY + 15);
    doc.text(profile?.shipAddress || 'N/A', 110, addressY + 20);
  
    // Terms and Conditions
    const termsY = addressY + 55;
    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', 14, termsY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, termsY + 3, 200, termsY + 3); // Underline
  
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      '1. The Seller shall not be liable to the Buyer for any loss or damage.',
      14,
      termsY + 10
    );
    doc.text(
      '2. The Seller warrants the product for one (1) year from the date of shipment.',
      14,
      termsY + 15
    );
    doc.text(
      '3. The purchase order will be interpreted as acceptance of this offer.',
      14,
      termsY + 20
    );
  
    return doc.output('blob');
  };
  
  



  
  const handleOrder = async () => {
    try {
      setLoadingButton(true);
  
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not authenticated.');
        navigate('/', { replace: true });
        return;
      }
  
      // Base item (main product) to be added to the order
      const baseItem = {
        name,
        price,
        hsn,
        quantity: required_quantity,
        total: price * required_quantity,
      };
  
      // Combine base item with additional items
      const allItems = [baseItem, ...additionalItems];
  
      // Validate each item to ensure required fields are present
      const isValidOrder = allItems.every(item =>
        item.name && item.quantity && item.total && item.price && item.hsn
      );
  
      if (!isValidOrder) {
        alert('Order validation failed: Missing required fields in some items.');
        setLoadingButton(false);
        return;
      }
  
      // Send combined items (base + additional) to the first backend API to place the order
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/place-order`,
        { items: allItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (orderResponse.status === 200) {
        // Now call another API to store the order data in a different database
        const storeInAnotherDbResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/Adminorder`,  // new API endpoint
          { items: allItems },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Check if the second API call was successful
        if (storeInAnotherDbResponse.status === 200) {
          const pdfBlob = generatePDF();
  
          const formData = new FormData();
          formData.append('pdf', pdfBlob, 'order-summary.pdf');
          formData.append('userEmail', profile?.email);
  
          const emailResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/upload-pdf`,
            formData,
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
          );
  
          // Handle successful response and proceed as needed
          if (emailResponse.status === 200) {
            alert('Order placed successfully, and invoice emailed!');
            navigate('/Getorders'); 
          } else {
            alert('Failed to send invoice email.');
          }
        } else {
          alert('Failed to store order in another database.');
        }
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('An error occurred while placing the order.');
    } finally {
      setLoadingButton(false); // Reset the button loading state
    }
  };
  
  
  

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  

  return (
<div className="setter">
  <div className="container mt-5">
    <div className="border p-4 rounded bg-light shadow-lg">
      {/* Order Summary Heading */}
      <h2 className="text-center mb-4 text-primary font-weight-bold">Order Summary</h2>
      <h4 className="text-center mb-4 text-secondary font-weight-semibold ms-5">Business Profile Details</h4>

      
      {/* Business Profile Details in Row */}
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="mb-3">
            <p><strong>Company Name:</strong> {profile?.companyName || "N/A"}</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-5">
          <div className="mb-3">
            <p><strong>Phone:</strong> {profile?.phoneNumber || "N/A"}</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-5">
          <div className="mb-3">
            <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-5">
          <div className="mb-3">
            <p><strong>GST:</strong> {profile?.gstNumber || "N/A"}</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-5">
          <div className="mb-3">
            <p><strong>Shipping Address:</strong> {profile?.shipAddress || "N/A"}</p>
          </div>
        </div>
        <div className="col-md-6 col-lg-5">
          <div className="mb-3">
            <p><strong>Billing Address:</strong> {profile?.billAddress || "N/A"}</p>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {/* Order Summary */}
          {renderOrderSummary()}

          {/* Place Order Button */}
          <button
            className="btn btn-success mt-4"
            onClick={handleOrder}
            disabled={loadingButton}
            style={{ width: '100%' }}
          >
            {loadingButton ? 'Placing Order...' : 'Place Order'}
          </button>


        </div>
      )}
    </div>
  </div>
</div>


      
  
    
  );
};

export default Order;
