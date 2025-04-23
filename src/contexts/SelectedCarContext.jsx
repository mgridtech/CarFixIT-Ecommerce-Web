import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserId } from '../utils/auth'; // Import the method to get userId

const SelectedCarContext = createContext();

export const SelectedCarProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const userId = getUserId(); // Get the current userId
    if (userId) {
      // Retrieve the selected car for the current user from localStorage
      const storedCar = localStorage.getItem(`selectedCar_${userId}`);
      if (storedCar) {
        setSelectedCar(JSON.parse(storedCar));
      }
    }
  }, []);

  const updateSelectedCar = (car) => {
    const userId = getUserId(); // Get the current userId
    if (userId) {
      setSelectedCar(car);
      // Save the selected car to localStorage for the current user
      localStorage.setItem(`selectedCar_${userId}`, JSON.stringify(car));
    }
  };

  return (
    <SelectedCarContext.Provider value={{ selectedCar, setSelectedCar: updateSelectedCar }}>
      {children}
    </SelectedCarContext.Provider>
  );
};

export const useSelectedCar = () => useContext(SelectedCarContext);