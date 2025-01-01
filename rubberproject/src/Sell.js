import React, { useState, useEffect } from 'react';
import axios from 'axios';
import verify from './images/verify.jpeg';
import sell from './images/sell.jpeg';
import './Sell.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SrenComponent from './SrenComponent';
import SellTop from './SellTop';
import logo1 from './images/logo.png';


const Sell = () => {
    const [material, setMaterial] = useState('Tyre scrap');
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    const navigate = useNavigate();
    const location = useLocation(); // Get current route location





    // Scroll to the top whenever the location changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);


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
        if (material === 'Tyre scrap') {
            setApplications([
                'Baled Tyres PCR',
                'Baled Tyres TBR',
                'Three Piece PCR',
                'Three Piece TBR',
                'Shredds',
                'Mulch PCR',
                'Rubber Granules/Crum'
            ]);
            setSelectedApplication('');
        } else if (material === 'pyro oil') {
            setApplications([
                'Pyro Oil',

            ]);
            setSelectedApplication('');
        } else if (material === 'Tyre steel scrap') {
            setApplications(['Pyro Steel', 'Rubber Crum Steel']);
            setSelectedApplication('');
        }
    }, [material]);

    // Fetch business profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
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
                    setError('No business profile found.');
                }
            } catch (err) {
                setError(`Failed to fetch profile. ${err.message}`);
                console.error('Error fetching business profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleMaterialChange = (e) => setMaterial(e.target.value);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const scrapData = {
            material,
            application: selectedApplication,
            quantity: parseFloat(quantity),
            companyName: profile?.companyName,
            phoneNumber: profile?.phoneNumber,
            email: profile?.email,
        };

        try {
            const authToken = localStorage.getItem('token');
            if (!authToken) throw new Error('User is not authenticated. Please log in.');

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/uploadscrap`,
                scrapData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                }
            );

            if (response.data.success) {
                setMessage('Scrap details uploaded successfully!');
                setMaterial('Tyre scrap');
                setQuantity('');
                setSelectedApplication('');
            } else {
                setError('Failed to upload scrap details.');
            }
        } catch (err) {
            console.error('Error uploading scrap details:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        window.onload = () => {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        // Cleanup to avoid any potential memory leaks
        return () => {
            window.onload = null;
        };
    }, []);




    return (
        <>

            <div className='setter'>
                <SellTop />


                <div className="container" style={{ marginTop: '40px', marginBottom: '20px', padding: '2rem', borderRadius: '10px', background: 'linear-gradient(135deg, #17a2b8, #0d6efd)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', animation: 'fadeIn 1.5s ease-in-out' }}>
                    <h2 className="tyre-scrap-heading" style={{ textAlign: 'center', color: 'white', fontSize: '2rem', marginBottom: '20px', animation: 'bounce 2s infinite' }}>Upload Your Scrap Details</h2>

                    {message && <div className="alert alert-success" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px' }}>{message}</div>}
                    {error && <div className="alert alert-danger" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
                        <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="material" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Choose Material</label>
                            <select
                                id="material"
                                className="form-select"
                                value={material}
                                onChange={handleMaterialChange}
                                required
                                style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px' }}
                            >
                                <option value="Tyre scrap">Tyre scrap</option>
                                <option value="pyro oil">Pyro Oil</option>
                                <option value="Tyre steel scrap">Tyre Steel Scrap</option>
                            </select>
                        </div>

                        {material && (
                            <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="applications" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Applications</label>
                                <select
                                    id="applications"
                                    className="form-select"
                                    value={selectedApplication}
                                    onChange={(e) => setSelectedApplication(e.target.value)}
                                    required
                                    style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px' }}
                                >
                                    <option value="">Select Application</option>
                                    {applications.length > 0 ? (
                                        applications.map((app, index) => (
                                            <option key={index} value={app}>{app}</option>
                                        ))
                                    ) : (
                                        <option value="">No applications available.</option>
                                    )}
                                </select>
                            </div>
                        )}

                        <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="quantity" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                className="form-control"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '10px 20px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: '#007bff', borderRadius: '5px', cursor: 'pointer', width: '100%', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>

                <SrenComponent />

                <h2 className="text-center my-5" style={{ fontSize: '2.5rem', color: '#007bff', fontWeight: '700', textTransform: 'uppercase' }}>Your Profile Details</h2>

{profile ? (
    <div className="profile-container" style={{
        maxWidth: "500px", margin: "0 auto", padding: "30px", borderRadius: "15px", 
        backgroundColor: "#fff", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", 
        border: "1px solid #e0e0e0", transition: "all 0.3s ease-in-out"
    }}>
        <div className="profile-content">
            <div className="profile-text">
                <strong style={{ color: "#007bff" }}>Company Name:</strong>
                <p style={{ color: "#333", fontWeight: "500" }}>{profile.companyName}</p>
            </div>
            <div className="profile-text">
                <strong style={{ color: "#007bff" }}>Phone Number:</strong>
                <p style={{ color: "#333", fontWeight: "500" }}>{profile.phoneNumber}</p>
            </div>
            <div className="profile-text">
                <strong style={{ color: "#007bff" }}>Email:</strong>
                <p style={{ color: "#333", fontWeight: "500" }}>{profile.email}</p>
            </div>
        </div>
    </div>
) : (
    <div className="text-center my-5" style={{ color: '#6c757d' }}>
        <p>{error || "Loading profile..."}</p>
    </div>
)}





            </div></>
    );
};

export default Sell;
