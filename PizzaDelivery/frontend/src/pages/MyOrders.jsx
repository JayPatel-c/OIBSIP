import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useScrollReveal from '../hooks/useScrollReveal';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useScrollReveal();

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.get('/orders/myorders');
      setOrders(res.data.data);
    } catch (err) {
      setError('Could not retrieve orders.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrders(true);

    // Setup polling every 5 seconds to meet Requirement 10: "real-time updates"
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Order Received':
        return 1;
      case 'In the Kitchen':
        return 2;
      case 'Sent to Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const steps = [
    { step: 1, label: 'Received' },
    { step: 2, label: 'Baking' },
    { step: 3, label: 'Out for Delivery' },
    { step: 4, label: 'Delivered' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div className="scroll-reveal" style={{ marginBottom: '35px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px' }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Track the journey of your custom gourmet pizza from the kitchen to your table. (Refreshes automatically)
        </p>
      </div>

      {loading && (
        <div className="flex-center" style={{ minHeight: '40vh', flexDirection: 'column', gap: '15px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your orders archive...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center card scroll-reveal-scale" style={{ padding: '60px 20px', color: 'var(--text-secondary)' }}>
          
          <h3>No Orders Found</h3>
          <p style={{ marginTop: '10px', marginBottom: '20px' }}>You haven't ordered any pizzas yet. Let's make one now!</p>
          <a href="/build" className="btn btn-primary">
            Build Pizza
          </a>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {orders.map((order, index) => {
            const currentStepNum = getStatusStep(order.status);
            return (
              <div
                key={order._id}
                className="order-tracker-card card card-animated animate-cascade"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                {/* Header info */}
                <div className="order-tracker-header flex-between" style={{ flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '18px' }}>
                      Order ID:{' '}
                      <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>
                        {order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                    </h4>
                    <small className="text-secondary">
                      Ordered on: {new Date(order.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--text-highlight)' }}>
                      ₹{order.totalAmount}
                    </div>
                    <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-progress'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items description */}
                <div className="order-tracker-items" style={{ marginBottom: '25px', padding: '10px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '5px' }}>
                  <h5 style={{ fontWeight: 600, marginBottom: '10px' }}>Items</h5>
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} style={{ fontSize: '14px', marginBottom: '8px', lineHeight: '1.4' }}>
                      {item.isCustom ? (
                        <div>
                          <strong>Custom Pizza</strong> (₹{item.price})
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '15px' }}>
                            Base: {item.customDetails.base?.name} • Sauce: {item.customDetails.sauce?.name} •
                            Cheese: {item.customDetails.cheese?.name} • Toppings:{' '}
                            {item.customDetails.veggies?.map((v) => v.name).join(', ') || 'None'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <strong>{item.pizza?.name}</strong> x{item.quantity} (₹{item.price})
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Visual order status step timeline */}
                <div className="status-timeline-container" style={{ marginTop: '20px' }}>
                  <div className="status-timeline-progress-bar">
                    <div
                      className="progress-line-fill"
                      style={{ width: `${((currentStepNum - 1) / 3) * 100}%` }}
                    ></div>
                  </div>
                  <div className="status-timeline-steps">
                    {steps.map((s) => (
                      <div
                        key={s.step}
                        className={`status-timeline-step ${
                          currentStepNum >= s.step ? 'active' : ''
                        } ${currentStepNum === s.step ? 'current' : ''}`}
                      >
                        <div className="timeline-node">{s.step}</div>
                        <div className="timeline-label">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
