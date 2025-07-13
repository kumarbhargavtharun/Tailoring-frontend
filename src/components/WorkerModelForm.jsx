// src/components/WorkerModelForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const WorkerModelForm = () => {
  const [id, setId] = useState('');
  const [worker, setWorker] = useState('');
  const [model, setModel] = useState('');

  const update = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/update-worker-model`, {
        worker,
        model,
      });
      alert('Updated worker/model');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Update Worker & Model</h2>
      <input
        type="text"
        placeholder="Order ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Worker"
        value={worker}
        onChange={(e) => setWorker(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <button onClick={update}>Update</button>
    </div>
  );
};

export default WorkerModelForm;
