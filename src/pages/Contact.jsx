import React from 'react';

const Contact = () => {
  return (
    <section className="text-gray-600 body-font relative">
      <div className="absolute inset-0">
        <iframe
          width="100%"
          height="100%"
          style={{ paddingTop: "10px" }} 
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="map"
          scrolling="no"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2076.3375893503876!2d78.39330951589928!3d17.36277781242089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97003c0a9dd3%3A0x74a10cb9e224fbe!2sT.K%20Towers!5e0!3m2!1sen!2sin!4v1727078279260!5m2!1sen!2sin"
        ></iframe>
      </div>
      <div className="container px-5 py-24 mx-auto flex">
        <div className="lg:w-1/3 md:w-1/2 bg-teal-50 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Get in Touch</h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out.
          </p>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm text-gray-600">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            ></textarea>
          </div>
          <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            Send Message
          </button>
          <p className="text-xs text-gray-500 mt-3">
            We typically respond within 24 hours. Looking forward to connecting with you!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
