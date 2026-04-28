# Payment Flow Test Script

## Prerequisites

1. Set up Stripe test mode credentials
2. Configure environment variables
3. Install Stripe CLI for webhook testing

## Environment Setup

### Backend (.env)
```env
STRIPE_SECRET=sk_test_your_test_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_API_BASE_URL=http://localhost:8000/api
```

## Test Steps

### 1. Start Stripe CLI for Webhooks
```bash
stripe listen --forward-to localhost:8000/api/webhook/stripe
```

### 2. Test API Endpoints

#### Create Payment Intent
```bash
curl -X POST http://localhost:8000/api/orders/checkout \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"course_ids": [1, 2]}'
```

Expected Response:
```json
{
  "success": true,
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_..."
}
```

#### Verify Payment
```bash
curl -X GET http://localhost:8000/api/orders/verify/pi_... \
  -H "Authorization: Bearer <user_token>"
```

### 3. Test Frontend Flow

1. Add courses to cart
2. Navigate to checkout page
3. Complete payment using test card:
   - **Success**: `4242 4242 4242 4242`
   - **Failure**: `4000 0000 0000 0002`

### 4. Test Webhook Processing

1. Complete a successful payment
2. Check Stripe CLI for webhook events
3. Verify database records:
   - Order created
   - Order items created
   - User enrolled in courses

### 5. Test Error Scenarios

#### Already Owned Course
```bash
curl -X POST http://localhost:8000/api/orders/checkout \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"course_ids": [1]}' # where user already owns course 1
```

Expected Response:
```json
{
  "success": false,
  "message": "You already own one or more of these courses.",
  "owned_course_ids": [1]
}
```

#### Invalid Course ID
```bash
curl -X POST http://localhost:8000/api/orders/checkout \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"course_ids": [999]}' # non-existent course
```

Expected Response:
```json
{
  "success": false,
  "message": "No valid courses found or courses are not published."
}
```

## Verification Checklist

- [ ] Payment intent creation works
- [ ] Stripe Elements render correctly
- [ ] Payment confirmation works
- [ ] Webhook processing works
- [ ] Orders created in database
- [ ] Users enrolled in courses
- [ ] Error handling works
- [ ] Idempotency maintained
- [ ] Security measures enforced

## Common Issues

1. **Webhook not firing** - Check Stripe CLI connection
2. **Signature verification failed** - Verify webhook secret
3. **CORS issues** - Check API CORS configuration
4. **Authentication failed** - Verify user token
5. **Payment failed** - Check Stripe test mode