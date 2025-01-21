import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Sell.css';
import logo from "./images/logo3.png"
import "./Order.css";
import logo1 from "./images/logo.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import seal from './images/seal1.png';
const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, available_quantity, price, required_quantity, hsn, selected_location } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAvailable, setCurrentAvailable] = useState(available_quantity);
  const [loadingButton, setLoadingButton] = useState(false); // Loading state for button
  const [tyreScrapItems, setTyreScrapItems] = useState([]);
  const [tyreSteelScrapItems, setTyreSteelScrapItems] = useState([]);
  const [PyrooilItem, setPyrooilItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [additionalQuantity, setAdditionalQuantity] = useState();
  const [additionalItems, setAdditionalItems] = useState([]);
  const [selectedProductPrice, setSelectedProductPrice] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [isSameAsBilling, setIsSameAsBilling] = useState(false); // Checkbox state
  const [shippingAddress, setShippingAddress] = useState(''); // Manual inp
  const [billingAddress, setBillingAddress] = useState('');
  // Reset the selected price when the product is deselected
  const resetForm = () => {
    setSelectedProduct(null);
    setSelectedProductPrice(''); // Reset price
    setAdditionalQuantity('');
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/scrap`);
        setTyreScrapItems(response.data.scrap_items.filter((item) => item.type === 'Tyre scrap'));
        setTyreSteelScrapItems(response.data.scrap_items.filter((item) => item.type === 'Tyre steel scrap'));
        setPyrooilItems(response.data.scrap_items.filter((item) => item.type === 'pyro oil'));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  const handleCheckboxChange = () => {
    setIsSameAsBilling(!isSameAsBilling);
    if (!isSameAsBilling) {
      setShippingAddress(profile?.billAddress || ''); // Copy billing address to shipping address
    } else {
      setShippingAddress(''); // Clear input if unchecked
    }
  };
  // Handle manual shipping address input
  const handleShippingAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };
  const handleAddClick = () => {
    setShowDropdown(!showDropdown);
    setSelectedCategory('');
    setFilteredProducts([]);
  };
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFilteredProducts(
      category === 'Tyre scrap' ? tyreScrapItems :
        category === 'Tyre steel scrap' ? tyreSteelScrapItems :
          category === 'Pyro Oil' ? PyrooilItem :
            [] // Default to an empty array if no category matches
    );
  };
  const handleProductPriceChange = (event) => {
    const priceOption = event.target.value;
    if (priceOption === 'default') {
      setSelectedProductPrice(selectedProduct.price); // Set the default price if available
    } else {
      const priceValue = selectedProduct[priceOption];
      setSelectedProductPrice(priceValue ? Number(priceValue) : null); // Convert to number or null if not valid
    }
  };
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };
  const handleQuantityChange = (e) => {
    setAdditionalQuantity(e.target.value);
  };
  const addToOrder = () => {
    if (selectedProduct && additionalQuantity > 0 && selectedProductPrice) {
      // Resolve the price based on the selected option
      const resolvedPrice =
        selectedProductPrice === 'default'
          ? selectedProduct.price // Use the default price
          : selectedProduct[selectedProductPrice]; // Use the selected price option
      if (!resolvedPrice) {
        displayAlert('Invalid price selected.', 'danger');
        return;
      }
      const newItem = {
        name: selectedProduct.name,
        price: resolvedPrice, // Ensure numeric price
        quantity: additionalQuantity,
        total: resolvedPrice * additionalQuantity, // Correct multiplication
        hsn: selectedProduct.hsn,
        loading_location: selectedProductPrice,
      };
      setAdditionalItems((prevItems) => [...prevItems, newItem]);
      // Reset form fields
      setShowDropdown(false);
      resetForm();
      displayAlert(`Added ${newItem.name} with quantity ${newItem.quantity} tons to the order.`, 'success');
    } else {
      displayAlert('Please select a valid product, price, and enter a valid quantity.', 'danger');
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
        loading_location: selected_location,
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
                <th>Loading Location</th>
                <th>HSN</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>₹{item.price.toFixed(2)}</td> {/* Correctly display the price */}
                  <td>{item.loading_location}</td>
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
          <option value="Pyro Oil">Pyro Oil</option>
        </select>
      </div>
      {selectedCategory && (
        <div className="mb-3">
          <label className="form-label">Select Product</label>
          <select
            className="form-select"
            onChange={(e) => {
              const product = JSON.parse(e.target.value);
              handleProductSelect(product);
            }}
          >
            <option value="">Select a product</option>
            {(selectedCategory === 'Tyre scrap' ? tyreScrapItems :
              selectedCategory === 'Tyre steel scrap' ? tyreSteelScrapItems :
                selectedCategory === 'Pyro Oil' ? PyrooilItem :
                  []).map((product) => (
                    <option
                      key={product.id}
                      value={JSON.stringify(product)}
                      disabled={
                        product.available_quantity === 0 ||
                        product.available_quantity === "No Stock" ||
                        allItems.some(item => item.name === product.name)  // Disable if product is already in the order
                      }
                    >
                      {product.name}
                      {product.quantity === 0 || product.quantity === "No Stock" ? ' (Out of stock)' : ''}
                      {allItems.some(item => item.name === product.name) && ' (Already in Order)'} {/* Label for already ordered products */}
                    </option>
                  ))}
          </select>
        </div>
      )}
      {selectedProduct && (
        <div className="mb-3">
          <label className="form-label">
            Please Choose Location and Price:
          </label>
          <select
            className="form-select"
            value={selectedProductPrice || 'default'}
            onChange={(e) => setSelectedProductPrice(e.target.value)}
          >
            {/* Default option as "Loading location" */}
            <option value="default" disabled>
              Select a location
            </option>

            {selectedProduct.ex_chennai && selectedProduct.chennai_quantity > 0 && (
              <option value="ex_chennai">Ex-Chennai: ₹{selectedProduct.ex_chennai}-{selectedProduct.chennai_quantity} (quantity)</option>
            )}
            {selectedProduct.ex_chennai && selectedProduct.chennai_quantity === 0 && (
              <option value="ex_chennai" disabled>
                Ex-Chennai: Out of Stock
              </option>
            )}

            {selectedProduct.ex_nhavasheva && selectedProduct.nhavasheva_quantity > 0 && (
              <option value="ex_nhavasheva">Ex-Nhavasheva: ₹{selectedProduct.ex_nhavasheva}-{selectedProduct.nhavasheva_quantity} (quantity)</option>
            )}
            {selectedProduct.ex_nhavasheva && selectedProduct.nhavasheva_quantity === 0 && (
              <option value="ex_nhavasheva" disabled>
                Ex-Nhavasheva: Out of Stock
              </option>
            )}

            {selectedProduct.ex_mundra && selectedProduct.mundra_quantity > 0 && (
              <option value="ex_mundra">Ex-Mundra: ₹{selectedProduct.ex_mundra}-{selectedProduct.mundra_quantity} (quantity)</option>
            )}
            {selectedProduct.ex_mundra && selectedProduct.mundra_quantity === 0 && (
              <option value="ex_mundra" disabled>
                Ex-Mundra: Out of Stock
              </option>
            )}
          </select>
          <div className="mt-2">
            {selectedProductPrice && selectedProduct[selectedProductPrice] && (
              <strong>
                Selected Price: ₹{selectedProduct[selectedProductPrice]}
              </strong>
            )}
          </div>
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
                min="1" // Ensures the value cannot go below 1
                step="1" // Ensures increments are in whole numbers (optional)
                onInput={(e) => e.preventDefault()} // Prevents invalid input
              />
            {/* Show error message below input if quantity exceeds available quantity of selected location */}
            {selectedProductPrice && selectedProduct[selectedProductPrice] && additionalQuantity > selectedProduct[selectedProductPrice.split("_")[1] + "_quantity"] && (
              <div className="text-danger mt-2">
               Entered Quantity exceeds Available Stock in Selected Location.
              </div>
            )}
          </div>
          <button
            className="btn btn-success"
            onClick={addToOrder}
            style={{ width: '100%' }}
            disabled={additionalQuantity > selectedProduct[selectedProductPrice.split("_")[1] + "_quantity"]}  // Disable button if quantity exceeds available stock for the selected location
          >
            Add to Order
          </button>
          <div style={{ marginTop: '20px' }}>
            {orderItems.map((item, index) => (
              <div key={index}>
                {item.product.name} - Quantity: {item.quantity} - Price: {item.price}
              </div>
            ))}
          </div>
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
  }, [navigate, location]);
  // Redirect to home if required data is missing
  useEffect(() => {
    if (!name || !price || !required_quantity || !hsn) {
      navigate('/', { replace: true });
    }
  }, [name, price, required_quantity, hsn, navigate]);
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
    if (num === 0) return 'Zero';
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
      'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
      return '';
    };
    const units = ['Crore', 'Lakh', 'Thousand', ''];
    const divisors = [10000000, 100000, 1000, 1];
    let result = '';
    for (let i = 0; i < divisors.length; i++) {
      const quotient = Math.floor(num / divisors[i]);
      num %= divisors[i];
      if (quotient > 0) {
        result += numToWords(quotient) + ' ' + units[i] + ' ';
      }
    }
    return result.trim() + ' Rupees Only';
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    if (logo) {
      doc.addImage(logo, 'JPEG', 8, 6, 35, 15); // Adjust the width and height of the logo
    }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const companyAddress = [
      'VIKAH RUBBERS',
      '406, 4th Floor, Patel Towers,',
      'Above EasyBuy Beside Nagole RTO Office,',
      'Nagole Hyderabad, Telangana-500035',
    ];
    let addressYy = 9; // Adjusted starting Y to align with logo
    doc.text(companyAddress[0], 40, addressYy + 2); // Company Name
    doc.text(companyAddress[1], 40, addressYy + 5); // Street Address
    doc.text(companyAddress[2], 40, addressYy + 8); // Additional Address
    doc.text(companyAddress[3], 40, addressYy + 11); // City, State, and Postal Code
    const baseItems = [
      {
        name,
        price,
        hsn,
        quantity: required_quantity,
        loading_location: selected_location,
        total: price * required_quantity,
      },
    ];
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFORMA INVOICE', 115, addressYy + 1, { align: 'center' }); // Moved down slightly
    doc.setFontSize(10);
    doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 190, 20, { align: 'right' });
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 25, 200, 25); // Underline
    // Billing and Shipping Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To', 14, 35);
    doc.text('Ship To', 133, 35);
    doc.line(10, 38, 200, 38); // Underline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    // Bill To Section
    const labelX = 14; // X position for the left side
    const colonX = labelX + 20; // X position for the colon alignment
    const valueX = colonX + 5; // X position for the values
    doc.text('Company', labelX, 45);
    doc.text(':', colonX, 45);
    doc.text(profile.companyName || 'N/A', valueX, 45);
    doc.text('Email', labelX, 50);
    doc.text(':', colonX, 50);
    doc.text(profile.email || 'N/A', valueX, 50);
    doc.text('Phone', labelX, 55);
    doc.text(':', colonX, 55);
    doc.text(profile.phoneNumber || 'N/A', valueX, 55);
    doc.text('GST', labelX, 60);
    doc.text(':', colonX, 60);
    doc.text(profile.gstNumber || 'N/A', valueX, 60);
    doc.text('Address', labelX, 65);
    doc.text(':', colonX, 65);
    const billingAddress = doc.splitTextToSize(`${profile.billAddress || 'N/A'}`, 80);
    billingAddress.forEach((line, index) => {
      doc.text(line, valueX, 65 + (index * 5));
    });
    // Ship To Section
    const shipToColonX = labelX + 20; // Unique name for the second colonX
    let finalShippingAddress = '';
    if (isSameAsBilling) {
      finalShippingAddress = profile?.billAddress || 'N/A';
    } else {
      finalShippingAddress = shippingAddress || 'N/A';
    }
    const wrappedShippingAddress = doc.splitTextToSize(`${finalShippingAddress}`, 60);
    wrappedShippingAddress.forEach((line, index) => {
      doc.text(line, valueX + 95, 45 + (index * 5));
    });
    const billingAddressHeight = 15 + billingAddress.length * 5;
    const shippingAddressHeight = 15 + wrappedShippingAddress.length * 5;
    const totalAddressHeight = Math.max(billingAddressHeight, shippingAddressHeight); // Maximum of both addresses
    // Products Section: Dynamically set start position based on address length
    let productsStartY = 50 + totalAddressHeight;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Products', 14, productsStartY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, productsStartY + 3, 200, productsStartY + 3); // Underline
    const gstRate = 0.18;
    const subtotalBase = baseItems.reduce((sum, item) => sum + item.total, 0); // For base items
    const subtotalAdditional = additionalItems.reduce((sum, item) => sum + item.total, 0); // For additional items
    const subtotal = subtotalBase + subtotalAdditional;
    const gst = subtotal * gstRate;
    const total = subtotal + gst;
    const totalAmountInWords = numberToWords(total);
    doc.setFont('helvetica', 'normal');
    const combinedItems = [
      ...baseItems.map(item => ({
        name: item.name,
        price: item.price,
        hsn: item.hsn,
        quantity: item.quantity,
        loading_location: item.loading_location || selected_location, // Load specific location or fallback to default selected_location
        total: item.total,
        gst: item.total * gstRate,
      })),
      ...additionalItems.map(item => ({
        name: item.name,
        price: item.price,
        hsn: item.hsn,
        quantity: item.quantity,
        total: item.total,
        loading_location: item.loading_location || selected_location, // Similarly, check for item-specific location or fallback to default
        gst: item.total * gstRate,
      })),
    ];
    doc.autoTable({
      startY: productsStartY + 5, // Start products section after the header
      head: [
        ['Item Name', 'Price/Ton', 'Loading Location', 'HSN', 'Quantity', 'Subtotal', 'GST (18%)', 'Total']
      ],
      body: combinedItems.map(item => [
        item.name,
        `RS ${item.price.toFixed(2)}`,
        item.loading_location, // Now this reflects the correct location per item
        item.hsn,
        `${item.quantity} tons`,
        `RS ${item.total.toFixed(2)}`,
        `RS ${item.gst.toFixed(2)}`,
        `RS ${(item.total + item.gst).toFixed(2)}`,
      ]),
      theme: 'striped',
      styles: { fontSize: 8 },
    });
    const firstTableFinalY = doc.lastAutoTable.finalY + 5; // Position after the first table
    const secondTableStartY = firstTableFinalY + 2; // Decrease space between tables
    doc.autoTable({
      startY: secondTableStartY,
      head: [['Description', 'Amount']],
      body: [
        ['Taxable value', `RS ${subtotal.toFixed(2)}`],
        ['Total GST (18%)', `RS ${gst.toFixed(2)}`],
        ['Total', `RS ${total.toFixed(2)}`],
      ],
      theme: 'grid',
      styles: {
        fontSize: 8,  // Keep font size small
        cellPadding: 2,  // Ensure minimal padding
      },
      columnStyles: {
        0: { cellWidth: 80, halign: 'left' },
        1: { cellWidth: 40, halign: 'right' },
      },
      headStyles: {
        fontSize: 9,  // Adjust heading font size
        fontStyle: 'bold',
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0]
      },
    });
    // Positioning for Total Amount in Words and Total Balance
    const totalAmountY = doc.lastAutoTable.finalY + 10; // Position below the second table
    doc.text(`Total Amount (In Words): ${totalAmountInWords}`, 14, totalAmountY);
    doc.text(`Total Balance : Rs ${total.toFixed(2)}`, 14, totalAmountY + 8);
    const addressY = totalAmountY + 18; // Starting Y position for the section
    const bankingY = addressY; // You can define it equal to addressY or adjust if needed
    doc.setFontSize(12);
    doc.setFont('helvetica');
    // Banking Details Heading
    doc.text('Banking Details', 14, bankingY);  // Left-aligned
    doc.setDrawColor(0, 0, 0);
    doc.line(10, bankingY + 3, 200, bankingY + 3); // Underline for the heading
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    // Column-wise Banking Details with aligned colons
    const bankingStartX = 14; // X position for the left side
    const colonXForBanking = bankingStartX + 45; // X position for the colon alignment
    doc.text('Bank Name', bankingStartX, bankingY + 10);
    doc.text(':', colonXForBanking, bankingY + 10);
    doc.text('IDFC FIRST BANK', bankingStartX + 60, bankingY + 10);
    doc.text('Account Name', bankingStartX, bankingY + 15);
    doc.text(':', colonXForBanking, bankingY + 15);
    doc.text('VIKAH RUBBERS', bankingStartX + 60, bankingY + 15);
    doc.text('Account Number', bankingStartX, bankingY + 20);
    doc.text(':', colonXForBanking, bankingY + 20);
    doc.text('10113716761', bankingStartX + 60, bankingY + 20);
    doc.text('IFSC CODE', bankingStartX, bankingY + 25);
    doc.text(':', colonXForBanking, bankingY + 25);
    doc.text('IDFB0040132', bankingStartX + 60, bankingY + 25);
    doc.text('Account Type', bankingStartX, bankingY + 30);
    doc.text(':', colonXForBanking, bankingY + 30);
    doc.text('CURRENT A/C', bankingStartX + 60, bankingY + 30);
    doc.text('Branch', bankingStartX, bankingY + 35);
    doc.text(':', colonXForBanking, bankingY + 35);
    doc.text('NERUL BRANCH', bankingStartX + 60, bankingY + 35);
    // Terms and Conditions Section
    const termsY = bankingY + 45; // Start after banking details
    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', 14, termsY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, termsY + 3, 200, termsY + 3); // Underline
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const termsText = [
      '1. The Seller shall not be liable to the Buyer for any loss or damage.',
      '2. The Seller warrants the product for one (1) year from the date of shipment.',
      '3. The purchase order will be interpreted as acceptance of this offer.',
    ];
    let yOffset = termsY + 10;
    termsText.forEach(line => {
      doc.text(line, 14, yOffset);
      yOffset += 5; // Adjust for next line
    });
    // Seal Position Adjustment
    const imageY = yOffset + 0; // Move the image slightly higher
    const imageWidth = 80; // Increased width of the image
    const imageHeight = 80; // Increased height of the image
    doc.addImage(seal, 'PNG', 100, imageY, imageWidth, imageHeight); // Adjust position and size
    return doc.output('blob');
  };
  const handleOrder = async () => {
    try {
      setLoadingButton(true);
      const token = localStorage.getItem('token');
      if (!token) {
        displayAlert('User not authenticated.', 'danger');
        navigate('/', { replace: true });
        return;
      }
      // Declare baseItem properly
      const baseItem = {
        name,
        price,
        hsn,
        quantity: required_quantity,
        loading_location: selected_location,
        total: price * required_quantity,
      };
      const allItems = [baseItem, ...additionalItems];
      const isValidOrder = allItems.every(item =>
        item.name && item.quantity && item.total && item.price && item.hsn
      );
      if (!isValidOrder) {
        displayAlert('Order validation failed: Missing required fields in some items.', 'danger');
        setLoadingButton(false);
        return;
      }
      // Include shipping address
      const orderData = {
        items: allItems,
        billingAddress: profile?.billAddress || '',
        shippingAddress: isSameAsBilling ? (profile?.billAddress || '') : shippingAddress,
        isSameAsBilling,
      };
      console.log('Order Data:', orderData); // Verify data in console
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Adminorder`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        // Generate PDF after successful order creation
        const pdfBlob = generatePDF();
        const formData = new FormData();
        formData.append('pdf', pdfBlob, 'order-summary.pdf');
        formData.append('userEmail', profile?.email);
        // Call the second API to send the PDF to the backend
        const emailResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload-pdf`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        if (emailResponse.status === 200) {
          displayAlert('Order placed successfully, and invoice emailed!', 'success');
          setTimeout(() => {
            const alertContainer = document.getElementById('alert-container');
            if (alertContainer) {
              alertContainer.innerHTML = '';
            }
          }, 5000); // Alert disappears after 5 seconds
          navigate('/Getorders');
        } else {
          displayAlert('Failed to send invoice email.', 'danger');
        }
      } else {
        displayAlert('Failed to store order in the database.', 'danger');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      displayAlert('An error occurred while placing the order.', 'danger');
    } finally {
      setLoadingButton(false);
    }
  };
  // Helper function to display alerts
  const displayAlert = (message, type) => {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show alert-fade" role="alert">
          <img src="${logo1}" alt="Logo" class="mr-2" style="width: 100px;">
          ${message}
         
        </div>
      `;
    }
  };
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
  return (
    <div className="setter">
      <div className="container mt-5">
        <div className="border p-4 rounded bg-light shadow-lg">
          {/* Header with Logo and Title */}
          <div className="row align-items-center mb-4">
            <div className="col-md-2 col-sm-3">
              <img src={logo} alt="Logo" className="img-fluid" style={{ maxHeight: "60px" }} />
            </div>
            <div style={{ paddingLeft: "21.5%" }} className="col-md-10 col-sm-9">
              <h2 className="text-primary font-weight-bold">Order Summary</h2>
            </div>
          </div>
          <div className="row">
            {/* Full-width Column for Heading */}
            <div className="col-12 text-center mb-4">
              <h4 className="text-secondary font-weight-semibold">Business Profile Details</h4>
            </div>
            {/* Left Column (Business Profile Details) */}
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <p><strong>Company Name:</strong> {profile?.companyName || "N/A"}</p>
                  <p><strong>Phone:</strong> {profile?.phoneNumber || "N/A"}</p>
                  <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
                  <p><strong>GST:</strong> {profile?.gstNumber || "N/A"}</p>
                  <p><strong>Billing Address:</strong> {profile?.billAddress || "N/A"}</p>
                </div>
              </div>
            </div>
            {/* Right Column (Shipping Address Section) */}
            <div className="col-md-6 mb-4">
              <h5 className="mb-4 fs-4 fw-bold">Shipping Details</h5>
              {/* Checkbox Section with Heading */}
              <div className="mb-3">
                <h6 className="d-flex align-items-center" style={{ paddingLeft: '25px' }}>
                  <span className="fs-5 me-3" style={{ marginRight: '10px' }}>Same as Billing Address</span>
                  <input
                    type="checkbox"
                    className="form-check-input custom-checkbox fs-4"
                    style={{
                      width: '20px',   // Adjust the width of the checkbox
                      height: '20px',  // Adjust the height of the checkbox
                      transform: 'translateY(-2px)', // Center the tick mark vertically
                    }}
                    id="sameAsBilling"
                    checked={isSameAsBilling}
                    onChange={handleCheckboxChange}
                  />
                </h6>
              </div>
              {/* Shipping Address Input */}
              <div className="mb-4">
                <label htmlFor="shippingAddress" className="form-label fs-5 fw-semibold">
                  Shipping Address
                </label>
                <textarea
                  id="shippingAddress"
                  className="form-control"
                  rows="4"
                  value={shippingAddress}
                  onChange={handleShippingAddressChange}
                  placeholder="Enter Shipping Address"
                  disabled={isSameAsBilling}
                ></textarea>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          {/* Order Details and Place Order Button */}
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
                style={{ width: "100%" }}
              >
                {loadingButton ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Order;