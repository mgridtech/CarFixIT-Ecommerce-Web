import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/Aboutus";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import SplashScreen from "./components/SplashScreen";
import Footer from "./components/Footer";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ServiceProductsPage from "./pages/ServiceProductsPage";
import ServiceProductsDetails from "./pages/ServiceProductsDetails";
import EcommerceProductsPage from "./pages/EcommerceProductsPage";
import EcommerceProductsDetails from "./pages/EcommerceProductsDetails";
import { CartProvider } from './contexts/CartContext';
import Cart from "./pages/Cart";
import Address from './pages/Address';
import OrderConfirmation from './pages/OrderConfirmation';
import { getAuth, clearAuth } from "./utils/auth";
import { WishlistProvider } from './contexts/WishlistContext';
import { CarProvider } from './contexts/CarContext';
import Wishlist from "./pages/Wishlist";
import CarsPage from './pages/CarsPage';
import AddCarPage from './pages/AddCarPage';
import NoCarsPage from "./pages/NoCarsPage";
import CarModels from "./components/CarModels";
import CarDetailsForm from "./components/CarDetailsForm";
import ForgotPassword from "./pages/ForgotPassword";
import { SelectedCarProvider } from './contexts/SelectedCarContext'; // Import SelectedCarProvider

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Check authentication status
    setIsLoggedIn(getAuth());

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    // Redirect to login after logout
    window.location.href = '/login';
  };

  return (
    <CartProvider>
      <CarProvider>
        <WishlistProvider>
          <SelectedCarProvider> {/* Wrap the app with SelectedCarProvider */}
            <div className="flex flex-col min-h-screen">
              {isLoading ? (
                <SplashScreen />
              ) : (
                <Router>
                  <ScrollToTop />
                  {isLoggedIn && <Navbar onLogout={handleLogout} />}
                  <main className="flex-grow">
                    <Routes>
                      <Route
                        path="/"
                        element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                      />
                      <Route
                        path="/login"
                        element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
                      />
                      <Route
                        path="/signup"
                        element={isLoggedIn ? <Navigate to="/" /> : <SignupPage />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />

                      <Route
                        path="/services/:serviceId"
                        element={isLoggedIn ? <ServiceProductsPage /> : <Navigate to="/login" />}
                      />
                      <Route
                        path="/ecommerce/:categoryId"
                        element={isLoggedIn ? <EcommerceProductsPage /> : <Navigate to="/login" />}
                      />
                      <Route
                        path="/services/:serviceId/products/:productId"
                        element={isLoggedIn ? <ServiceProductsDetails /> : <Navigate to="/login" />}
                      />
                      <Route
                        path="/ecommerce/:categoryId/products/:productId"
                        element={isLoggedIn ? <EcommerceProductsDetails /> : <Navigate to="/login" />}
                      />

                      <Route
                        path="/blog"
                        element={isLoggedIn ? <Blog /> : <Navigate to="/login" />}
                      />
                      <Route
                        path="/about"
                        element={isLoggedIn ? <AboutUs /> : <Navigate to="/login" />}
                      />
                      <Route
                        path="/contact"
                        element={isLoggedIn ? <Contact /> : <Navigate to="/login" />}
                      />
                      <Route path="/cart" element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} />
                      <Route path="/checkout/address" element={isLoggedIn ? <Address /> : <Navigate to="/login" />} />
                      <Route path="/order-confirmation" element={isLoggedIn ? <OrderConfirmation /> : <Navigate to="/login" />} />
                      <Route path="/cars" element={isLoggedIn ? <CarsPage /> : <Navigate to="/login" />} />
                      <Route path="/add-car" element={isLoggedIn ? <AddCarPage /> : <Navigate to="/login" />} />
                      <Route path="/no-car" element={isLoggedIn ? <NoCarsPage /> : <Navigate to="/login" />} />
                      <Route path="/car-models/:brandId" element={<CarModels />} />
                      <Route path="/wishlist" element={isLoggedIn ? <Wishlist /> : <Navigate to="/login" />} />
                      <Route path="/car-details/:admincarId" element={<CarDetailsForm />} />

                      <Route
                        path="*"
                        element={<Navigate to={isLoggedIn ? "/" : "/login"} />}
                      />
                    </Routes>
                  </main>
                  {isLoggedIn && <Footer />}
                </Router>
              )}
            </div>
          </SelectedCarProvider>
        </WishlistProvider>
      </CarProvider>
    </CartProvider>
  );
}

export default App;