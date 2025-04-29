import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../pages/Services/Services.jsx"; // Import the method
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserId } from "../utils/auth.js";

const ProductsDetails = () => {
    const { addToWishlist } = useWishlist();
    const { productId } = useParams(); // Get productId from the URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        const userId = getUserId(); // Get the current userId
        if (userId) {
            // Retrieve the selected car for the current user from localStorage
            const selectedCarKey = `selectedCar_${userId}`;
            const selectedCarData = localStorage.getItem(selectedCarKey);
            if (selectedCarData) {
                try {
                    const selectedCar = JSON.parse(selectedCarData);
                    setSelectedCar(selectedCar);
                } catch (e) {
                    console.error("Error parsing selected car data:", e);
                }
            }
        }
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const userId = getUserId();
                // Update this section to properly get adminCarId from localStorage
                const selectedCarKey = `selectedCar_${userId}`;
                const selectedCarData = localStorage.getItem(selectedCarKey);

                let adminCarId = null;
                if (selectedCarData) {
                    try {
                        const selectedCar = JSON.parse(selectedCarData);
                        adminCarId = selectedCar?.adminCarId;
                    } catch (e) {
                        console.error("Error parsing selected car data:", e);
                    }
                }

                // Get user role - assuming 'customer' as default
                const userRole = 'user';

                const response = await getProductDetails(productId, userRole, adminCarId);
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
    }, [productId]);

    const handleAddToCart = () => {
        const userId = getUserId();
        if (!userId) {
            toast.error("User not logged in. Please log in to add products to the cart.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Update to get adminCarId correctly
        const selectedCarKey = `selectedCar_${userId}`;
        const selectedCarData = localStorage.getItem(selectedCarKey);
        let adminCarId = null;

        if (selectedCarData) {
            try {
                const selectedCar = JSON.parse(selectedCarData);
                adminCarId = selectedCar?.adminCarId;
            } catch (e) {
                console.error("Error parsing selected car data:", e);
            }
        }

        console.log("Selected Admin Car ID:", adminCarId);

        if (!adminCarId) {
            toast.error("No car selected. Please select a car before adding products to the cart.", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Create the cart item
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.image_data,
            price: product.price,
            quantity: 1,
            productType: "product", // Set productType as "product"
        };

        console.log("Adding to cart:", cartItem);
        addToCart(cartItem, "product");

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
            navigate("/cart"); // Redirect to the cart page after 3 seconds
        }, 3000);
    };

    if (loading) {
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

    const processedServices = JSON.parse(product.services).map((service) => service.trim());

    // Process properties to remove quotes from values
    const processedProperties = product.properties.map((property) => ({
      ...property,
      value: property.value.replace(/"/g, ""), // Remove quotes from the value
    }));
  

    // Format image source
    const getImageSrc = (imageString) => {
        if (!imageString) return "https://via.placeholder.com/300";

        if (imageString.startsWith("http")) {
            return imageString;
        }

        if (imageString.startsWith("data:image")) {
            return imageString;
        }

        return `data:image/jpeg;base64,${imageString}`;
    };

    
    return (
        <section className="w-full py-12">
            <div className="max-w-8xl mx-auto px-6">
                {/* Toast Container */}
                <ToastContainer />

                {/* Page Heading */}
                <div className="mb-8 text-center mt-12">
                    <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-600">{product.categoryInfo?.categoryName}</p>
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
                                    src={getImageSrc(product.images?.[0]?.image_data)}
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
                                    ₹{product.suitableCarPrice?.toLocaleString() || "Price not available"}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Services Included</h2>
                                <ul className="space-y-2">
                                    {processedServices.map((service, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg
                                                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="text-gray-600">{service}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {product.description && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                                    <p className="text-gray-600">{product.description}</p>
                                </div>
                            )}

                            {processedProperties.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Specifications</h2>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {processedProperties.map((property, index) => (
                                            <li key={index}>
                                                {property.name}: {property.value} {property.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-[#8B1E51] text-white py-3 rounded-md hover:bg-[#6e1641] transition-colors font-medium"
                                >
                                    Add to Cart (₹{product.suitableCarPrice?.toLocaleString() || "Price not available"})
                                </button>
                                <button
                                    onClick={() => {
                                        const wishlistItem = {
                                            id: product.id,
                                            name: product.name,
                                            image: product.images?.[0]?.image_data,
                                            price: product.price,
                                            type: "product",
                                        };
                                        addToWishlist(wishlistItem);
                                        toast.success("Product added to wishlist successfully!", {
                                            position: "top-right",
                                            autoClose: 3000,
                                        });
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
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductsDetails;