// src/pages/OrderConfirmation.js
import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <section className="w-full py-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-12 mt-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto mb-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-3xl font-bold text-[#8B1E51] mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-[#8B1E51] text-white rounded-md hover:bg-[#6e1641] transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;