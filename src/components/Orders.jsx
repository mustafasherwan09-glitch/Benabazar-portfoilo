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

        // Realtime Subscription
        const subscription = supabase
            .channel('orders_channel')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
                setOrders(prevOrders => prevOrders.map(order =>
                    order.id === payload.new.id ? { ...order, ...payload.new } : order
                ));
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to permanently delete this order? This cannot be undone.')) return;

        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId);

            if (error) throw error;
            setOrders(orders.filter(o => o.id !== orderId));
            alert('Order deleted successfully');
        } catch (error) {
            alert('Error deleting order: ' + error.message);
        }
    };

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

    const handlePrintSticker = (order) => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Order #${order.id}</title>
                    <style>
                        @page { size: 70mm 70mm; margin: 0; }
                        body { 
                            width: 70mm; 
                            height: 70mm; 
                            margin: 0; 
                            padding: 5px; 
                            font-family: 'Arial', sans-serif; 
                            font-size: 10px;
                            display: flex;
                            flex-direction: column;
                            box-sizing: border-box;
                        }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 2px; margin-bottom: 5px; }
                        .title { font-size: 14px; fontWeight: bold; margin: 0; }
                        .info { margin-bottom: 5px; }
                        .label { font-weight: bold; }
                        .items { width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 9px; }
                        .items th { border-bottom: 1px solid #000; text-align: left; }
                        .items td { border-bottom: 1px dotted #ccc; padding: 2px 0; }
                        .footer { margin-top: auto; text-align: center; border-top: 1px solid #000; padding-top: 2px; }
                        .total { font-size: 12px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="title">BENABAZAR</h1>
                        <div>Order #${order.id}</div>
                    </div>
                    
                    <div class="info">
                        <div><span class="label">Customer:</span> ${order.customer_name || 'N/A'}</div>
                        <div><span class="label">Phone:</span> ${order.phone || 'N/A'}</div>
                        <div><span class="label">City:</span> ${order.city || 'N/A'}</div>
                        <div><span class="label">Address:</span> ${order.address || 'N/A'}</div>
                    </div>

                    <table class="items">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items ? order.items.map(item => `
                                <tr>
                                    <td>
                                        ${item.name}
                                        <div style="font-size:8px; color:#555">SKU: ${item.sku || '-'}</div>
                                    </td>
                                    <td>${item.quantity}</td>
                                    <td>${(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            `).join('') : ''}
                        </tbody>
                    </table>

                    <div class="footer">
                        <div class="total">TOTAL: ${order.total_price?.toLocaleString()} IQD</div>
                        <div>${new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107'; // yellow
            case 'confirmed': return '#00bcd4'; // cyan
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
            {status === 'confirmed' && <FaCheck />}
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
                                                        <span>
                                                            {item.name}
                                                            {isAdmin && item.sku && <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: '5px', background: '#eee', padding: '2px 4px', borderRadius: '4px' }}>SKU: {item.sku}</span>}
                                                        </span>
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
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0 }}>Update Status:</p>
                                                <button
                                                    onClick={() => handlePrintSticker(order)}
                                                    style={{
                                                        background: '#333',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '5px 15px',
                                                        borderRadius: '5px',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Print Sticker (7x7cm)
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map(status => (
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
                                                {order.status === 'cancelled' && (
                                                    <button
                                                        onClick={() => handleDeleteOrder(order.id)}
                                                        style={{
                                                            padding: '5px 12px',
                                                            borderRadius: '15px',
                                                            border: '1px solid red',
                                                            background: '#ffebee',
                                                            color: 'red',
                                                            cursor: 'pointer',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold',
                                                            marginLeft: 'auto'
                                                        }}
                                                    >
                                                        Delete Order
                                                    </button>
                                                )}
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
