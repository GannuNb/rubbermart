import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Adminnav from './Adminnav';

function Adminshipping() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/orders`);
        const ordersWithShipping = await Promise.all(
          response.data.map(async (order) => {
            const shippingResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/shipping/${order._id}`
            );
            return {
              ...order,
              shippingDetails: shippingResponse.data,
            };
          })
        );
        setOrders(ordersWithShipping);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleInputChange = (orderId, e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [orderId]: {
        ...prevValues[orderId],
        [name]: value,
      },
    }));
  };

  const handleShip = async (orderId) => {
    const orderInput = inputValues[orderId] || {};
    const { vehicleNumber, quantity, selectedProduct } = orderInput;

    if (!vehicleNumber || !quantity || !selectedProduct) {
      alert('Please enter vehicle number, quantity, and select a product.');
      return;
    }

    const shippingData = {
      vehicleNumber,
      quantity,
      selectedProduct,
      orderId,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/shipping`, shippingData);
      console.log('Shipping data stored:', response.data);
      alert('Shipping data stored successfully!');
    } catch (err) {
      console.error('Error during shipping:', err);
      setError('Failed to store shipping information.');
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Adminnav />
      <div>
        <h3 className="mt-5">All Orders</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Subtotal</th>
              <th>GST</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Vehicle Number</th>
              <th>Quantity</th>
              <th>Product</th>
              <th>Ship</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td>{order._id}</td>
                  <td>{order.user?.email || 'N/A'}</td>
                  <td>{order.subtotal}</td>
                  <td>{order.gst}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={inputValues[order._id]?.vehicleNumber || ''}
                      onChange={(e) => handleInputChange(order._id, e)}
                      placeholder="Enter vehicle number"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="quantity"
                      value={inputValues[order._id]?.quantity || ''}
                      onChange={(e) => handleInputChange(order._id, e)}
                      placeholder="Enter quantity"
                      className="form-control"
                    />
                  </td>
                  <td>
                    <select
                      name="selectedProduct"
                      value={inputValues[order._id]?.selectedProduct || ''}
                      onChange={(e) => handleInputChange(order._id, e)}
                      className="form-control"
                    >
                      <option value="">Select Product</option>
                      {order.items.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleShip(order._id)}
                      className="btn btn-success"
                    >
                      Ship
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="11">
                    <table className="table table-bordered mt-2">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Shipped Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => {
                          const shippedQuantity = order.shippingDetails
                            .filter((shipping) => shipping.selectedProduct === item.name)
                            .reduce((total, shipping) => total + shipping.quantity, 0);

                          return (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>{shippedQuantity}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Adminshipping;
