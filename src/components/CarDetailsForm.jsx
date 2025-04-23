import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCar } from '../pages/Services/Services';
import { getUserId } from '../utils/auth';

const CarDetailsForm = ({ onBack }) => {
  const navigate = useNavigate();
  const { admincarId } = useParams(); // Retrieve admincarId from the URL
  const [formData, setFormData] = useState({
    plateNumber: '',
    transmissionId: '',
    fuelTypeId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fuelTypes = [
    { id: 1, name: 'Petrol' },
    { id: 2, name: 'Diesel' },
    { id: 3, name: 'CNG' },
    { id: 4, name: 'Electric' },
    { id: 5, name: 'Hybrid' },
  ];

  const transmissionTypes = [
    { id: 1, name: 'Manual' },
    { id: 2, name: 'Automatic' },
    { id: 3, name: 'Semi-Automatic' },
    { id: 4, name: 'Electric' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate(-1); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userId = getUserId(); // Retrieve userId from localStorage
      if (!userId) {
        setError('User ID not found. Please log in again.');
        return;
      }

      // Include admincarId from the URL in the payload
      const payload = { ...formData, admincarId };
      console.log('Payload sent to addCar:', payload);

      const result = await addCar(userId, payload);
      if (result.success) {
        setSuccess('Car added successfully!');
        setError('');
        navigate('/cars'); // Redirect to the cars page
      } else {
        setError(result.error || 'Failed to add car. Please try again.');
      }
    } catch (err) {
      console.error('Error adding car:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-12">
      <div className="max-w-2xl mx-auto px-6">
        <button
          onClick={onBack}
          type="button"
          className="mb-6 flex items-center text-[#8B1E51] hover:text-[#6e1641]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Models
        </button>

        <h1 className="text-3xl font-bold text-[#8B1E51] mb-8 text-center">Enter Car Details</h1>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-2 bg-green-50 text-green-600 text-sm rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Plate Number</label>
            <input
              type="text"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="Enter Plate Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transmission Type</label>
            <select
              name="transmissionId"
              value={formData.transmissionId}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="" disabled>
                Select Transmission Type
              </option>
              {transmissionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fuel Type</label>
            <select
              name="fuelTypeId"
              value={formData.fuelTypeId}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              required
            >
              <option value="" disabled>
                Select Fuel Type
              </option>
              {fuelTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#8B1E51] text-white rounded hover:bg-[#6e1641] transition"
            >
              Add Car
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CarDetailsForm;