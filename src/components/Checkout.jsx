import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '../supabaseClient';
import { FaCheckCircle } from 'react-icons/fa';

const Checkout = () => {
    const { cart, getCartTotal, clearCart, exchangeRate } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: 'Erbil',
        notes: ''
    });

    // Cities configuration
    const specialCities = ['Erbil', 'Duhok', 'Sulaymaniyah', 'Kirkuk'];
    const otherCities = [
        'Baghdad', 'Basra', 'Mosul', 'Najaf', 'Karbala', 'Nasiriyah', 'Amarah', 'Samawah', 'Ramadi', 'Fallujah', 'Tikrit', 'Baqubah', 'Kut', 'Hilla', 'Diwaniyah'
    ];
    // Sort other cities alphabetically
    otherCities.sort();

    const getDeliveryPrice = (city) => {
        if (city === 'Erbil') return 3000;
        if (['Duhok', 'Sulaymaniyah', 'Kirkuk'].includes(city)) return 4000;
        return 5000;
    };

    const deliveryPrice = getDeliveryPrice(formData.city);
    const subtotalUSD = getCartTotal();
    const subtotalIQD = subtotalUSD * exchangeRate;
    const finalTotalIQD = subtotalIQD + deliveryPrice;

    useEffect(() => {
        if (cart.length === 0 && !orderComplete) {
            navigate('/shop');
        }
    }, [cart, navigate, orderComplete]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get current user if logged in
            const { data: { user } } = await supabase.auth.getUser();

            const orderData = {
                items: cart,
                total_price: finalTotalIQD,
                delivery_price: deliveryPrice,
                city: formData.city,
                address: formData.address,
                phone: formData.phone,
                customer_name: formData.name,
                user_email: user ? user.email : 'guest',
                status: 'pending'
            };

            const { error } = await supabase
                .from('orders')
                .insert([orderData]);

            if (error) throw error;

            setOrderComplete(true);
            clearCart();
        } catch (error) {
            alert('Error placing order: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        <FaCheckCircle style={{ fontSize: '5rem', color: '#4caf50', marginBottom: '20px' }} />
                    </motion.div>
                    <h1 style={{ color: 'var(--color-primary)' }}>Order Placed Successfully!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '500px', margin: '10px aut' }}>
                        Thank you for your order, {formData.name}. <br />
                        We will contact you shortly at {formData.phone} to confirm delivery via Call or WhatsApp.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="btn btn-primary"
                        style={{ marginTop: '30px' }}
                    >
                        Continue Shopping
                    </button>
                    <br />
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                        style={{ marginTop: '10px' }}
                    >
                        Back To Home
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, padding: '120px 20px 60px', maxWidth: '1000px' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary)' }}>Checkout</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    {/* Form Section */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '20px' }}>Delivery Details / زانیاری گەیاندن</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Name / ایمی سیانی</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number / ژمارەی مۆبایل</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="0750xxxxxxx"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City / شار</label>
                                <select
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', background: 'white' }}
                                >
                                    <optgroup label="Kurdistan Region">
                                        {specialCities.map(city => <option key={city} value={city}>{city}</option>)}
                                    </optgroup>
                                    <optgroup label="Other Iraq Cities">
                                        {otherCities.map(city => <option key={city} value={city}>{city}</option>)}
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Address / ناونیشانی تەواو</label>
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px' }}
                                    placeholder="Neighborhood, Street, Landmark..."
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes / تێبینی (Optional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="Any special instructions..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{ marginTop: '10px', padding: '15px', fontSize: '1.2rem', width: '100%' }}
                            >
                                {loading ? 'Processing...' : `Place Order - ${(finalTotalIQD).toLocaleString()} IQD`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>Quantity: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px solid #eee', paddingTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>Subtotal (USD)</span>
                                <span>${subtotalUSD.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#666' }}>
                                <span>Exchange Rate</span>
                                <span>$1 = {exchangeRate.toLocaleString()} IQD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--color-primary)' }}>
                                <span>Delivery Fee ({formData.city})</span>
                                <span>{deliveryPrice.toLocaleString()} IQD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                <span>Total (IQD)</span>
                                <span>{finalTotalIQD.toLocaleString()} IQD</span>
                            </div>
                            <small style={{ display: 'block', marginTop: '5px', color: '#777' }}>* Payment is Cash on Delivery (COD)</small>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
