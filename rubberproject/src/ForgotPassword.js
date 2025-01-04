import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo1 from './images/logo.png'; // Update the path to your logo

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const json = await response.json();
            if (json.success) {
                // Navigate to the confirmation page
                navigate('/ForgetMailPass', { state: { from: location.pathname } });
            } else {
                setError(json.error); // Show error message
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.'); // Catch network errors
        }
    };

    return (
        <><div className='setter'>
        <div className="container my-5">
            <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: '400px' }}>
                <img
                    src={logo1}
                    alt="Logo"
                    className="mb-3 mx-auto d-block"
                    style={{ width: '80px' }}
                />
                <h2 className="text-center mb-4 text-primary">Forgot Password</h2>
                <p className="text-center text-muted">
                    Enter your email below, and we'll send you instructions to reset your password.
                </p>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-secondary">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
        </div></>
    );
}
