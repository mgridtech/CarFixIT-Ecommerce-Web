const CarBrands = ({ brands, onSelect }) => {
  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 text-center mt-12">
          <h1 className="text-4xl font-bold text-[#8B1E51] mb-2">Select Car Brand</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <button
              key={index}
              onClick={() => onSelect(brand)} // Pass the entire brand object
              className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition flex flex-col items-center"
            >
              <img 
                src={brand.image} 
                alt={brand.name} 
                className="h-16 w-auto mb-2 object-contain"
              />
              <span className="text-lg font-medium text-gray-800">{brand.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarBrands;