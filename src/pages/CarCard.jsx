import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserId } from '../utils/auth';

const CarCard = ({ car, onCarClick, onDeleteCar }) => {
  const [isSelected, setIsSelected] = useState(false);
  
  const formatImageUrl = (imageData) => {
    if (!imageData) return "https://via.placeholder.com/300x200?text=No+Image";
    if (imageData.startsWith("data:image")) return imageData;
    if (imageData.startsWith("/9j")) return `data:image/jpeg;base64,${imageData}`;
    if (imageData.startsWith("iVBOR")) return `data:image/png;base64,${imageData}`;
    if (imageData.match(/^[A-Za-z0-9+/=]+$/)) return `data:image/png;base64,${imageData}`;
    return imageData;
  };
  
  const capitalize = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  useEffect(() => {
    const checkIfSelected = () => {
      const userId = getUserId();
      if (!userId) {
        setIsSelected(false);
        return;
      }
      
      try {
        const savedSelectedCarString = localStorage.getItem(`selectedCar_${userId}`);
        if (!savedSelectedCarString) {
          setIsSelected(false);
          return;
        }
        
        const savedSelectedCar = JSON.parse(savedSelectedCarString);
        setIsSelected(Number(savedSelectedCar.id) === Number(car.id));
        console.log(`Car ${car.id} selected status: ${Number(savedSelectedCar.id) === Number(car.id)}`);
      } catch (error) {
        console.error('Error checking selected car:', error);
        setIsSelected(false);
      }
    };
    
    checkIfSelected();
    
    const handleCarUpdated = () => {
      console.log(`Checking selection for car ${car.id} after car-updated event`);
      checkIfSelected();
    };
    
    window.addEventListener('car-updated', handleCarUpdated);
    
    return () => {
      window.removeEventListener('car-updated', handleCarUpdated);
    };
  }, [car.id]); 

  return (
    <div
      className={`relative cursor-pointer rounded-xl border border-gray-100 p-6 transition-all 
        ${isSelected 
          ? "bg-[#f8e5ee] shadow-lg" 
          : "bg-white shadow-md hover:shadow-lg"}`}
      onClick={() => onCarClick(car)}
    >
      <button
        className="absolute top-2 right-2 text-[#8B1E51] hover:text-[#6e1641] transition"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteCar(car.id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
      </button>

      <div className="h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={formatImageUrl(car.carImage)}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
          }}
        />
      </div>

      <h2 className="text-2xl font-semibold text-[#8B1E51] mb-2">
        {capitalize(car.brand)} {capitalize(car.model)}
      </h2>
      <ul className="text-gray-700 space-y-1 text-sm">
        <li><span className="font-medium">Plate Number:</span> {car.plateNumber}</li>
        <li><span className="font-medium">Fuel Type:</span> {car.fuelType}</li>
        <li><span className="font-medium">Transmission Type:</span> {car.transmission}</li>
      </ul>
    </div>
  );
};

export default CarCard;