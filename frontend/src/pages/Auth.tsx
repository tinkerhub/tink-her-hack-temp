import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Eye, EyeOff, ArrowRight, Map, Cloud, Coffee } from 'lucide-react';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: 'var(--font-family)', overflow: 'hidden' }}>

            {/* Left Side (Branding Section) */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #000000 0%, #1F2937 100%)', // Black -> Dark Gray
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4rem',
                color: 'white',
                overflow: 'hidden'
            }} className="hidden-on-mobile">

                {/* Floating Background Effects */}
                <div className="animate-float-slow" style={{
                    position: 'absolute', top: '15%', left: '10%',
                    width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(40px)'
                }}></div>
                <div className="animate-float-medium" style={{
                    position: 'absolute', bottom: '20%', right: '10%',
                    width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(60px)'
                }}></div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="animate-float-slow" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
                            <Map size={24} color="#E5E7EB" />
                        </div>
                        <div className="animate-float-medium" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px', backdropFilter: 'blur(8px)', marginTop: '20px' }}>
                            <Cloud size={24} color="#E5E7EB" />
                        </div>
                        <div className="animate-float-slow" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
                            <Coffee size={24} color="#E5E7EB" />
                        </div>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '3.5rem',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                        Plan Smarter.<br />Live Better.
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: 1.6,
                        maxWidth: '440px'
                    }}>
                        AI-powered lifestyle planning with real-time intelligence. Join thousands finding their perfect moments.
                    </p>
                </div>
            </div>

            {/* Right Side (Login Card) */}
            <div style={{
                flex: 1,
                background: '#F9FAFB',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                {/* Minimal Navbar */}
                <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Hexagon size={28} color="#000000" strokeWidth={2.5} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000' }}>PocketPlan</span>
                </div>

                {/* Center Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '420px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        padding: '40px',
                        borderRadius: '20px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
                        animation: 'fadeInScaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Welcome Back 👋</h2>
                            <p style={{ color: '#6B7280' }}>Sign in to continue your smart planning.</p>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #E5E7EB',
                                        background: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#1F2937'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#000000'}
                                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                />
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Password</label>
                                    <a href="#" style={{ fontSize: '0.875rem', color: '#111827', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</a>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            paddingRight: '3rem',
                                            borderRadius: '10px',
                                            border: '1px solid #E5E7EB',
                                            background: 'white',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            color: '#1F2937'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#000000'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '1rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#9CA3AF',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-premium"
                                style={{
                                    marginTop: '1rem',
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    background: '#000000',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loader-pulse" style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }}></span>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Log In <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                                <div style={{ height: '1px', flex: 1, background: '#E5E7EB' }}></div>
                                <span style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>OR</span>
                                <div style={{ height: '1px', flex: 1, background: '#E5E7EB' }}></div>
                            </div>

                            <button
                                type="button"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '10px',
                                    border: '1px solid #E5E7EB',
                                    background: 'white',
                                    color: '#374151',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                                Continue with Google
                            </button>
                        </form>
                    </div>

                    <p style={{ marginTop: '2rem', color: '#6B7280' }}>
                        Don't have an account? <span style={{ color: '#000000', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Sign up</span>
                    </p>
                </div>
            </div>

            <style>
                {`
                    @media (max-width: 768px) {
                        .hidden-on-mobile {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Auth;
