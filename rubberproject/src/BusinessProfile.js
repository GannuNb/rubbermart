import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo1 from './images/logo.png';

const BusinessProfile = () => {
  const [profile, setProfile] = useState({
    registeredgst: 'no',
    companyName: '',
    phoneNumber: '',
    email: '',
    gstNumber: '',
    pan: '',
    billAddress: '',
    shipAddress: '',
    gstCertificate: null, // Added state for GST certificate file
    panCertificate: null, // Added state for PAN certificate file
    selectedProducts: []  // Added state for selected product options
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate();
  const location = useLocation();
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);

  const productOptions = [
    "Baled Tyres PCR",
    "Baled Tyres TBR",
    "Three Piece PCR",
    "Three Piece TBR",
    "Shreds",
    "Mulch PCR",
    "Rubber Granules/crumb",
    "Pyro Oil",
    "Pyro Steel",
    "Rubber Crum Steel"
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userdetails`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        setProfile((prevProfile) => ({
          ...prevProfile,
          email: response.data.user.email,
        }));
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Check if user is logged in, if not, redirect to login page
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
        alertMessage.textContent = 'Please log in to View Business Profile.';
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

  // Fetch business profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/business-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (response.data.profileExists) {
          setProfile(response.data.businessProfile);
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      const maxFileSize = 1024 * 1024; // 1 MB in bytes

      // Check file size
      if (file.size > maxFileSize) {
        setError("Please upload a file less than 1 MB.");
        return; // Prevent updating the state if file size is too large
      } else {
        setError(''); // Clear error if file is valid
      }

      setProfile({
        ...profile,
        [e.target.name]: file
      });
    } else if (e.target.type === 'checkbox') {
      // Handling checkbox inputs
      const { name, checked } = e.target;
      setProfile((prevProfile) => {
        let newSelectedProducts = [...prevProfile.selectedProducts];
        if (checked) {
          newSelectedProducts.push(name);
        } else {
          newSelectedProducts = newSelectedProducts.filter(item => item !== name);
        }
        return {
          ...prevProfile,
          selectedProducts: newSelectedProducts
        };
      });
    } else {
      setProfile({
        ...profile,
        [e.target.name]: e.target.value
      });
    }
  };

  // Display alert message
  const displayAlert = (message, type) => {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
      alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="display: flex; align-items: center; padding: 20px;">
          <img src="${logo1}" alt="Logo" style="width: 50px; margin-right: 10px;">
          <span>${message}</span>
      </div>
      `;
      setTimeout(() => {
        alertContainer.innerHTML = '';
      }, 5000);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated. Please log in.');
      }
  
      const formData = new FormData();
      formData.append('registeredgst', profile.registeredgst);  // Ensure this line is here
      formData.append('companyName', profile.companyName);
      formData.append('phoneNumber', profile.phoneNumber);
      formData.append('email', profile.email);
      formData.append('gstNumber', profile.gstNumber);
      formData.append('pan', profile.pan);
      formData.append('billAddress', profile.billAddress);
      formData.append('shipAddress', profile.shipAddress);
      formData.append('gstCertificate', profile.gstCertificate); // Add GST certificate file
      formData.append('panCertificate', profile.panCertificate); // Add PAN certificate file
      formData.append('selectedProducts', profile.selectedProducts.join(',')); // Send products as comma-separated string
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/business-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Important for file uploads
          }
        }
      );
  
      if (response.data.success) {
        displayAlert('Thank you for Creating Business Profile, WELCOME ONBOARD!', 'success');
        setProfileExists(true);
        navigate('/');
      } else {
        displayAlert(`Failed to create business profile: ${response.data.message}`, 'danger');
      }
    } catch (error) {
      console.error('Error creating business profile:', error);
      const message = error.response?.data?.message || error.message;
      displayAlert(`Error creating business profile: ${message}`, 'danger');
    }
  };

  // Handle checkbox change for shipping address
  const handleCheckboxChange = () => {
    setIsSameAsBilling((prevState) => {
      const newState = !prevState;
      if (newState) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          shipAddress: prevProfile.billAddress,
        }));
      } else {
        setProfile((prevProfile) => ({
          ...prevProfile,
          shipAddress: '',
        }));
      }
      return newState;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (profileExists) {
    return (
      <div className="setter">
        <div className="container">
          <div className="business-profile-container">
            <h2 className="text-center mb-4 tyre-scrap-heading mr-5">Your Business Profile</h2>
            <div className="row">
              <div className="col-12 col-md-6 mb-3 text-black">
                <p><strong>Company Name:</strong> {profile.companyName}</p>
              </div>
              <div className="col-12 col-md-6 mb-3 text-black">
                <p><strong>Phone Number:</strong> {profile.phoneNumber}</p>
              </div>
              <div className="col-12 col-md-6 mb-3 text-black">
                <p><strong>Email:</strong> {profile.email}</p>
              </div>
              <div className="col-12 col-md-6 mb-3 text-black">
                <p><strong>GST Number:</strong> {profile.gstNumber}</p>
              </div>
              <div className="col-12 col-md-6 mb-3 text-black">
                <p><strong>PAN:</strong> {profile.pan}</p>
              </div>
              <div className="col-12 col-md-6 mb-3 text-black">
                <p><strong>Bill to Address:</strong> {profile.billAddress}</p>
              </div>
              <div className="col-12 col-md-6 mb-3 text-black">
                <p><strong>Ship to Address:</strong> {profile.shipAddress}</p>
              </div>
              <div className="col-12 mb-3 text-black">
                <p><strong>Intrested Products:</strong> {profile.selectedProducts.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setterbus">
      <div className="container mt-5">
        <form onSubmit={handleSubmit} className="border p-5 rounded bg-white shadow-lg">
          <h2 className="text-center mb-4 text-primary">Create Business Profile</h2>

          {/* Error Message */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Form Fields */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="companyName" className="form-label text-muted">Company Name</label>
              <input
                type="text"
                className="form-control shadow-sm"
                id="companyName"
                name="companyName"
                value={profile.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="phoneNumber" className="form-label text-muted">Phone Number</label>
              <input
                type="tel"
                className="form-control shadow-sm"
                id="phoneNumber"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="email" className="form-label text-muted">Email</label>
              <input
                type="email"
                className="form-control shadow-sm"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="gstNumber" className="form-label text-muted">GST Number</label>
              <input
                type="text"
                className="form-control shadow-sm"
                id="gstNumber"
                name="gstNumber"
                value={profile.gstNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="pan" className="form-label text-muted">PAN</label>
              <input
                type="text"
                className="form-control shadow-sm"
                id="pan"
                name="pan"
                value={profile.pan}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="billAddress" className="form-label text-muted">Bill to Address</label>
              <textarea
                className="form-control shadow-sm"
                id="billAddress"
                name="billAddress"
                value={profile.billAddress}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>
            <div className="col-md-6" style={{ marginTop: '-3.5%' }}>
              <h5 className="mb-2">Shipping Details</h5>
              <div className="form-group mt-2">
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="sameAsBilling"
                    checked={isSameAsBilling}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="sameAsBilling" className="form-check-label text-black">Same as Billing Address</label>
                </div>
                <textarea
                  className="form-control shadow-sm"
                  id="shipAddress"
                  name="shipAddress"
                  value={profile.shipAddress}
                  onChange={handleChange}
                  rows="4"
                  disabled={isSameAsBilling}
                />
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="gstCertificate" className="form-label text-muted">Upload GST Certificate</label>
              <input
                type="file"
                className="form-control shadow-sm"
                id="gstCertificate"
                name="gstCertificate"
                onChange={handleChange}
                accept="application/pdf,image/*"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="panCertificate" className="form-label text-muted">Upload PAN Certificate</label>
              <input
                type="file"
                className="form-control shadow-sm"
                id="panCertificate"
                name="panCertificate"
                onChange={handleChange}
                accept="application/pdf,image/*"
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <h5>intrested Products</h5>
              <div className="row">
                {productOptions.map((product) => (
                  <div key={product} className="col-md-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={product}
                        name={product}
                        checked={profile.selectedProducts.includes(product)}
                        onChange={handleChange}
                      />
                      <label className="form-check-label text-black" htmlFor={product}>
                        {product}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;
