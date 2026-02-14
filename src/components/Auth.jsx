import React, { useState } from 'react';
import axios from '../config/api';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation for registration
        if (!isLogin) {
            if (!secretCode || secretCode.length < 4) {
                setError('Secret code must be at least 4 characters');
                return;
            }
            if (secretCode.includes('=')) {
                setError('Secret code cannot contain "=" symbol');
                return;
            }
        }

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin
            ? { username, password }
            : { username, password, secretCode: secretCode + '=' };

        try {
            const res = await axios.post(endpoint, payload);
            if (isLogin) {
                onLogin(res.data.user);
            } else {
                setSuccess('Registration successful! Please login with your credentials.');
                setIsLogin(true);
                setUsername('');
                setPassword('');
                setSecretCode('');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h2>{isLogin ? '🔒 Welcome Back' : '🌸 Join SheWants'}</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Enter your credentials to access your safe space' : 'Create your secure account'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {!isLogin && (
                    <div className="input-group">
                        <label>Secret Code (Calculator Unlock)</label>
                        <input
                            type="text"
                            placeholder="e.g., 1234 (will become 1234=)"
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            required
                            maxLength="10"
                        />
                        <small className="input-hint">
                            This code will unlock the calculator. Enter it followed by "=" on the calculator.
                        </small>
                    </div>
                )}

                <button type="submit" className="auth-btn">
                    {isLogin ? 'Login' : 'Create Account'}
                </button>
            </form>

            {error && <div className="message error-message">❌ {error}</div>}
            {success && <div className="message success-message">✅ {success}</div>}

            <div className="auth-toggle">
                <p onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                    setUsername('');
                    setPassword('');
                    setSecretCode('');
                }}>
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                </p>
            </div>
        </div>
    );
};

export default Auth;
