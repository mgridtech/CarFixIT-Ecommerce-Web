import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars, deleteCar } from '../pages/Services/Services';
import { getUserId } from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import loaderSvg from '../assets/oval.svg'; // Import the loader
import { useSelectedCar } from '../contexts/SelectedCarContext';


const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { setSelectedCar } = useSelectedCar();

  // Helper function to capitalize the first letter of each word
  const capitalize = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleCarClick = (car) => {
    setSelectedCar(car); // Update the selected car in the context and localStorage
    console.log(`Selected Car: ${car.brand} ${car.model}`);
  };

  const handleDeleteCar = async (carId) => {
    const userId = getUserId(); // Get the current user ID from localStorage or auth utility
    if (!userId) {
      console.error('User ID not found. Cannot delete car.');
      return;
    }

    try {
      const result = await deleteCar(userId, carId); // Call the deleteCar API
      console.log('Delete Response:', result);

      if (result.success) {
        // Remove the deleted car from the state
        setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
        console.log(`Car with ID ${carId} deleted successfully.`);
      } else {
        console.error('Failed to delete car:', result.message);
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      setError('Failed to delete the car. Please try again.');
    }
  };


  useEffect(() => {
    const fetchCars = async () => {
      const userId = getUserId();
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const result = await getCars(userId);
        console.log('API Response:', result);

        // Check if the API response is valid and contains cars
        if (result && result.success) {
          const apiResponse = result.data;

          if (Array.isArray(apiResponse) && apiResponse.length > 0) {
            // If the response is an array of cars
            setCars(apiResponse);
            console.log('Cars state updated:', apiResponse);
          } else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
            // If the response contains a nested data array
            setCars(apiResponse.data);
            console.log('Cars state updated:', apiResponse.data);
          } else {
            // No cars found
            console.warn('No cars found for this user.');
            setCars([]); // Set cars to an empty array
          }
        } else {
          console.error('Invalid response from getCars:', result);
          setCars([]); // Set cars to an empty array
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img
          src={loaderSvg}
          alt="Loading..."
          className="w-58 h-58 animate-spin"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        {cars && cars.length > 0 ? (
          <>
            <div className="text-center mb-10 mt-10">
              <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">Your Cars</h1>
              <p className="text-gray-600">Here's a list of your saved cars</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100 relative cursor-pointer"
                  onClick={() => handleCarClick(car)} // Handle click event
                >
                  {/* Delete Icon */}
                  <button
                    className="absolute top-2 right-2 text-[#8B1E51] hover:text-[#6e1641] transition"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the card click event
                      handleDeleteCar(car.id); // Call the delete handler
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                  </button>

                  <h2 className="text-2xl font-semibold text-[#8B1E51] mb-2">
                    {capitalize(car.brand)} {capitalize(car.model)}
                  </h2>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li><span className="font-medium">Plate Number:</span> {car.plateNumber}</li>
                    <li><span className="font-medium">Fuel Type:</span> {car.fuelType}</li>
                    <li><span className="font-medium">Transmission Type:</span> {car.transmission}</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/add-car"
                className="inline-block px-6 py-3 bg-[#8B1E51] text-white font-medium rounded-md shadow hover:bg-[#6e1641] transition"
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
                Add Another Car
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-8 mt-18">
              <FontAwesomeIcon
                icon={faCar}
                className="text-[#8B1E51] text-7xl mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#8B1E51] mb-4">Your Garage is Empty</h1>
            <p className="mb-6 text-gray-600">You haven't added any cars yet. Start by adding your first vehicle to manage all your car details in one place.</p>
            <Link
              to="/add-car"
              className="inline-flex items-center px-6 py-3 bg-[#8B1E51] text-white rounded-md hover:bg-[#6e1641] transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
              Add Your First Car
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarsPage;