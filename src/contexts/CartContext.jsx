import { createContext, useContext, useState, useEffect } from 'react';
import { addToCart as addToCartAPI, getCart } from '../pages/Services/Services'; // Import the API methods
import { getUserId } from '../utils/auth'; // Import the method to get userId

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Initialize cart from API or localStorage
  useEffect(() => {
    const fetchCart = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        // First try to get cart from API
        const result = await getCart(userId);
        if (result.success && result.data) {
          const cartData = result.data.data || result.data;
          setCartItems(cartData.cartItems || []);
          setCartCount(cartData.cartItems?.length || 0);
          
          // Store in localStorage for offline access
          localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartData.cartItems || []));
        } else {
          // If API fails, try localStorage
          const savedCart = localStorage.getItem(`cartItems_${userId}`);
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
            setCartCount(parsedCart.length);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem(`cartItems_${userId}`);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          setCartCount(parsedCart.length);
        }
      }
    };

    fetchCart();
  }, []);

  // Function to update cart count and dispatch event
  const updateCartCountAndNotify = (items) => {
    setCartCount(items.length);
    setCartItems(items);
    
    // Update localStorage
    const userId = getUserId();
    if (userId) {
      localStorage.setItem(`cartItems_${userId}`, JSON.stringify(items));
    }
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("cart-updated", { 
      detail: { count: items.length } 
    }));
  };

  const addToCart = async (item, type, navigate) => {
    const userId = getUserId(); // Retrieve the userId from session or localStorage
    if (!userId) {
      console.error('User not logged in. Cannot add product to cart.');
      return;
    }

    const payload = {
      carId: item.carId || 1, // Replace with the actual carId if available
      productId: item.id,
      quantity: item.quantity || 1, // Default to 1 if not provided
      productType: type,
    };

    try {
      const result = await addToCartAPI(userId, payload); // Call the API method
      if (result.success) {
        console.log('Product added to cart successfully:', result.data);

        // Fetch the updated cart to ensure we have the latest data
        const cartResult = await getCart(userId);
        if (cartResult.success && cartResult.data) {
          const cartData = cartResult.data.data || cartResult.data;
          updateCartCountAndNotify(cartData.cartItems || []);
        }

        // Optionally navigate to the cart page
        if (navigate) {
          navigate('/cart');
        }
      } else {
        console.error('Failed to add product to cart:', result.error);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const removeFromCart = (id, type) => {
    const updatedItems = cartItems.filter((item) => !(item.id === id && item.type === type));
    updateCartCountAndNotify(updatedItems);
  };

  const updateQuantity = (id, type, newQuantity) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.type === type
        ? { ...item, quantity: newQuantity }
        : item
    );
    updateCartCountAndNotify(updatedItems);
  };

  const clearCart = () => {
    updateCartCountAndNotify([]);
  };

  const updateCartItems = (newCartItems) => {
    updateCartCountAndNotify(newCartItems);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateCartItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};