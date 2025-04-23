import { createContext, useContext, useState, useEffect } from 'react';
import { addToCart as addToCartAPI } from '../pages/Services/Services'; // Import the API method
import { getUserId } from '../utils/auth'; // Import the method to get userId

const CartContext = createContext();


export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

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

        // Update the local cart state with the new item
        setCartItems((prevItems) => {
          const existingItem = prevItems.find(
            (cartItem) => cartItem.id === item.id && cartItem.type === type
          );

          if (existingItem) {
            // If the product already exists, redirect to the cart page
            if (navigate) {
              navigate('/cart');
            }
            return prevItems; // Do not add duplicate entries
          }

          // Add a new item to the cart
          return [...prevItems, { ...item, type }];
        });

        window.dispatchEvent(new Event("cart-updated"));


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
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
    window.dispatchEvent(new Event("cart-updated"));

  };

  const updateQuantity = (id, type, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    window.dispatchEvent(new Event("cart-updated"));
  };

  const clearCart = () => {
    setCartItems([]);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateCartItems = (newCartItems) => {
    setCartItems(newCartItems);
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`cartItems_${userId}`, JSON.stringify(newCartItems));
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
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