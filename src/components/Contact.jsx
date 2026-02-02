import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    return (
        <section id="contact" style={{ background: 'var(--color-bg)' }}>
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                >
                    Get In Touch • پەیوەندیمان پێوە بکە
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center'
                }}>
                    {/* Contact Info */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                    >
                        <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Ready to Order?</h3>
                        <p style={{ color: 'var(--color-text)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                            We are available 24/7 to assist you with your orders from global stores.
                            <br />
                            هەر ئێستا داواکارییەکەت بنێرە و لە ماوەیەکی کەمدا بەدەستی دەهێنیت.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <a href="#" className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text)', fontSize: '1.1rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', background: 'var(--color-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'white'
                                }}>
                                    <FaInstagram />
                                </div>
                                <span>@bena.bazar</span>
                            </a>
                            <a href="#" className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text)', fontSize: '1.1rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', background: 'var(--color-secondary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                                }}>
                                    <FaWhatsapp />
                                </div>
                                <span>WhatsApp Support</span>
                            </a>
                            <div className="contact-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text)', fontSize: '1.1rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', background: '#333', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'
                                }}>
                                    <FaMapMarkerAlt />
                                </div>
                                <span>Kurdistan, Iraq</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        style={{
                            background: 'var(--color-surface)',
                            padding: '3rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(146, 26, 37, 0.1)',
                            boxShadow: '0 10px 40px -10px rgba(146, 26, 37, 0.1)'
                        }}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Name • ناو</label>
                            <input type="text" style={{
                                width: '100%', padding: '1rem', background: 'var(--color-bg)',
                                border: '1px solid #ddd', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)'
                            }} placeholder="Your Name" />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Message • نامە</label>
                            <textarea rows="4" style={{
                                width: '100%', padding: '1rem', background: 'var(--color-bg)',
                                border: '1px solid #ddd', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)'
                            }} placeholder="I want to order..." />
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
