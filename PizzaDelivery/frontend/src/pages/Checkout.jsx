import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import useScrollReveal from '../hooks/useScrollReveal';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  useScrollReveal();
  
  // Retrieve checkout items passed from menu or builder state
  const { orderItems, totalAmount } = location.state || { orderItems: [], totalAmount: 0 };

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Overlay state for simulation checkout
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simulationDetails, setSimulationDetails] = useState(null);

  if (orderItems.length === 0) {
    return (
      <div className="container text-center" style={{ padding: '80px 20px', minHeight: '80vh' }}>
        <h2>No Items In Checkout</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Please go back to varieties or build custom pizza.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          View Menu
        </button>
      </div>
    );
  }

  // Handle Order Placement directly after signature verification
  const handlePlaceOrder = async (payDetails) => {
    try {
      const orderPayload = {
        items: orderItems.map((item) => {
          if (item.isCustom) {
            return {
              isCustom: true,
              price: item.price,
              quantity: item.quantity,
              customDetails: {
                base: item.customDetails.base._id,
                sauce: item.customDetails.sauce._id,
                cheese: item.customDetails.cheese._id,
                veggies: item.customDetails.veggies.map((v) => v._id),
              },
            };
          } else {
            return {
              isCustom: false,
              pizza: item.pizza._id,
              quantity: item.quantity,
              price: item.price,
            };
          }
        }),
        totalAmount,
        paymentDetails: payDetails,
        shippingAddress: { address, city, postalCode },
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-orders');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register your order on database.');
      setLoading(false);
    }
  };

  const handleCheckoutPayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!address || !city || !postalCode) {
      return setError('Please fill in complete shipping address.');
    }

    setLoading(true);

    try {
      // Step 1: Create Razorpay Order
      const checkRes = await api.post('/payment/checkout', { amount: totalAmount });
      const orderData = checkRes.data;

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create checkout order');
      }

      // Step 2: Check if using mock simulation mode
      if (orderData.isMock || !window.Razorpay) {
        console.log('Using simulated checkout modal overlay...');
        setSimulationDetails(orderData);
        setShowSimulateModal(true);
        return;
      }

      // Step 3: Trigger real Razorpay browser popup modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Pizza Crafters Ltd.',
        description: 'Artisan Custom Pizza Order Delivery',
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verification
          try {
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              isMock: false,
            };
            
            const verifyRes = await api.post('/payment/verify', verifyPayload);
            if (verifyRes.data.success) {
              await handlePlaceOrder({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            } else {
              throw new Error('Payment signature verification failed.');
            }
          } catch (err) {
            setError(err.message || 'Payment verification failed.');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '9999999999',
        },
        theme: {
          color: '#319795',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment was cancelled by the user.');
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      setError(err.message || 'Failed to initiate Razorpay checkout flow.');
      setLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    setShowSimulateModal(false);
    
    try {
      const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 12)}`;
      const mockSignature = `sig_mock_${Math.random().toString(36).substring(2, 12)}`;
      
      const verifyPayload = {
        razorpayOrderId: simulationDetails.orderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSignature,
        isMock: true,
      };

      const verifyRes = await api.post('/payment/verify', verifyPayload);
      if (verifyRes.data.success) {
        await handlePlaceOrder({
          razorpayOrderId: simulationDetails.orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: mockSignature,
        });
      } else {
        throw new Error('Simulation signature verification failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed simulated payment validation.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <h1 className="scroll-reveal" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', marginBottom: '30px' }}>
        Checkout Order
      </h1>

      {success && (
        <div className="alert alert-success text-center scroll-reveal-scale" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          
          <h2 style={{ marginBottom: '10px' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            We've received your payment. Your custom pizza is now heading to the oven!
          </p>
          <p style={{ marginTop: '20px', fontSize: '14px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            Redirecting to order tracking dashboard in a few seconds...
          </p>
        </div>
      )}

      {!success && (
        <div className="checkout-grid">
          {/* Left Form: Delivery Address */}
          <div className="checkout-address card scroll-reveal-left" data-delay="100">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
              Delivery Details
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleCheckoutPayment}>
              <div className="form-group">
                <label htmlFor="address">Delivery Street Address</label>
                <textarea
                  id="address"
                  placeholder="e.g. Flat No, Wing, Building Name, Local Area Road"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zip">Postal ZIP Code</label>
                  <input
                    type="text"
                    id="zip"
                    placeholder="e.g. 400001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="payment-notice" style={{ marginTop: '20px' }}>
                <span className="notice-icon"></span>
                <p>
                  Payments are secure and processed in <strong>Razorpay Test Mode</strong>. No real money will be charged.
                </p>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg pulse" style={{ marginTop: '30px' }} disabled={loading}>
                {loading ? 'Initiating Transaction...' : `Pay & Confirm Order (₹${totalAmount})`}
              </button>
            </form>
          </div>

          {/* Right Panel: Receipt Review */}
          <div className="checkout-receipt card scroll-reveal-right" data-delay="200">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
              Order Review
            </h3>

            <div className="checkout-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orderItems.map((item, index) => (
                <div key={index} className="checkout-item-review" style={{ display: 'flex', gap: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>
                  {item.isCustom ? (
                    <div>
                      <h4 style={{ fontWeight: 600, color: 'var(--accent)' }}>Customized Gourmet Pizza</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '5px', lineHeight: '1.4' }}>
                        Crust: {item.customDetails.base.name} <br />
                        Sauce: {item.customDetails.sauce.name} <br />
                        Cheese: {item.customDetails.cheese.name} <br />
                        Toppings:{' '}
                        {item.customDetails.veggies.length > 0
                          ? item.customDetails.veggies.map((v) => v.name).join(', ')
                          : 'None'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{item.pizza.name}</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '5px' }}>
                        Standard Recipe Variety • Qty: {item.quantity}
                      </p>
                    </div>
                  )}
                  <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>₹{item.price}</div>
                </div>
              ))}
            </div>

            <div className="summary-row" style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total Payable Amount</span>
              <span className="text-highlight">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Razorpay Overlay Modal */}
      {showSimulateModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in text-center" style={{ maxWidth: '400px', border: '2px solid var(--accent)' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '15px' }}>Razorpay Simulation</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.5' }}>
              We've triggered simulated checkout because you are using <strong>Test Sandbox Mode</strong> (no API keys or offline environment).
            </p>
            <div className="simulation-details-box" style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px', textAlign: 'left', marginBottom: '25px', fontSize: '13px' }}>
              <p><strong>Payable:</strong> ₹{totalAmount}</p>
              <p><strong>Order ID:</strong> {simulationDetails?.orderId}</p>
              <p><strong>Customer:</strong> {user?.name}</p>
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={handleSimulateSuccess} className="btn btn-primary">
                Simulate Success
              </button>
              <button
                onClick={() => {
                  setShowSimulateModal(false);
                  setLoading(false);
                  setError('Payment simulation cancelled by user.');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
