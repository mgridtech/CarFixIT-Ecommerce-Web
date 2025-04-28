import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceProductsByCategoryAndCar } from "../pages/Services/Services.jsx";
import { getUserId } from "../utils/auth.js";

const ServiceProductsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [noProductsMessage, setNoProductsMessage] = useState("");

  // Helper function to format base64 image data based on signature
  const formatImageUrl = (imageData) => {
    if (!imageData) return "https://via.placeholder.com/300x200?text=No+Image";

    if (imageData.startsWith("data:image")) return imageData;
    if (imageData.startsWith("/9j")) return `data:image/jpeg;base64,${imageData}`;
    if (imageData.startsWith("iVBOR")) return `data:image/png;base64,${imageData}`;
    if (imageData.match(/^[A-Za-z0-9+/=]+$/)) return `data:image/png;base64,${imageData}`;
    return imageData;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const userId = getUserId(); // Dynamically get the userId
        const selectedCarKey = `selectedCar_${userId}`;
        const selectedCarData = localStorage.getItem(selectedCarKey);

        if (!selectedCarData) {
          // Handle case where no car is selected
          setNoProductsMessage("No car selected. Please select a car.");
          setLoading(false); // Stop loading
          return;
        }

        const selectedCar = JSON.parse(selectedCarData);
        const adminCarId = selectedCar?.adminCarId;

        if (!adminCarId) {
          // Handle case where adminCarId is missing
          setNoProductsMessage("No car selected. Please select a car.");
          setLoading(false); // Stop loading
          return;
        }

        const response = await getServiceProductsByCategoryAndCar(serviceId, adminCarId);

        if (response && response.data) {
          console.log("API Response:", response.data); // Debugging: Log the API response

          // Check if the response contains a message about no products
          if (
            response.message === "No products found in this category." ||
            (Array.isArray(response.data.products) && response.data.products.length === 0)
          ) {
            setNoProductsMessage("No products are associated with this car. Please select a different car.");
          }

          setProducts(response.data.products || []);
          setSubcategories(response.data.subcategories || []);
        } else {
          setError("Failed to fetch products or invalid response format");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error in fetch operation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [serviceId]);

  // Filter products based on selected subcategory
  useEffect(() => {
    if (selectedSubcategory) {
      const filtered = products.filter((product) => product.subcategoryId === selectedSubcategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedSubcategory, products]);

  if (loading) {
    // Show the loader while data is being fetched
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
      </div>
    );
  }

  if (noProductsMessage) {
    return (
      <section className="w-full flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-lg font-medium text-gray-600">{noProductsMessage}</p>
          <button style={{ marginTop: "30px" }}
          onClick={() => navigate("/cars")}
          className="px-6 py-3 bg-[#8B1E51] text-white font-medium rounded-md hover:bg-[#6e1641] transition-colors"
        >
          Select a Car
        </button>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-500">Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="w-full flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg font-medium text-gray-600">
            No products are associated with this car. Please select a different car.
          </p>
        </div>
      </section>
    );
  }

  // Find the subcategory name for display
  const getCategoryName = () => {
    if (selectedSubcategory && subcategories.length > 0) {
      const subcategory = subcategories.find((sub) => sub.id === selectedSubcategory);
      return subcategory ? subcategory.name : `Category ${serviceId}`;
    }
    return `Category ${serviceId}`;
  };

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
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
          Back to Services
        </button>

        {/* Category Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8B1E51]">Service Products</h1>
          <p className="mt-2 text-gray-600">Shop for quality service products</p>
        </div>

        {/* Subcategories Filter */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Categories</h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((subcat) => (
                <button
                  key={subcat.id}
                  onClick={() => setSelectedSubcategory(subcat.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedSubcategory === subcat.id
                      ? "bg-[#8B1E51] text-white shadow-md"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {subcat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{getCategoryName()}</h3>
            <p className="text-sm text-gray-500">{filteredProducts.length} products available</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden rounded-md mb-3">
                  <img
                    src={formatImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
                    }}
                  />
                </div>
                <h4 className="text-lg font-medium text-gray-800">{product.name}</h4>
                <p className="text-[#8B1E51] font-bold mt-2">₹{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {product.description || `Status: ${product.status}`}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/services/${serviceId}/products/${product.id}`)}
                    className="flex-1 bg-[#8B1E51] text-white py-2 rounded-md hover:bg-[#6e1641] transition-colors"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProductsPage;