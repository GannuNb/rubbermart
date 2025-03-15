import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Sell.css";
import logo from "./images/logo3.png";
import "./Order.css";
import logo1 from "./images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import seal from "./images/seal1.png";
const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sellerid,
    name,
    available_quantity,
    price,
    required_quantity,
    hsn,
    selected_location,
    id,
    scrapid,
  } = location.state || {};

  const [totalPrice, setTotalPrice] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderItems, setOrderItems] = useState([]); // State to store items in the order
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [orderAdded, setOrderAdded] = useState(false); // Tracks if the order has been added

    useEffect(() => {
        // Directly set the scroll position to the top of the page
        document.documentElement.scrollTop = 0; 
        document.body.scrollTop = 0;  // For compatibility with older browsers
      }, []); // Empty dependency array ensures it runs only once on page load
  
      
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/applications`,
          {
            params: { id },
          }
        );
        setApplications(response.data);
        setLoadingApplications(false);
      } catch (err) {
        setError("Failed to load applications");
        setLoadingApplications(false);
      }
    };

    if (id) {
      fetchApplications();
    }
  }, [id]);

  const handleApplicationChange = (e) => {
    setSelectedApplication(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
  const handleAddApplication = () => {
    if (!selectedApplication || !quantity) {
      displayAlert(
        "Please select an application and enter quantity.",
        "danger"
      );
      return;
    }

    // Find the selected application object
    const selectedApp = applications.find(
      (app) => app.application === selectedApplication
    );

    if (selectedApp) {
      const newItem = {
        sellerid: sellerid,
        name: selectedApp.application,
        price: selectedApp.price,
        hsn: selectedApp.hsn,
        quantity: parseFloat(quantity),
        loading_location: selectedApp.loadingLocation,
        availablequantity: quantity,
        total: selectedApp.price * parseFloat(quantity), // Calculate total
      };

      setApplications((prev) => [...prev, newItem]); // Update state with new item
      setQuantity(""); // Reset quantity after adding
      setSelectedApplication(""); // Reset application dropdown
    }
  };

  const addToOrder = () => {
    if (selectedApplication && quantity) {
      const selectedApp = applications.find(
        (app) => app.application === selectedApplication
      );

      // Check if the required quantity exceeds available quantity
      if (selectedApp && parseFloat(quantity) > selectedApp.quantity) {
        alert(
          `The required quantity exceeds the available quantity of ${selectedApp.quantity} tons.`
        );
        return; // Prevent adding the item to the order
      }

      if (selectedApp) {
        const item = {
          sellerid: sellerid,
          name: selectedApp.application,
          price: selectedApp.price,
          hsn: "40040000", // Static HSN for additional items, replace '40040000' with the actual HSN code.
          quantity: parseFloat(quantity),
          loading_location: selectedApp.loadingLocation,
          total: selectedApp.price * parseFloat(quantity),
          scrapid: selectedApp.scrapid, // Include scrapid here
        };

        // Add the new item to the orderItems state
        setOrderItems([...orderItems, item]);

        // Reset the selected application and quantity
        setSelectedApplication("");
        setQuantity("");
      }
    } else {
      alert("Please select an application and enter a quantity.");
    }
  };

  const handleCheckboxChange = () => {
    setIsSameAsBilling(!isSameAsBilling);
    if (!isSameAsBilling) {
      setShippingAddress(profile?.billAddress || ""); // Copy billing address to shipping address
    } else {
      setShippingAddress(""); // Clear input if unchecked
    }
  };
  // Handle manual shipping address input
  const handleShippingAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };

  // Render Order Summary
  const renderOrderSummary = () => {
    const gstNumber = profile?.gstNumber || '';
    const gstRate = gstNumber.startsWith('27') ? 0.09 : 0.18;
    // baseItems contains the main order item (the one passed in the location state)
    const baseItems = [
      {
        sellerid,
        name,
        price,
        hsn,
        quantity: required_quantity,
        loading_location: selected_location,
        total: price * required_quantity, // Total cost of base item
      },
    ];

    // Combine the baseItems with any additional items added to the order
    const allItems = [...baseItems, ...orderItems];

    // Calculate subtotal (sum of all item totals)
    const subtotal = allItems.reduce((sum, item) => sum + item.total, 0);

    // Calculate GST (18% of the subtotal)
    const gst = subtotal * gstRate;

    // Calculate the total (subtotal + GST)
    const total = subtotal + gst;

    // Check if the applications are still loading
    if (loadingApplications) return <div>Loading applications...</div>;

    // Handle error message if applications failed to load
    if (error) return <div className="alert alert-danger">{error}</div>;

    // Determine which applications are already in the order
    const addedApplications = allItems.map((item) => item.name);





    return (
      <div className="border p-4 rounded bg-white mt-4">
        <h4>Order Details</h4>
        <div
          className="table-responsive"
          style={{
            overflowX: 'scroll',
            display: 'block',
            whiteSpace: 'nowrap',
          }}
        >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Seller ID</th>
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
                  <td>{item.sellerid}</td>
                  <td>{item.name}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>{item.loading_location}</td>
                  <td>{item.hsn}</td>
                  <td>{item.quantity} tons</td>
                  <td>₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>

            {/* Application and Quantity Input */}
            <tfoot>
              <tr>
                <td colSpan="6">
                  {/* "+" button to show the dropdown */}
                  {!orderAdded && (
                    <button
                      className="btn btn-success rounded-circle p-4 mt-3" // Increased padding for a larger button
                      onClick={() => setDropdownVisible(true)} // Show dropdown when clicked
                      style={{
                        width: '60px', // Larger width
                        height: '60px', // Larger height
                        fontSize: '36px', // Larger font size for the "+" symbol
                        lineHeight: '60px', // Ensure the "+" is vertically centered
                        display: 'flex', // Use flexbox for centering
                        justifyContent: 'center', // Center horizontally
                        alignItems: 'center', // Center vertically
                        color: 'black', // Make the "+" black
                        border: 'none', // Optional: remove any border
                      }}
                    >
                      +
                    </button>
                  )}

                  {/* Show the dropdown only if it's visible and order is not added */}
                  {!orderAdded && dropdownVisible && (
                    <div className="mb-3 mt-4">
                      <label
                        htmlFor="applicationDropdown"
                        className={orderAdded ? 'text-muted text-black' : 'text-black'} // Apply black color by default, muted if order is added
                      >
                        Add Applications from this Seller
                      </label>
                      <select
                        id="applicationDropdown"
                        className="form-select"
                        value={selectedApplication}
                        onChange={handleApplicationChange}
                        disabled={orderAdded}  // Disable if order is added
                      >
                        <option value="">Select Application</option>
                        {applications.map((app, index) => (
                          <option
                            key={index}
                            value={app.application}
                            disabled={addedApplications.includes(app.application)}
                          >
                            {app.application} - ₹{app.price}- Available {app.quantity} - ({app.loadingLocation})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity Input if an application is selected */}
                  {!orderAdded && selectedApplication && (
                    <div className="mb-3 ">
                      <label
                        htmlFor="quantity"
                        className={orderAdded ? 'text-muted' : ''} // Disable label if order is added
                        style={{ color: 'black' }}
                      >
                        Required Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        className="form-control"
                        value={quantity}
                        onChange={handleQuantityChange}
                        required
                        disabled={orderAdded}  // Disable if order is added
                      />

                      {/* Show error message if required quantity exceeds available quantity */}
                      {selectedApplication &&
                        parseFloat(quantity) >
                        applications.find(
                          (app) => app.application === selectedApplication
                        ).quantity && (
                          <small className="text-danger">
                            Required quantity exceeds available quantity!
                          </small>
                        )}
                      {/* Button to add item to order */}
                      <div className="text-end">
                        <button
                          className="btn btn-primary mt-2"
                          onClick={addToOrder}
                          disabled={orderAdded || addedApplications.includes(selectedApplication)}
                        >
                          Add to Order
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>

              {/* Calculation rows */}
              <tr>
                <td colSpan="4" className="text-right">
                  <strong>Subtotal:</strong>
                </td>
                <td>₹{subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="4" className="text-right">
                  <strong>GST ({gstRate * 100}%):</strong>
                </td>
                <td>₹{gst.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="4" className="text-right">
                  <strong>Total:</strong>
                </td>
                <td>₹{total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setTimeout(() => {
        if (!document.querySelector(".custom-alert")) { // Prevent multiple alerts
          const alertDiv = document.createElement("div");
          alertDiv.className = "custom-alert";

          const logoImg = document.createElement("img");
          logoImg.src = logo1;
          logoImg.alt = "Company Logo";
          logoImg.className = "alert-logo";

          const alertMessage = document.createElement("span");
          alertMessage.textContent = "Please log in to Order ";
          alertMessage.className = "alert-message";

          alertDiv.appendChild(logoImg);
          alertDiv.appendChild(alertMessage);
          document.body.appendChild(alertDiv);

          setTimeout(() => {
            alertDiv.remove();
          }, 5000);
        }

        navigate("/Login", { state: { from: location.pathname } });
      }, 0);
    }
  }, [navigate, location]);
  // Redirect to home if required data is missing
  useEffect(() => {
    if (!name || !price || !required_quantity || !hsn) {
      navigate("/", { replace: true });
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
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/business-profile`,
          config
        );
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
        } else {
          navigate("/BusinessProfile", { replace: true });
        }
      } catch (err) {
        setError("Failed to fetch profile.");
        console.error("Error fetching business profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const numberToWords = (num) => {
    if (num === 0) return "Zero";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " and " + numToWords(n % 100) : "")
        );
      return "";
    };
    const units = ["Crore", "Lakh", "Thousand", ""];
    const divisors = [10000000, 100000, 1000, 1];
    let result = "";
    for (let i = 0; i < divisors.length; i++) {
      const quotient = Math.floor(num / divisors[i]);
      num %= divisors[i];
      if (quotient > 0) {
        result += numToWords(quotient) + " " + units[i] + " ";
      }
    }
    return result.trim() + " Rupees Only";
  };

  const generatePDF = (
    baseItems,
    orderItems,
    profile,
    isSameAsBilling,
    shippingAddress,
    logo,
    seal
  ) => {
    const doc = new jsPDF();

    // Add text instead of the logo
if (logo) {
  doc.setFontSize(10); // Set font size for the logo text
  doc.setFont("helvetica", "bold"); // Optional: Set font style (bold)
  doc.text("Rubberscrapmart", 6, 18); // Position the text (x, y coordinates)
}


    // Set font for header
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    // Company address
    const companyAddress = [
      'Rubberscrapmart',
      'Ground Floor, Office No-52/ Plot No-44,',
      'Sai Chamber CHS Wing A, Sector -11',
      'Sai Chambers, CBD Belapur, Navi Mumbai,',
      'Thane, Maharashtra, 400614',
      'GSTN : 27AAVFV4635R1ZY',
    ];

    let addressYy = 9; // Adjusted starting Y to align with logo
    doc.text(companyAddress[0], 40, addressYy + 2); // Company Name
    doc.text(companyAddress[1], 40, addressYy + 5); // Street Address
    doc.text(companyAddress[2], 40, addressYy + 8); // Additional Address
    doc.text(companyAddress[3], 40, addressYy + 11); // City, State, and Postal Code
    doc.text(companyAddress[4], 40, addressYy + 14); // City, State, and Postal Code
    doc.text(companyAddress[5], 40, addressYy + 17); // City, State, and Postal Code



    // Invoice Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PROFORMA INVOICE", 115, addressYy + 1, { align: "center" });

    // Order Date
    doc.setFontSize(10);
    doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 190, 20, {
      align: "right",
    });
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 30, 200, 30); // Underline

    // Billing and Shipping Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To", 14, 35);
    doc.text("Ship To", 133, 35);
    doc.line(10, 38, 200, 38); // Underline

    // Bill To Section
    const labelX = 14; // X position for the left side
    const colonX = labelX + 20; // X position for the colon alignment
    const valueX = colonX + 5; // X position for the values
    doc.setFontSize(10);

    // Company Name
    doc.text("Company", labelX, 45);
    doc.text(":", colonX, 45);
    doc.text(profile.companyName || "N/A", valueX, 45);

    // Address
    doc.text("Address", labelX, 50);
    doc.text(":", colonX, 50);
    const billingAddress = doc.splitTextToSize(
      `${profile.billAddress || "N/A"}`,
      60
    );
    billingAddress.forEach((line, index) => {
      doc.text(line, valueX, 50 + index * 5);
    });

    // Phone Number
    doc.text("Phone", labelX, 50 + billingAddress.length * 5);
    doc.text(":", colonX, 50 + billingAddress.length * 5);
    doc.text(profile.phoneNumber || "N/A", valueX, 50 + billingAddress.length * 5);

    // Email
    doc.text("E-mail", labelX, 55 + billingAddress.length * 5);
    doc.text(":", colonX, 55 + billingAddress.length * 5);
    doc.text(profile.email || "N/A", valueX, 55 + billingAddress.length * 5);

    // GST Number
    doc.text("GSTN", labelX, 60 + billingAddress.length * 5);
    doc.text(":", colonX, 60 + billingAddress.length * 5);
    doc.text(profile.gstNumber || "N/A", valueX, 60 + billingAddress.length * 5);

    // Ship To Section
    const shipToColonX = labelX + 20; // Unique name for the second colonX
    let finalShippingAddress = "";
    if (isSameAsBilling) {
      finalShippingAddress = profile?.billAddress || "N/A";
    } else {
      finalShippingAddress = shippingAddress || "N/A";
    }
    const wrappedShippingAddress = doc.splitTextToSize(
      `${finalShippingAddress}`,
      60
    );

    // Company Name
    doc.text("Company", labelX + 95, 45);
    doc.text(":", shipToColonX + 95, 45);
    doc.text(profile.companyName || "N/A", valueX + 95, 45);

    // Address
    doc.text("Address", labelX + 95, 50);
    doc.text(":", shipToColonX + 95, 50);
    wrappedShippingAddress.forEach((line, index) => {
      doc.text(line, valueX + 95, 50 + index * 5);
    });

    // Phone Number
    doc.text("Phone", labelX + 95, 50 + wrappedShippingAddress.length * 5);
    doc.text(":", shipToColonX + 95, 50 + wrappedShippingAddress.length * 5);
    doc.text(profile.phoneNumber || "N/A", valueX + 95, 50 + wrappedShippingAddress.length * 5);

    // Email
    doc.text("E-mail", labelX + 95, 55 + wrappedShippingAddress.length * 5);
    doc.text(":", shipToColonX + 95, 55 + wrappedShippingAddress.length * 5);
    doc.text(profile.email || "N/A", valueX + 95, 55 + wrappedShippingAddress.length * 5);

    // GST Number
    doc.text("GSTN", labelX + 95, 60 + wrappedShippingAddress.length * 5);
    doc.text(":", shipToColonX + 95, 60 + wrappedShippingAddress.length * 5);
    doc.text(profile.gstNumber || "N/A", valueX + 95, 60 + wrappedShippingAddress.length * 5);

    const billingAddressHeight = 20 + billingAddress.length * 5;
    const shippingAddressHeight = 20 + wrappedShippingAddress.length * 5;
    const totalAddressHeight = Math.max(
      billingAddressHeight,
      shippingAddressHeight
    ); // Maximum of both addresses




    // Products Section
    let productsStartY = 50 + totalAddressHeight;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Products", 14, productsStartY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, productsStartY + 3, 200, productsStartY + 3); // Underline

    const gstRate = profile.gstNumber && profile.gstNumber.startsWith("27") ? 0.09 : 0.18;
    const subtotalBase = [...baseItems, ...orderItems].reduce(
      (sum, item) => sum + (item.total || 0), 0
    ); // Ensure item.total is defined
    const subtotal = subtotalBase;

    const gst = subtotal * gstRate;
    const total = subtotal + gst;
    const totalAmountInWords = numberToWords(total); // Ensure correct function call

    // Combine items for both baseItems and orderItems
    const combinedItems = [
      ...baseItems,
      ...orderItems.map((item) => {
        const total = item.total || item.price * item.quantity; // Ensure total is calculated
        const gst = total * gstRate; // GST calculation

        return {
          sellerid: sellerid,
          name: item.name,
          price: item.price,
          hsn: item.hsn,
          quantity: item.quantity,
          loading_location: item.loading_location || selected_location,
          total: total, // Ensure total is set properly
          gst: gst, // Ensure gst is calculated
          scrapid: item.scrapid, // Ensure scrapid is included for each item
        };
      }),
    ];


    doc.autoTable({
      startY: productsStartY + 5,
      head: [
        [
          "SellerID",
          "Item Name",
          "Price/Ton",
          "Loading Location",
          "HSN",
          "Quantity",
          "Subtotal",
          "GST",
          "Total",
        ],
      ],
      body: combinedItems.map((item) => {
        // Calculate GST if not provided
        const gst = item.gst !== undefined ? item.gst : item.total * gstRate;
        const totalWithGST = item.total + gst;

        return [
          sellerid,
          item.name,
          `RS ${item.price.toFixed(2)}`,
          item.loading_location, // Loading Location
          item.hsn,
          `${item.quantity} tons`,
          `RS ${item.total.toFixed(2)}`,
          `RS ${gst.toFixed(2)}`, // Use the calculated GST value
          `RS ${totalWithGST.toFixed(2)}`, // Total including GST
        ];
      }),
      theme: "striped",
      styles: { fontSize: 8 },
    });


    // Second Table for Total Amounts
    const firstTableFinalY = doc.lastAutoTable.finalY + 5;
    const secondTableStartY = firstTableFinalY + 2;
    const gstRateText = gstRate === 0.09 ? "9%" : "18%"; // Dynamically decide whether it's 9% or 18%

