import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Correctly importing icons

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const json = await response.json();
      if (json.success) {
        setMessage(json.message);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(json.error);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="setter">
      <div className="reset-password-container">
        <form onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  borderRadius: '0 4px 4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Update Password</button>
        </form>
      </div>
    </div>
  );
}
