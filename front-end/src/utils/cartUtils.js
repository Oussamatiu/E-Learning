// Cart utilities for localStorage management
const CART_STORAGE_KEY = 'elearning_cart';

// Get cart from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Add course to cart (prevent duplicates)
export const addToCart = (course) => {
  try {
    const cart = getCart();

    // Check if course is already in cart
    const existingItem = cart.find(item => item.id === course.id);
    if (existingItem) {
      return false; // Course already in cart
    }

    // Add course to cart
    const cartItem = {
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail: course.thumbnail,
      level: course.level,
      instructor: course.instructor?.name || 'Unknown Instructor',
      addedAt: new Date().toISOString()
    };

    cart.push(cartItem);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    // Dispatch cart updated event
    window.dispatchEvent(new Event('cart-updated'));

    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

// Remove course from cart
export const removeFromCart = (courseId) => {
  try {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== courseId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));

    // Dispatch cart updated event
    window.dispatchEvent(new Event('cart-updated'));

    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};


export const clearCart = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);

    
    window.dispatchEvent(new Event('cart-updated'));

    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// Check if course is in cart
export const isInCart = (courseId) => {
  const cart = getCart();
  return cart.some(item => item.id === courseId);
};

// Get cart item count
export const getCartCount = () => {
  const cart = getCart();
  return cart.length;
};

// Get cart total price
export const getCartTotal = () => {
  const cart = getCart();
  
  return cart.reduce((total, item) =>
    total + (item.price ? parseFloat(item.price) : 0), 0
    );
};