doc.autoTable({
  startY: secondTableStartY,
  head: [["Description", "Amount"]],
  body: [
    ["Taxable value", `RS ${subtotal.toFixed(2)}`],
    [`Total GST (${gstRateText})`, `RS ${gst.toFixed(2)}`], // Use dynamic GST label
    ["Total", `RS ${total.toFixed(2)}`],
  ],
  theme: "grid",
  styles: {
    fontSize: 8,
    cellPadding: 2,
  },
  columnStyles: {
    0: { cellWidth: 80, halign: "left" },
    1: { cellWidth: 40, halign: "right" },
  },
  headStyles: {
    fontSize: 9,
    fontStyle: "bold",
    fillColor: [240, 240, 240],
    textColor: [0, 0, 0],
  },
});


    // Total Amount in Words and Total Balance
    const totalAmountY = doc.lastAutoTable.finalY + 10;
    doc.text(
      `Total Amount (In Words): ${totalAmountInWords}`,
      14,
      totalAmountY
    );
    doc.text(`Total Balance : Rs ${total.toFixed(2)}`, 14, totalAmountY + 8);

    // Banking Details
    const addressY = totalAmountY + 18;
    const bankingY = addressY;
    doc.setFontSize(12);
    doc.setFont("helvetica");
    doc.text("Banking Details", 14, bankingY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, bankingY + 3, 200, bankingY + 3); // Underline
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const bankingStartX = 14;
    const colonXForBanking = bankingStartX + 45;
    doc.text("Bank Name", bankingStartX, bankingY + 10);
    doc.text(":", colonXForBanking, bankingY + 10);
    doc.text("IDFC FIRST BANK", bankingStartX + 60, bankingY + 10);
    doc.text("Account Name", bankingStartX, bankingY + 15);
    doc.text(":", colonXForBanking, bankingY + 15);
    doc.text("VIKAH RUBBERS", bankingStartX + 60, bankingY + 15);
    doc.text("Account Number", bankingStartX, bankingY + 20);
    doc.text(":", colonXForBanking, bankingY + 20);
    doc.text("10113716761", bankingStartX + 60, bankingY + 20);
    doc.text("IFSC CODE", bankingStartX, bankingY + 25);
    doc.text(":", colonXForBanking, bankingY + 25);
    doc.text("IDFB0040132", bankingStartX + 60, bankingY + 25);
    doc.text("Account Type", bankingStartX, bankingY + 30);
    doc.text(":", colonXForBanking, bankingY + 30);
    doc.text("CURRENT A/C", bankingStartX + 60, bankingY + 30);
    doc.text("Branch", bankingStartX, bankingY + 35);
    doc.text(":", colonXForBanking, bankingY + 35);
    doc.text("NERUL BRANCH", bankingStartX + 60, bankingY + 35);

    // Terms and Conditions
    const termsY = bankingY + 45;
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions:", 14, termsY);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, termsY + 3, 200, termsY + 3); // Underline
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const termsText = [
      "1. The Seller shall not be liable to the Buyer for any loss or damage.",
      "2. The Seller warrants the product for one (1) year from the date of shipment.",
      "3. The purchase order will be interpreted as acceptance of this offer.",
    ];
    let yOffset = termsY + 10;
    termsText.forEach((line) => {
      doc.text(line, 14, yOffset);
      yOffset += 5; // Adjust for next line
    });

    // Seal Position Adjustment
    if (seal) {
      const imageY = yOffset + 0;
      const imageWidth = 80;
      const imageHeight = 80;
      doc.addImage(seal, "PNG", 100, imageY, imageWidth, imageHeight); // Adjust position and size
    }

    return doc.output("blob");
  };

  const handleOrder = async () => {
    try {
      setLoadingButton(true); // Show loading state on button

      // Step 1: Check if the user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        displayAlert("User not authenticated.", "danger");
        navigate("/", { replace: true });
        return;
      }

      // Step 2: Combine baseItems (from the state) and added items (from the orderItems state)
      const gstRate = 0.18; // GST rate of 18%
      const baseItems = [
        {
          sellerid: sellerid,
          name,
          price,
          hsn,
          quantity: required_quantity,
          loading_location: selected_location,
          total: price * required_quantity, // Total cost of base item
          scrapid, // Add scrapid here for the base item
        },
      ];

      const combinedItems = [
        ...baseItems,
        ...orderItems.map((item) => ({
          sellerid: sellerid,
          name: item.name,
          price: item.price,
          hsn: item.hsn,
          quantity: item.quantity,
          loading_location: item.loading_location || selected_location,
          total: item.total || item.price * item.quantity, // Ensure total is set properly
          gst: (item.total || item.price * item.quantity) * gstRate, // Ensure gst is calculated correctly
          scrapid: item.scrapid, // Ensure scrapid is included for each item
        })),
      ];

      // Step 3: Validate order data (check if all necessary fields are filled)
      const isValidOrder = combinedItems.every(
        (item) =>
          item.name &&
          item.quantity &&
          item.total &&
          item.price &&
          item.hsn &&
          item.scrapid // Include scrapid in validation
      );
      if (!isValidOrder) {
        displayAlert(
          "Order validation failed: Missing required fields in some items.",
          "danger"
        );
        setLoadingButton(false); // Reset loading state
        return;
      }

      // Step 4: Create order data to send to the backend
const orderData = {
  items: combinedItems,
  billingAddress: profile?.billAddress || "", // Ensure fallback for missing address
  shippingAddress: isSameAsBilling
    ? profile?.billAddress || ""
    : shippingAddress,
  isSameAsBilling,
  id, // Assuming id is the order ID or another required identifier
  gstNumber: profile?.gstNumber || "", // Add GST number field
};


      // Step 5: Send the order data to the API for storing the order
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Adminorder`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        // Step 6: Generate PDF after successful order creation

        const pdfBlob = generatePDF(
          baseItems,
          orderItems,
          profile,
          isSameAsBilling,
          shippingAddress,
          logo,
          seal
        );

        const formData = new FormData();
        formData.append("pdf", pdfBlob, "order-summary.pdf");
        formData.append("userEmail", profile?.email); // Attach user email for sending the invoice

        // Step 7: Send the generated PDF to the backend to email to the user
        const emailResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload-pdf`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (emailResponse.status === 200) {
          // Step 8: Show success alert and navigate to the orders page
          displayAlert(
            "Order placed successfully, and invoice emailed!",
            "success"
          );
          setTimeout(() => {
            const alertContainer = document.getElementById("alert-container");
            if (alertContainer) {
              alertContainer.innerHTML = ""; // Clear alert container after 5 seconds
            }
          }, 5000); // Alert disappears after 5 seconds
          navigate("/Getorders"); // Navigate to the orders page
        } else {
          displayAlert("Failed to send invoice email.", "danger");
        }
      } else {
        displayAlert("Failed to store order in the database.", "danger");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      displayAlert("An error occurred while placing the order.", "danger");
    } finally {
      setLoadingButton(false); // Disable the loading button when the operation completes
    }
  };

  // Helper function to display alerts
  const displayAlert = (message, type) => {
    const alertContainer = document.getElementById("alert-container");
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
  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  return (
    <div className="setter">
      <div className="container mt-5">
        <div className="border p-4 rounded bg-light shadow-lg">
          {/* Header with Logo and Title */}
          <div className="row align-items-center mb-4">
            <div className="col-md-2 col-sm-3">
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ maxHeight: "60px" }}
              />
            </div>
            <div
              style={{ paddingLeft: "21.5%" }}
              className="col-md-10 col-sm-9"
            >
              <h2 className="text-primary font-weight-bold">Order Summary</h2>
            </div>
          </div>
          <div className="row">
            {/* Full-width Column for Heading */}
            <div className="col-12 text-center mb-4">
              <h4 className="text-secondary font-weight-semibold">
                Business Profile Details
              </h4>
            </div>
            {/* Left Column (Business Profile Details) */}
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
                    <strong>Company Name:</strong>{" "}
                    {profile?.companyName || "N/A"}
                  </p>
                  <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
                    <strong>Billing Address:</strong>{" "}
                    {profile?.billAddress || "N/A"}
                  </p>
                  <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
                    <strong>Phone:</strong> {profile?.phoneNumber || "N/A"}
                  </p>
                  <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
                    <strong>E-Mail:</strong> {profile?.email || "N/A"}
                  </p>
                  <p style={{ wordWrap: "break-word", maxWidth: "300px" }}>
                    <strong>GSTN:</strong> {profile?.gstNumber || "N/A"}
                  </p>

                </div>
              </div>
            </div>
            {/* Right Column (Shipping Address Section) */}
            <div className="col-md-6 mb-4">
              <h5 className="mb-4 fs-4 fw-bold">Shipping Details</h5>
              {/* Checkbox Section with Heading */}
              <div className="mb-3">
                <h6
                  className="d-flex align-items-center"
                  style={{ paddingLeft: "25px" }}
                >
                  <span
                    className="fs-5 me-3 mx-2"
                    style={{ marginRight: "10px" }}
                  >
                    Same as Billing Address
                  </span>
                  <input
                    type="checkbox"
                    className="form-check-input custom-checkbox fs-4"
                    style={{
                      width: "20px", // Adjust the width of the checkbox
                      height: "20px", // Adjust the height of the checkbox
                      transform: "translateY(-2px)", // Center the tick mark vertically
                    }}
                    id="sameAsBilling"
                    checked={isSameAsBilling}
                    onChange={handleCheckboxChange}
                  />
                </h6>
              </div>
              {/* Shipping Address Input */}
              <div className="mb-4">
                <label
                  htmlFor="shippingAddress"
                  className="form-label fs-5 fw-semibold"
                >
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