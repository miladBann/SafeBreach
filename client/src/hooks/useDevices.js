import { useState, useEffect } from "react";

const useDevices = (events) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    try {
      // Ensure events is an array before processing
      if (!Array.isArray(events)) {
        throw new Error("Invalid events data: Expected an array.");
      }

      const uniqueDevices = [...new Set(events.map((event) => event.device_id))];
      setDevices(uniqueDevices);
    } catch (error) {
      console.error("Error in useDevices:", error.message);
      // Optionally, reset devices to an empty array on error
      setDevices([]);
    }
  }, [events]);

  return devices;
};

export default useDevices;
