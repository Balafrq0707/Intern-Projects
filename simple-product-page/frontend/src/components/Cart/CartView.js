import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartView = () => {
  const { cart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const cartItems = [...new Set(cart)];

  const handleProceed = () => {
    navigate('/cart/summary'); 
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="cart-wrapper">
    <div className="cart-container">
      <button className="back-button" onClick={handleBack}> Back to Shop</button>
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your Cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <strong>{item.title || item.name || item.productTitle}</strong>
              <div className="quantity-controls">
                <div>
                  <button onClick={() => decreaseQuantity(item)}>-</button>
                </div>
                  <span>{item.quantity}</span>
                <div>
                 <button onClick={() => increaseQuantity(item)}>+</button>
                </div>
              </div>
              <p>Price: ${item.quantity * item.price}</p>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <button onClick={handleProceed}>Proceed To Buy</button>
      )}
    </div>
  </div>
  );
};

export default CartView;
