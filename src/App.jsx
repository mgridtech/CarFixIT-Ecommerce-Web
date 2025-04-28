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
import { SelectedCarProvider } from './contexts/SelectedCarContext';
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import MyAddresses from "./pages/MyAddresses";
import ProductsDetails from "./pages/ProductDetails";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    setIsLoggedIn(getAuth());

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  // Define routes where the Navbar should not be displayed
  const hideNavbarRoutes = ["/login", "/signup", "/forgot-password"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          <ScrollToTop />
          {shouldShowNavbar && <Navbar onLogout={handleLogout} />} {/* Always render Navbar except on specific routes */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
              />
              <Route
                path="/signup"
                element={isLoggedIn ? <Navigate to="/" /> : <SignupPage />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/services/:serviceId"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <ServiceProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ecommerce/:categoryId"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <EcommerceProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services/:serviceId/products/:productId"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <ServiceProductsDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ecommerce/:categoryId/products/:productId"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <EcommerceProductsDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <Blog />
                }
              />
              <Route
                path="/about"
                element={
                  <AboutUs />
                }
              />
              <Route
                path="/contact"
                element={
                  <Contact />
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/address"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Address />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-confirmation"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cars"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <CarsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-car"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <AddCarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/no-car"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <NoCarsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/car-models/:brandId" element={<CarModels />} />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route path="/car-details/:admincarId" element={<CarDetailsForm />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-addresses"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <MyAddresses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-details/:id"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/productdetails/:productId"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <ProductsDetails />
                  </ProtectedRoute>
                }
              />

            </Routes>
          </main>
          <Footer /> {/* Always render Footer */}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <CarProvider>
          <WishlistProvider>
            <SelectedCarProvider>
              <AppContent />
              <ToastContainer />
            </SelectedCarProvider>
          </WishlistProvider>
        </CarProvider>
      </CartProvider>
    </Router>
  );
}

export default App;