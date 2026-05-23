import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useScrollReveal from '../hooks/useScrollReveal';

const BuildPizza = () => {
  const [ingredients, setIngredients] = useState({ bases: [], sauces: [], cheese: [], veggies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom builder states
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  
  // Base cost of a custom pizza structure
  const baseCost = 150; 
  const [currentStep, setCurrentStep] = useState(1); // Steps: 1 (Base), 2 (Sauce), 3 (Cheese), 4 (Veggies), 5 (Review)
  const navigate = useNavigate();
  useScrollReveal();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get('/pizzas/ingredients');
        setIngredients(res.data.data);
        
        // Auto-select defaults
        if (res.data.data.bases.length > 0) setSelectedBase(res.data.data.bases[0]);
        if (res.data.data.sauces.length > 0) setSelectedSauce(res.data.data.sauces[0]);
        if (res.data.data.cheese.length > 0) setSelectedCheese(res.data.data.cheese[0]);
      } catch (err) {
        setError('Could not retrieve custom builder ingredients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleVeggieToggle = (veggie) => {
    const isSelected = selectedVeggies.some((v) => v._id === veggie._id);
    if (isSelected) {
      setSelectedVeggies(selectedVeggies.filter((v) => v._id !== veggie._id));
    } else {
      setSelectedVeggies([...selectedVeggies, veggie]);
    }
  };

  const calculateTotalPrice = () => {
    let total = baseCost;
    if (selectedBase) total += selectedBase.price;
    if (selectedSauce) total += selectedSauce.price;
    if (selectedCheese) total += selectedCheese.price;
    selectedVeggies.forEach((v) => {
      total += v.price;
    });
    return total;
  };

  const handleProceedToCheckout = () => {
    const totalPrice = calculateTotalPrice();
    
    // Construct customized pizza item
    const customPizzaItem = {
      isCustom: true,
      price: totalPrice,
      quantity: 1,
      customDetails: {
        base: selectedBase,
        sauce: selectedSauce,
        cheese: selectedCheese,
        veggies: selectedVeggies,
      },
    };

    navigate('/checkout', {
      state: {
        orderItems: [customPizzaItem],
        totalAmount: totalPrice,
      },
    });
  };

  const steps = [
    { num: 1, label: 'Base Selection' },
    { num: 2, label: 'Zesty Sauce' },
    { num: 3, label: 'Gourmet Cheese' },
    { num: 4, label: 'Fresh Toppings' },
    { num: 5, label: 'Summary & Order' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div className="scroll-reveal" style={{ marginBottom: '35px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px' }}>
          Custom Pizza Builder
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Design your dream pizza in 5 easy steps. All custom pizzas start at base ₹150 + ingredients.
        </p>
      </div>

      {loading && (
        <div className="flex-center" style={{ minHeight: '40vh', flexDirection: 'column', gap: '15px' }}>
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading ingredients kitchen...</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="builder-layout">
          {/* Progress Bar / Steps */}
          <div className="builder-progress-bar scroll-reveal" data-delay="100">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`progress-step-btn ${currentStep === s.num ? 'active' : ''} ${
                  currentStep > s.num ? 'completed' : ''
                }`}
              >
                <span className="step-number">{s.num}</span>
                <span className="step-label">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="builder-grid">
            {/* Left Side: Step Content Panels */}
            <div className="builder-panel card scroll-reveal-left" data-delay="200">
              {/* Step 1: Bases */}
              {currentStep === 1 && (
                <div>
                  <h2 className="step-heading">Step 1: Choose Your Pizza Base</h2>
                  <p className="step-subheading">Select one fresh gourmet crust option from below:</p>
                  <div className="ingredients-selector-list stagger-children">
                    {ingredients.bases.map((base, i) => (
                      <div
                        key={base._id}
                        onClick={() => setSelectedBase(base)}
                        className={`ingredient-option-card scroll-reveal ${selectedBase?._id === base._id ? 'selected' : ''}`}
                        data-delay={i * 80}
                      >
                        <div className="flex-between">
                          <strong>{base.name}</strong>
                          <span className="price-tag">+{base.price > 0 ? `₹${base.price}` : 'Free'}</span>
                        </div>
                        <small className="text-secondary">Quantity in stock: {base.quantity} {base.unit}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Sauces */}
              {currentStep === 2 && (
                <div>
                  <h2 className="step-heading">Step 2: Choose Your Pizza Sauce</h2>
                  <p className="step-subheading">Select your signature sauce coating base flavor:</p>
                  <div className="ingredients-selector-list stagger-children">
                    {ingredients.sauces.map((sauce, i) => (
                      <div
                        key={sauce._id}
                        onClick={() => setSelectedSauce(sauce)}
                        className={`ingredient-option-card scroll-reveal ${selectedSauce?._id === sauce._id ? 'selected' : ''}`}
                        data-delay={i * 80}
                      >
                        <div className="flex-between">
                          <strong>{sauce.name}</strong>
                          <span className="price-tag">+{sauce.price > 0 ? `₹${sauce.price}` : 'Free'}</span>
                        </div>
                        <small className="text-secondary">Quantity in stock: {sauce.quantity} {sauce.unit}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Cheeses */}
              {currentStep === 3 && (
                <div>
                  <h2 className="step-heading">Step 3: Select Cheese Type</h2>
                  <p className="step-subheading">Artisan real cheese melting options:</p>
                  <div className="ingredients-selector-list stagger-children">
                    {ingredients.cheese.map((ch, i) => (
                      <div
                        key={ch._id}
                        onClick={() => setSelectedCheese(ch)}
                        className={`ingredient-option-card scroll-reveal ${selectedCheese?._id === ch._id ? 'selected' : ''}`}
                        data-delay={i * 80}
                      >
                        <div className="flex-between">
                          <strong>{ch.name}</strong>
                          <span className="price-tag">+{ch.price > 0 ? `₹${ch.price}` : 'Free'}</span>
                        </div>
                        <small className="text-secondary">Quantity in stock: {ch.quantity} {ch.unit}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Veggies & Toppings */}
              {currentStep === 4 && (
                <div>
                  <h2 className="step-heading">Step 4: Opt Veggies & Premium Meats</h2>
                  <p className="step-subheading">Layer as many fresh toppings as you like:</p>
                  <div className="ingredients-selector-list select-multi stagger-children">
                    {ingredients.veggies.map((veg, i) => {
                      const isSelected = selectedVeggies.some((v) => v._id === veg._id);
                      return (
                        <div
                          key={veg._id}
                          onClick={() => handleVeggieToggle(veg)}
                          className={`ingredient-option-card multi-select scroll-reveal ${isSelected ? 'selected' : ''}`}
                          data-delay={i * 80}
                        >
                          <div className="flex-between">
                            <strong>{veg.name}</strong>
                            <span className="price-tag">+₹{veg.price}</span>
                          </div>
                          <small className="text-secondary">Quantity in stock: {veg.quantity} {veg.unit}</small>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Summary Review */}
              {currentStep === 5 && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <h2 className="step-heading">Step 5: Review & Craft</h2>
                  <p className="step-subheading" style={{ marginBottom: '30px' }}>
                    Double check your pizza recipe combinations below:
                  </p>

                  <div className="review-box scroll-reveal-scale animate-glow" style={{ maxWidth: '400px', margin: '0 auto 30px', textAlign: 'left' }}>
                    <p>🔥 <strong>Crust:</strong> {selectedBase?.name}</p>
                    <p>🍅 <strong>Sauce:</strong> {selectedSauce?.name}</p>
                    <p>🧀 <strong>Cheese:</strong> {selectedCheese?.name}</p>
                    <p>
                      🌿 <strong>Toppings:</strong>{' '}
                      {selectedVeggies.length > 0
                        ? selectedVeggies.map((v) => v.name).join(', ')
                        : 'No additional toppings chosen.'}
                    </p>
                  </div>

                  <button onClick={handleProceedToCheckout} className="btn btn-primary btn-lg pulse">
                    Proceed to Payment (₹{calculateTotalPrice()})
                  </button>
                </div>
              )}

              {/* Nav Buttons */}
              <div className="builder-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                {currentStep > 1 && (
                  <button onClick={() => setCurrentStep(currentStep - 1)} className="btn btn-secondary">
                    ← Back Step
                  </button>
                )}
                {currentStep < 5 && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="btn btn-primary"
                    style={{ marginLeft: 'auto' }}
                  >
                    Next Step →
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Running Receipt Summary */}
            <div className="builder-summary-panel card scroll-reveal-right" data-delay="300">
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '15px' }}>
                Order Summary
              </h3>

              <div className="summary-row">
                <span>Base Custom Pizza Cost</span>
                <span>₹{baseCost}</span>
              </div>

              {selectedBase && (
                <div className="summary-row sub-item">
                  <span>↳ Crust: {selectedBase.name}</span>
                  <span>{selectedBase.price > 0 ? `+₹${selectedBase.price}` : 'Free'}</span>
                </div>
              )}

              {selectedSauce && (
                <div className="summary-row sub-item">
                  <span>↳ Sauce: {selectedSauce.name}</span>
                  <span>{selectedSauce.price > 0 ? `+₹${selectedSauce.price}` : 'Free'}</span>
                </div>
              )}

              {selectedCheese && (
                <div className="summary-row sub-item">
                  <span>↳ Cheese: {selectedCheese.name}</span>
                  <span>{selectedCheese.price > 0 ? `+₹${selectedCheese.price}` : 'Free'}</span>
                </div>
              )}

              {selectedVeggies.map((v) => (
                <div key={v._id} className="summary-row sub-item">
                  <span>↳ Topping: {v.name}</span>
                  <span>+₹{v.price}</span>
                </div>
              ))}

              <div
                className="summary-row total"
                style={{
                  marginTop: '20px',
                  paddingTop: '15px',
                  borderTop: '2px dashed var(--border)',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                <span>Estimated Total:</span>
                <span className="text-highlight">₹{calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildPizza;
