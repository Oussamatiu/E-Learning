import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, getCartTotal } from '../utils/cartUtils';
import api from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/payment/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems] = useState(getCart());
  const [clientSecret, setClientSecret] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true); // تبدأ بـ true لأننا سنبدأ الجلب فوراً

  const total = getCartTotal();

  // جلب الـ clientSecret تلقائياً عند تحميل المكون
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    const initializePayment = async () => {
      try {
        const res = await api.post('api/orders/checkout', {
          courses: cartItems.map(i => ({ id: i.id }))
        });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error(err);
        alert("Failed to initialize payment. Redirecting to cart...");
        navigate('/cart');
      } finally {
        setIsInitializing(false);
      }
    };

    initializePayment();
  }, [cartItems, navigate]);

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* الجانب الأيسر: منطقة الدفع */}
          <div className="w-full lg:w-7/12 xl:w-2/3">
            <div className="bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100 p-8 min-h-[400px] flex flex-col justify-center">
              
              {isInitializing ? (
                // واجهة تحميل احترافية أثناء جلب البيانات
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Securing your connection...</h2>
                  <p className="text-gray-500">Please wait while we initialize your secure payment gateway.</p>
                </div>
              ) : clientSecret ? (
                // إظهار نموذج الدفع فور توفر الـ clientSecret
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm total={total} />
                </Elements>
              ) : (
                <div className="text-center text-red-500">
                  Something went wrong. Please refresh the page.
                </div>
              )}

            </div>
          </div>

          {/* الجانب الأيمن: ملخص الطلب */}
          <div className="w-full lg:w-5/12 xl:w-1/3 sticky top-24">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Order Summary</h3>
              
              <div className="max-h-[300px] overflow-y-auto px-2 mb-6 space-y-4 scrollbar-thin">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm gap-4">
                    <span className="text-gray-600 truncate flex-1">{item.title}</span>
                    <span className="font-bold text-gray-900 shrink-0">${Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center px-2">
                <span className="text-gray-900 font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-[#592b98]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
