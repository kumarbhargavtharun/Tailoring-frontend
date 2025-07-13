import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceOrderForm.css';

const API_BASE_URL=process.env.REACT_APP_API_URL

const ServiceOrderForm = () => {
  const [custid, setCustid] = useState('');
  const [custname, setCustname] = useState('');
  const [phone, setPhone] = useState('');
  const [workamt, setWorkamt] = useState('');
  const [tailoringEnabled, setTailoringEnabled] = useState(false);
  const [tailoramt, setTailoramt] = useState('');
  const [advance, setAdvance] = useState('');
  const [worker, setWorker] = useState('');
  const [model, setModel] = useState('');
  const [sarees, setSarees] = useState('');
  const [remarks, setRemarks] = useState('');
  const [deliverydate, setDeliverydate] = useState(new Date().toISOString().split('T')[0]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchCustId();
    fetchOrders();
  }, []);

  const fetchCustId = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/next-custid`);
      setCustid(res.data.nextCustId);
    } catch (err) {
      console.error('Fetch custid error:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    }
  };

  const resetForm = () => {
    fetchCustId();
    setCustname('');
    setPhone('');
    setWorkamt('');
    setTailoramt('');
    setAdvance('');
    setWorker('');
    setModel('');
    setSarees('');
    setRemarks('');
    setDeliverydate(new Date().toISOString().split('T')[0]);
    setTailoringEnabled(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/orders', {
        custid,
        custname,
        phone,
        workamt: workamt || null,
        tailoramt: tailoringEnabled ? (tailoramt || 600) : null,
        advance: advance || null,
        worker,
        model,
        sarees,
        status: 'Pending',
        remarks: remarks || null,
        deliverydate,
        ordereddate: new Date().toISOString().split('T')[0]
      });
      fetchOrders();
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit order');
    }
  };

  const todayDate = new Date();
  const formattedToday = `${todayDate.getFullYear()}-${(todayDate.getMonth() + 1).toString().padStart(2, '0')}-${todayDate.getDate().toString().padStart(2, '0')}`;

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.ordereddate);
    const formattedOrderDate = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getDate().toString().padStart(2, '0')}`;
    return formattedOrderDate === formattedToday;
  });

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Service Order Form</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Bill No</label>
          <input type="text" className="form-control" value={custid} readOnly />
        </div>
        <div className="col-md-4">
          <label className="form-label">Customer Name</label>
          <input type="text" className="form-control" value={custname} onChange={(e) => setCustname(e.target.value)} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Phone</label>
          <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>

        <div className="col-md-4">
          <label className="form-label">Work Amount</label>
          <input type="number" className="form-control" value={workamt} onChange={(e) => setWorkamt(e.target.value)} />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input me-2"
            checked={tailoringEnabled}
            onChange={(e) => {
              setTailoringEnabled(e.target.checked);
              if (e.target.checked) {
                setTailoramt('600');
              } else {
                setTailoramt('');
              }
            }}
          />
          <label className="form-check-label me-2">Tailoring</label>
          <input
            type="number"
            className="form-control"
            value={tailoramt}
            onChange={(e) => setTailoramt(e.target.value)}
            disabled={!tailoringEnabled}
            style={{ flex: 1 }}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Advance</label>
          <input type="number" className="form-control" value={advance} onChange={(e) => setAdvance(e.target.value)} />
        </div>

        <div className="col-md-4">
          <label className="form-label">Worker</label>
          <input type="text" className="form-control" value={worker} onChange={(e) => setWorker(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Model</label>
          <input type="text" className="form-control" value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Delivery Date</label>
          <input
            type="date"
            className="form-control"
            value={deliverydate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDeliverydate(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Sarees</label>
          <input type="text" className="form-control" value={sarees} onChange={(e) => setSarees(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Remarks</label>
          <input type="text" className="form-control" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </div>
      </form>

      <h4 className="mt-4">Today's Orders</h4>
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
              <th>Remarks</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {todayOrders.map(order => (
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
                <td>{order.remarks}</td>
                <td>{new Date(order.deliverydate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceOrderForm;
