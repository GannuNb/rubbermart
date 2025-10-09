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
        // Directly set the scroll position to the top of the page
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;  // For compatibility with older browsers
    }, []); // Empty dependency array ensures it runs only once on page load

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

        // if (logo) {
        //     doc.addImage(logo, 'JPEG', 11, 6, 40, 20);
        // }

        // Add text "Rubberscrapmart" with padding, positioning it at the top-left corner
        doc.setFontSize(14); // Set font size
        doc.setFont("helvetica", "bold"); // Set font style
        doc.text("Rubberscrapmart", 10, 12); // Add the text at position (10, 10)

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
            const leftX = 14;
            const labelX = 50; // Aligned position for colons
            const valueX = 60; // Value starts here

            // Company Name
            doc.text('Company', leftX, startY + 8);
            doc.text(':', labelX, startY + 8);
            doc.text(validateText(profile.companyName), valueX, startY + 8);

            // Email
            doc.text('Email', leftX, startY + 13);
            doc.text(':', labelX, startY + 13);
            doc.text(validateText(profile.email), valueX, startY + 13);

            // Address with proper wrapping
            doc.text('Address', leftX, startY + 18);
            doc.text(':', labelX, startY + 18);
            const address = validateText(profile.billAddress);
            const wrappedAddress = doc.splitTextToSize(address, 120);
            doc.text(wrappedAddress, valueX, startY + 18);
        }

        startY += 40;

        // "DETAILS OF MY PRODUCT" Heading
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text('DETAILS OF MY PRODUCT', 105, startY, { align: 'center' });

        startY += 3;

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

        doc.autoTable({
            startY: startY + 10,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5,
                textColor: [0, 0, 0],
                halign: 'center',
            },
            headStyles: {
                fillColor: [0, 102, 0],
                textColor: [255, 255, 255],
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
        });

        startY = doc.previousAutoTable.finalY + 10;

        // Terms and Conditions
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
                <div className="container-fluid">
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
            </>
    );
};

export default Sellreport;
