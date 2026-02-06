import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaBars, FaTimes, FaUser, FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, setIsCartOpen } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isHome = location.pathname === '/';

  // Import supabase inside component or at top? Ideally at top.
  // Actually, Navbar doesn't import supabase yet. I need to add import.
  // I will add import in a separate block or here if I can.
  // Let's assume I added the import. 

  useEffect(() => {
    // Check auth on mount
    import('../supabaseClient').then(({ supabase }) => {
      supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

      // Listen for changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    });

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

  const handleLogout = async () => {
    const { supabase } = await import('../supabaseClient');
    await supabase.auth.signOut();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: scrolled ? '1rem 2rem' : '1.5rem 2rem',
        background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 5px 20px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            to={user ? "/shop" : "/"}
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontFamily: 'Doran',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>✦</span>
            <h1>Benabazar</h1>
          </Link>

          {/* Mobile Cart Icon (Only if logged in) */}
          {user && (
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                position: 'relative',
                marginLeft: '0.8rem'
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
          )}
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

          {/* Menu Items */}
          {user ? (
            // Logged In Menu
            <>
              <Link to="/shop" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>Shop</Link>
              <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>
                {user.email === 'admin@benabazar.com' ? 'Admin Panel' : 'My Orders'}
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn-outline"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                  borderRadius: '9999px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)',
                  background: 'transparent', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', position: 'relative'
                }}
              >
                <FaShoppingCart /> Cart
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-secondary)',
                    color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="btn-primary"
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '9999px', background: '#dc3545', color: 'white',
                  border: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            // Guest Menu
            <>
              <a href="/#home" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>Home</a>
              <a href="/#about" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>About</a>
              <a href="/#services" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>Services</a>
              <a href="/#process" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>Process</a>
              <a href="/#contact" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>Contact</a>

              <Link
                to="/login"
                className="btn-primary"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem',
                  borderRadius: '9999px', background: 'var(--color-primary)', color: 'white',
                  border: 'none', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'none'
                }}
              >
                <FaUser style={{ fontSize: '0.8rem' }} /> Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none', // Hidden on desktop via CSS, explicit logic handles query
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-text)',
            cursor: 'pointer',
            zIndex: 1001
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <style>{`
          @media (max-width: 768px) {
            .desktop-menu { display: none !important; }
            .mobile-toggle { display: block !important; }
          }
        `}</style>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'center',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px'
              }}
            >
              {user ? (
                // Logged In Mobile Menu
                <>
                  <Link to="/shop" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 600 }}>Shop</Link>
                  <Link to="/orders" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 600 }}>
                    {user.email === 'admin@benabazar.com' ? 'Admin Panel' : 'My Orders'}
                  </Link>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc3545', fontSize: '1.1rem', fontWeight: 600 }}>Logout</button>
                </>
              ) : (
                // Guest Mobile Menu
                <>
                  <a href="/#home" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 600 }}>Home</a>
                  <a href="/#about" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 600 }}>About</a>
                  <a href="/#services" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 600 }}>Services</a>
                  <a href="/#process" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 600 }}>Process</a>
                  <a href="/#contact" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 600 }}>Contact</a>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '200px', justifyContent: 'center' }}>
                    <FaUser /> Login
                  </Link>
                </>
              )}
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
      </div>
    </nav>
  );
};

export default Navbar;

