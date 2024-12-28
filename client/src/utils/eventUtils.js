export const filterEventsByTime = (events, timeFilter) => {
  if (timeFilter === "all") return events;

  const now = Date.now();
  const timeRanges = {
    lastWeek: now - 7 * 24 * 60 * 60 * 1000, // Last 7 days
    lastMonth: now - 30 * 24 * 60 * 60 * 1000, // Last 30 days 
  };

  return events.filter((event) => event.timestamp >= timeRanges[timeFilter]);
};
