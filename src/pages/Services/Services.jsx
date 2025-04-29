// const baseURL = "http://localhost:3009";
const baseURL = "https://carfixit-backend.onrender.com";

export const getBaseURL = () => baseURL;

export const getPromotionalBanners = async () => {
  try {
    const response = await fetch(baseURL + "/fetch/banners", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching banners: ${response.status}`);
    }

    const result = await response.json();

    // Check if the response has the expected structure
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: [] };
    }

    // Filter banners where bannerType is 'promotional'
    const promotionalBanners = result.data.filter(
      (banner) =>
        banner.bannerType &&
        banner.bannerType.trim().toLowerCase() === "promotional"
    );

    console.log("Promotional banners:", promotionalBanners);
    return { error: null, data: promotionalBanners };
  } catch (error) {
    console.error("Error fetching promotional banners:", error);
    return { error: error.message, data: [] };
  }
};

export const getDisplayBanners = async () => {
  try {
    const response = await fetch(baseURL + "/fetch/banners", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching banners: ${response.status}`);
    }

    const result = await response.json();

    // Check if the response has the expected structure
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: [] };
    }

    // Filter banners where bannerType is 'display'
    const displayBanners = result.data.filter(
      (banner) =>
        banner.bannerType &&
        banner.bannerType.trim().toLowerCase() === "display"
    );

    console.log("Display banners:", displayBanners);
    return { error: null, data: displayBanners };
  } catch (error) {
    console.error("Error fetching display banners:", error);
    return { error: error.message, data: [] };
  }
};

export const getServiceCategories = async () => {
  try {
    const response = await fetch(baseURL + "/get/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.status}`);
    }

    const result = await response.json();
    
    // Check if the response has the expected structure
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: [] };
    }

    // Filter categories where categoryType is 'service'
    const filteredCategories = result.data.filter(
      (category) => category.categoryType && 
                   category.categoryType.trim().toLowerCase() === "service"
    );

    console.log("Service categories:", filteredCategories);
    return { error: null, data: filteredCategories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: error.message, data: [] };
  }
};

export const getEcommerceCategories = async () => {
  try {
    const response = await fetch(baseURL + "/get/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.status}`);
    }

    const result = await response.json();
    
    // Check if the response has the expected structure
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: [] };
    }

    // Filter categories where categoryType is 'service'
    const filteredCategories = result.data.filter(
      (category) => category.categoryType && 
                   category.categoryType.trim().toLowerCase() === "ecommerce"
    );

    console.log("Ecommerce categories:", filteredCategories);
    return { error: null, data: filteredCategories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: error.message, data: [] };
  }
};

export const getServiceProductsByCategoryAndCar = async (categoryId, carId = 1) => {
  try {
    console.log(`API call - categoryId: ${categoryId}, carId: ${carId}`);
    
    const response = await fetch(`${baseURL}/categoryProductByCar/${categoryId}/${carId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }

    const result = await response.json();
    console.log("API response:", result);

    // Return the full response structure
    return { error: null, data: result.data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: error.message, data: null };
  }
};

export const getServiceProductDetails = async (productId) => {
  try {
    const response = await fetch(`${baseURL}/productDetails/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching product details: ${response.status}`);
    }

    const result = await response.json();

    // Check if the response has the expected structure
    if (!result || !result.data) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: null };
    }

    console.log("Fetched product details:", result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { error: error.message, data: null };
  }
};

export const getEcommerceProductsByCategoryAndCar = async (categoryId, carId = 1) => {
  try {
    console.log(`API call - categoryId: ${categoryId}, carId: ${carId}`);
    
    const response = await fetch(`${baseURL}/categoryProductByCar/${categoryId}/${carId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.status}`);
    }

    const result = await response.json();
    console.log("API response:", result);

    // Return the full response structure
    return { error: null, data: result.data };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: error.message, data: null };
  }
};

export const getEcommerceProductDetails = async (productId) => {
  try {
    const response = await fetch(`${baseURL}/productDetails/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching product details: ${response.status}`);
    }

    const result = await response.json();

    // Check if the response has the expected structure
    if (!result || !result.data) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: null };
    }

    console.log("Fetched product details:", result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { error: error.message, data: null };
  }
};

export const getCarBrand = async () => {
  try {
    const response = await fetch(baseURL + "/brand/getBrands", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching car brands: ${response.status}`);
    }

    const result = await response.json();

    // Check if the response has the expected structure
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: [] };
    }

    console.log("Car brands fetched:", result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.error("Error fetching car brands:", error);
    return { error: error.message, data: [] };
  }
};

