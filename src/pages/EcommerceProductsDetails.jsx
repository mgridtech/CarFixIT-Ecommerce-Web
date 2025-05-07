import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEcommerceProductDetails } from "../pages/Services/Services.jsx"; // Import the method
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS


const EcommerceProductsDetails = () => {
  const { addToWishlist } = useWishlist(); // Use WishlistContext

  const { productId } = useParams(); // Get productId from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State to track quantity
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await getEcommerceProductDetails(productId); // Fetch product details
        if (!response.error) {
          setProduct(response.data);
        } else {
          setError(response.error);
          console.error("Error fetching product details:", response.error);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error in fetch operation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Trigger fetch when productId changes

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    // Show the loader while data is being fetched
    return (
      <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
    </div>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-500">Error loading product details: {error}</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-[#8B1E51]">Product not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-[#8B1E51] text-white rounded-md hover:bg-[#6e1641] transition-colors"
          >
            Back to Products
          </button>
        </div>
      </section>
    );
  }

  // Process properties to remove quotes from values
  const processedProperties = product.properties.map((property) => ({
    ...property,
    value: property.value.replace(/"/g, ""), // Remove quotes from the value
  }));

  return (
    <section className="w-full py-12">
      <div className="max-w-8xl mx-auto px-6">
        {/* Toast Container */}
        <ToastContainer />
        
        {/* Page Heading */}
        <div className="mb-8 text-center mt-12">
          <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">{product.name}</h1>
          <p className="text-lg text-gray-600">{product.categoryInfo?.categoryName || "Ecommerce"}</p>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-[#8B1E51] hover:text-[#6e1641]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </button>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 p-6">
              <div className="h-96 overflow-hidden rounded-lg">
                <img
                  src={product.images?.[0]?.image_data || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mt-1">{product.name}</h1>
                <p className="text-2xl text-[#8B1E51] font-bold mt-2">
                  ₹{(product.suitableCars?.[0]?.price * quantity).toLocaleString()}
                </p>
              </div>

              {/* <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600">{product.description || "No description available."}</p>
              </div> */}

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Specifications</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {processedProperties.map((property) => (
                    <li key={property.id}>
                      {property.name}: {property.value} {property.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Quantity</h2>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <div className="px-4 py-1 border-t border-b border-gray-300 bg-white">
                    {quantity}
                  </div>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const cartItem = {
                      id: product.id,
                      name: product.name,
                      image: product.images?.[0]?.image_data,
                      price: product.suitableCars?.[0]?.price,
                      quantity: quantity, // Pass the updated quantity
                    };
                    console.log("Adding to cart:", cartItem); // Debugging log
                    addToCart(cartItem, "ecommerce");
                    toast.success("Product added to cart successfully!", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setTimeout(() => {
                      navigate("/cart");
                    }, 3000); // Redirect after 3 seconds
                  }}
                  className="flex-1 bg-[#8B1E51] text-white py-3 rounded-md hover:bg-[#6e1641] transition-colors font-medium"
                >
                  Add to Cart (₹{(product.suitableCars?.[0]?.price * quantity).toLocaleString()})
                </button>
                {/* <button
                  onClick={() => {
                    const wishlistItem = {
                      id: product.id,
                      name: product.name,
                      image: product.images?.[0]?.image_data,
                      price: product.suitableCars?.[0]?.price,
                      type: "ecommerce",
                    };
                    console.log("Adding to wishlist:", wishlistItem); // Debugging log
                    addToWishlist(wishlistItem); // Add to wishlist
                    toast.success("Product added to wishlist successfully!", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setTimeout(() => {
                      //navigate("/wishlist");
                    }, 3000); // Redirect after 3 seconds
                  }}
                  className="p-3 border border-[#8B1E51] text-[#8B1E51] rounded-md hover:bg-[#f8e8ee] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcommerceProductsDetails;