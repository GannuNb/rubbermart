import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo1 from './images/logo.png'; // Update the path to your logo

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const json = await response.json();
            if (json.success) {
                setMessage(json.message); // Success message
            } else {
                setError(json.error); // Error message
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.'); // Catch network errors
        }
    };

    // Show alert when message or error changes
    useEffect(() => {
        if (message || error) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'custom-alert';

            // Add logo to alert
            const logoImg = document.createElement('img');
            logoImg.src = logo1;
            logoImg.alt = 'Logo';
            logoImg.className = 'alert-logo';

            // Add message to alert
            const alertMessage = document.createElement('span');
            alertMessage.textContent = message || error; // Show success or error message

            // Append logo and message to alert div
            alertDiv.appendChild(logoImg);
            alertDiv.appendChild(alertMessage);

            // Append alert to body
            document.body.appendChild(alertDiv);

            // Automatically remove alert after 5 seconds
            const timer = setTimeout(() => {
                alertDiv.remove();
                if (message) {
                    // Redirect to Login page after successful password reset
                    navigate('/Login', { state: { from: location.pathname } });
                }
            }, 5000);

            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [message, error, navigate, location]);

    return (
        <div className="setter">
            <div className="forgot-password-container">
                <form onSubmit={handleSubmit}>
                    <h2>Forgot Password</h2>
                    <div className="form-group">
                        <label className="text-black" htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
}
