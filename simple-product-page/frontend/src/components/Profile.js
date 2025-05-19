import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useCart } from './Cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { logout } from './slices/Slice';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
        const data = await res.json();
        setUserProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    if (userId) fetchUserProfile();
  }, [userId]);

  const handleLogout = () => {
   dispatch(logout()) ; 
    navigate('/');
  };

  if (loading) return <p>Loading profile...</p>;
  if (!userProfile) return <p>User not found.</p>;

  const { userName, email, Location, orders } = userProfile;

  console.log("User Profile Data:", userProfile);


  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="user-details">
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Location:</strong> {Location}</p>
      </div>

      <h3>Order Details</h3>
      {orders && orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) =>
            order.OrderItems.map((item, idx) => (
              <li key={`${order.id}-${idx}`} className="order-item">
                <p><strong>Product:</strong> {item.Product.title}</p>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total Price:</strong> ${item.total_price}</p>
                <hr />
              </li>
            ))
          )}
        </ul>
      ) : (
        <p>No orders found for this user.</p>
      )}
    </div>
  );
};

export default Profile;
