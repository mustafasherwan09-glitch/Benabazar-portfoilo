import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaPlane } from 'react-icons/fa';

const Hero = () => {
    return (
        <section id="home" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '100px', /* Increased for mobile navbar clearance */
            paddingBottom: '50px',
            background: 'radial-gradient(circle at 50% 50%, #FAF5E9 0%, #F5E6D3 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Elements - Scaled for mobile */}
            <div style={{
                position: 'absolute',
                top: '-15%',
                right: '-10%',
                width: 'clamp(300px, 50vw, 600px)',
                height: 'clamp(300px, 50vw, 600px)',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                width: 'clamp(250px, 40vw, 500px)',
                height: 'clamp(250px, 40vw, 500px)',
                background: 'radial-gradient(circle, rgba(146, 26, 37, 0.08) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src="/benabazarlogo.png"
                        alt="Bena Bazar Logo"
                        style={{
                            width: 'clamp(120px, 30vw, 200px)', /* Responsive Image */
                            margin: '0 auto 1.5rem',
                            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                        }}
                    />

                    <h1 style={{
                        fontSize: 'clamp(2rem, 8vw, 5rem)', /* More aggressive clamping for mobile */
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1rem',
                        color: 'var(--color-primary)',
                        textTransform: 'uppercase'
                    }}>
                        Global Shopping <br /> Made Simple
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                        fontWeight: 500,
                        maxWidth: '700px',
                        margin: '0 auto 2rem',
                        padding: '0 1rem',
                        color: 'var(--color-text)'
                    }}>
                        هێنانی کاڵا لە باشترین مارکە جیهانییەکانەوە بۆ دەرگای ماڵەکەت
                        <br />
                        Shop from Shein, Trendyol, and top global brands with ease.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        padding: '0 1rem'
                    }}>
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary"
                            style={{ fontSize: '1.1rem', padding: '0.9rem 2.5rem', boxShadow: '0 10px 25px rgba(146, 26, 37, 0.2)' }}
                        >
                            Order Now • داواکردن
                        </motion.a>
                        <motion.a
                            href="#services"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-outline"
                            style={{ fontSize: '1.1rem', padding: '0.9rem 2.5rem' }}
                        >
                            Services • خزمەتگوزاری
                        </motion.a>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, marginTop: 50 }}
                    animate={{ opacity: 1, marginTop: 80 }}
                    whileInView={{ opacity: 1, marginTop: 50 }} // Adjusted margins
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem', /* Reduced gap */
                        flexWrap: 'wrap',
                        borderTop: '1px solid rgba(146, 26, 37, 0.1)',
                        paddingTop: '2rem',
                        marginTop: '3rem'
                    }}
                >
                    {[
                        { label: 'Followers', value: '11K+', icon: <FaShoppingBag /> },
                        { label: 'Orders', value: '5000+', icon: <FaPlane /> },
                        { label: 'Satisfaction', value: '100%' }
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center', flex: '1 1 100px' }}>
                            <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-primary)' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
