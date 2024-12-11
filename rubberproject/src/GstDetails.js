import React, { useState } from 'react';
import axios from 'axios';

const GstDetails = () => {
  const [gstNumber, setGstNumber] = useState('');
  const [gstDetails, setGstDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGstNumberChange = (e) => {
    // Ensure input is uppercase
    setGstNumber(e.target.value.toUpperCase());
  };

  const fetchGstDetails = async () => {
    if (!gstNumber) {
      setError("GST Number is required");
      return;
    }
    
    // Input validation for GSTIN format
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[0-9]{1}$/;
    if (!gstinRegex.test(gstNumber)) {
      setError("Invalid GSTIN format");
      return;
    }

    setLoading(true);
    setError('');
    setGstDetails(null);

    try {
      // Replace <URL> with your API base URL
      const response = await axios.get(`<URL>/eivital/v1.03/Master/gstin/${gstNumber}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response data is available
      if (response.data && response.data.success) {
        setGstDetails(response.data);
        setError('');
      } else {
        setError('No details found for this GST number.');
      }
    } catch (err) {
      setError('Failed to fetch GST details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>GST Details</h1>
      <input
        type="text"
        placeholder="Enter GST Number"
        value={gstNumber}
        onChange={handleGstNumberChange}
      />
      <button onClick={fetchGstDetails} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Details'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {gstDetails && (
        <div>
          <h2>GST Details</h2>
          <p><strong>GSTIN:</strong> {gstDetails.gstin}</p>
          <p><strong>Business Name:</strong> {gstDetails.business_name}</p>
          <p><strong>Legal Name:</strong> {gstDetails.legal_name}</p>
          {/* Display other details as per the API response */}
        </div>
      )}
    </div>
  );
};

export default GstDetails;
