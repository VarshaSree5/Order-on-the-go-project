import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../../styles/Profile.css';
import { GeneralContext } from '../../context/GeneralContext';
import axios from 'axios';

const Profile = () => {
  const { logout } = useContext(GeneralContext);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-orders');
      const filtered = response.data
        .filter((order) => order.userId === userId)
        .reverse();
      setOrders(filtered);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = async (id) => {
    try {
      await axios.put('http://localhost:6001/cancel-order', { id });
      alert('Order cancelled!');
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="profilePage">
      <div className="profileCard">
        <span>
          <h5>Username:</h5>
          <p>{username}</p>
        </span>
        <span>
          <h5>Email:</h5>
          <p>{email}</p>
        </span>
        <span>
          <h5>Orders:</h5>
          <p>{orders.length}</p>
        </span>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="profileOrders-container">
        <h3>Orders</h3>
        <div className="profileOrders">
          {orders.map((order) => (
            <div className="profileOrder" key={order._id}>
              <img src={order.foodItemImg} alt={order.foodItemName} />
              <div className="profileOrder-data">
                <h4>{order.foodItemName}</h4>
                <p>{order.restaurantName}</p>
                <div>
                  <span>
                    <p>
                      <b>Quantity:</b> {order.quantity}
                    </p>
                  </span>
                  <span>
                    <p>
                      <b>Total Price:</b> ₹
                      {parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}{' '}
                      <s>₹{order.price * order.quantity}</s>
                    </p>
                  </span>
                  <span>
                    <p>
                      <b>Payment mode:</b> {order.paymentMethod}
                    </p>
                  </span>
                </div>
                <div>
                  <span>
                    <p>
                      <b>Ordered on:</b> {order.orderDate.slice(0, 10)} Time:{' '}
                      {order.orderDate.slice(11, 16)}
                    </p>
                  </span>
                  <span>
                    <p>
                      <b>Status:</b> {order.orderStatus}
                    </p>
                  </span>
                </div>
                {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
