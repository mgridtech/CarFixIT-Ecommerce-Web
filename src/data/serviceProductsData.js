export const serviceProducts = {
    1: {
      name: "Periodic Services",
      categories: ["Basic Service", "Standard Service", "Premium Service"],
      products: {
        "Basic Service": [
          { id: 101, name: "Oil Change", price: 299, image: "/oil-change.jpg", description: "Complete engine oil replacement with high-quality lubricants to keep your engine running smoothly." },
          { id: 102, name: "Filter Replacement", price: 199, image: "/filter.jpg", description: "Replacement of air and oil filters to ensure clean airflow and oil circulation." }
        ],
        "Standard Service": [
          { id: 103, name: "Full Inspection", price: 599, image: "/inspection.jpg", description: "Comprehensive 50-point inspection of your vehicle's critical systems." },
          { id: 104, name: "Brake Check", price: 399, image: "/brake.jpg", description: "Complete brake system inspection including pads, rotors, and fluid levels." }
        ],
        "Premium Service": [
          { id: 105, name: "Complete Tune-up", price: 999, image: "/tuneup.jpg", description: "Full engine tune-up including spark plugs, fluids, and system checks." },
          { id: 106, name: "Engine Flush", price: 799, image: "/engine.jpg", description: "Deep cleaning of engine internals to remove sludge and deposits." }
        ]
      }
    },
    2: {
      name: "AC Service & Repair",
      categories: ["AC Service", "AC Repair", "AC Parts"],
      products: {
        "AC Service": [
          { id: 201, name: "AC Gas Refill", price: 899, image: "/ac-gas.jpg", description: "Complete refrigerant recharge with leak testing and performance check." },
          { id: 202, name: "AC Cleaning", price: 499, image: "/ac-clean.jpg", description: "Thorough cleaning of AC vents and components for better airflow." }
        ],
        "AC Repair": [
          { id: 203, name: "Compressor Repair", price: 1499, image: "/compressor.jpg", description: "Diagnosis and repair of AC compressor issues." },
          { id: 204, name: "Condenser Repair", price: 1299, image: "/condenser.jpg", description: "Repair or replacement of damaged AC condenser units." }
        ],
        "AC Parts": [
          { id: 205, name: "AC Filter", price: 299, image: "/ac-filter.jpg", description: "High-quality cabin air filter replacement." },
          { id: 206, name: "AC Vent", price: 199, image: "/vent.jpg", description: "Replacement of damaged or clogged AC vents." }
        ]
      }
    },
    3: {
      name: "Denting & Painting",
      categories: ["Minor Dent Repair", "Major Dent Repair", "Full Painting"],
      products: {
        "Minor Dent Repair": [
          { id: 301, name: "Small Dent Removal", price: 799, image: "/small-dent.jpg", description: "Paintless dent removal for small dings and dents." },
          { id: 302, name: "Paint Touch-up", price: 499, image: "/paint-touchup.jpg", description: "Professional color-matched paint touch-up for small scratches." }
        ],
        "Major Dent Repair": [
          { id: 304, name: "Large Dent Removal", price: 1499, image: "/large-dent.jpg", description: "Advanced techniques for larger dent repairs." },
          { id: 305, name: "Frame Straightening", price: 1999, image: "/frame-straighten.jpg", description: "Precision frame alignment using specialized equipment." }
        ],
        "Full Painting": [
          { id: 307, name: "Full Body Paint", price: 4999, image: "/full-paint.jpg", description: "Complete exterior repaint with premium quality paint." },
          { id: 308, name: "Premium Metallic Paint", price: 6999, image: "/metallic-paint.jpg", description: "High-end metallic paint job with clear coat protection." }
        ]
      }
    },
    4: {
      name: "Cleaning & Spa",
      categories: ["Basic Cleaning", "Premium Detailing", "Interior Spa"],
      products: {
        "Basic Cleaning": [
          { id: 401, name: "Exterior Wash", price: 199, image: "/exterior-wash.jpg", description: "Hand wash and dry with premium cleaning products." },
          { id: 402, name: "Interior Vacuuming", price: 299, image: "/interior-vacuum.jpg", description: "Deep vacuum cleaning of all interior surfaces." }
        ],
        "Premium Detailing": [
          { id: 404, name: "Full Body Polish", price: 999, image: "/body-polish.jpg", description: "Professional polishing to restore showroom shine." },
          { id: 405, name: "Ceramic Coating", price: 2999, image: "/ceramic-coating.jpg", description: "Advanced protective coating for long-lasting shine." }
        ],
        "Interior Spa": [
          { id: 407, name: "Leather Conditioning", price: 799, image: "/leather-condition.jpg", description: "Specialized treatment for leather seats and surfaces." },
          { id: 408, name: "Fabric Protection", price: 499, image: "/fabric-protect.jpg", description: "Protective treatment for fabric upholstery." }
        ]
      }
    }
  };
  
 // Create serviceItems array similar to ecommerceItems
export const serviceItems = [
  { id: 1, name: "Periodic Services" },
  { id: 2, name: "AC Service & Repair" },
  { id: 3, name: "Denting & Painting" },
  { id: 4, name: "Cleaning & Spa" }
];
 
  export const serviceInclusions = [
    "Professional service by certified technicians",
    "Genuine parts (if applicable)",
    "Free inspection report",
    "6-month service warranty",
    "Complimentary car wash"
  ];