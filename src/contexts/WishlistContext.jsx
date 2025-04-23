import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    // Load wishlist from localStorage on initial render
    const [wishlistItems, setWishlistItems] = useState(() => {
        if (typeof window !== "undefined") {
            const savedWishlist = localStorage.getItem("wishlist");
            return savedWishlist ? JSON.parse(savedWishlist) : [];
        }
        return [];
    });

    // useEffect(() => {
    //     localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    // }, [wishlistItems]);

    const addToWishlist = (item, navigate) => {
        setWishlistItems((prevItems) => {
            const existingItem = prevItems.find((wishlistItem) => wishlistItem.id === item.id);

            if (existingItem) {
                // If the product already exists, redirect to the wishlist page
                if (navigate) {
                    navigate("/wishlist");
                }
                return prevItems; // Do not add duplicate entries
            }

            // Add a new item
            return [...prevItems, item];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};