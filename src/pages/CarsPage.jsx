import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars, deleteCar } from '../pages/Services/Services';
import { getUserId } from '../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelectedCar } from '../contexts/SelectedCarContext';
import CarCard from './CarCard';

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedCar, setSelectedCar } = useSelectedCar();

  // Handle car selection/deselection
  const handleCarClick = (car) => {
    const userId = getUserId();
    if (!userId) {
      console.error('User ID not found. Cannot select car.');
      return;
    }

    // Check if this car is already selected
    let isCurrentlySelected = false;

    try {
      const savedSelectedCarString = localStorage.getItem(`selectedCar_${userId}`);
      if (savedSelectedCarString) {
        const savedSelectedCar = JSON.parse(savedSelectedCarString);
        isCurrentlySelected = Number(savedSelectedCar.id) === Number(car.id);
      }
    } catch (error) {
      console.error('Error checking if car is selected:', error);
    }

    if (isCurrentlySelected) {
      // Deselect the car
      setSelectedCar(null);
      localStorage.removeItem(`selectedCar_${userId}`);
      console.log(`Deselected Car: ${car.brand} ${car.model}`);
    } else {
      // Select the car
      setSelectedCar(car);
      localStorage.setItem(`selectedCar_${userId}`, JSON.stringify(car));
      console.log(`Selected Car: ${car.brand} ${car.model}`);
    }

    // Trigger a car-updated event so all cards refresh their selection state
    window.dispatchEvent(new Event('car-updated'));
  };

  const handleDeleteCar = async (carId) => {
    const userId = getUserId();
    if (!userId) {
      console.error('User ID not found. Cannot delete car.');
      return;
    }

    try {
      const result = await deleteCar(userId, carId);

      if (result.success) {
        setCars((prevCars) => prevCars.filter((car) => car.id !== carId));

        try {
          const savedSelectedCarString = localStorage.getItem(`selectedCar_${userId}`);
          if (savedSelectedCarString) {
            const savedSelectedCar = JSON.parse(savedSelectedCarString);
            if (Number(savedSelectedCar.id) === Number(carId)) {
              localStorage.removeItem(`selectedCar_${userId}`);
              setSelectedCar(null);

              window.dispatchEvent(new Event('car-updated'));
            }
          }
        } catch (error) {
          console.error('Error handling selection after delete:', error);
        }

        console.log(`Car with ID ${carId} deleted successfully.`);
      } else {
        console.error('Failed to delete car:', result.message);
        setError('Failed to delete the car. Please try again.');
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

        if (result && result.success) {
          const apiResponse = result.data;

          if (Array.isArray(apiResponse) && apiResponse.length > 0) {
            setCars(apiResponse);
            console.log('Cars state updated:', apiResponse);
          } else if (apiResponse && apiResponse.data && Array.isArray(apiResponse.data)) {
            setCars(apiResponse.data);
            console.log('Cars state updated:', apiResponse.data);
          } else {
            console.warn('No cars found for this user.');
            setCars([]);
          }
        } else {
          console.error('Invalid response from getCars:', result);
          setCars([]);
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();

    const handleAuthEvent = () => {
      console.log('CarsPage detected car-updated event - fetching cars again');
      fetchCars();
    };

    window.addEventListener('car-updated', handleAuthEvent);

    return () => {
      window.removeEventListener('car-updated', handleAuthEvent);
    };
  }, [setSelectedCar]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-28 w-28 border-t-2 border-b-2 border-[#8B1E51]"></div>
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
                <CarCard
                  key={car.id}
                  car={car}
                  onCarClick={handleCarClick}
                  onDeleteCar={handleDeleteCar}
                />
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