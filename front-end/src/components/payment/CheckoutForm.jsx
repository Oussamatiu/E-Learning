import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ total, clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message);
        onError?.(stripeError.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Complete Your Payment</h3>
        <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
          <PaymentElement options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }} />
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}
      </div>

      <button
        disabled={loading || !stripe}
        className="w-full py-4 bg-gradient-to-r from-[#592b98] to-[#7c3aed] text-white font-bold rounded-2xl shadow-md hover:shadow-xl transition-all disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
             <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             Processing...
          </span>
        ) : `Pay $${total.toFixed(2)} Now`}
      </button>

      <p className="mt-4 text-center text-xs text-gray-400">
        🔒 Secured by Stripe. Your data is encrypted.
      </p>
    </form>
  );
};

export default CheckoutForm;
