import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaBars, FaTimes, FaUser, FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, setIsCartOpen } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isHome = location.pathname === '/';

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

  const handleNavClick = (e, item) => {
    setIsOpen(false);
    if (!isHome) {
      e.preventDefault();
      navigate(`/#${item.toLowerCase()}`);
    }
  };

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

        {/* Logo & Quick Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', zIndex: 1001, textDecoration: 'none' }}>
            <img src="/benabazarlogo.png" alt="Bena Bazar" style={{ height: '40px', objectFit: 'contain' }} />
            <h1 style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.25rem' }}>
              BENA <span style={{ color: 'var(--color-text)' }}>BAZAR</span>
            </h1>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              position: 'relative',
              marginLeft: '0.5rem'
            }}
          >
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--color-secondary)',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>

          <Link
            to="/login"
            style={{
              background: 'rgba(146, 26, 37, 0.1)',
              color: 'var(--color-primary)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgba(146, 26, 37, 0.2)'
            }}
          >
            <FaUser style={{ fontSize: '0.75rem' }} /> Login
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {/* Shop Link */}
          <Link
            to="/shop"
            style={{
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Shop
          </Link>

          {['Home', 'Services', 'Feedbacks', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, item)}
              style={{
                color: 'var(--color-text)',
                fontWeight: 600,
                position: 'relative',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              {item}
            </a>
          ))}

          {/* Instagram Button */}
          <a
            href="https://instagram.com/bena.bazar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <FaInstagram /> Insta
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: '2px solid var(--color-primary)',
              color: 'var(--color-primary)',
              background: 'transparent',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <FaShoppingCart /> Cart
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--color-secondary)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Login Button */}
          <Link
            to="/login"
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
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <FaUser style={{ fontSize: '0.8rem' }} /> Login
          </Link>
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
            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              style={{
                color: 'var(--color-text)',
                fontSize: '2rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Shop
            </Link>

            {['Home', 'Services', 'Feedbacks', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item)}
                style={{
                  color: 'var(--color-text)',
                  fontSize: '2rem',
                  fontWeight: 700
                }}
              >
                {item}
              </a>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary"
                style={{
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '200px',
                  justifyContent: 'center'
                }}
              >
                <FaUser /> Login
              </Link>

              <a
                href="https://instagram.com/bena.bazar"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '200px',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '2px solid var(--color-primary)',
                  color: 'var(--color-primary)'
                }}
              >
                <FaInstagram /> Follow Us
              </a>
            </div>
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

