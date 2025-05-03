import React from 'react';
import {useCart} from './Cart/CartContext';
const NavBar = () => {
  const { getCartItemCount } = useCart();  
  return (
    <nav className="navbar">
    <div className="navbar-left">
      <h2>MyShop</h2>
    </div>
    <div className="navbar-right">
      <button className="cart-icon">
        🛒
        {getCartItemCount() > 0 && <span className="cart-count">{getCartItemCount()}</span>}
      </button>
    </div>
  </nav>
  );
};

export default NavBar;
