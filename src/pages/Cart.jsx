import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { getCart } from '../pages/Services/Services.jsx'; // Import the getCart method
import { getUserId } from '../utils/auth.js'; // Import the method to get userId
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import { removeFromCart, cartDecreaseQuantity, cartIncreaseQuantity } from '../pages/Services/Services.jsx';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const userId = getUserId(); // Retrieve the userId from session or localStorage
      if (!userId) {
        toast.error("User not logged in. Please log in to view your cart.", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
        return;
      }

      try {
        const result = await getCart(userId); // Call the getCart method
        console.log("getCart Result:", result); // Log the entire result object

        if (result.success) {
          // Access the correct data structure based on your API response
          const cartData = result.data.data || result.data;
          console.log("Cart Items Response:", cartData.cartItems); // Log the cart items

          setCartItems(cartData.cartItems || []); // Set the cart items
          setTotalPrice(cartData.totalValue || 0); // Set the total price

          // Store cart items in localStorage with userId as key
          localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartData.cartItems || []));
        } else {
          toast.error(result.error || "Failed to fetch cart.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("An unexpected error occurred while fetching the cart.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Recalculate the total price whenever cartItems changes
  useEffect(() => {
    const newTotalPrice = cartItems.reduce(
      (total, item) => total + item.finalPrice * item.quantity,
      0
    );
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const increaseQuantity = async (cartItemId) => {
    const userId = getUserId();
    try {
      const result = await cartIncreaseQuantity(userId, cartItemId);
      if (result.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + 1, itemTotal: (item.quantity + 1) * item.finalPrice }
              : item
          )
        );

        // Update localStorage
        const updatedCartItems = cartItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedCartItems));
      } else {
        toast.error(result.error || "Failed to increase quantity.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const decreaseQuantity = async (cartItemId) => {
    console.log("Decreasing quantity for cartItemId:", cartItemId); // Debugging log
    const userId = getUserId();
    try {
      const result = await cartDecreaseQuantity(userId, cartItemId);
      console.log("API Response:", result); // Debugging log
      if (result.success) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartItemId === cartItemId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1, itemTotal: (item.quantity - 1) * item.finalPrice }
              : item
          )
        );
  
        // Update localStorage
        const updatedCartItems = cartItems.map((item) =>
          item.cartItemId === cartItemId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1, itemTotal: (item.quantity - 1) * item.finalPrice }
            : item
        );
        setCartItems([...updatedCartItems]); // Force state update
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedCartItems));
      } else {
        toast.error(result.error || "Failed to decrease quantity.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    const userId = getUserId();
    if (!userId) {
      toast.error("User not logged in. Please log in to remove items from the cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await removeFromCart(userId, cartItemId);
      if (result.success) {
        toast.success("Item removed from cart successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Remove the item from the cartItems state
        const updatedCartItems = cartItems.filter((item) => item.cartItemId !== cartItemId);
        setCartItems(updatedCartItems);

        // Update localStorage
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedCartItems));
      } else {
        toast.error(result.error || "Failed to remove item from cart.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const capitalize = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-[#8B1E51] mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="160"
            height="220"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B1E51"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p className="text-2xl text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Toast Container */}
        <ToastContainer />

        <div className="mb-8 text-center mt-12">
          <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <div className="text-[#8B1E51] mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="160"
                height="220"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B1E51"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <p className="text-3xl text-gray-600 mb-2">Cart is empty, shop now</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-[#8B1E51] text-white rounded-md hover:bg-[#6e1641] transition-colors"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="md:flex gap-8">
            {/* Cart Items */}
            <div className="md:w-2/3">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="bg-white rounded-lg shadow-md p-6 mb-4 relative">
                  <button
                    className="absolute top-2 right-2 text-[#8B1E51] hover:text-[#6e1641] transition"
                    onClick={() => handleRemoveFromCart(item.cartItemId)} 
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                  </button>
                  <div className="flex">
                    <div className="w-1/4">
                      <img
                        src={`data:image/png;base64,${item.image}`}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                    <div className="w-3/4 pl-6">
                      <div className="flex justify-between">
                        <h3 className="text-xl font-semibold">{capitalize(item.name)}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">Quantity: {item.quantity}</p>
                      <p className="text-lg text-[#8B1E51] font-bold my-2">₹{item.itemTotal.toLocaleString()}</p>
                      {item.productType === "ecommerce" && (
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2">Quantity</h2>
                          <div className="flex items-center">
                            <button
                              onClick={() => decreaseQuantity(item.cartItemId)}
                              className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                            >
                              -
                            </button>
                            <div className="px-4 py-1 border-t border-b border-gray-300 bg-white">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => increaseQuantity(item.cartItemId)}
                              className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => navigate('/checkout/address')}
                  className="w-full bg-[#8B1E51] text-white py-3 rounded-md hover:bg-[#6e1641] transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;