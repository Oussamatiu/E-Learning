// Test Stripe keys configuration
const stripe = require('stripe')('sk_test_51TPmHDKRWmWKw0qyKRRZB3DTc8kDH极v6jKmC4SjXYAPOHaaVK9tiBzTh5BhjAhDXzQ4d8RlwhWbPH35ZHMhPRhcIu00NCOqez30');

async function testStripeKeys() {
  try {
    // Test creating a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      payment_method_types: ['card'],
    });

    console.log('✅ Stripe keys are working!');
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Client Secret:', paymentIntent.client_secret);

    return true;
  } catch (error) {
    console.error('❌ Stripe keys error:', error.message);
    return false;
  }
}

testStripeKeys();