import { useEffect, useState } from "react";
import splashImage from "../assets/images/splash.png";

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 800); // Smooth transition before unmounting
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4 text-gray-800 animate-bounce">
        Welcome to CarFixIt
      </h1>
      <img
        src={splashImage}
        alt="Loading..."
        className="w-64 h-auto md:w-80 lg:w-96 object-contain animate-pulse"
      />
    </div>
  );
};

export default SplashScreen;
