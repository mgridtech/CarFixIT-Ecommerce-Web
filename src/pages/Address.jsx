import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import DateTimePicker from '../components/DateTimePicker';
import { getUserId } from '../utils/auth';
import { createOrder, addAddress, getAllAddresses, deleteAddress, editAddress } from '../pages/Services/Services';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Address = () => {
  const [serviceType, setServiceType] = useState('');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchAddresses = async () => {
      const userId = getUserId();
      try {
        const result = await getAllAddresses(userId);
        if (result && result.data) {
          console.log("Addresses fetched successfully:", result.data);
          setAddresses(result.data);
        } else {
          toast.error("Failed to fetch addresses", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`Error fetching addresses: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      // Try to get the price from localStorage
      const storedPrice = localStorage.getItem(`checkoutTotalPrice_${userId}`);
      console.log("Retrieved price from localStorage:", storedPrice);

      if (storedPrice) {
        // Make sure we're parsing it as a float and handle any formatting
        const parsedPrice = parseFloat(storedPrice);
        if (!isNaN(parsedPrice)) {
          setTotalPrice(parsedPrice);
          console.log("Set total price to:", parsedPrice);
        } else {
          console.error("Failed to parse price:", storedPrice);
        }
      } else {
        console.warn("No price found in localStorage for user:", userId);

        // As a fallback, check if there's price in the location state (from navigation)
        const location = useLocation();
        if (location.state && location.state.totalPrice) {
          setTotalPrice(location.state.totalPrice);
          console.log("Using price from navigation state:", location.state.totalPrice);
        }
      }
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceTypeChange = (type) => {
    console.log(`Service type changed to: ${type}`);
    console.log(`Current addresses:`, addresses);

    setServiceType(type);
    setShowDateTimePicker(false);
    setIsAddingAddress(false);
    setSelectedAddressId(null);
  };

  const handleDateTimeSelect = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setFormData({
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    });
    setEditingAddressId(null);
  };

  const handleSaveAddress = async () => {
    const userId = getUserId();

    const payload = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode,
    };

    console.log("Payload being sent:", payload);

    try {
      let result;

      if (editingAddressId) {
        result = await editAddress(userId, editingAddressId, payload);
      } else {
        result = await addAddress(userId, payload);
      }

      if (result.success) {
        toast.success(
          editingAddressId
            ? "Address updated successfully!"
            : "Address saved successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );

        const updatedAddresses = await getAllAddresses(userId);
        if (updatedAddresses.success) {
          setAddresses(updatedAddresses.data);
          setIsAddingAddress(false);
          setEditingAddressId(null);
        }
      } else {
        toast.error(
          editingAddressId
            ? `Failed to update address: ${result.error}`
            : `Failed to save address: ${result.error}`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      toast.error(
        editingAddressId
          ? `Error updating address: ${error.message}`
          : `Error saving address: ${error.message}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleEditAddress = (address) => {
    setFormData(address);
    setEditingAddressId(address.id);
    setIsAddingAddress(true);
    setSelectedAddressId(null);
    setShowDateTimePicker(false);
  };

  const handleDeleteAddress = async (id) => {
    const userId = getUserId();

    try {
      const result = await deleteAddress(userId, id);

      if (result.success) {
        toast.success("Address deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        if (Array.isArray(addresses)) {
          setAddresses(addresses.filter((addr) => addr.id !== id));
        } else {
          console.error("Addresses state is not an array:", addresses);
          setAddresses([]);
        }

        if (selectedAddressId === id) {
          setSelectedAddressId(null);
          setShowDateTimePicker(false);
        }
      } else {
        toast.error(`Failed to delete address: ${result.error}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(`Error deleting address: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


  const isFormValid = () => {
    if (!serviceType) return false;

    if (serviceType === 'walkin') {
      return selectedDateTime !== null;
    }

    if (serviceType === 'pickup') {
      return selectedAddressId !== null && selectedDateTime !== null;
    }

    return false;
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    setShowDateTimePicker(true);
  };

  // In your handleSubmit function, modify the code as follows:

const handleSubmit = async (e) => {
  e.preventDefault();

  const userId = getUserId();
  if (!userId) {
    toast.error("User not logged in. Please log in to add products to the cart.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  const carIdValue = localStorage.getItem(`selectedCar_${userId}`);
  let carId;
  try {
    const parsedCar = JSON.parse(carIdValue);
    carId = parsedCar.id || parsedCar;
  } catch (e) {
    carId = carIdValue;
  }

  if (!carId || carId === "undefined" || carId === "null") {
    toast.error("No car selected. Please select a car before proceeding.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  console.log("Selected Car ID:", carId);

  const addressesData = addresses && addresses.data ? addresses.data : [];

  const selectedAddress = addressesData.find(addr => addr.id === selectedAddressId);

  if (serviceType === "pickup" && !selectedAddress) {
    toast.error("Please select a valid address for pickup service.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  const formattedAddress = serviceType === "pickup" && selectedAddress
    ? `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pincode}`
    : serviceType === "walkin"
      ? "MGrid Tech, KK Convention Road"
      : null;

  if (!selectedDateTime) {
    toast.error("Please select a valid appointment time.", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  // Double check the value is correctly being read from localStorage
  console.log("Total price from state:", totalPrice);
  
  // Try different formats for the price to ensure backend compatibility
  const formattedTotalValue = parseFloat(totalPrice).toFixed(2);
  
  const orderData = {
    userId: parseInt(userId),
    carId: parseInt(carId),
    userAddress: formattedAddress,
    appointmentDate: selectedDateTime.date,
    appointmentTime: selectedDateTime.appointmentId,
    appointmentId: selectedDateTime.appointmentId,
    deliveryType: serviceType === "pickup" ? "delivery" : "walkin",
    paymentMethod: "Cash on delivery",
    // Try both field names to see if that's the issue
    totalValue: formattedTotalValue,
    totalAmount: formattedTotalValue, // Adding this as a backup in case backend expects this name
  };

  console.log("Final order data being sent:", orderData);

  try {
    // Before sending, log the data as it would appear in the network request
    console.log("JSON data for request:", JSON.stringify(orderData));
    
    const result = await createOrder(orderData);
    console.log("Raw API response:", result);
    
    if (result.success) {
      console.log("Order saved successfully:", result.data);
      
      // Immediately attempt to fetch the new order to verify the price
      // Add code here if you have a getOrder function to confirm the price was saved
      
      toast.success("Order created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Also save the correct price in localStorage for the confirmation page
      localStorage.setItem('lastOrderTotalValue', formattedTotalValue);
      
      clearCart();
      navigate("/order-confirmation");
    } else {
      console.error("Failed to save order:", result.error);
      toast.error(`Failed to save order: ${result.error}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  } catch (error) {
    console.error("Error saving order:", error);
    toast.error(`An unexpected error occurred: ${error.message}`, {
      position: "top-right",
      autoClose: 3000,
    });
  }
};


  console.log("Current addresses in state:", addresses);
  console.log("Current service type:", serviceType);

  return (
    <section className="w-full py-12">
      <div className="max-w-4xl mx-auto px-6">
        <ToastContainer />

        <div className="mb-8 text-center mt-12">
          <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">How would you like your service?</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Service Type Selection */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="walkin"
                  checked={serviceType === 'walkin'}
                  onChange={() => handleServiceTypeChange('walkin')}
                  className="h-5 w-5 text-[#8B1E51] focus:ring-[#8B1E51]"
                />
                <span className="ml-2 text-gray-700">Walk-in Service</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="pickup"
                  checked={serviceType === 'pickup'}
                  onChange={() => handleServiceTypeChange('pickup')}
                  className="h-5 w-5 text-[#8B1E51] focus:ring-[#8B1E51]"
                />
                <span className="ml-2 text-gray-700">Pickup/Doorstep Service</span>
              </label>
            </div>
          </div>

          {/* Walk-in Date/Time Selection */}
          {serviceType === 'walkin' && (
            <div className="mb-8">
              <DateTimePicker onDateTimeSelect={handleDateTimeSelect} />
              {selectedDateTime && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    Selected appointment: {selectedDateTime.date} at {selectedDateTime.time}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Address Management for Pickup */}
          {serviceType === 'pickup' && (
            <div className="mb-8">
              {!isAddingAddress && (
                <>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    {addresses.length > 0 ? 'Saved Addresses' : 'Add your delivery address'}
                  </h3>

                  {addresses && addresses.data && addresses.data.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {addresses.data.map((address) => (
                        <div
                          key={address.id}
                          className={`border p-4 rounded-md ${selectedAddressId === address.id ? 'border-[#8B1E51] bg-[#f8e8ee]' : 'border-gray-200'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{address.address}</p>
                              <p>{address.city}, {address.state} {address.pincode}</p>
                              <p>{address.country}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                              <button
                                type="button"
                                onClick={() => handleEditAddress(address)}
                                className="text-[#8B1E51] hover:text-[#6e1641] text-sm"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                              {selectedAddressId !== address.id && (
                                <button
                                  type="button"
                                  onClick={() => handleSelectAddress(address.id)}
                                  className="px-3 py-1 bg-[#8B1E51] text-white rounded-md text-sm"
                                >
                                  Select
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="w-full py-2 border-2 border-dashed border-[#8B1E51] text-[#8B1E51] rounded-md hover:bg-[#f8e8ee] transition-colors mb-6"
                  >
                    {addresses.length > 0 ? '+ Add Another Address' : '+ Add New Address'}
                  </button>
                </>
              )}

              {/* Address Form */}
              {isAddingAddress && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-gray-700 mb-2">Address*</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1E51]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-gray-700 mb-2">City*</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1E51]"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-gray-700 mb-2">State*</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1E51]"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-gray-700 mb-2">Country*</label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1E51]"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-gray-700 mb-2">Zip Code*</label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1E51]"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAddress(false);
                          setEditingAddressId(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        className="px-4 py-2 bg-[#8B1E51] text-white rounded-md hover:bg-[#6e1641]"
                      >
                        {editingAddressId ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Date/Time Picker after address selection */}
              {showDateTimePicker && (
                <div className="mb-8">
                  <DateTimePicker onDateTimeSelect={handleDateTimeSelect} />
                  {selectedDateTime && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-gray-700">
                        Selected pickup: {selectedDateTime.date} at {selectedDateTime.time}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="px-6 py-2 border border-[#8B1E51] text-[#8B1E51] rounded-md hover:bg-[#f8e8ee] transition-colors"
            >
              Back to Cart
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="px-6 py-2 bg-[#8B1E51] text-white rounded-md hover:bg-[#6e1641] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Proceed to Pay (₹{totalPrice.toLocaleString()})
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Address;