export const getCarModelByBrand = async (brandId) => {
  try {
    const response = await fetch(`${baseURL}/modelbyBrand/${brandId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching models for brand ID ${brandId}: ${response.status}`);
    }

    const result = await response.json();

    // Check if the response has the expected structure
    if (!result.data || !Array.isArray(result.data)) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: [] };
    }

    console.log(`Models for brand ID ${brandId}:`, result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.error(`Error fetching models for brand ID ${brandId}:`, error);
    return { error: error.message, data: [] };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${baseURL}/user/registration`, { // Prepend baseURL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Send user data as JSON
    });

    if (!response.ok) {
      throw new Error(`Failed to register user: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (input, password) => {
  try {
    const response = await fetch(`${baseURL}/login/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, password }), // Send input (email/phone) and password
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result }; // Explicitly set success to true
    } else {
      return { success: false, data: result }; // Explicitly set success to false
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

export const generateOTP = async (email, otpType = 'registration') => {
  try {
    const response = await fetch(`${baseURL}/generateOtp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otpType }),
    });

    const result = await response.json();
    console.log('API Response:', result);

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { 
        success: false, 
        error: result.message || `Failed to generate OTP: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Error generating OTP:', error);
    return { success: false, error: error.message };
  }
};

export const verifyOTP = async (email, otpType = 'registration', otp) => {
  try {
    const response = await fetch(`${baseURL}/verifyOtp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otpType, otp }),
    });

    const result = await response.json();
    console.log('API Response:', result); 

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { 
        success: false, 
        error: result.message || `Failed to verify OTP: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email, password, otpId) => {
  try {
    const response = await fetch(`${baseURL}/user/updatepassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, otpId }), // Send email, password, and otpId
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};

