import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faSignOutAlt,
  faShoppingCart,
  faHeart,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/logo.png";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { getCars, getCart } from "../pages/Services/Services";
import { getUserId } from "../utils/auth";
import { useSelectedCar } from "../contexts/SelectedCarContext";

const Navbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const { selectedCar, setSelectedCar } = useSelectedCar();
  const { cartCount } = useCart(); // Get cartCount from context

  const userId = getUserId();

  // Calculate total items in wishlist
  const wishlistItemCount = wishlistItems?.length || 0;

  const updateCartCount = async () => {
    if (!userId) return;
    
    try {
      const result = await getCart(userId);
      if (result.success) {
        const cartData = result.data.data || result.data;
        setCartItemCount(cartData.cartItems?.length || 0);
      } else {
        // Fallback to localStorage
        const cartsItems = JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
        setCartItemCount(cartsItems.length);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      // Fallback to localStorage
      const cartsItems = JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
      setCartItemCount(cartsItems.length);
    }
  };

  const updateSelectedCar = async () => {
    const userId = getUserId();
    if (!userId) {
      return;
    }

    const storedCar = localStorage.getItem(`selectedCar_${userId}`);
    if (storedCar) {
      setSelectedCar(JSON.parse(storedCar));
      return;
    }

    try {
      const result = await getCars(userId);
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const lastCar = result.data[result.data.length - 1];
        setSelectedCar(lastCar);
        localStorage.setItem(`selectedCar_${userId}`, JSON.stringify(lastCar));
      } else {
        setSelectedCar(null);
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      setSelectedCar(null);
    }
  };

  useEffect(() => {
    updateSelectedCar();
    updateCartCount(); // Initial cart count

    // Function to handle cart update events
    const handleCartUpdate = (event) => {
      // If event has detail with count, use it directly
      if (event.detail && typeof event.detail.count === 'number') {
        setCartItemCount(event.detail.count);
      } else {
        // Otherwise, fetch the latest count
        updateCartCount();
      }
    };

    // Listen for cart updates with the enhanced event listener
    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("car-updated", updateSelectedCar);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("car-updated", updateSelectedCar);
    };
  }, []);

  // Set cart count from context when it changes
  useEffect(() => {
    if (cartCount !== undefined) {
      setCartItemCount(cartCount);
    }
  }, [cartCount]);

  const handleLogout = () => {
    window.dispatchEvent(new Event("car-updated"));
    const userId = getUserId();
    if (userId) {
      localStorage.removeItem(`selectedCar_${userId}`);
      localStorage.removeItem('userId');
      localStorage.removeItem(`cartItems_${userId}`);
      localStorage.removeItem(`wishlistItems_${userId}`);
    }
    onLogout();
  };

  const handleCarClick = () => {
    if (selectedCar) {
      navigate("/cars");
    } else {
      navigate("/cars");
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-green-100 shadow-md p-4 fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Car Selection */}
        <div className="flex items-center space-x-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <img src={logo} alt="CarFixIt Logo" className="h-12" />
          </Link>

          {selectedCar ? (
            <div
              onClick={handleCarClick}
              className="hidden md:flex items-center bg-white px-3 py-1 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
            >
              {selectedCar.carImage ? (
                <img
                  src={`data:image/jpeg;base64,${selectedCar.carImage}`}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  className="w-10 h-10 mr-2" // Same size as typical FontAwesome icon
                />
              ) : (
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div> // Placeholder if image is missing
              )}
              <span className="text-sm font-medium">
                {selectedCar.brand} {selectedCar.model}
              </span>
            </div>
          ) : (
            <button
              onClick={handleCarClick}
              className="hidden md:flex items-center text-sm font-medium bg-orange-200 text-orange-800 px-3 py-1 rounded-lg shadow-sm"
            >
              No Car Selected
            </button>
          )}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link
              to="/"
              className="text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-orange-400 hover:text-white transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-orange-400 hover:text-white transition"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-orange-400 hover:text-white transition"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-orange-400 hover:text-white transition"
            >
              Contact
            </Link>
          </li>

          {userId && (
            <>
              {/* Cart Icon with Badge */}
              <li className="relative">
                <Link
                  to="/cart"
                  className="text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-orange-400 hover:text-white transition flex items-center"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </li>

              <li className="relative">
                <Link
                  to="/profile"
                  className="text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-orange-400 hover:text-white transition flex items-center"
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl" />
                </Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-orange-400 hover:text-white transition flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Toggle */}
        <div
          className="md:hidden text-2xl cursor-pointer z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-green-100 shadow-md p-4 md:hidden">
          {/* Car Selection for Mobile */}
          {selectedCar ? (
            <div
              onClick={handleCarClick}
              className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm mb-4 cursor-pointer hover:bg-gray-100"
            >
              {selectedCar.carImage ? (
                <img
                  src={`data:image/jpeg;base64,${selectedCar.carImage}`}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  className="w-10 h-10 mr-2" // Same size as typical FontAwesome icon
                />
              ) : (
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div> // Placeholder if image is missing
              )}              <span className="text-sm font-medium">
                {selectedCar.brand} {selectedCar.model}
              </span>
            </div>
          ) : (
            <button
              onClick={handleCarClick}
              className="block w-full text-left py-3 px-6 bg-orange-200 text-orange-800 rounded-md mb-4"
            >
              No Car Selected
            </button>
          )}

          <ul>
            <li>
              <Link
                to="/"
                className="block py-3 px-6 hover:bg-orange-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block py-3 px-6 hover:bg-orange-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="block py-3 px-6 hover:bg-orange-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-3 px-6 hover:bg-orange-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
            {userId && (
              <>
                <li>
                  <Link
                    to="/cart"
                    className="block py-3 px-6 hover:bg-orange-400 hover:text-white flex items-center justify-between"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className="bg-orange-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left py-3 px-6 hover:bg-orange-400 hover:text-white flex items-center"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;