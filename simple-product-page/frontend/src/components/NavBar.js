import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from './Cart/CartContext'; 


const NavBar = () => {
  const navigate = useNavigate();
  const session = useSelector((state) => state.session.session);
  const { getCartItemCount } = useCart(); 

  const handleProfile = () => {
    navigate(`/profile/${session.id}`);
  };

  const categories = [
    'Smartphones',
    'Headphones',
    'Speakers',
    'Graphics cards',
    'Laptops',
    'Gaming'
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
          <a href="/" className="navbar-title">
            <h2>O N E P I E C E 💥</h2>
          </a>
        <div className="navbar-categories">
          <h2  onClick={() => navigate('/')}>Home</h2>
          {categories.map((category) => (
            <h2
              key={category}
              className="navbar-category"
              onClick={() => navigate(`/category/${category}`)}
            >
              {category}
            </h2>
          ))}
        </div>
      </div>

      

      <div className="navbar-right">
        {session ? (
          <div className="user-profile" onClick={handleProfile}>
            <img
              src={session.profile_img}
              alt="Profile"
              className="nav-profile-img"
            />
            <h2 className="username">{session.username}</h2>
          </div>
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
