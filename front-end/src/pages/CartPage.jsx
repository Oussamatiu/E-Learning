import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, clearCart, getCartTotal } from '../utils/cartUtils';
import api from '../services/api';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleRemoveItem = (courseId) => {
    removeFromCart(courseId);
    setCartItems(getCart());
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await api.post('api/orders/checkout', {
        courses: cartItems.map(item => ({ id: item.id }))
      });

      if (response.data.success) {
        clearCart();
        alert('Checkout successful! Redirecting to your dashboard...');
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
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add courses to your cart</p>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-[#592b98] text-white font-semibold rounded-md hover:bg-[#3e1f6b] transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-6 border-b border-gray-100 last:border-b-0">
              <img
                src={"http://127.0.0.1:8000/storage/" + item.thumbnail}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{item.title}</h3>
                <p className="text-gray-600 text-xs mb-2">By {item.instructor}</p>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {item.level}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-900">
                  {item.price ? `$${Number(item.price).toFixed(2)}` : 'Free'}
                 
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Remove from cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Total and Checkout */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-[#592b98]">${typeof total === 'number' ? total.toFixed(2) : '0.00'}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#592b98] text-white font-semibold py-3 rounded-md hover:bg-[#3e1f6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              30-Day Money-Back Guarantee on all courses
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center text-[#592b98] hover:text-[#3e1f6b] font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;