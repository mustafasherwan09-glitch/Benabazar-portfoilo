import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 1000,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        fontSize: '1.2rem',
                        border: '2px solid white'
                    }}
                    whileHover={{ y: -5, backgroundColor: 'var(--color-primary-dark)' }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaArrowUp />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
