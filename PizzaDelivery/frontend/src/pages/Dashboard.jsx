import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await api.get('/pizzas');
        setPizzas(res.data.data);
      } catch (err) {
        setError('Could not retrieve pizza varieties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const handleOrderInstantly = (pizza) => {
    // Navigate to checkout with this single standard pizza item
    navigate('/checkout', {
      state: {
        orderItems: [
          {
            isCustom: false,
            pizza: pizza,
            quantity: 1,
            price: pizza.price,
          },
        ],
        totalAmount: pizza.price,
      },
    });
  };

  const filteredPizzas = pizzas.filter((p) => {
    if (categoryFilter === 'All') return true;
    return p.category === categoryFilter;
  });

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div className="flex-between" style={{ marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px' }}>
            Pizza Varieties
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Choose from our premium pre-crafted gourmet selection or make your own!
          </p>
        </div>

        {/* Custom Customization Callout */}
        <button onClick={() => navigate('/build')} className="btn btn-accent pulse">
          Custom Pizza Builder
        </button>
      </div>

      {/* Category filters */}
      <div className="filter-bar" style={{ marginBottom: '30px' }}>
        {['All', 'Veg', 'Non-Veg'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
          >
            {cat} Pizzas
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex-center" style={{ minHeight: '40vh', flexDirection: 'column', gap: '15px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading our delicious selection...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && filteredPizzas.length === 0 && (
        <div className="text-center" style={{ padding: '60px 0', color: 'var(--text-secondary)' }}>
          
          <p style={{ marginTop: '15px' }}>No pizzas available in this category right now.</p>
        </div>
      )}

      {!loading && !error && filteredPizzas.length > 0 && (
        <div className="pizza-grid">
          {filteredPizzas.map((pizza) => (
            <div key={pizza._id} className="pizza-card card animate-fade-in">
              <div className="pizza-image-container">
                <img
                  src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600'}
                  alt={pizza.name}
                  className="pizza-image"
                />
                <span className={`pizza-badge ${pizza.category === 'Veg' ? 'veg' : 'non-veg'}`}>
                  {pizza.category}
                </span>
              </div>
              <div className="pizza-details">
                <h3 className="pizza-name">{pizza.name}</h3>
                <p className="pizza-desc">{pizza.description}</p>
                <div className="pizza-footer flex-between">
                  <span className="pizza-price">₹{pizza.price}</span>
                  <button onClick={() => handleOrderInstantly(pizza)} className="btn btn-primary btn-sm">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
