import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarBrands from '../components/CarBrands';
import CarModels from '../components/CarModels';
import CarDetailsForm from '../components/CarDetailsForm';
import { getCarBrand } from "../pages/Services/Services.jsx";

const AddCarPage = () => {
  const [step, setStep] = useState(1);
  const [carBrands, setCarBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarBrands = async () => {
      setLoading(true); // Start loading
      try {
        const { error, data } = await getCarBrand();
        if (error) {
          throw new Error(error);
        }
        // Map the data to include the full image source
        const brandsWithImages = data.map((brand) => ({
          ...brand,
          image: `data:image/png;base64,${brand.image}`, // Convert Base64 to image source
        }));
        setCarBrands(brandsWithImages);
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCarBrands();
  }, []);

  const handleBrandSelect = (brand) => {
    console.log("Selected Brand:", brand); // Debugging log
    setSelectedBrand(brand);
    navigate(`/car-models/${brand.id}`); // Navigate to the next page with the brand ID in the URL
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setStep(3);
  };

  const handleSubmitCarDetails = (carDetails) => {
    const newCar = {
      brand: selectedBrand,
      model: selectedModel,
      ...carDetails
    };

    // Save to localStorage
    const existingCars = JSON.parse(localStorage.getItem('userCars') || '[]');
    const updatedCars = [...existingCars, newCar];
    localStorage.setItem('userCars', JSON.stringify(updatedCars));

    navigate('/cars');
  };

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
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-500">Error loading car brands: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add a New Car</h1>

      {step === 1 && <CarBrands brands={carBrands} onSelect={handleBrandSelect} />}
      {step === 2 && (
        <CarModels
          brand={selectedBrand}
          models={[]} // Models should be fetched dynamically if needed
          onSelect={handleModelSelect}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <CarDetailsForm
          onSubmit={handleSubmitCarDetails}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
};

export default AddCarPage;