import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sellreport.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "./images/logo.png";
import logo1 from './images/logo.png';
import { FaFilePdf } from 'react-icons/fa';


const Sellreport = () => {
    const [approvedScrap, setApprovedScrap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const location = useLocation(); // Get current route location
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                alertMessage.textContent = 'Please log in to Sell.';
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
        const fetchApprovedScrap = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token found. Please log in.');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getApprovedScrap`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApprovedScrap(response.data.approvedScrap);
            } catch (error) {
                console.error('Error fetching approved scrap:', error);
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedScrap();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, config);
                if (response.data.profileExists) {
                    setProfile(response.data.businessProfile);
                }
            } catch (err) {
                console.error('Error fetching business profile:', err);
            }
        };

        fetchProfile();
    }, []);

    const validateText = (text) => (text ? text : 'N/A');

    const generatePDF = (scrap) => {
        const doc = new jsPDF();

        if (logo) {
            doc.addImage(logo, 'JPEG', 11, 6, 40, 20);
        }

        // Header Section
        doc.setFontSize(20);
        doc.text('MY PRODUCT DETAILS', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 25, 200, 25);
        // Billing Information Section
        let startY = 35;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Billing Information', 14, startY);
        doc.setDrawColor(0, 0, 0);
        doc.line(10, startY + 3, 200, startY + 3);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        if (profile) {
            // Company Name
            doc.text(`Company: ${validateText(profile.companyName)}`, 14, startY + 8);

            // Email (Moved above Address with some spacing)
            const email = validateText(profile.email);
            doc.text(`Email: ${email}`, 14, startY + 13);

            // Add some spacing between email and address
            const emailSpacing = 5;

            // Address with proper wrapping
            const address = validateText(profile.billAddress);
            const wrappedAddress = doc.splitTextToSize(address, 120); // Wrap text within 120 units
            doc.text('Address:', 14, startY + 13 + emailSpacing); // Add spacing between email and address
            doc.text(wrappedAddress, 30, startY + 13 + emailSpacing); // Adjust Y position accordingly
        }



        startY += 40; // Increase spacing after Billing Information

        // "DETAIL OF MY PRODUCT" Heading Section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0); // Black color for heading
        doc.text('DETAILS OF MY PRODUCT', 105, startY, { align: 'center' });

        startY += 3; // Decrease spacing between the heading and table

        // Table Data
        const tableColumn = ['Field', 'Value'];
        const tableRows = [
            ['Material', validateText(scrap.material)],
            ['Application', validateText(scrap.application)],
            ['Quantity', validateText(scrap.quantity)],
            ['Company Name', validateText(scrap.companyName)],
            ['Email', validateText(scrap.email)],
            ['Approved At', new Date(scrap.approvedAt).toLocaleString()],
        ];

        // Add the Table with fields and values
        doc.autoTable({
            startY: startY + 10, // Start the table right after the heading with less space
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5,
                textColor: [0, 0, 0],
                halign: 'center', // Center-align text in cells
            },
            headStyles: {
                fillColor: [0, 102, 0], // Green header background
                textColor: [255, 255, 255], // White text color for header
            },
            bodyStyles: {
                fillColor: [255, 255, 255], // White background for table rows
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240], // Light grey for alternate rows
            },
        });

        startY = doc.previousAutoTable.finalY + 10; // Adjust Y position after table

        // Terms and Conditions Section
        doc.setFont('helvetica', 'bold');
        doc.text('Terms and Conditions:', 14, startY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('1. The Seller shall not be liable to the Buyer for any loss or damage.', 14, startY + 5);
        doc.text('2. The Seller warrants the product for one (1) year from the date of shipment.', 14, startY + 10);
        doc.text('3. The purchase order will be interpreted as acceptance of this offer.', 14, startY + 15);

        // Save PDF
        doc.save(`scrap-report-${scrap._id}.pdf`);
    };






    if (loading) return <div className="text-center mt-5">Loading approved scrap reports...</div>;
    if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;

    return (
        <>
            <div className='setter'>
                <div className="container my-5">
                    <h2 className="text-center mb-4">Approved Scrap Reports</h2>
                    {approvedScrap.length === 0 ? (
                        <p className="text-center">No approved scrap items found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Material</th>
                                        <th>Application</th>
                                        <th>Quantity</th>
                                        <th>Company Name</th>
                                        <th>Email</th>
                                        <th>Approved At</th>
                                        <th>Sell report</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {approvedScrap.map((scrap) => (
                                        <tr key={scrap._id}>
                                            <td>{scrap.material}</td>
                                            <td>{scrap.application}</td>
                                            <td>{scrap.quantity}</td>
                                            <td>{scrap.companyName}</td>
                                            <td>{scrap.email}</td>
                                            <td>{new Date(scrap.approvedAt).toLocaleString()}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => generatePDF(scrap)}
                                                >
                                                    <FaFilePdf /> {/* Add the PDF icon here */}
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div></>
    );
};

export default Sellreport;
