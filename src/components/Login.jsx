import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaLock, FaTruck } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';

const Login = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{
                flex: 1,
                background: 'radial-gradient(circle at 50% 50%, #FAF5E9 0%, #F5E6D3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '120px 20px 60px' // Added top padding for navbar
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
                        maxWidth: '600px',
                        width: '100%',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Top Border */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: 'var(--color-primary)'
                    }} />

                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(146, 26, 37, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        color: 'var(--color-primary)',
                        fontSize: '2rem'
                    }}>
                        <FaLock />
                    </div>

                    <h1 style={{
                        color: 'var(--color-primary)',
                        marginBottom: '1rem',
                        fontSize: '2.5rem',
                        fontWeight: 800
                    }}>
                        Coming Soon
                    </h1>
                    <h2 style={{
                        color: 'var(--color-text)',
                        marginBottom: '2rem',
                        fontSize: '1.8rem', // Kurdish Font Size
                        fontFamily: 'Tahoma, Arial'
                    }}>
                        بەم زووانە
                    </h2>

                    <div style={{ margin: '2rem 0', color: 'var(--color-text)', lineHeight: '1.8' }}>
                        <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                            We are building a simple e-commerce store for you. <br />
                            Soon you will be able to <strong>Login</strong> and order anything directly.
                        </p>
                        <p style={{ fontSize: '1.1rem', direction: 'rtl', fontFamily: 'Tahoma, Arial' }}>
                            خەریکی دروستکردنی فرۆشگایەکی ئۆنلاینین بۆ ئێوەی ئازیز.<br />
                            بەم زووانە دەتوانن <strong>داخل بن</strong> و هەر شتێکتان ئەوێت بیکڕن.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginTop: '2.5rem',
                        borderTop: '1px solid #eee',
                        paddingTop: '2rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <FaTruck style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cash on Delivery</span>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'Tahoma' }}>پارەدان لە کاتی گەیشتن</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <FaShoppingCart style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Easy Shopping</span>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'Tahoma' }}>کڕینی ئاسان</span>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
