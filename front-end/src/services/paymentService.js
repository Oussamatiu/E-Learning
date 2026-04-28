import apiClient from './apiClient';

// Payment service for handling Stripe integration
export const paymentService = {
  // Create payment intent for checkout
  createPaymentIntent: async (courseIds) => {
    try {
      const response = await apiClient.post('/orders/checkout', {
        course_ids: courseIds
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create payment intent');
    }
  },

  // Verify payment status (optional - can be used for post-payment verification)
  verifyPayment: async (paymentIntentId) => {
    try {
      const response = await apiClient.get(`/orders/verify/${paymentIntentId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to verify payment');
    }
  }
};

export default paymentService;