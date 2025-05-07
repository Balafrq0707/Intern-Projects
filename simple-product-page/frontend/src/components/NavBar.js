import { useNavigate } from 'react-router-dom';
import {useCart} from './Cart/CartContext'

const NavBar = () => {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-title">
          <h2>MyShop</h2>
        </a>
      </div>
      <div className="navbar-right">
        <button className="cart-icon" onClick={() => navigate('/cart')}>
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