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
    const [loadingLocation, setLoadingLocation] = useState('');
    const [countryOfOrigin, setCountryOfOrigin] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]); // State to store images
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]); // For previewing images

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
                const alertDiv = document.createElement('div');
                alertDiv.className = 'custom-alert';

                const logoImg = document.createElement('img');
                logoImg.src = logo1;
                logoImg.alt = 'Company Logo';
                logoImg.className = 'alert-logo';

                const alertMessage = document.createElement('span');
                alertMessage.textContent = 'Please log in to Sell.';
                alertMessage.className = 'alert-message';

                alertDiv.appendChild(logoImg);
                alertDiv.appendChild(alertMessage);

                document.body.appendChild(alertDiv);

                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);

                navigate('/Login', { state: { from: location.pathname } });
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
                'Shreds',
                'Mulch PCR',
                'Rubber Granules/Crum'
            ]);
            setSelectedApplication('');
        } else if (material === 'pyro oil') {
            setApplications(['Pyro Oil']);
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
                    navigate('/BusinessProfile', { replace: true });
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
    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files.length > 3) {
            alert('You can only upload up to 3 images.');
            return;
        }
    
        const fileArray = Array.from(files);
        
        // Check if any file is above 1 MB
        const isSizeValid = fileArray.every(file => file.size <= 1 * 1024 * 1024); // 1 MB in bytes
    
        if (!isSizeValid) {
            alert('Please upload images below 1 MB.');
            return;
        }
    
        // Proceed with setting the images if all are under the size limit
        setImages(files);
        const previewUrls = fileArray.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(previewUrls);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
    
        const formData = new FormData();
        formData.append('material', material);
        formData.append('application', selectedApplication);
        formData.append('quantity', parseFloat(quantity));
        formData.append('companyName', profile.companyName);
        formData.append('phoneNumber', profile.phoneNumber);
        formData.append('email', profile.email);
        formData.append('loadingLocation', loadingLocation);
        formData.append('countryOfOrigin', countryOfOrigin);
        formData.append('price', parseFloat(price));
        Array.from(images).forEach(image => formData.append('images', image));
    
        try {
            const authToken = localStorage.getItem('token');
            if (!authToken) throw new Error('User is not authenticated. Please log in.');
    
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/uploadscrap`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${authToken}`,
                    },
                }
            );
    
            if (response.data.success) {
                displayAlert('Scrap details uploaded successfully!', 'success');
            } else {
                displayAlert('Failed to upload scrap details.', 'danger');
            }
        } catch (err) {
            console.error('Error uploading scrap details:', err.response || err.message);
            displayAlert(err.response?.data?.message || 'An unexpected error occurred.', 'danger');
        } finally {
            setLoading(false);
        }
    };

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
                            <label htmlFor="material" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Choose Category</label>
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
                                <label htmlFor="applications" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Type of Scrap</label>
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

                        {/* Quantity */}
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

                        {/* Loading Location */}
                        <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="loadingLocation" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Loading Location</label>
                            <select
                                id="loadingLocation"
                                className="form-select"
                                value={loadingLocation}
                                onChange={(e) => setLoadingLocation(e.target.value)}
                                required
                                style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px' }}
                            >
                                <option value="">Select Loading Location</option>
                                <option value="ex_chennai">Ex Chennai</option>
                                <option value="ex_mundra">Ex Mundra</option>
                                <option value="ex_nhavasheva">Ex Nhavasheva</option>
                            </select>
                        </div>

                        {/* Country of Origin */}
                        <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="countryOfOrigin" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Country of Origin</label>
                            <input
                                type="text"
                                id="countryOfOrigin"
                                className="form-control"
                                value={countryOfOrigin}
                                onChange={(e) => setCountryOfOrigin(e.target.value)}
                                required
                                style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px' }}
                            />
                        </div>

                        {/* Price */}
                        <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="price" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Price per Unit</label>
                            <input
                                type="number"
                                id="price"
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px' }}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-3" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="images" className="form-label" style={{ fontWeight: 'bold', color: 'white' }}>Upload Images (Max 3)</label>
                            <input
                                type="file"
                                id="images"
                                className="form-control"
                                multiple
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px' }}
                            />
                        </div>

                        {/* Image Previews */}
                        {imagePreviewUrls.length > 0 && (
                            <div className="image-previews" style={{ marginBottom: '1.5rem' }}>
                                {imagePreviewUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        style={{ maxWidth: '200px', marginRight: '10px', borderRadius: '5px' }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '5px' }}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload Scrap'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Sell;
