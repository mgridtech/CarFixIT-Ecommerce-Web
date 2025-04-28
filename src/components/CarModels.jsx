import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCarModelByBrand } from "../pages/Services/Services.jsx"; // Adjust the import path as needed

const CarModels = ({ onBack }) => {
  const { brandId } = useParams(); // Get brandId from the URL
  const navigate = useNavigate(); // Use navigate for redirection
  const [models, setModels] = useState([]); // Initialize models as an empty array
  const [brandName, setBrandName] = useState(''); // Store the brand name
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const { error, data } = await getCarModelByBrand(brandId);
        if (error) {
          throw new Error(error);
        }
        if (data && Array.isArray(data)) {
          // Map the models to include the full Base64 image source
          const modelsWithImages = data.map((model) => ({
            ...model,
            image: `data:image/jpeg;base64,${model.image}`, // Convert Base64 to image source
          }));
          setModels(modelsWithImages); // Set the models array
          setBrandName(data[0]?.brandName || ''); // Use the brandName from the first model
        } else {
          setModels([]); // Fallback to an empty array if data is not valid
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [brandId]);

  if (loading) {
    // Show the loader while data is being fetched
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-8">{error}</p>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-[#8B1E51] hover:text-[#6e1641] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Brands
          </button>
        </div>
        <h1 className="text-3xl font-bold text-[#8B1E51] mb-8 text-center">Select {brandName.charAt(0).toUpperCase() + brandName.slice(1)} Model</h1>
        {models.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No models available for this brand</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {models.map((model, index) => (
              <button
                key={index}
                onClick={() => navigate(`/car-details/${model.id}`)} // Navigate to CarDetailsForm with model ID
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col h-full"
              >
                <div className="relative pt-[56.25%] bg-gray-100"> {/* 16:9 aspect ratio container */}
                  {model.image ? (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">Image not available</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{model.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{brandName}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CarModels;