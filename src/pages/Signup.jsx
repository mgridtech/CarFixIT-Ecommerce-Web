import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import carImage from '../assets/images/logo1.png';
import { registerUser } from './Services/Services';
import { generateOTP } from './Services/Services';
import { verifyOTP } from './Services/Services';


export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otpId: null, // Initialize otpId as null
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpFields, setShowOtpFields] = useState(false); // State to show OTP fields
  const [otp, setOtp] = useState(['', '', '', '']); // State for OTP input
  const [showOtpPopup, setShowOtpPopup] = useState(false); // State to show OTP popup
  const [timer, setTimer] = useState(120); // Timer state (2 minutes = 120 seconds)
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Disable resend button initially
  const otpRefs = useRef([]); // References for OTP input boxes
  const navigate = useNavigate();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpId, setOtpId] = useState(null); // Separate state for otpId

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Restrict input to one character
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input box
    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      const result = await generateOTP(formData.email, 'registration'); // Call generateOTP with email and otpType
      if (result.success) {
        console.log('OTP generated successfully:', result.data);
        setError('OTP has been sent to your email.'); // Set success message
        setShowOtpFields(true); // Show OTP fields only on success
      } else {
        console.error('Failed to generate OTP:', result.error);
        setError(result.data?.message || 'Failed to generate OTP. Please try again.'); // Use API response message
        setShowOtpFields(false); // Hide OTP fields on error
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError('An error occurred while generating OTP. Please try again.'); // Set generic error message
      setShowOtpFields(false); // Hide OTP fields on error
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join(''); // Combine the OTP digits into a single string
    console.log('Verifying OTP:', enteredOtp);

    try {
      const result = await verifyOTP(formData.email, 'registration', enteredOtp); // Call verifyOTP with email, otpType, and otp
      if (result.success) {
        console.log('OTP verified successfully:', result.data);

        // Store the OTP ID in the `otpId` state
        const otpRecordId = result.data.data.otprecordid;
        console.log(otpRecordId,"111");
        
        setOtpId(otpRecordId); // Store otpId in a separate state
        console.log('Stored otpId:', otpRecordId); // Debugging log

        setError('OTP verified successfully!'); // Set success message
        setShowOtpFields(false); // Hide OTP fields on successful verification
        setIsOtpVerified(true); // Mark OTP as verified
      } else {
        console.error('Invalid OTP:', result.error);
        setError(result.data?.message || 'Invalid OTP. Please try again.'); // Use API response message
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred while verifying OTP. Please try again.');
    }
  };

  const handleOtpPopupClose = () => {
    // Close the popup and show OTP fields
    setShowOtpPopup(false);
    setShowOtpFields(true);
    setTimer(120); // Reset the timer to 2 minutes
    setIsResendDisabled(true); // Disable the resend button
  };

  const handleResendOtp = async () => {
    console.log('Resending OTP...');

    try {
      const result = await generateOTP(formData.email, 'registration'); // Call generateOTP with email and otpType
      if (result.success) {
        console.log('OTP resent successfully:', result.data);
        setError('OTP has been resent to your email.'); // Set success message
        setTimer(120); // Reset the timer to 2 minutes
        setIsResendDisabled(true); // Disable the resend button again
      } else {
        console.error('Failed to resend OTP:', result.error);
        setError(result.data?.message || 'Failed to resend OTP. Please try again.'); // Use API response message
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('An error occurred while resending OTP. Please try again.'); // Set generic error message
    }
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if `otpId` is present
      if (!otpId) {
        setError('OTP verification is required before registration.');
        setIsLoading(false);
        return;
      }

      // Create the payload with the `otpId`
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        otpId, // Use the separate otpId state
      };

      console.log('Submitting registration with userData:', userData); // Debugging log

      const result = await registerUser(userData);

      if (result.success) {
        console.log('User registered successfully:', result.data);
        navigate('/login'); // Redirect to login page
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  // Timer logic
  useEffect(() => {
    let interval;
    if (showOtpFields && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false); // Enable the resend button when the timer ends
    }
    return () => clearInterval(interval);
  }, [showOtpFields, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center relative">
        <div className={`w-full md:w-1/2 lg:w-1/2 md:pl-8 lg:p-16 ${showOtpPopup ? 'blur-sm' : ''}`}>
          <img
            className="w-full max-w-md mx-auto md:mx-0 h-auto object-cover rounded-lg mb-8"
            src={carImage}
            alt="Professional car service"
          />
        </div>

        <div
          className="lg:w-1/3 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
        >
          <h2 className="text-gray-900 text-2xl font-medium title-font mb-5">Create Account</h2>

          {error && (
            <div
              className={`mb-4 p-2 text-sm rounded ${error === 'OTP has been sent to your email.' || error === 'OTP verified successfully!'
                ? 'bg-green-50 text-green-600' // Success message styling
                : 'bg-red-50 text-red-600' // Error message styling
                }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
              {!showOtpFields && !isOtpVerified && isValidEmail(formData.email) && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Send OTP
                  </button>
                </div>
              )}
            </div>

            {showOtpFields && (
              <>
                <div className="flex justify-between mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      ref={(el) => (otpRefs.current[index] = el)} // Assign ref to each input
                      className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 text-lg"
                    />
                  ))}
                </div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Time remaining: {formatTime(timer)}</p>
                </div>
                <div className="text-center mb-4">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled}
                    className={`px-4 py-2 rounded ${isResendDisabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                      } transition-colors`}
                  >
                    Resend OTP
                  </button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleVerifyOtp} // Add a function to handle OTP verification
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}

            <div className="relative mb-4">
              <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !isOtpVerified}
              className={`text-white border-0 py-2 px-8 focus:outline-none rounded text-lg w-full ${isLoading ? 'opacity-70 cursor-not-allowed bg-blue-400' : !isOtpVerified ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isLoading ? 'Creating account...' : !isOtpVerified ? 'Verify OTP First' : 'Sign Up'}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Log in
            </Link>
          </p>
        </div>

        {showOtpPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
              <p className="text-lg text-gray-700 mb-4">
                {error || 'OTP has been sent to your email.'} {/* Dynamically display error or success message */}
              </p>
              <button
                onClick={() => {
                  setShowOtpPopup(false); // Close the popup
                  if (error === 'OTP verified successfully!') {
                    setShowOtpFields(false); // Hide OTP fields on successful verification
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}