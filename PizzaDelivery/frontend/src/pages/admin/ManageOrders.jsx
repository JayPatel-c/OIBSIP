import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAllOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data);
    } catch (err) {
      setError('Could not retrieve incoming orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setSuccessMsg(`Order status updated successfully to "${newStatus}"!`);
        // Refresh orders list
        fetchAllOrders();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const statusOptions = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '35px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px' }}>
          Manage Pizza Orders Panel
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review placed orders, shipping details, and modify cooking stages. Status changes are pushed to users in real time.
        </p>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh', flexDirection: 'column', gap: '15px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading incoming order sheets...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center card" style={{ padding: '50px 0', color: 'var(--text-secondary)' }}>
          <h3>No Orders Registered</h3>
          <p>Orders will show up here as soon as users place checkouts.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {orders.map((order) => (
            <div key={order._id} className="order-tracker-card card animate-fade-in" style={{ borderLeft: `4px solid ${order.status === 'Delivered' ? '#48bb78' : '#319795'}` }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>
                    Order ID:{' '}
                    <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>
                      {order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                  </h4>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    Customer: <strong>{order.user?.name}</strong> • Phone: {order.user?.phone} • Email: {order.user?.email}
                  </small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{order.totalAmount}</div>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    Payment: <span style={{ color: '#48bb78', fontWeight: 'bold' }}>{order.paymentStatus}</span>
                  </small>
                </div>
              </div>

              {/* Items and Address grid */}
              <div className="builder-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px 18px', borderRadius: '5px' }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '8px' }}>Items</h5>
                  {order.items.map((item, index) => (
                    <div key={index} style={{ fontSize: '13px', marginBottom: '6px' }}>
                      {item.isCustom ? (
                        <div>
                          <strong>Custom Pizza:</strong> Crust: {item.customDetails?.base?.name} • Sauce:{' '}
                          {item.customDetails?.sauce?.name} • Cheese: {item.customDetails?.cheese?.name} • Toppings:{' '}
                          {item.customDetails?.veggies?.map((v) => v.name).join(', ') || 'None'}
                        </div>
                      ) : (
                        <div>
                          <strong>{item.pizza?.name}</strong> x{item.quantity} (₹{item.price})
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px 18px', borderRadius: '5px', fontSize: '13px' }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '8px' }}>Delivery Address</h5>
                  <p>{order.shippingAddress?.address}</p>
                  <p>
                    {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>

              {/* Status Update controls */}
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '15px', paddingTop: '15px', borderTop: '1px dashed var(--border)' }}>
                <div>
                  Status Check: <span className="badge badge-progress">{order.status}</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <label htmlFor={`status-select-${order._id}`} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Update Stage:
                  </label>
                  <select
                    id={`status-select-${order._id}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
