import React, { useState, useEffect } from "react";
import { getUserId } from "../utils/auth";
import { getProfile, updateProfile } from "../pages/Services/Services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserId(); // Get userId from localStorage
      if (!userId) {
        setError("User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const result = await getProfile(userId); // Call the getProfile method
        console.log("API Response:", result); // Debugging log

        if (result.success) {
          // Check if data exists and has the expected structure
          const userData = result.data.data || result.data;

          const userInfo = {
            name: userData.username || "",
            email: userData.email || "",
            phone: userData.phone ? String(userData.phone) : "", // Convert to string if it's a number
          };

          // Set user data based on available fields
          setUser(userInfo);
          // Save original data for cancel functionality
          setOriginalUser(userInfo);

          console.log("Updated User State:", userInfo); // Debugging log
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
      // Prepare the payload for the API
      const payload = {
        name: user.name,
        email: user.email,
        phone: user.phone ? parseInt(user.phone, 10) : "" // Convert string to number for the API
      };

      const result = await updateProfile(userId, payload);

      if (result.success) {
        // Update was successful
        setOriginalUser({ ...user }); // Update original user data
        setIsEditing(false);
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Handle update error
        setError(result.error || "Failed to update profile.");
        toast.error(`Failed to update profile.: ${result.error}`, {
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
    // Revert to original data
    setUser({ ...originalUser });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-4xl mx-auto px-6">
        <ToastContainer />

        <h1 style={{ marginTop: 60 }} className="text-3xl font-bold text-[#8B1E51] mb-6">
          My Profile
        </h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            ) : (
              <p className="text-gray-800">{user.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            ) : (
              <p className="text-gray-800">{user.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            ) : (
              <p className="text-gray-800">{user.phone}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-[#8B1E51] text-white font-medium rounded-md hover:bg-[#6e1641] transition-colors"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-[#8B1E51] text-white font-medium rounded-md hover:bg-[#6e1641] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;