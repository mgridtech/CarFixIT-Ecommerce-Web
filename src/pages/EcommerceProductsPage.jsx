import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEcommerceProductsByCategoryAndCar } from "../pages/Services/Services.jsx";
import { getUserId } from "../utils/auth.js";

const EcommerceProductsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Keep this as is
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [noProductsMessage, setNoProductsMessage] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);


  const formatImageUrl = (imageData) => {
    if (!imageData) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imageData.startsWith("data:image")) return imageData;
    if (imageData.startsWith("/9j")) return `data:image/jpeg;base64,${imageData}`;
    if (imageData.startsWith("iVBOR")) return `data:image/png;base64,${imageData}`;
    if (imageData.match(/^[A-Za-z0-9+/=]+$/)) return `data:image/png;base64,${imageData}`;
    return imageData;
  };

  useEffect(() => {
    let filtered = products;
    
    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategoryId === selectedSubcategory);
    }
    
    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brandCategoryId === selectedBrand);
    }

    setFilteredProducts(filtered);
  }, [selectedSubcategory, selectedBrand, products]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Retrieve userId and adminCarId from local storage
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

        // Call the API with categoryId and adminCarId
        const response = await getEcommerceProductsByCategoryAndCar(categoryId, adminCarId);

        if (response && response.data) {
          console.log("API Response:", response.data); // Debugging: Log the API response

          // Check if the response contains a message about no products
          
          if (
            response.message === "No products found in this category." ||
            (Array.isArray(response.data.products) && response.data.products.length === 0)
          ) {
            setNoProductsMessage("No products are associated with this car. Please select a different car.");
          }

          const processedProducts = (response.data.products || []).map((product) => ({
            ...product,
            formattedImage: formatImageUrl(product.image),
          }));

          setProducts(processedProducts);
          setSubcategories(response.data.subcategories || []);
          setFilteredBrands(response.data.brandCategories || []);
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
  }, [categoryId]);


  useEffect(() => {
    if (selectedSubcategory) {
      const filtered = products.filter((product) => product.subcategoryId === selectedSubcategory);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedSubcategory, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
      </div>
    );
  }

  if (noProductsMessage && noProductsMessage.includes("No car selected")) {
    return (
      <section className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-center">
          <div className="mb-6">
            <img 
              src="https://img.freepik.com/free-vector/select-concept-illustration_114360-393.jpg" 
              alt="No car selected" 
              className="w-72 h-72 mx-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x300?text=Select+A+Car";
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Car Selected</h2>
          <p className="text-lg text-gray-600 mb-8">Please select a car to view available products and services.</p>
          <button
            onClick={() => navigate("/cars")}
            className="px-8 py-4 bg-[#8B1E51] text-white font-semibold rounded-lg shadow-md hover:bg-[#6e1641] transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-5h2.02a1.5 1.5 0 011.17.563l1.481 1.85a1.5 1.5 0 01.33.93V16a1 1 0 001 1h1a1 1 0 001-1v-4a1 1 0 00-.14-.515l-1.949-2.436A4 4 0 0013.76 7H11V4a1 1 0 00-1-1H3z" />
            </svg>
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
      <section className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-md mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-center">
          <div className="mb-6">
            <img 
              src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg" 
              alt="No products found" 
              className="w-72 h-72 mx-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x300?text=No+Products";
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Products Available</h2>
          <p className="text-lg text-gray-600 mb-8">No products are associated with this car. Please select a different car.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/cars")}
              className="px-6 py-3 bg-[#8B1E51] text-white font-semibold rounded-lg shadow-md hover:bg-[#6e1641] transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-5h2.02a1.5 1.5 0 011.17.563l1.481 1.85a1.5 1.5 0 01.33.93V16a1 1 0 001 1h1a1 1 0 001-1v-4a1 1 0 00-.14-.515l-1.949-2.436A4 4 0 0013.76 7H11V4a1 1 0 00-1-1H3z" />
              </svg>
              Select Different Car
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  const getCategoryName = () => {
    if (selectedSubcategory && subcategories.length > 0) {
      const subcategory = subcategories.find((sub) => sub.id === selectedSubcategory);
      return subcategory ? subcategory.name : `Category ${categoryId}`;
    }
    return `Category ${categoryId}`;
  };

  const renderBrandsSection = () => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Brands</h2>
      <div className="flex flex-wrap gap-3">
        {filteredBrands.map((brand) => (
          <button
            key={brand.brandCatId}
            onClick={() => setSelectedBrand(
              selectedBrand === brand.brandCatId ? null : brand.brandCatId
            )}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedBrand === brand.brandCatId
                ? "bg-[#8B1E51] text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {brand.brandName}
          </button>
        ))}
      </div>
    </div>
  );

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
          Back to Categories
        </button>

        {/* Category Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8B1E51]">Ecommerce Products</h1>
          <p className="mt-2 text-gray-600">Shop for quality ecommerce products</p>
        </div>

        {/* Subcategories Filter */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Categories</h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((subcat) => (
                <button
                  key={subcat.id}
                  onClick={() => {
                    setSelectedSubcategory(subcat.id);
                  }}
                  className={`px-4 py-2 rounded-full transition-colors ${selectedSubcategory === subcat.id
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

        {selectedSubcategory !== null && renderBrandsSection()}

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
                    src={product.formattedImage}
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
                    onClick={() => navigate(`/ecommerce/${categoryId}/products/${product.id}`)}
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

export default EcommerceProductsPage;