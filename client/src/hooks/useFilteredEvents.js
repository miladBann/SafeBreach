import { filterEventsByTime } from "../utils/eventUtils";

const useFilteredEvents = (events, selectedDevices, timeFilter) => {
  try {
    // Validate the input data to avoid runtime issues
    if (!Array.isArray(events)) {
      throw new Error("Invalid events data: Expected an array.");
    }

    if (!Array.isArray(selectedDevices)) {
      throw new Error("Invalid selectedDevices data: Expected an array.");
    }

    // Filter by selected devices
    const filteredByDevices =
      selectedDevices.length > 0
        ? events.filter((event) => selectedDevices.includes(event.device_id))
        : events;

    // Apply time filter based on the selected value
    return timeFilter === "all"
      ? filteredByDevices
      : filterEventsByTime(filteredByDevices, timeFilter);
  } catch (error) {
    console.error("Error in useFilteredEvents:", error.message);
    // Return an empty array if an error occurs to ensure the app doesn't break
    return [];
  }
};

export default useFilteredEvents;
