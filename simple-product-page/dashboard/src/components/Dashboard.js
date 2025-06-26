import React, { useState, useEffect } from 'react';
import OrdersGraph from './OrdersGraph';
import '../App.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const staff = useSelector((state) => state.StaffSession.StaffSession);

  useEffect(() => {
    fetchTodaysOrders();
  }, []);

  const fetchTodaysOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3001/api/dashboard/allOrders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log(result); 
      const today = new Date();

      const filteredUsers = result
        .map((user) => {
          const todayOrders = user.Orders?.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getFullYear() === today.getFullYear() &&
              orderDate.getMonth() === today.getMonth() &&
              orderDate.getDate() === today.getDate()
            );
          }).map((order) => ({
            ...order,
            orderItems: order.OrderItems, 
          }));

          return {
            ...user,
            orders: todayOrders, 
          };
        })
        .filter((user) => user.orders && user.orders.length > 0);

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleShipping = (orderId, productId, itemIndex) => {
    const key = `${orderId}-${productId}-${itemIndex}`;
    setOrderStatus((prev) => ({ ...prev, [key]: 'shipped' }));
  };

  const handleOrders = async (orderId, productId, itemIndex) => {
    const key = `${orderId}-${productId}-${itemIndex}`;

    if (!productId) {
      console.error('❌ Cannot cancel order - product ID is undefined', { orderId, productId });
      alert('Product ID is missing. Cannot cancel order.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}/${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setOrderStatus((prev) => ({ ...prev, [key]: 'cancelled' }));
        console.log(data.message);
      } else {
        console.error('Failed to delete:', data.message);
      }
    } catch (error) {
      console.error('Error deleting the order:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <button onClick={fetchTodaysOrders} className="view-orders-btn">
        View Orders
      </button>

      {staff.role === 'admin' && (
        <div>
          <Link to="/addProduct" style={{ marginLeft: '2em' }}>
            Add Product
          </Link>
          <Link to="/manageProducts" style={{ marginLeft: '2em' }}>
            Manage Products
          </Link>
        </div>
      )}

      <OrdersGraph />

      {users.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Order ID</th>
              <th>Product Title</th>
              <th>Quantity</th>
              <th>Total Price (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              user.orders.map((order) =>
                order.orderItems.map((item, idx) => {
                  const productId = item.product_id ?? item.Product?.id;
                  const key = `${order.id}-${productId}-${idx}`;
                  const status = orderStatus[key];

                  return (
                    <tr key={`${user.id}-${order.id}-${idx}`}>
                      <td>{user.id}</td>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>{user.Location}</td>
                      <td>{order.id}</td>
                      <td>{item.Product?.title || 'Unknown'}</td>
                      <td>{item.quantity}</td>
                      <td>{item.total_price}</td>
                      <td>
                        {status === 'shipped' ? (
                          <span style={{ color: 'green', fontWeight: 'bold' }}>
                            Product Shipped!
                          </span>
                        ) : status === 'cancelled' ? (
                          <span style={{ color: 'red', fontWeight: 'bold' }}>
                            Order got cancelled
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleShipping(order.id, productId, idx)}
                              style={{
                                color: 'white',
                                backgroundColor: '#007bff',
                                marginLeft: '10px',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                padding: '10px 16px',
                              }}
                            >
                              Ship
                            </button>
                            {staff.role === 'admin' && (
                              <button
                                onClick={() => {
                                  if (!productId) {
                                    alert('Missing product ID. Cannot cancel this order.');
                                    return;
                                  }
                                  handleOrders(order.id, productId, idx);
                                }}
                                style={{
                                  color: 'white',
                                  marginLeft: '20px',
                                  backgroundColor: 'red',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '1rem',
                                  padding: '10px 16px',
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No orders found for today.</p>
      )}
    </div>
  );
};

export default Dashboard;
