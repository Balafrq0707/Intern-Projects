import React, { useState } from 'react';
import NavBar from './components/NavBar'
import ProductList from './components/products';
import DisplayCart from './components/Cart/DisplayCart'
import { CartProvider } from './components/Cart/CartContext';
import AuthForm from './components/AuthForm'
import './App.css';

function App() {
  const [showCart, setShowCart] = useState(false);

  return (
    <CartProvider>
      <NavBar toggleCart={() => setShowCart(true)} />
      <AuthForm />
      {showCart ? (
        <DisplayCart onBack={() => setShowCart(false)} />
      ) : (
        <ProductList />
      )}
      
    </CartProvider>
  );
}

export default App;
