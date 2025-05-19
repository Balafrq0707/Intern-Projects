import { useCart } from './CartContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector} from 'react-redux';
// import { setSession, logout } from '../slices/Slice';



const OrderSummary = () => {
  const { cart, proceedToBuy } = useCart();
  const session = useSelector((state) => state.session.session);
  // const dispatch = useDispatch();
  

  const [orderSummary, setOrderSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const summary = proceedToBuy(cart);
    setOrderSummary(summary);
  }, [cart, proceedToBuy]);

  const handleOrder = async () => {
    if (!session) {
      alert("Please login before placing an order.");
      navigate('/login');
      return;
    }

    const newEntry = {
      userName: session.username, 
      email: session.email, 
      orderItems: orderSummary, 
    };

    try {
      const res = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });
      console.log(session)
      if (res.ok) {
        alert('Your order has been successfully placed!');
      } else {
        alert('Something went wrong placing your order.');
      }
    } catch (err) {
      console.error('Order request failed:', err);
      alert('Network error while placing your order.');
    }
  };

  return (
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
  );
};

export default OrderSummary;