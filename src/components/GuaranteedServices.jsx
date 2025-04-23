// import React from 'react';

// // Import service images
// import pickupDropImg from '../assets/images/image2.png';
// import sparePartsImg from '../assets/images/image3.png';
// import warrantyImg from '../assets/images/image.png';
// import affordablePricesImg from '../assets/images/image1.png';
// import checkmarkImg from '../assets/images/checkmark.png';

// // Services data
// const guaranteedServices = [
//   { id: 1, name: "Free PickUp & Drop", image: pickupDropImg },
//   { id: 2, name: "Spare BodyParts", image: sparePartsImg },
//   { id: 3, name: "30 Days Warranty", image: warrantyImg },
//   { id: 4, name: "Affordable Prices", image: affordablePricesImg }
// ];

// const GuaranteedServices = () => {
//   return (
//     <section className="text-gray-600 body-font py-16">
//       <div className="container mx-auto px-5">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">
//             Our Guaranteed Services
//           </h2>
//           <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
//             At CarFixIt, we provide **top-tier services** ensuring **quality, reliability, and affordability**.  
//             Our commitment is to keep your vehicle in the **best condition** while making car maintenance 
//             **stress-free and efficient**.
//           </p>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
//           {guaranteedServices.map((service) => (
//             <div
//               key={service.id}
//               className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center 
//                          transition-transform transform hover:scale-105 border border-gray-300"
//             >
//               <img 
//                 src={service.image} 
//                 alt={service.name} 
//                 className="w-24 h-24 object-contain mb-4 rounded-lg" 
//               />
//               <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
//               <img 
//                 src={checkmarkImg} 
//                 alt="Checkmark" 
//                 className="w-6 h-6 mt-3"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default GuaranteedServices;
import React from 'react';

// Import service images
import pickupDropImg from '../assets/images/image2.png';
import sparePartsImg from '../assets/images/image3.png';
import warrantyImg from '../assets/images/image.png';
import affordablePricesImg from '../assets/images/image1.png';
import checkmarkImg from '../assets/images/checkmark.png';

// Services data
const guaranteedServices = [
  { id: 1, name: "Free PickUp & Drop", image: pickupDropImg },
  { id: 2, name: "Spare BodyParts", image: sparePartsImg },
  { id: 3, name: "30 Days Warranty", image: warrantyImg },
  { id: 4, name: "Affordable Prices", image: affordablePricesImg }
];

const GuaranteedServices = () => {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-[#8B1E51] mb-2">
            Our Guaranteed Services
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
            At CarFixIt, we provide <strong>top-tier services</strong> ensuring <strong>quality, reliability, and affordability</strong>.  
            Our commitment is to keep your vehicle in the <strong>best condition</strong> while making car maintenance 
            <strong> stress-free and efficient</strong>.
          </p>
        </div>

        {/* Grid Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {guaranteedServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#F6FBFB] p-5 rounded-xl border border-[#8B1E51] flex flex-col items-center text-center"
            >
              <img 
                src={service.image} 
                alt={service.name} 
                className="w-20 h-20 object-contain mb-3 rounded-md" 
              />
              <h3 className="text-base font-semibold text-gray-800">{service.name}</h3>
              <img 
                src={checkmarkImg} 
                alt="Checkmark" 
                className="w-5 h-5 mt-3"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuaranteedServices;
