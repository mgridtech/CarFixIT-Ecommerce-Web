import React from "react";
import carImage from "../assets/images/car2.png";
const AboutUs = () => {
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Side - Text Content */}
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
              About CarFixIt
            </h2>
            <p className="text-gray-700 leading-relaxed text-center md:text-left">
              CarFixIt is your trusted partner for car maintenance, repairs, and servicing. 
              We provide top-quality automotive solutions with convenience and transparency, 
              ensuring your vehicle remains in perfect condition.
            </p>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Services
              </h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Comprehensive car servicing – from oil changes to brake repairs.</li>
                <li>Expert diagnostics – cutting-edge tools to detect issues.</li>
                <li>Doorstep pickup & delivery – saving you time and hassle.</li>
                <li>Transparent pricing – no hidden costs, just honest service.</li>
                <li>Certified technicians – skilled professionals ensuring high-quality work.</li>
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Why Choose CarFixIt?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our goal is to make car maintenance hassle-free, affordable, and reliable. 
                Whether you need a quick fix or a full-service repair, CarFixIt is here for you!
              </p>
            </div>

            <p className="mt-6 text-lg font-bold text-gray-900 text-center md:text-left">
              Book your car service today and experience the CarFixIt difference!
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="md:w-1/2 flex justify-center">
            <img 
              src={carImage}
              alt="CarFixIt Service" 
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
