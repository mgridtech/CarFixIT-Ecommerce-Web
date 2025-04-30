import React, { useState, useEffect } from "react";
import { getUserId } from "../utils/auth";
import { getProfile, updateProfile } from "../pages/Services/Services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Phone, Edit, Save, X, ShoppingBag, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [originalUser, setOriginalUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserId();
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const result = await getProfile(userId);
        if (result.success) {
          const userData = result.data.data || result.data;
          const userInfo = {
            name: userData.username || "",
            email: userData.email || "",
            phone: userData.phone ? String(userData.phone) : "",
          };
          setUser(userInfo);
          setOriginalUser(userInfo);
        } else {
          setError(result.error || "Failed to fetch user profile.");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching the profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const userId = getUserId();
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    setUpdateLoading(true);

    try {
      const payload = {
        name: user.name,
        email: user.email,
        phone: user.phone ? parseInt(user.phone, 10) : ""
      };

      const result = await updateProfile(userId, payload);
      if (result.success) {
        setOriginalUser({ ...user });
        setIsEditing(false);
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        setError(result.error || "Failed to update profile.");
        toast.error(`Failed to update profile: ${result.error}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      setError("An unexpected error occurred while updating the profile.");
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setUser({ ...originalUser });
    setIsEditing(false);
  };

  const handleOrdersClick = () => {
    navigate("/my-orders");
  };

  const handleAddressesClick = () => {
    navigate("/my-addresses");
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <ToastContainer />

        <h1 style={{ marginTop: 60 }} className="text-3xl font-bold text-[#8B1E51] mb-6 flex items-center">
          <User className="mr-2" size={28} />
          My Profile
        </h1>

        {/* Main Profile Card - Fixed Alignment */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Personal Information</h2>

          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <User className="mr-2 text-[#8B1E51]" size={18} />
              Name
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E51] focus:border-transparent outline-none transition"
                  placeholder="Enter your name"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <User className="text-[#8B1E51] mr-3" size={18} />
                <span className="text-gray-800 py-2">
                  {user.name || "Not provided"}
                </span>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <Mail className="mr-2 text-[#8B1E51]" size={18} />
              Email
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="text-gray-400" size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E51] focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <Mail className="text-[#8B1E51] mr-3" size={18} />
                <span className="text-gray-800 py-2">
                  {user.email || "Not provided"}
                </span>
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <Phone className="mr-2 text-[#8B1E51]" size={18} />
              Phone
            </label>
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Phone className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E51] focus:border-transparent outline-none transition"
                  placeholder="Enter your phone number"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <Phone className="text-[#8B1E51] mr-3" size={18} />
                <span className="text-gray-800 py-2">
                  {user.phone || "Not provided"}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  disabled={updateLoading}
                >
                  <X className="mr-2" size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#8B1E51] text-white font-medium rounded-lg hover:bg-[#6e1641] transition-colors flex items-center"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-[#8B1E51] text-white font-medium rounded-lg hover:bg-[#6e1641] transition-colors flex items-center"
              >
                <Edit className="mr-2" size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Quick Access Boxes */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Orders Box */}
          <div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleOrdersClick}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#8B1E51]/10 p-3 rounded-full flex items-center justify-center w-10 h-10">
                <ShoppingBag className="text-[#8B1E51] h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">My Orders</h3>
            </div>
            <p className="text-gray-600">View and track all your orders and purchases</p>
          </div>

          {/* Addresses Box */}
          <div
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleAddressesClick}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#8B1E51]/10 p-3 rounded-full flex items-center justify-center w-10 h-10">
                <MapPin className="text-[#8B1E51] h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">My Addresses</h3>
            </div>
            <p className="text-gray-600">Manage your shipping and billing addresses</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;