import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart, getCartTotal } from '../utils/cartUtils';
import api from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/payment/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      navigate('/cart');
    }
    setCartItems(items);
  }, [navigate]);

  const handlePaymentSuccess = async (paymentMethod) => {
    setIsCheckingOut(true);
    try {
      const response = await api.post('api/orders/checkout', {
        courses: cartItems.map(item => ({ id: item.id })),
        payment_method_id: paymentMethod.id
      });

      if (response.data.success) {
        clearCart();
        alert('Payment successful! Redirecting to your dashboard...');
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Error processing your order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = getCartTotal();

  if (cartItems.length === 0) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl font-semibold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your enrollment securely</p>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
          {/* Left Column: Payment Form */}
          <div className="w-full lg:w-7/12 xl:w-2/3 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
              <Elements stripe={stripePromise} options={{
                mode: 'payment',
                amount: Math.max(50, Math.round(total * 100)),
                currency: 'usd',
              }}>
                <CheckoutForm 
                  total={total} 
                  onSuccess={handlePaymentSuccess} 
                  onCancel={() => navigate('/cart')} 
                />
              </Elements>
            </div>
          </div>
          
          {/* Right Column: Order Summary Snapshot */}
          <div className="w-full lg:w-5/12 xl:w-1/3 flex-shrink-0 lg:sticky lg:top-24">
            <h3 className="text-lg font-medium text-gray-900 mb-4 px-2 hidden lg:block">Order Summary</h3>
            <div className="bg-white rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4 lg:hidden">Order Summary</h3>
              
              <div className="max-h-[40vh] overflow-y-auto pr-2 mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <img 
                      src={`http://127.0.0.1:8000/storage/${item.thumbnail}`} 
                      alt={item.title} 
                      className="w-14 h-14 object-cover rounded-md flex-shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.instructor}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 flex-shrink-0">
                      ${Number(item.price).toFixed(2) || '0.00'}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-gray-600">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="text-sm">Taxes</span>
                  <span className="text-sm font-medium">Calculated at next step</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-medium text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="font-medium text-2xl text-[#592b98] block">${total.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 font-normal">Including VAT</span>
                  </div>
                </div>
              </div>
            </div>
            
          
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CheckoutPage;
