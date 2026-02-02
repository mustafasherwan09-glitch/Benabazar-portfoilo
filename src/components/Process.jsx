import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { num: '01', title: 'Select Items', desc: 'Choose your favorite items from Shein or any store.', descKu: 'کاڵاکانت هەڵبژێرە لە هەر سایتێک' },
    { num: '02', title: 'Send Link', desc: 'Send us the product links via Instagram or WhatsApp.', descKu: 'لینکی کاڵا بنێرە بۆمان' },
    { num: '03', title: 'Confirmation', desc: 'We confirm the total price and details.', descKu: 'نرخ و وردەکاریت بۆ پشتڕاست دەکەینەوە' },
    { num: '04', title: 'Delivery', desc: 'Relax while we ship it to your doorstep.', descKu: 'چاوەڕێ بە تا کاڵاکەت دەگات' }
];

const Process = () => {
    return (
        <section id="process" style={{ background: '#FFF' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="section-title"
                    style={{ textAlign: 'center' }}
                >
                    <h2>How It Works</h2>
                </motion.div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    position: 'relative'
                }}>
                    {/* Connector Line (Desktop only) */}
                    <div className="connector" style={{
                        position: 'absolute',
                        top: '50px',
                        left: '10%',
                        right: '10%',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                        opacity: 0.2,
                        zIndex: 0,
                        /* display set via style tag below for media query */
                    }} />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                            style={{
                                background: 'var(--color-bg)',
                                padding: '2rem',
                                borderRadius: 'var(--radius-md)',
                                flex: '1 1 200px', /* Allow flex shrink/grow with min base */
                                minWidth: '220px', /* Minimum width for readability */
                                textAlign: 'center',
                                position: 'relative',
                                zIndex: 1,
                                borderTop: '4px solid var(--color-primary)',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{
                                fontSize: '4rem',
                                fontWeight: 900,
                                color: 'rgba(146, 26, 37, 0.05)',
                                position: 'absolute',
                                top: '0px',
                                right: '20px',
                                lineHeight: 1
                            }}>
                                {step.num}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-primary)', fontWeight: 700 }}>{step.title}</h3>
                            <p style={{ color: 'var(--color-text)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{step.descKu}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .connector { display: none; }
        }
        @media (min-width: 769px) {
          .connector { display: block; }
        }
      `}</style>
        </section>
    );
};

export default Process;
