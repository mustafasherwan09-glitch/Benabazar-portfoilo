// Website V1.0 - Final Build
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Shop from './components/Shop';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Orders from './components/Orders';

function App() {
  return (
    <Router>
      <div className="App">
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
