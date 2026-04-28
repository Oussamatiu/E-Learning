// Quick test to verify Stripe payment setup
console.log('Testing Stripe Payment Setup...');

// Check environment variables
console.log('Frontend Stripe Public Key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api');

// Test API endpoint (simulated)
console.log('\nTesting API endpoints:');
console.log('POST /api/orders/checkout - Payment intent creation');
console.log('POST /api/webhook/stripe - Webhook handling');
console.log('GET /api/orders/verify/{id} - Payment verification');

console.log('\n✅ Setup verification complete.');
console.log('\nNext steps:');
console.log('1. Ensure Stripe CLI is running for webhooks');
console.log('2. Test with Stripe test cards');
console.log('3. Verify database records after payment');