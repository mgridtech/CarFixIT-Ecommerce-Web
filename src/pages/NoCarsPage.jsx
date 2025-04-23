import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getCars } from '../pages/Services/Services'; // Import the getCars method
import { getUserId } from '../utils/auth'; // Import getUserId to retrieve userId from localStorage

const NoCarsPage = () => {
  const [hasCars, setHasCars] = useState(false); // State to track if the user has cars
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(''); // State to track errors

  useEffect(() => {
    const fetchCars = async () => {
      const userId = getUserId(); // Retrieve userId from localStorage
      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const result = await getCars(userId); // Fetch cars for the logged-in user
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          setHasCars(true); // User has at least one car
        } else {
          setHasCars(false); // No cars found
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
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

  if (hasCars) {
    return null; // Do not render anything if the user has cars
  }

  return (
    <section className="w-full py-12 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
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
    </section>
  );
};

export default NoCarsPage;