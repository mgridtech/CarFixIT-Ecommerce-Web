import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import carImage from '../assets/images/logo1.png';
import { generateOTP, verifyOTP, resetPassword } from './Services/Services';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpId, setOtpId] = useState(null); // Store OTP ID after verification
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpFields, setShowOtpFields] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for showing the success modal
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      const result = await generateOTP(email, 'password_reset');
      if (result.success) {
        console.log('OTP generated successfully:', result.data);
        setSuccess('OTP has been sent to your email.');
        setError('');
        setShowOtpFields(true);
        setTimer(120);
        setIsResendDisabled(true);
      } else {
        console.error('Failed to generate OTP:', result.error);
        setError(result.data?.message || 'Failed to generate OTP. Please try again.');
        setShowOtpFields(false);
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError('An error occurred while generating OTP. Please try again.');
      setShowOtpFields(false);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    console.log('Verifying OTP:', enteredOtp);

    try {
      const result = await verifyOTP(email, 'password_reset', enteredOtp);
      if (result.success) {
        console.log('OTP verified successfully:', result.data);
        setSuccess('OTP verified successfully!');
        setError('');
        setShowOtpFields(false);
        setIsOtpVerified(true);
        setOtpId(result.data.data.otprecordid); // Store OTP ID
      } else {
        console.error('Invalid OTP:', result.error);
        setError(result.data?.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred while verifying OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const result = await resetPassword(email, password, otpId);
      if (result.success) {
        console.log('Password reset successfully:', result.data);
        setSuccess('Password has been reset successfully!');
        setError('');
        setShowSuccessModal(true); // Show the success modal
      } else {
        console.error('Failed to reset password:', result.error);
        setError(result.data?.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An error occurred while resetting password. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    console.log('Resending OTP...');

    try {
      const result = await generateOTP(email, 'password_reset');
      if (result.success) {
        console.log('OTP resent successfully:', result.data);
        setSuccess('OTP has been resent to your email.');
        setTimer(120);
        setIsResendDisabled(true);
      } else {
        console.error('Failed to resend OTP:', result.error);
        setError(result.data?.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('An error occurred while resending OTP. Please try again.');
    }
  };

  useEffect(() => {
    let interval;
    if (showOtpFields && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
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
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="w-full md:w-1/2 lg:w-1/2 md:pl-8 lg:p-16">
          <img
            className="w-full max-w-md mx-auto md:mx-a h-auto object-cover rounded-lg mb-8"
            src={carImage}
            alt="Professional car service"
          />
        </div>
        <div className="lg:w-1/3 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-2xl font-medium title-font mb-5">Forgot Password</h2>

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

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              placeholder="Enter your email"
              required
            />
          </div>

          {isOtpVerified && (
            <>
              <div className="relative mb-4">
                <label htmlFor="password" className="leading-7 text-sm text-gray-600">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="confirmPassword" className="leading-7 text-sm text-gray-600">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg w-full"
              >
                Reset Password
              </button>
            </>
          )}

          {!showOtpFields && !isOtpVerified && email && (
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
                    ref={(el) => (otpRefs.current[index] = el)}
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
                  onClick={handleVerifyOtp}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Verify OTP
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <p className="text-lg text-gray-700 mb-4">Password reset successfully!</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}