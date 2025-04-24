import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from local storage or API
    const fetchUserData = async () => {
      // Simulate fetching user data
      const userData = JSON.parse(localStorage.getItem("user")) || {
        name: "",
        email: "",
        phone: "",
      };
      setUser(userData);
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

  const handleSave = () => {
    // Save updated user data to local storage or API
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <section className="w-full py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 style={{marginTop:60}} className="text-3xl font-bold text-[#8B1E51] mb-6">My Profile</h1>
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
          <div className="flex justify-end">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#8B1E51] text-white font-medium rounded-md hover:bg-[#6e1641] transition-colors"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
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