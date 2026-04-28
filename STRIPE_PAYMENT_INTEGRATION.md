# Stripe Payment Integration - E-Learning Platform

## Overview

This document describes the complete Stripe payment integration for the e-learning platform. The implementation follows security best practices and ensures that:

1. **Prices are calculated securely on the backend** - Never trust frontend calculations
2. **Webhooks handle payment confirmation** - Prevents race conditions
3. **Idempotency is maintained** - Prevents duplicate processing
4. **Proper error handling** - Graceful degradation

## Architecture

### Backend (Laravel)

#### Key Files:
- `app/Http/Controllers/OrderController.php` - Handles payment intent creation
- `app/Http/Controllers/StripeWebhookController.php` - Handles payment confirmation
- `app/Models/Order.php` - Order model
- `app/Models/OrderItem.php` - Order items model
- `routes/api.php` - API routes

#### API Endpoints:

1. **POST /api/orders/checkout**
   - Creates a Stripe PaymentIntent
   - Validates course IDs and user ownership
   - Returns `client_secret` for frontend
   - **Request:** `{ "course_ids": [1, 2, 3] }`
   - **Response:** `{ "success": true, "clientSecret": "pi_...", "paymentIntentId": "pi_..." }`

2. **GET /api/orders/verify/{paymentIntentId}**
   - Verifies payment status (optional)
   - Useful for post-payment verification

3. **POST /api/webhook/stripe**
   - Handles Stripe webhook events
   - Processes successful payments
   - Creates orders and enrollments

### Frontend (React)

#### Key Files:
- `src/components/payment/CheckoutPage.jsx` - Main checkout page
- `src/components/payment/CheckoutForm.jsx` - Stripe payment form
- `src/components/payment/PaymentSuccess.jsx` - Success page
- `src/services/paymentService.js` - Payment API service
- `src/utils/cartUtils.js` - Cart management utilities

#### Key Components:

1. **CheckoutPage**
   - Displays order summary
   - Initializes Stripe Elements
   - Handles payment flow

2. **CheckoutForm**
   - Renders Stripe PaymentElement
   - Handles payment confirmation
   - Manages loading states

## Security Measures

### 1. Backend Price Calculation
- **Never** trust frontend prices
- All prices are fetched from database
- Total calculated securely on server

### 2. Webhook Security
- Stripe signature verification
- Endpoint secret validation
- Proper error handling

### 3. Idempotency
- Payment intent ID stored in orders
- Prevents duplicate webhook processing
- Database-level checks

### 4. Validation
- Course existence validation
- User ownership checks
- Published course verification

## Database Schema

### Orders Table
- `user_id` - User who made purchase
- `price` - Total amount paid
- `status` - Order status (completed/failed)
- `stripe_payment_intent_id` - Stripe reference
- `payment_method` - Payment method used

### Order Items Table
- `order_id` - Reference to order
- `course_id` - Purchased course
- `price` - Individual course price

### User Courses (Enrollment)
- `user_id` - User ID
- `course_id` - Course ID
- `progress` - Learning progress
- `enrolled_at` - Enrollment timestamp

## Payment Flow

1. **User adds courses to cart** → Local storage
2. **User proceeds to checkout** → `/checkout` page
3. **Frontend calls `/orders/checkout`** → Gets `client_secret`
4. **Stripe Elements renders** → Payment form
5. **User completes payment** → Stripe confirmation
6. **Stripe sends webhook** → `/webhook/stripe`
7. **Backend processes webhook** → Creates order + enrollment
8. **Frontend redirects** → Success page

## Environment Variables

### Backend (.env)
```env
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:8000/api
```

## Why client_secret?

The `client_secret` is used to:
1. **Authenticate** the frontend with Stripe
2. **Secure** the payment intent - only the intended client can confirm
3. **Prevent** unauthorized payment modifications
4. **Maintain** session-specific security

## Why Webhook?

Webhooks are essential because:
1. **Async Processing** - Payments can take time to confirm
2. **Reliability** - Handles network issues gracefully
3. **Security** - Backend validates payment success
4. **Idempotency** - Prevents duplicate processing
5. **Offline Payments** - Handles delayed payment methods

## Testing

### Local Testing
1. Use Stripe test cards
2. Set up Stripe CLI for webhooks
3. Test various payment scenarios

### Test Cards
- Success: `4242 4242 4242 4242`
- Failure: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

## Error Handling

### Frontend Errors
- Network issues
- Payment failures
- Validation errors

### Backend Errors
- Stripe API errors
- Database errors
- Validation failures

### Webhook Errors
- Signature verification
- Processing failures
- Duplicate detection

## Monitoring

### Logging
- Payment intent creation
- Webhook processing
- Error conditions

### Analytics
- Successful payments
- Failed payments
- Conversion rates

## Future Enhancements

1. **Payment Method Management**
2. **Refund Processing**
3. **Subscription Payments**
4. **Multi-currency Support**
5. **Advanced Analytics**

## Support

For issues related to this integration:
1. Check Stripe Dashboard for payment status
2. Review application logs
3. Verify webhook configuration
4. Test with Stripe test mode