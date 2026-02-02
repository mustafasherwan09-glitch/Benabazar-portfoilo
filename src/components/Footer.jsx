import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#1A0507', // Dark Maroon/Black for contrast footer
            padding: '4rem 0',
            textAlign: 'center',
            color: 'white'
        }}>
            <div className="container">
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '1rem',
                    letterSpacing: '2px'
                }}>
                    BENA <span style={{ color: 'var(--color-secondary)' }}>BAZAR</span>
                </h2>
                <p style={{ color: '#aaa', marginBottom: '2rem' }}>
                    Your Gateway to Global Shopping. <br />
                    &copy; {new Date().getFullYear()} Bena Bazar. All rights reserved.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    <a href="#" style={{ color: '#666', fontSize: '0.9rem' }}>Privacy Policy</a>
                    <a href="#" style={{ color: '#666', fontSize: '0.9rem' }}>Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
