import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaLock, FaTruck, FaEnvelope, FaKey, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/shop'); // Redirect to shop on successful login
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{
                flex: 1,
                background: 'radial-gradient(circle at 50% 50%, #FAF5E9 0%, #F5E6D3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '120px 20px 60px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        background: 'white',
                        padding: '3rem',
                        borderRadius: '2rem',
                        boxShadow: '0 20px 60px rgba(146, 26, 37, 0.15)',
                        maxWidth: '500px',
                        width: '100%',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Top Border */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--color-primary)'
                    }} />

                    <div style={{
                        width: '70px', height: '70px', background: 'rgba(146, 26, 37, 0.1)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                        color: 'var(--color-primary)', fontSize: '1.8rem'
                    }}>
                        {isSignUp ? <FaUserPlus /> : <FaLock />}
                    </div>

                    <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 800 }}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <h2 style={{ color: 'var(--color-text)', marginBottom: '2rem', fontSize: '1.4rem' }}>
                        {isSignUp ? 'دروستکردنی هەژمار' : 'چوونەژوورەوە'}
                    </h2>

                    {error && (
                        <div style={{ backgroundColor: '#ffebeel', color: '#c62828', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <FaEnvelope style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', color: '#aaa' }} />
                            <input
                                type="email"
                                placeholder="Email / ئیمەیڵ"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px',
                                    border: '1px solid #eee', background: '#f9f9f9', fontSize: '1rem', outline: 'none'
                                }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <FaKey style={{ position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)', color: '#aaa' }} />
                            <input
                                type="password"
                                placeholder="Password / وشەی نهێنی"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px',
                                    border: '1px solid #eee', background: '#f9f9f9', fontSize: '1rem', outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '1rem',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'transform 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Sign Up / تۆمارکردن' : 'Login / چوونەژوورەوە')}
                            {!loading && (isSignUp ? <FaUserPlus /> : <FaSignInAlt />)}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#666' }}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"} <br />
                        {isSignUp ? 'پێشتر هەژمارت هەبووە؟' : "هەژمارت نییە؟"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{
                                background: 'none', border: 'none', color: 'var(--color-primary)',
                                fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline'
                            }}
                        >
                            {isSignUp ? 'Login Here' : 'Create Account'}
                        </button>
                    </div>

                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem',
                        borderTop: '1px solid #eee', paddingTop: '2rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <FaTruck style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }} />
                            <span style={{ fontSize: '0.8rem' }}>Fast Delivery</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <FaShoppingCart style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }} />
                            <span style={{ fontSize: '0.8rem' }}>Easy Shopping</span>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
