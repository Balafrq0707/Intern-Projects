import React from 'react';
import './App.css';
import { CartProvider } from './components/Cart/CartContext';
import AuthForm from './components/AuthForm';
import ProductList from './components/products';
import NavBar from './components/NavBar';

const App = () => {

  return (
    <div>
      <CartProvider>
        <NavBar /> 
        <AuthForm/>
        <ProductList/>
      </CartProvider>
    </div>
  );
};

export default App;