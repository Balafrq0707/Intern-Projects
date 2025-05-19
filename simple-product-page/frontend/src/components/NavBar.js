import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from './Cart/CartContext'; 

const NavBar = () => {
  const navigate = useNavigate();
  const session = useSelector((state) => state.session.session);
  const { getCartItemCount } = useCart(); 

  const handleProfile = () => {
    console.log("session:", session);
    navigate(`/profile/${session.id}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-title">
          <h2>MyShop</h2>
        </a>
      </div>
      <div className="navbar-right">
        {session ? (
          <>
            <h2 onClick={handleProfile} style={{ cursor: 'pointer' }}>
              <span>{session.username}</span>
            </h2>
          </>
        ) : (
          <div className="form-handlers">
            <h2 className="register-handler" onClick={() => navigate('/register')}>
              Register
            </h2>
            <h2 className="login-handler" onClick={() => navigate('/login')}>
              Login
            </h2>
          </div>
        )}

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
