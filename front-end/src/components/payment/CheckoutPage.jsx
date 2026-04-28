import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { getCart, clearCart } from '../../utils/cartUtils';
import { useNavigate } from 'react-router-dom';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [courseIds, setCourseIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    setCartItems(cart);
    setTotal(cart.reduce((sum, item) => sum + (item.price || 0), 0));
    setCourseIds(cart.map(item => item.id));
  }, [navigate]);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // Clear cart on successful payment
    clearCart();
    // Redirect to success page
    navigate('/payment-success', {
      state: {
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        courses: cartItems
      }
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // You can show a toast notification here
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/courses')}
            className="bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#6d28d9]"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Order Summary -->
            <div className="lg:border-r lg:pr-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h1>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📚</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-gray-600 text-xs">{item.instructor}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">${item.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[#7c3aed]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- Payment Form -->
            <div>
              <Elements stripe={stripePromise} options={{
                mode: 'payment',
                amount: Math.round(total * 100),
                currency: 'usd',
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#7c3aed',
                    colorBackground: '#ffffff',
                    colorText: '#1f2937',
                    colorDanger: '#ef4444',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                  }
                }
              }}>
                <CheckoutForm
                  courseIds={courseIds}
                  total={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;