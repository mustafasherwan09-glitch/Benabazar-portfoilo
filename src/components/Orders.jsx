import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaBox, FaClock, FaCheck, FaTruck, FaTimes, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (!user) {
                    setLoading(false);
                    return;
                }

                const adminEmail = 'admin@benabazar.com';
                const isUserAdmin = user.email === adminEmail;
                setIsAdmin(isUserAdmin);

                let query = supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                // If not admin, only show user's own orders
                if (!isUserAdmin) {
                    query = query.eq('user_email', user.email);
                }

                const { data, error } = await query;
                if (error) throw error;
                setOrders(data || []);

            } catch (error) {
                console.error('Error fetching orders:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            alert(`Order status updated to ${newStatus}`);
        } catch (error) {
            alert('Error updating status: ' + error.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107'; // yellow
            case 'preparing': return '#2196f3'; // blue
            case 'shipped': return '#9c27b0'; // purple
            case 'delivered': return '#4caf50'; // green
            case 'cancelled': return '#f44336'; // red
            default: return '#777';
        }
    };

    const StatusBadge = ({ status }) => (
        <span style={{
            background: getStatusColor(status),
            color: 'white',
            padding: '5px 10px',
            borderRadius: '15px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
        }}>
            {status === 'pending' && <FaClock />}
            {status === 'preparing' && <FaBox />}
            {status === 'shipped' && <FaTruck />}
            {status === 'delivered' && <FaCheck />}
            {status === 'cancelled' && <FaTimes />}
            {status.toUpperCase()}
        </span>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            <Navbar />

            <div className="container" style={{ flex: 1, padding: '120px 20px 60px', maxWidth: '1000px' }}>
                <h1 style={{ marginBottom: '2rem', color: 'var(--color-primary)', textAlign: 'center' }}>
                    {isAdmin ? 'Manage Orders (Admin)' : 'My Orders'}
                </h1>

                {loading ? (
                    <div style={{ textAlign: 'center' }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px' }}>
                        <h3>No orders found.</h3>
                        {!user && <p>Please login to view your orders.</p>}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{
                                background: 'white',
                                borderRadius: '15px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                borderLeft: `5px solid ${getStatusColor(order.status)}`,
                                transition: 'all 0.3s'
                            }}>
                                {/* Order Header */}
                                <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Order #{order.id}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                            {new Date(order.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <StatusBadge status={order.status} />
                                </div>

                                {/* Order Content */}
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

                                    {/* Admin View Details */}
                                    {isAdmin && (
                                        <div style={{ background: '#f0f7ff', padding: '15px', borderRadius: '10px', fontSize: '0.9rem' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#2196f3' }}>
                                                Customer Details:
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                                <div><FaUser style={{ marginRight: 5 }} /> {order.customer_name || 'N/A'}</div>
                                                <div><FaPhone style={{ marginRight: 5 }} /> {order.phone || 'N/A'}</div>
                                                <div><FaMapMarkerAlt style={{ marginRight: 5 }} /> {order.city} - {order.address}</div>
                                                <div>Email: {order.user_email}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Products List */}
                                    <div>
                                        <strong>Items:</strong>
                                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', borderBottom: '1px solid #f9f9f9', paddingBottom: '5px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ fontWeight: 'bold', background: '#eee', width: '25px', height: '25px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{item.quantity}x</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Total Footer */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                            Delivery: {order.delivery_price?.toLocaleString()} IQD
                                        </div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                            Total: {order.total_price?.toLocaleString()} IQD
                                        </div>
                                    </div>

                                    {/* Admin Controls */}
                                    {isAdmin && (
                                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #ddd' }}>
                                            <p style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Update Status:</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {['pending', 'preparing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => updateStatus(order.id, status)}
                                                        disabled={order.status === status}
                                                        style={{
                                                            padding: '5px 12px',
                                                            borderRadius: '15px',
                                                            border: '1px solid #ddd',
                                                            background: order.status === status ? getStatusColor(status) : 'white',
                                                            color: order.status === status ? 'white' : '#333',
                                                            cursor: order.status === status ? 'default' : 'pointer',
                                                            fontSize: '0.8rem',
                                                            opacity: order.status === status ? 1 : 0.7
                                                        }}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};
// Helper Icon import fix (FaUser was used but not imported in the component body above, let me fix it in the write_to_file content)
import { FaUser } from 'react-icons/fa';

export default Orders;
