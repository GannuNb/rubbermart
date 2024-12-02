import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sell.css';

const Uploaded = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [scrapItems, setScrapItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    // Handle login submission
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, { email, password });
            const tokenKey = `admin_token_${email}`; // Use template literals for the token key
            localStorage.setItem(tokenKey, response.data.token); // Store the JWT token with a unique key
            setIsAuthenticated(true); // Set authentication to true on successful login
        } catch (err) {
            setLoginError('Invalid email or password.');
        }
    };

    const handleLogout = () => {
        const tokenKey = `admin_token_${email}`; // Use the same unique key for logout
        localStorage.removeItem(tokenKey); // Clear the specific JWT token
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const fetchScrapData = async () => {
            try {
                const tokenKey = `admin_token_${email}`; // Use the same unique key to fetch the token
                const token = localStorage.getItem(tokenKey);
                if (!token) {
                    throw new Error('No authentication token found. Please log in.');
                }
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getuploadedscrap`, {
                    headers: { 'Authorization': `Bearer ${token}` } // Correctly format the Bearer token
                });
                setScrapItems(response.data.uploadedScrapItems);
            } catch (error) {
                console.error('Error fetching scrap items:', error);
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchScrapData();
        }
    }, [isAuthenticated, email]); // Add email as a dependency

    const handleApprove = async (id) => {
        try {
            const tokenKey = `admin_token_${email}`; // Use the same unique key for the approve request
            const token = localStorage.getItem(tokenKey);
            if (!token) throw new Error('No authentication token found. Please log in.');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/approveScrap/${id}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` } // Correctly format the Bearer token
            });
            setScrapItems(scrapItems.filter(item => item._id !== id));
            alert(response.data.message || 'Scrap item approved.');
        } catch (error) {
            console.error('Error approving scrap item:', error);
            alert(error.response?.data?.message || error.message || 'Failed to approve the scrap item.');
        }
    };

    const handleDeny = async (id) => {
        try {
            const tokenKey = `admin_token_${email}`; // Use the same unique key for the deny request
            const token = localStorage.getItem(tokenKey);
            if (!token) throw new Error('No authentication token found. Please log in.');
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/denyScrap/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` } // Correctly format the Bearer token
            });
            setScrapItems(scrapItems.filter(item => item._id !== id));
            alert(response.data.message || 'Scrap item denied.');
        } catch (error) {
            console.error('Error denying scrap item:', error);
            alert(error.response?.data?.message || error.message || 'Failed to deny the scrap item.');
        }
    };

    // Render Login Form if not authenticated
    if (!isAuthenticated) {
        return (
                <div className="login-container">
                    <h2>Admin Login for uploaded</h2>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {loginError && <p className="text-danger">{loginError}</p>}
                        <button type="submit">Login</button>
                    </form>
                </div>
        );
    }

    // Loading and error handling
    if (loading) return <div className="text-center mt-5">Loading scrap items...</div>;
    if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;

    return (
        <>
            <div className="container my-5">
                <h2 className="text-center mb-4">Uploaded Scrap Items</h2>
                {scrapItems.length === 0 ? (
                    <p className="text-center">No scrap items found.</p>
                ) : (
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Material</th>
                                <th>Application</th>
                                <th>Quantity</th>
                                <th>Company Name</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Uploaded At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scrapItems.map((scrap) => (
                                <tr key={scrap._id}>
                                    <td>{scrap.material}</td>
                                    <td>{scrap.application}</td>
                                    <td>{scrap.quantity}</td>
                                    <td>{scrap.companyName}</td>
                                    <td>{scrap.phoneNumber}</td>
                                    <td>{scrap.email}</td>
                                    <td>{new Date(scrap.uploadedAt).toLocaleString()}</td>
                                    <td style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <button className="btn btn-success btn-custom me-2" onClick={() => handleApprove(scrap._id)}>
                                            Approve
                                        </button>
                                        <button className="btn btn-danger btn-custom" onClick={() => handleDeny(scrap._id)}>
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            </>
    );
};

export default Uploaded;
