import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServiceCategories } from "../pages/Services/Services.jsx";

const ServicesSection = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await getServiceCategories();
        if (!response.error) {
          setServices(response.data);
        } else {
          setError(response.error);
          console.error("Error fetching services:", response.error);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error in fetch operation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  if (loading) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* <p>Loading services...</p> */}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-500">Error loading services: {error}</p>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>No services available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#8B1E51]">Services</h2>
        </div>

        {/* Center the grid based on the number of services */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-center`}
        >
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[#F6FBFB] p-5 rounded-xl border border-[#8B1E51] flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleServiceClick(service.id)}
            >
              <img
                src={`data:image/jpeg;base64,${service.image_data}`}
                alt={service.name}
                className="w-20 h-20 object-contain mb-3"
              />
              <h3 className="text-base font-semibold text-gray-800">{service.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;