import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ManageInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Custom adjust stock state
  const [adjustingId, setAdjustingId] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(10);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data.data);
    } catch (err) {
      setError('Could not retrieve inventory levels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (item) => {
    setError('');
    setSuccessMsg('');
    const newQty = item.quantity + Number(adjustAmount);

    if (newQty < 0) {
      return setError('Stock quantity cannot be negative!');
    }

    try {
      const res = await api.put(`/inventory/${item._id}`, { quantity: newQty });
      if (res.data.success) {
        setSuccessMsg(`Successfully adjusted ${item.name} stock level to ${newQty}!`);
        setAdjustingId(null);
        setAdjustAmount(10);
        // Refresh
        fetchInventory();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock level.');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '35px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px' }}>
          Manage Store Inventory
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor available ingredient quantities. Items marked with red alerts are below their safety warning threshold.
        </p>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh', flexDirection: 'column', gap: '15px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading inventory records...</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto', padding: '10px 20px' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Ingredient Name</th>
                <th>Stock Quantity</th>
                <th>Threshold Limit</th>
                <th>Price Addition</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isLow = item.quantity < item.threshold;
                return (
                  <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td>
                      <span className="badge" style={{ textTransform: 'capitalize', background: 'rgba(255,255,255,0.05)' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 'bold',
                          color: isLow ? 'var(--danger)' : 'var(--text-highlight)',
                          padding: '4px 8px',
                          background: isLow ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                          borderRadius: '3px',
                        }}
                      >
                        {item.quantity} {item.unit}
                      </span>
                      {isLow && (
                        <span style={{ color: 'var(--danger)', fontSize: '12px', marginLeft: '10px', fontWeight: 'bold' }}>
                          Low Stock!
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.threshold}</td>
                    <td>₹{item.price}</td>
                    <td style={{ textAlign: 'right' }}>
                      {adjustingId === item._id ? (
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="number"
                            style={{ width: '70px', padding: '5px' }}
                            value={adjustAmount}
                            onChange={(e) => setAdjustAmount(e.target.value)}
                          />
                          <button onClick={() => handleAdjustStock(item)} className="btn btn-primary btn-sm">
                            Save
                          </button>
                          <button onClick={() => setAdjustingId(null)} className="btn btn-secondary btn-sm">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAdjustingId(item._id);
                            setAdjustAmount(10);
                          }}
                          className="btn btn-accent btn-sm"
                        >
                          ➕ Restock Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageInventory;
