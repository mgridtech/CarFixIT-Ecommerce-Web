import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../pages/Services/Services.jsx"; 
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserId } from "../utils/auth.js";

const ProductsDetails = () => {
    const { addToWishlist } = useWishlist();
    const { productId } = useParams(); 
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        const userId = getUserId(); 
        if (userId) {
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

        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.images?.[0]?.image_data,
            price: product.price,
            quantity: 1,
            productType: "product", 
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
            navigate("/cart"); 
        }, 3000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
            </div>
        );
    }

    const userId = getUserId();
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

    if (!adminCarId) {
        return (
            <section className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-md mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-center">
                    <div className="mb-6">
                        <img 
                            src="https://img.freepik.com/free-vector/car-finder-concept-illustration_114360-7655.jpg" 
                            alt="No car selected" 
                            className="w-72 h-72 mx-auto object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300x300?text=Select+Car";
                            }}
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">No Car Selected</h2>
                    <p className="text-lg text-gray-600 mb-8">Please select a car before viewing product details.</p>
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
                            Select Car
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
            <section className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-md mx-auto px-8 py-10 bg-white rounded-xl shadow-lg text-center">
                    <div className="mb-6">
                        <img 
                            src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg" 
                            alt="No product found" 
                            className="w-72 h-72 mx-auto object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300x300?text=No+Product";
                            }}
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                    <p className="text-lg text-gray-600 mb-8">The product you're looking for doesn't exist or isn't available for your selected car.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate("/products")}
                            className="px-6 py-3 bg-[#8B1E51] text-white font-semibold rounded-lg shadow-md hover:bg-[#6e1641] transition-all transform hover:scale-105 flex items-center justify-center"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5 mr-2" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
                            </svg>
                            Back to Products
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

    const processedServices = JSON.parse(product.services).map((service) => service.trim());

    const processedProperties = product.properties.map((property) => ({
      ...property,
      value: property.value.replace(/"/g, ""),
    }));
  

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
                <ToastContainer />
                <div className="mb-8 text-center mt-12">
                    <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">{product.name}</h1>
                    <p className="text-lg text-gray-600">{product.categoryInfo?.categoryName}</p>
                </div>

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

                <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
                    <div className="md:flex">
                        <div className="md:w-1/2 p-6">
                            <div className="h-96 overflow-hidden rounded-lg">
                                <img
                                    src={getImageSrc(product.images?.[0]?.image_data)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

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
                                {/* <button
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
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductsDetails;