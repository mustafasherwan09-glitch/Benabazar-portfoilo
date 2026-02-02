import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: scrolled ? '1rem' : '1.5rem 1rem',
        background: scrolled || isOpen ? 'rgba(253, 249, 243, 0.95)' : 'transparent',
        backdropFilter: scrolled || isOpen ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(146, 26, 37, 0.1)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo */}
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', zIndex: 1001 }}>
          <img src="/benabazarlogo.png" alt="Bena Bazar" style={{ height: '40px', objectFit: 'contain' }} />
          <h1 style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.25rem' }}>
            BENA <span style={{ color: 'var(--color-text)' }}>BAZAR</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['Home', 'Services', 'Gallery', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                color: 'var(--color-text)',
                fontWeight: 600,
                position: 'relative',
                fontSize: '1rem'
              }}
              className="nav-link"
            >
              {item}
            </a>
          ))}
          <a
            href="https://instagram.com/bena.bazar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            <FaInstagram /> Follow Us
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--color-text)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 1001,
            padding: '0.5rem'
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              background: 'var(--color-bg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2rem',
              zIndex: 1000
            }}
          >
            {['Home', 'Services', 'Gallery', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                style={{
                  color: 'var(--color-text)',
                  fontSize: '2rem',
                  fontWeight: 700
                }}
              >
                {item}
              </a>
            ))}
            <a
              href="https://instagram.com/bena.bazar"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '1.2rem', marginTop: '1rem' }}
            >
              <FaInstagram style={{ marginRight: '8px' }} /> Follow Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
