import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(1500); // Default

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('benabazar_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        // Fetch Exchange Rate
        const fetchRate = async () => {
            const { data, error } = await supabase
                .from('global_settings')
                .select('exchange_rate')
                .eq('id', 1)
                .single();
            if (data) {
                setExchangeRate(data.exchange_rate);
            }
        };
        fetchRate();

        // Subscribe to Rate Changes
        const subscription = supabase
            .channel('public:global_settings')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'global_settings' }, (payload) => {
                if (payload.new && payload.new.exchange_rate) {
                    setExchangeRate(payload.new.exchange_rate);
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('benabazar_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            exchangeRate,
            setExchangeRate
        }}>
            {children}
        </CartContext.Provider>
    );
};
