import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderTable.css';

const API_BASE_URL=process.env.REACT_APP_API_URL



const getColor = (date) => {
  if (!date) return 'black';
  const today = new Date();
  const due = new Date(date);
  const diff = (due - today) / (1000 * 60 * 60 * 24);
  if (diff < 1 && due.getDate() === today.getDate()) return 'red';
  if (diff <= 2) return 'orange';
  return 'green';
};

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const updateStatus = async (id, status) => {
    if (!id) {
      console.error("Missing id for status update");
      return;
    }
    try {
      await axios.put(`/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error('Status update error:', err.response?.data || err.message);
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (!order.ordereddate) return true; // ✅ show old data
const orderDate = new Date(order.ordereddate);
const formattedDate = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getDate().toString().padStart(2, '0')}`;
const matchesDate = !selectedDate || formattedDate === selectedDate;
    const matchesSearch = order.custname.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    return matchesDate && matchesSearch && matchesStatus;
  });

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Customer Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Delivered</option>
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>Bill No</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Work Amt</th>
              <th>Tailor Amt</th>
              <th>Advance</th>
              <th>Worker</th>
              <th>Model</th>
              <th>Sarees</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.custid}</td>
                <td>{order.custname}</td>
                <td>{order.phone}</td>
                <td>{order.workamt}</td>
                <td>{order.tailoramt}</td>
                <td>{order.advance}</td>
                <td>{order.worker}</td>
                <td>{order.model}</td>
                <td>{order.sarees}</td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Delivered</option>
                  </select>
                </td>
                <td>{order.remarks}</td>
                <td style={{ color: getColor(order.deliverydate) }}>
                  {order.deliverydate ? new Date(order.deliverydate).toLocaleDateString() : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
