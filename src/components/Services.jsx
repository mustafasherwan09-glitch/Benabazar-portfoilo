import React from 'react';
import { motion } from 'framer-motion';
import { FaShippingFast, FaTshirt, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';

const services = [
    {
        icon: <FaTshirt />,
        title: 'Shein & Trendyol',
        desc: 'لێرەوە بۆ باشترین براندەکان. ئێمە هەڵدەستین بە کڕینی کاڵاکان بۆ تۆ بە باشترین نرخ.',
        sub: 'Direct shopping from top fashion sites'
    },
    {
        icon: <FaShippingFast />,
        title: 'Fast Shipping',
        desc: 'گەیاندن لە ماوەی 12-18 ڕۆژ. گەیاندنی بەلاش بۆ هەندێک ئۆفەر.',
        sub: '12-18 Days Delivery'
    },
    {
        icon: <FaMoneyBillWave />,
        title: 'Best Exchange Rates',
        desc: 'نرخی گۆڕینەوەی دۆلار بە پێی بازاڕی ڕۆژ. $100 = 119,999 IQD (Example)',
        sub: 'Competitive Pricing'
    },
    {
        icon: <FaHeadset />,
        title: '24/7 Support',
        desc: 'وەڵامدانەوەی خێرا بۆ داواکارییەکانتان لە ڕێگەی ئینستاگرام و سۆشیال میدیا.',
        sub: 'Fast Customer Service'
    }
];

const Services = () => {
    return (
        <section id="services" style={{ background: 'var(--color-bg)' }}> {/* Changed to bg color */}
            <div className="container">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Our Services • خزمەتگوزارییەکان
                </motion.h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                background: 'var(--color-surface)',
                                padding: '2.5rem 2rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(146, 26, 37, 0.05)', // Subtle maroon border
                                textAlign: 'center',
                                boxShadow: '0 10px 30px -10px rgba(146, 26, 37, 0.08)' // Colored shadow
                            }}
                        >
                            <div style={{
                                fontSize: '2.5rem',
                                color: 'var(--color-primary)',
                                marginBottom: '1.5rem',
                                display: 'inline-block',
                                padding: '1.2rem',
                                background: 'rgba(146,26,37,0.05)',
                                borderRadius: '50%'
                            }}>
                                {service.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>{service.title}</h3>
                            <p style={{ color: 'var(--color-text)', marginBottom: '0.8rem', lineHeight: '1.6' }}>{service.desc}</p>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{service.sub}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
