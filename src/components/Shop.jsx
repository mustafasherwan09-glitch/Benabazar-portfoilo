import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaFilter, FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Admin Add Product State
    const [newProduct, setNewProduct] = useState({
        name: '', description: '', price: '', category: 'General', image_url: '', stock: 10, sku: ''
    });
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart, exchangeRate } = useCart();

    useEffect(() => {
        fetchProducts();
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user && user.email === 'admin@benabazar.com') {
            setIsAdmin(true);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!isAdmin) return;

        try {
            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select();

            if (error) throw error;

            setProducts([data[0], ...products]);
            setIsAdding(false);
            setNewProduct({ name: '', description: '', price: '', category: 'General', image_url: '', stock: 10 });
            alert('Product added successfully!');
        } catch (error) {
            alert('Error adding product: ' + error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Error deleting product: ' + error.message);
        }
    };

    const handleUpdateRate = async () => {
        const newRate = prompt('Enter new exchange rate (e.g. 1500 for $1 = 1500 IQD):', exchangeRate);
        if (newRate && !isNaN(newRate)) {
            const { error } = await supabase
                .from('global_settings')
                .update({ exchange_rate: parseFloat(newRate) })
                .eq('id', 1);

            if (error) alert('Error updating rate');
            else alert('Exchange rate updated! New orders will use this rate.');
        }
    };

    const handleUpdateStock = async (id, newStock) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', id);

            if (error) throw error;
            setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
        } catch (error) {
            console.error('Error updating stock', error);
        }
    }

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
            <Navbar />

            {/* Header Section */}
            <div style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: '120px 20px 40px',
                textAlign: 'center'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
                >
                    {isAdmin ? 'Admin Dashboard' : 'Shop Our Collection'}
                </motion.h1>
                <p style={{ opacity: 0.9 }}>
                    {isAdmin ? 'Manage your inventory and products' : 'دیاریترین بەرهەمەکانمان ببینە و داوا بکە'}
                </p>

                {isAdmin && (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            style={{
                                padding: '10px 24px',
                                background: 'white',
                                color: 'var(--color-primary)',
                                border: 'none',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            {isAdding ? 'Close Form' : '+ Add New Product'}
                        </button>
                        <button
                            onClick={handleUpdateRate}
                            style={{
                                padding: '10px 24px',
                                background: 'var(--color-secondary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Rate: {exchangeRate} IQD
                        </button>
                    </div>
                )}
            </div>

            <div className="container" style={{ flex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

                {/* Admin Add Form */}
                {isAdmin && isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '15px',
                            marginBottom: '2rem',
                            boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Add New Product</h3>
                        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <input
                                placeholder="Price ($)"
                                type="number"
                                value={newProduct.price}
                                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                required
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <input
                                placeholder="Category (e.g. Shoes)"
                                value={newProduct.category}
                                list="category-options"
                                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                required
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <datalist id="category-options">
                                {categories.filter(c => c !== 'All').map(cat => (
                                    <option key={cat} value={cat} />
                                ))}
                            </datalist>
                            <input
                                placeholder="SKU (Admin Only)"
                                value={newProduct.sku}
                                onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <input
                                placeholder="Stock Quantity"
                                type="number"
                                value={newProduct.stock}
                                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                required
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <input
                                placeholder="Image URL (http://...)"
                                value={newProduct.image_url}
                                onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                style={{ gridColumn: 'span 2', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                            <textarea
                                placeholder="Description"
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                style={{ gridColumn: 'span 2', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>
                                Save Product
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Search and Filter */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '2rem',
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                        <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 45px',
                                borderRadius: '10px',
                                border: '1px solid #eee',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '5px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: selectedCategory === cat ? 'var(--color-primary)' : '#f0f0f0',
                                    color: selectedCategory === cat ? 'white' : '#333',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>
                ) : filteredProducts.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    background: 'white',
                                    borderRadius: '15px',
                                    overflow: 'hidden',
                                    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{
                                    height: '250px',
                                    background: '#f8f9fa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                left: 10,
                                                background: 'rgba(255,0,0,0.8)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                zIndex: 10,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            title="Delete Product"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    )}
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ fontSize: '3rem', color: '#ddd' }}><FaShoppingCart /></div>
                                    )}
                                    {product.stock <= 0 && (
                                        <div style={{ position: 'absolute', top: 10, right: 10, background: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem' }}>
                                            Out of Stock
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '5px' }}>
                                        {isAdmin && product.sku && <span style={{ fontSize: '0.8rem', color: '#555', background: '#eee', padding: '2px 5px', borderRadius: '4px', alignSelf: 'flex-start' }}>SKU: {product.sku}</span>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span>{product.category}</span>
                                            <span style={{
                                                color: product.stock < 5 ? '#e91e63' : '#4caf50',
                                                fontWeight: 'bold',
                                                fontSize: '0.85rem'
                                            }}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', flex: 1 }}>{product.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {product.description}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                            ${product.price}
                                        </span>
                                        <button
                                            disabled={product.stock <= 0}
                                            onClick={() => addToCart(product)}
                                            style={{
                                                padding: '8px 16px',
                                                background: product.stock > 0 ? 'var(--color-primary)' : '#ccc',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Sold'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                        <h2>No products found</h2>
                        <p>Try changing your search or category.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Shop;
