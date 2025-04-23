import React, { useState } from 'react';
import { getAppSlots } from '../pages/Services/Services';

const DateTimePicker = ({ onDateTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setShowTimeSlots(false);
    setSelectedAppointment(null);
    setLoading(true);
    setError(null);
 
    try {
      // Use the local function instead of the imported one if you have both
      const result = await getAppSlots(date);
      console.log("API Result:", result); // Add this to debug
      
      if (result.success && result.data) {
        // Check if data is an array or if it has a data property that's an array
        const fetchedAppointments = Array.isArray(result.data) 
          ? result.data 
          : (result.data.data || []); // Handle nested data structure if needed
          
        console.log("Processed Appointments:", fetchedAppointments);
        setAppointments(fetchedAppointments);
        setShowTimeSlots(true); // Always show the time slots section
      } else {
        setError(result.error || "Failed to fetch time slots.");
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error in handleDateChange:", err);
      setError(err.message || "An unexpected error occurred.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Only pass the appointment details to the parent component
    // without any side effects
    if (onDateTimeSelect) {
      onDateTimeSelect({
        date: new Date(selectedDate).toLocaleDateString(),
        time: `${appointment.fromTime} - ${appointment.toTime}`,
        appointmentId: appointment.id,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Choose Date</label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-md"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {loading && <p className="text-gray-500">Loading time slots...</p>}
      
      {error && <p className="text-red-500">{error}</p>}
      
      {showTimeSlots && !loading && (
        <div className="mt-4">
          <h3 className="text-gray-700 mb-2">Select Time Slot</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <button
                  key={appointment.id}
                  type="button" // Add type="button" to prevent form submission
                  onClick={() => handleAppointmentSelect(appointment)}
                  className={`px-3 py-2 border rounded-md ${
                    selectedAppointment?.id === appointment.id
                      ? 'bg-[#8B1E51] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {`${appointment.fromTime} - ${appointment.toTime}`}
                </button>
              ))
            ) : (
              <p className="text-gray-500">No time slots available for the selected date.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;

