import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext"; // Import CartContext
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons"; // Import heart and cart icons
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart(); // Use CartContext
    const navigate = useNavigate();

    return (
        <section className="w-full py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Toast Container */}
                <ToastContainer />

                <div className="mb-8 text-center mt-12">
                    <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">Favorite</h1>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center justify-center">
                        <div className="text-[#8B1E51] mb-6">
                            <svg
                                stroke="#8B1E51"
                                fill="none"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="160"
                                height="220"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </div>
                        <p className="text-3xl text-gray-600 mb-2">Your favorite products will be shown here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow relative"
                            >
                                {/* Product Image */}
                                <div className="h-48 overflow-hidden rounded-md mb-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Name */}
                                <h4 className="text-lg font-medium text-gray-800">{item.name}</h4>

                                {/* Product Price and Heart Icon */}
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-[#8B1E51] font-bold">
                                        ₹{item.price.toLocaleString()}
                                    </p>
                                    <FontAwesomeIcon
                                        icon={faHeart}
                                        className="text-[#8B1E51] text-2xl cursor-pointer hover:text-[#6e1641] transition-colors"
                                        onClick={() => {
                                            removeFromWishlist(item.id); // Remove from wishlist
                                            toast.info("Product removed from wishlist", {
                                                position: "top-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            });
                                        }}
                                    />
                                </div>

                                {/* Add to Cart Button */}
                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            // Ensure the type is explicitly passed
                                            const type = item.type || "ecommerce"; // Default to "ecommerce" if type is not set
                                            const cartItem = { ...item, type, quantity: 1 }; // Include type in the cart item

                                            console.log("Adding to cart:", cartItem); // Log the data being passed

                                            addToCart(cartItem, type); // Add to cart with the correct type
                                            removeFromWishlist(item.id); // Remove the item from the wishlist

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
                                                navigate("/cart"); // Redirect to cart page after toast shows
                                            }, 3000);
                                        }}
                                        className="w-full bg-[#8B1E51] text-white py-2 rounded-md hover:bg-[#6e1641] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faShoppingCart} /> {/* Cart Icon */}
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Wishlist;