export const addCar = async (userId, carData) => {

  try {
    const response = await fetch(`${baseURL}/user/${userId}/addcar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData), // Send car data as JSON
    });

    if (!response.ok) {
      throw new Error(`Failed to add car: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error adding car:', error);
    return { success: false, error: error.message };
  }
};

export const getCars = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/user/${userId}/getcars`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.statusText}`);
    }
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching cars:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCar = async (userId, carId) => {
  try {
    const response = await fetch(`${baseURL}/user/${userId}/${carId}/deletecar`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete car: ${response.statusText}`);
    }
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error deleting car:', error);
    return { success: false, error: error.message };
  }
};

export const addToCart = async (userId, payload) => {
  try {
    console.log('Payload:', payload); // Log the payload being sent
    const response = await fetch(`${baseURL}/cart/${userId}/addProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response:', response); // Log the raw response

    if (!response.ok) {
      throw new Error(`Failed to add product to cart: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Result:', result); 
    window.dispatchEvent(new Event("cart-updated"));
    return { success: true, data: result };
  } catch (error) {
    console.error('Error adding product to cart:', error);
    return { success: false, error: error.message };
  }
};

export const getCart = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/fetch/${userId}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Raw API Response:", response); // Log the raw response

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Parsed API Response:", result); // Log the parsed response

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { success: false, error: error.message };
  }
};

export const removeFromCart = async (userId, cartItemId) => {
  try {
    console.log("Removing item - User ID:", userId, "Cart Item ID:", cartItemId);
    
    // Make sure values are valid
    if (!userId || !cartItemId) {
      return { success: false, error: "Invalid userId or cartItemId" };
    }
    
    const url = `${baseURL}/cart/${userId}/${cartItemId}/remove`;
    console.log("API Request URL:", url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("Response status:", response.status);
    
    const resultText = await response.text();
    console.log("Raw response:", resultText);
    
    // Try to parse as JSON if possible
    let result;
    try {
      result = JSON.parse(resultText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      return { success: false, error: "Invalid response format" };
    }
    
    if (!response.ok) {
      console.error("Error response:", result);
      return { success: false, error: result.message || "Failed to remove item from cart" };
    }
    
    console.log("Successful response:", result);
    window.dispatchEvent(new Event("cart-updated"));
    return { success: true, data: result };
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return { success: false, error: error.message };
  }
};

export const cartIncreaseQuantity = async (userId, cartItemId) => {
  try {
    const response = await fetch(`${baseURL}/cart/${userId}/${cartItemId}/incQuantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to increase quantity: ${response.statusText}`);
    }
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error increasing quantity:', error);
    return { success: false, error: error.message };
  }
};

export const cartDecreaseQuantity = async (userId, cartItemId) => {
  try {
    const response = await fetch(`${baseURL}/cart/${userId}/${cartItemId}/decQuantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to decrease quantity: ${response.statusText}`);
    }
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    return { success: false, error: error.message };
  }
};

export const getAppSlots = async (appointmentDate) => {
  try {
    const response = await fetch(`${baseURL}/avialable/appointments?appointmentDate=${appointmentDate}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch appointment slots: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Fetched Appointment Slots for Date:", appointmentDate, result); // Debugging log
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching appointment slots:", error);
    return { success: false, error: error.message };
  }
};

export const createOrder = async (orderData) => {
  try {
    console.log("Creating order with data:", orderData);
    
    const formattedData = {
      ...orderData,
      totalValue: parseFloat(orderData.totalValue).toFixed(2)
    };
    
    console.log("Formatted order data:", formattedData);
    
    const response = await fetch(`${baseURL}/create/Order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from server:", errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Parsed error:", errorJson);
      } catch (e) {
      }
      
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Create order API response:", data);
    
    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};


export const addAddress = async (userId, payload) => {
  try {
    console.log("Payload being sent:", payload); // Log the payload
    const response = await fetch(`${baseURL}/user/${userId}/addAddress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log("Raw response:", response); // Log the raw response

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      console.error("Error response text:", errorText);
      throw new Error(`Failed to add address: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Parsed result:", result); // Log the parsed result
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in addAddress:", error);
    return { success: false, error: error.message };
  }
};

export const getAllAddresses = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/user/${userId}/getAddress`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch addresses: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Fetched Addresses:", result); // Debugging log
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return { success: false, error: error.message };
  }
};

export const deleteAddress = async (userId, addressId) => {
  try {
    const response = await fetch(`${baseURL}/user/${userId}/${addressId}/deleteAddress`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      console.error("Error response text:", errorText);
      throw new Error(`Failed to delete address: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Address deleted successfully:", result); // Debugging log
    return { success: true, data: result };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { success: false, error: error.message };
  }
};

export const editAddress = async (userId, addressId, payload) => {
  try {
    const response = await fetch(`${baseURL}/user/${userId}/${addressId}/editAddress`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      console.error("Error response text:", errorText);
      throw new Error(`Failed to edit address: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Address edited successfully:", result); // Debugging log
    return { success: true, data: result };
  } catch (error) {
    console.error("Error editing address:", error);
    return { success: false, error: error.message };
  }
};

export const getProfile = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/user/${userId}/getProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Fetched User Profile for User ID:", userId, result); // Debugging log

    // Return the whole result object
    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
};

export const updateProfile = async (userId, payload) => {
  try {
    const response = await fetch(`${baseURL}/user/${userId}/updateprofile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      console.error("Error response text:", errorText);
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Profile updated successfully:", result); // Debugging log
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }
};

export const getMyOrders = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/userOrders/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user orders: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Fetched Orders for User ID:", userId, result); // Debugging log
    
    // Return the whole result object
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await fetch(`${baseURL}/orderDetails/${orderId}?role=user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order details: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Fetched Order Details for Order ID:", orderId, result);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return { success: false, error: error.message };
  }
};

export const cancelOrder = async (userId, orderId) => {
  try {
    
    const response = await fetch(`${baseURL}/cancel/order`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        orderId
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || `Error: ${response.status} - ${response.statusText}` 
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred"
    };
  }
};

export const getProductDetails = async (productId, role, carId) => {
  try {
    const response = await fetch(
      `${baseURL}/productDetails/${productId}?role=${role}&carId=${carId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching product details: ${response.status}`);
    }

    const result = await response.json();

    if (!result?.data) {
      console.error("Unexpected API response format:", result);
      return { error: "Unexpected API response format", data: null };
    }

    console.log("Fetched product details:", result.data);
    return { error: null, data: result.data };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { error: error.message, data: null };
  }
};

// export const getBrands = async (categoryId) => {
//   try {
//     const response = await fetch(
//       `${baseURL}/get/${categoryId}/brandbyCategory`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Error fetching brands: ${response.status}`);
//     }

//     const result = await response.json();

//     if (!result?.data) {
//       console.error("Unexpected API response format:", result);
//       return { error: "Unexpected API response format", data: null };
//     }

//     console.log("Fetched brands:", result.data);
//     return { error: null, data: result.data };
//   } catch (error) {
//     console.error("Error fetching brands:", error);
//     return { error: error.message, data: null };
//   }
// };

export const getCoupons = async () => {
  try {
    const response = await fetch(`${baseURL}/fetch/coupons?role=user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch coupons: ${response.statusText}`);
    }
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return { success: false, error: error.message };
  }
};

export const applyCoupon = async (userId, couponId) => {
  try {
    const response = await fetch(`${baseURL}/coupon/apply/${userId}/${couponId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      throw new Error(`Failed to apply coupon: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Coupon applied result:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in applyCoupon:", error);
    return { success: false, error: error.message };
  }
};

export const deleteCoupon = async (userId) => {
  try {
    const response = await fetch(`${baseURL}/coupon/remove/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      console.error("Error response text:", errorText);
      throw new Error(`Failed to remove coupon: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Coupon removed successfully:", result); 
    return { success: true, data: result };
  } catch (error) {
    console.error("Error removing coupon:", error);
    return { success: false, error: error.message };
  }
};


const Services = () => {
};
 
export default Services;