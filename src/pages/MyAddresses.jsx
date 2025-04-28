import React, { useState, useEffect } from 'react';
import { getUserId } from '../utils/auth';
import { getAllAddresses, addAddress, deleteAddress, editAddress } from '../pages/Services/Services';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

        fetchAddresses();
        setIsAddingAddress(false);
        setEditingAddressId(null);
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

        fetchAddresses();
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

  return (
    <section className="w-full py-12">
      <div className="max-w-4xl mx-auto px-6">
        <ToastContainer />

        <div className="mb-8 text-center mt-12">
          <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">My Addresses</h1>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Add New Address Button at the top */}
          <button
            type="button"
            onClick={handleAddAddress}
            className="w-full py-2 mb-6 border-2 border-dashed border-[#8B1E51] text-[#8B1E51] rounded-md hover:bg-[#f8e8ee] transition-colors"
          >
            + Add New Address
          </button>

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
                    placeholder='Plot No. and Street'
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
                    placeholder='City'
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
                        placeholder='State'
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
                        placeholder='Country'
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
                        placeholder='Zip Code'
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

          {/* Addresses List */}
          {!isAddingAddress && (
            <>

              {addresses && addresses.data && addresses.data.length > 0 ? (
                <div className="space-y-4">
                  {addresses.data.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gray-200 p-4 rounded-md hover:border-[#8B1E51] transition-colors"
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't saved any addresses yet.</p>
                  <p className="text-gray-500">Add an address to make checkout faster.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyAddresses;