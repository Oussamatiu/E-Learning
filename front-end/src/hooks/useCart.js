import { useState, useEffect } from 'react';
import { getCartCount } from '../utils/cartUtils';

// Hook for cart count with live updates
export const useCartCount = () => {
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };

    // Listen to both storage events and custom cart-updated events
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cart-updated', handleCartUpdate);

    // Initial count
    setCartCount(getCartCount());

    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  return cartCount;
};