import React, { useState } from 'react';

function Gst() {
  const [gstNumber, setGstNumber] = useState(''); // State to hold GST number
  const [gstDetails, setGstDetails] = useState(null); // State to hold the fetched GST details
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors
  const [pan, setPan] = useState(''); // State to hold extracted PAN

  const handleGstNumberChange = (event) => {
    setGstNumber(event.target.value); // Update the gstNumber as user types
  };

  const extractPanFromGst = (gstin) => {
    // Extract the PAN by removing the first two and last three characters from the GSTIN
    if (gstin && gstin.length === 15) {
      return gstin.slice(2, 12); // Extract characters from index 2 to 12 (10 characters for PAN)
    }
    return '';
  };

  const fetchGstDetails = async () => {
    if (!gstNumber) {
      alert('Please enter a GST number!');
      return;
    }
    
    setLoading(true); // Set loading state to true while the API call is in progress
    setError(null); // Reset any previous errors

    try {
      const response = await fetch(
        'https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'gst-verification.p.rapidapi.com',
            'x-rapidapi-key': '80325c5c56msh8d18cbdb2bdf05fp1ade17jsnd91c656e77d2', // Your RapidAPI key
          },
          body: JSON.stringify({
            task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
            group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
            data: {
              gstin: gstNumber, // Use the entered GST number
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch GST details');
      }

      const data = await response.json();
      setGstDetails(data.result.source_output); // Set the fetched GST details in the state

      // Extract PAN from GST number
      const extractedPan = extractPanFromGst(gstNumber);
      setPan(extractedPan); // Set the extracted PAN
    } catch (err) {
      setError(err.message); // Handle errors and set them to the state
    } finally {
      setLoading(false); // Set loading state to false once the API call is complete
    }
  };

  return (
    <div className='setter'>
      <div className="container mt-5 ">
        <div className="text-left mx-5 mb-4">
          <h1>GST Details</h1>
          <p>Enter a GST number to fetch details</p>
        </div>

        <div className="d-flex justify-content-center">
          <div className="input-group w-80 mx-3">
            <input
              type="text"
              className="form-control"
              value={gstNumber}
              onChange={handleGstNumberChange}
              placeholder="Enter GST Number"
            />
            <div className="input-group-append">
              <button
                onClick={fetchGstDetails}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Fetching...' : 'Get GST Details'}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-4">{error}</div>}

        {gstDetails && (
          <div className="mt-4">
            <h2 className="text-primary">GST Details:</h2>
            <ul className="list-group">
              <li className="list-group-item"><strong>GSTIN:</strong> {gstDetails.gstin}</li>
              <li className="list-group-item"><strong>Legal Name:</strong> {gstDetails.legal_name}</li>
              <li className="list-group-item"><strong>Trade Name:</strong> {gstDetails.trade_name}</li>
              <li className="list-group-item"><strong>GST Status:</strong> {gstDetails.gstin_status}</li>
              <li className="list-group-item"><strong>Date of Registration:</strong> {gstDetails.date_of_registration}</li>
              <li className="list-group-item"><strong>Nature of Business:</strong> {gstDetails.nature_of_business_activity.join(', ')}</li>
              <li className="list-group-item"><strong>Constitution of Business:</strong> {gstDetails.constitution_of_business}</li>
              <li className="list-group-item">
                <strong>Principal Place of Business:</strong> {gstDetails.principal_place_of_business_fields.principal_place_of_business_address.door_number}, 
                {gstDetails.principal_place_of_business_fields.principal_place_of_business_address.city}, {gstDetails.principal_place_of_business_fields.principal_place_of_business_address.state_name}, {gstDetails.principal_place_of_business_fields.principal_place_of_business_address.pincode}
              </li>
              {/* Add extracted PAN Field */}
              <li className="list-group-item"><strong>PAN (extracted from GSTIN):</strong> {pan}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gst;
