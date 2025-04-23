import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEcommerceCategories } from '../pages/Services/Services.jsx';

const EcommerceSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getEcommerceCategories();
        if (!response.error) {
          setCategories(response.data); // Set the fetched categories
        } else {
          setError(response.error);
          console.error("Error fetching ecommerce categories:", response.error);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error in fetch operation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/ecommerce/${categoryId}`);
  };

  if (loading) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* <p>Loading categories...</p> */}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-500">Error loading categories: {error}</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>No categories available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#8B1E51]">Ecommerce</h2>
          <p className="text-gray-600 mt-2">Shop for quality auto parts and accessories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#F6FBFB] p-5 rounded-xl border border-[#8B1E51] flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCategoryClick(category.id)}
            >
              <img
                src={`data:image/jpeg;base64,${category.image_data}`} // Properly format base64 image
                alt={category.name}
                className="w-20 h-20 object-contain mb-3"
              />
              <h3 className="text-base font-semibold text-gray-800">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcommerceSection;