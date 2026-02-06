import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        style={{
                            position: 'fixed', inset: 0, background: 'black', zIndex: 1000
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed', top: 0, right: 0, bottom: 0,
                            width: '90%', maxWidth: '400px',
                            background: 'white', zIndex: 1001,
                            boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
                            display: 'flex', flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>Your Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                                <FaTimes />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
                                    Your cart is empty.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {cart.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ width: '80px', height: '80px', background: '#f8f8f8', borderRadius: '10px', overflow: 'hidden' }}>
                                                {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{item.name}</h4>
                                                <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: 'bold' }}>${item.price}</p>

                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0f0f0', borderRadius: '5px', padding: '2px 8px' }}>
                                                        <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><FaMinus size={10} /></button>
                                                        <span style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><FaPlus size={10} /></button>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: '#ff4444', cursor: 'pointer' }}>
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div style={{ padding: '20px', borderTop: '1px solid #eee', background: '#f9f9f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    <span>Total:</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '15px', fontSize: '1.1rem', borderRadius: '15px' }}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
