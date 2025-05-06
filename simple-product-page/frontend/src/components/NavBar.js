  import React from 'react';
import { useCart } from './Cart/CartContext';

const NavBar = ({ toggleCart }) => {
  const { getCartItemCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-left">
          <a href="#products" className="navbar-title">
             <h2>MyShop</h2>
          </a>
      </div>
      <div className="navbar-right">
        <button className="cart-icon" onClick={toggleCart}>
          🛒
          {getCartItemCount() > 0 && (
            <span className="cart-count">{getCartItemCount()}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
