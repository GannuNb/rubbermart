import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sellreport.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import logo from "./images/logo.png";

const Sellreport = () => {
    const [approvedScrap, setApprovedScrap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setTimeout(() => {
                alert("Please log in to view sell reports");
                navigate('/Login');
            }, 0);
            return;
        }
    }, [navigate]);

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

        // Header
        doc.setFontSize(20);
        doc.text('SELL INVOICE', 86, 20);
        doc.setFontSize(10);
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 25, 200, 25);

        // Billing and Shipping Information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Billing Information', 14, 35);
        doc.text('Shipping Information', 110, 35);
        doc.setDrawColor(0, 0, 0);
        doc.line(10, 38, 200, 38);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        if (profile) {
            doc.text(`Company: ${validateText(profile.companyName)}`, 14, 45);
            doc.text(`Address: ${validateText(profile.billAddress)}`, 14, 50);
            doc.text(`Email: ${validateText(profile.email)}`, 14, 55);

            doc.text(`Address: ${validateText(profile.shipAddress)}`, 110, 45);
        }

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
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        // Terms and Conditions
        doc.setFont('helvetica', 'bold');
        doc.text('Terms and Conditions:', 14, 150);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('1. The Seller shall not be liable to the Buyer for any loss or damage.', 14, 155);
        doc.text('2. The Seller warrants the product for one (1) year from the date of shipment.', 14, 160);
        doc.text('3. The purchase order will be interpreted as acceptance of this offer.', 14, 165);

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
                                        Pdf
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
