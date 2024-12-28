import React from "react";

const EventPopup = ({ event }) => {
  // Function to calculate the age of an event
  const calculateEventAge = (timestamp) => {
    const currentTime = Date.now();
    const ageInMilliseconds = currentTime - timestamp;
    const ageInMinutes = Math.floor(ageInMilliseconds / 60000);
    const ageInHours = Math.floor(ageInMinutes / 60);
    
    if (ageInHours > 24) {
      return `${Math.floor(ageInHours / 24)} days ago`;
    } else if (ageInHours > 0) {
      return `${ageInHours} hours ago`;
    } else if (ageInMinutes > 0) {
      return `${ageInMinutes} minutes ago`;
    } else {
      return "Just now";
    }
  };

  const eventAge = calculateEventAge(event.timestamp);

  return (
    <div>
      <h4>Device ID: {event.device_id}</h4>
      <p><strong>Address:</strong> {event.location_details.address}</p>
      <p><strong>Speed:</strong> {event.movement_speed.toFixed(2)} m/s</p>
      <p><strong>Battery:</strong> {event.battery}%</p>
      <p><strong>Signal Strength:</strong> {event.signal_strength} dBm</p>
      <p><strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}</p>
      <p><strong>Event Age:</strong> {eventAge}</p>
    </div>
  );
};

export default EventPopup;
