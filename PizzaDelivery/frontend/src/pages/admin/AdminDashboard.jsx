import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ ordersCount: 0, revenue: 0, lowStockCount: 0 });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [ordersRes, inventoryRes] = await Promise.all([
          api.get('/orders'),
          api.get('/inventory'),
        ]);

        const allOrders = ordersRes.data.data;
        const inventory = inventoryRes.data.data;

        // Calculate stats
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const lowStock = inventory.filter((item) => item.quantity < item.threshold);

        setStats({
          ordersCount: allOrders.length,
          revenue: totalRevenue,
          lowStockCount: lowStock.length,
        });
        
        setLowStockItems(lowStock);
      } catch (error) {
        console.error('Error loading admin details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '35px' }}>
        <span className="badge badge-admin" style={{ marginBottom: '10px' }}>Store Admin Workspace</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px' }}>
          Admin Management Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor store statistics, restock pizza ingredients, and change live orders delivery status.
        </p>
      </div>

      {loading && (
        <div className="flex-center" style={{ minHeight: '30vh', flexDirection: 'column', gap: '15px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading hub statistics...</p>
        </div>
      )}

      {!loading && (
        <div>
          {/* Stats Grid */}
          <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div className="card text-center" style={{ padding: '25px' }}>
              
              <h3 style={{ fontSize: '28px', color: 'var(--text-highlight)' }}>{stats.ordersCount}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Total Orders Placed</p>
            </div>
            <div className="card text-center" style={{ padding: '25px' }}>
              
              <h3 style={{ fontSize: '28px', color: 'var(--text-highlight)' }}>₹{stats.revenue}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Store Gross Revenue</p>
            </div>
            <div className="card text-center" style={{ padding: '25px', border: stats.lowStockCount > 0 ? '1px solid var(--danger)' : '1px solid var(--border)' }}>
              
              <h3 style={{ fontSize: '28px', color: stats.lowStockCount > 0 ? 'var(--danger)' : 'var(--text-highlight)' }}>
                {stats.lowStockCount}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Low Stock Warnings</p>
            </div>
          </div>

          <div className="builder-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
            {/* Quick Actions Panel */}
            <div className="card" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '25px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                Quick Hub Navigations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600 }}>Active Orders Tracking</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Update stages of user orders from received to baking and delivery.
                    </p>
                  </div>
                  <Link to="/admin/orders" className="btn btn-primary btn-sm">
                    Manage Orders
                  </Link>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600 }}>Inventory Warehouse</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Keep track of crusts, sauces, cheese quantities, and restock.
                    </p>
                  </div>
                  <Link to="/admin/inventory" className="btn btn-primary btn-sm">
                    Manage Inventory
                  </Link>
                </div>
              </div>
            </div>

            {/* Critical Stock Alert Dashboard */}
            <div className="card" style={{ padding: '30px', border: stats.lowStockCount > 0 ? '1px dashed var(--danger)' : '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '20px', color: stats.lowStockCount > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                Low Stock Alerts
              </h3>
              
              {lowStockItems.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  
                  <p style={{ fontSize: '14px' }}>All ingredients stock levels are safe.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    The following ingredients have fallen below the low-stock alert threshold:
                  </p>
                  {lowStockItems.slice(0, 4).map((item) => (
                    <div key={item._id} className="flex-between" style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '5px', fontSize: '13px', borderLeft: '3px solid var(--danger)' }}>
                      <div>
                        <strong>{item.name}</strong> ({item.category})
                      </div>
                      <div>
                        Stock: <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{item.quantity}</span> / {item.threshold}
                      </div>
                    </div>
                  ))}
                  {lowStockItems.length > 4 && (
                    <Link to="/admin/inventory" style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '10px', display: 'block', textAlign: 'right' }}>
                      View all {lowStockItems.length} alerts →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
