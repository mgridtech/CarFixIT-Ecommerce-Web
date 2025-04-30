import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import carImage from '../assets/images/logo1.png';
import { loginUser } from './Services/Services';
import { setAuth } from '../utils/auth';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the login API
      const result = await loginUser(formData.email, formData.password);

      if (result.success) {
        console.log('Login successful:', result.data);

        const userId = result.data.user?.id;
        console.log('User ID to be stored in localStorage:', userId);
        setAuth(true, userId);
        onLogin(); 
        navigate('/');
      } else {
        // Handle API error message if available
        setError(result.data?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="w-full md:w-1/2 lg:w-1/2 md:pl-8 lg:p-16">
          <img
            className="w-full max-w-md mx-auto md:mx-a h-auto object-cover rounded-lg mb-8"
            src={carImage}
            alt="Professional car service"
          />
        </div>
        <div className="lg:w-1/3 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-2xl font-medium title-font mb-5">Welcome Back!</h2>

          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">E-mail or Phone Number</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="Your E-mail or Phone Number"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="Your Password"
                required
              />
            </div>
            {/* <div className="flex items-center mb-6">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div> */}
            <button
              type="submit"
              disabled={isLoading}
              className={`text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
            <Link to="/forgot-password" className="text-xs text-blue-500 hover:text-blue-700">
              Forgot password?
            </Link>
            <Link to="/signup" className="text-xs text-blue-500 hover:text-blue-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}