import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clearCart } from '../utils/cartUtils';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const paymentIntentStatus = searchParams.get('redirect_status');

    if (paymentIntentStatus === 'succeeded') {
      setStatus('success');
      clearCart();
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-8">
              Thank you for your purchase. Your enrollment is being processed and you can now access your courses.
            </p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#592b98] to-[#7c3aed] text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:from-[#4b2488] hover:to-[#6d28d9] transition-all active:scale-[0.98]"
            >
              Go to My Dashboard
            </button>
          </>
        ) : status === 'failed' ? (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-500 mb-8">
              Something went wrong with your payment. Please try again or use a different payment method.
            </p>
            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              Return to Cart
            </button>
          </>
        ) : (
          <div className="py-12">
            <svg className="animate-spin h-10 w-10 text-[#592b98] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500">Processing your payment status...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
