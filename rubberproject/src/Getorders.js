import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Sellreport.css"
import "./Getorders.css";
import { useNavigate } from 'react-router-dom';

const Getorders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => {
        alert("Please log in to view your orders");
        navigate('/Login'); // Navigate to login if no token
      }, 0);
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='setter'>
      <div className="container py-5">
        <h2 className="text-center mb-4">All Orders</h2>
        {orders.length > 0 ? (
          <div className="row">
            <div className="col-12 mb-3">
              {/* Single Heading for All Orders */}
              <div className="row">
                <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2"><strong>Item Name</strong></div>
                <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2"><strong>Price</strong></div>
                <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2"><strong>Quantity</strong></div>
                <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2"><strong>GST</strong></div>
                <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2"><strong>Total Price</strong></div>
                <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2"><strong>Date</strong></div>
              </div>
            </div>

            {orders.map((order) => (
              <div key={order._id} className="col-12 mb-4">
                <div className="card order-card shadow-sm h-100">
                  <div className="card-body">
                    {/* Loop through each item in the order */}
                    {order.items.map((item, index) => (
                      <div key={index} className="row">
                        <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2">{item.name}</div>
                        <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2">₹{item.price}</div>
                        <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2">{item.quantity}</div>
                        <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2">₹{order.gst}</div>
                        <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2">₹{order.totalPrice}</div>
                        <div className="col-6 col-sm-4 col-md-2 col-lg-2 col-xl-2">{new Date(order.orderDate).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center" role="alert">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default Getorders;
