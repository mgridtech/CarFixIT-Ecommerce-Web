import React from "react";
import appImage from "../assets/images/appimage.png";

const DownloadApp = () => {
  return (
    <section className="w-full py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#8B1E51] leading-snug">
            Download Our App
          </h2>
          <p className="text-gray-700 max-w-md md:max-w-lg mx-auto md:mx-0">
            Experience hassle-free car maintenance with just a few taps.  
            Get our app today and enjoy seamless car services at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <a
              href="#"
              className="bg-black text-white px-5 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-gray-900 hover:scale-105 transition-transform"
            >
              <i className="fab fa-apple text-xl"></i>
              <span className="text-sm font-medium">App Store</span>
            </a>
            <a
              href="#"
              className="bg-green-600 text-white px-5 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-700 hover:scale-105 transition-transform"
            >
              <i className="fab fa-google-play text-xl"></i>
              <span className="text-sm font-medium">Google Play</span>
            </a>
          </div>
        </div>

        {/* Right Side - App Image */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end">
          <img
            src={appImage}
            alt="Download App"
            className="w-48 sm:w-56 md:w-64 lg:w-72 object-contain drop-shadow-xl transition-transform hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default DownloadApp;
