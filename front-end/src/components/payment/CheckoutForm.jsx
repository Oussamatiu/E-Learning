import React, { useState } from 'react';
import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ total, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    // Use elements to create the PaymentMethod
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    if (stripeError) {
      setError(stripeError.message);
      setIsProcessing(false);
    } else {
      setError(null);
      // Since we are mocking the backend, we simulate success
      console.log('PaymentMethod:', paymentMethod);
      
      // Simulate API call to backend
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(paymentMethod);
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl flex flex-col">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100 shadow-sm">
          <svg className="w-6 h-6 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">Secure Checkout</h3>
        <p className="text-sm text-gray-500 mt-2">
          Complete your purchase of <span className="font-medium text-gray-900">${total?.toFixed(2) || '0.00'}</span>
        </p>
      </div>

      <div className="mb-8">
        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 shadow-inner focus-within:bg-white focus-within:ring-2 focus-within:ring-[#592b98]/50 focus-within:border-[#592b98] transition-all duration-300">
          <PaymentElement />
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 text-sm text-red-600 rounded-lg flex items-start gap-2 border border-red-100 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="leading-tight">{error}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-auto">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 py-3.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#592b98] to-[#7c3aed] text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:from-[#4b2488] hover:to-[#6d28d9] transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin -ml-1 mr-1 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${total?.toFixed(2)}`
          )}
        </button>
      </div>
      
      <div className="mt-6 flex items-center justify-center text-xs text-gray-400 font-medium">
        <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        Powered by <span className="font-medium ml-1 text-gray-500">Stripe</span>
      </div>
    </form>
  );
};

export default CheckoutForm;
