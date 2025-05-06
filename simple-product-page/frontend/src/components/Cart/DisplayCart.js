import { useCart } from './CartContext';
import { useState } from 'react';

const DisplayCart = ({ onBack }) => {
    const { cart, increaseQuantity, decreaseQuantity, proceedToBuy } = useCart();
    const [orderSummary, setOrderSummary] = useState([]);

    const handleProceed = () => {
    const result = proceedToBuy(cartItems);
    setOrderSummary(result);
  };

  const cartItems = [...new Set(cart)];

  const handleOrder =()=>{
    alert('Your order has been successfully placed!')
  }

  return (
    <div className="cart-container">
      <button className="back-button" onClick={onBack}>⬅️ Back to Shop</button>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your Cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <strong>{item.title || item.name || item.productTitle}</strong>
              <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item)}>+</button>
              </div>

              <p>Price: ${item.price}</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleProceed}>Proceed To Buy</button>
      {orderSummary.length > 0 && (
      <div className="order-summary-card">
        <h3>Order Summary</h3>
        <ul className="order-summary-list">
          {orderSummary.map((item) => (
            <li key={item.id} className="order-summary-item">
              <span>{item.title}</span>
              <span>Qty: {item.qty}</span>
              <span>Price: ${item.price}</span>
            </li>
          ))}
        </ul>
          <div className="total-price">
            <strong>Total: </strong>
            <span>${orderSummary.reduce((total, item) => total + item.price * item.qty, 0)}</span>
          </div>
          <button onClick={handleOrder}>Place Order</button>
      </div>
    )}
    </div>
  );
     

}

export default DisplayCart;
