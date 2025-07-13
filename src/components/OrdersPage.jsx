import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("https://tailoring-backend-1.onrender.com")
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  const getColor = (dateStr) => {
    const today = new Date();
    const delivery = new Date(dateStr);
    const diff = (delivery - today) / (1000 * 60 * 60 * 24);
    if (diff <= 0) return 'red';
    if (diff <= 2) return 'yellow';
    return 'green';
  };

  return (
    <div>
      <h2>Orders List</h2>
      {orders.map(order => (
        <div
          key={order.custid}
          style={{
            backgroundColor: getColor(order.deliverydate),
            padding: '10px',
            margin: '10px 0',
            borderRadius: '6px'
          }}
        >
          <strong>ID:</strong> {order.custid} | <strong>Name:</strong> {order.custname} | <strong>Status:</strong> {order.status}
        </div>
      ))}
    </div>
  );
}
