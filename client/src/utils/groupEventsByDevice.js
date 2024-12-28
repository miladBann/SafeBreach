export const groupEventsByDevice = (events, selectedDevices) => {
    const paths = {};
    events.forEach((event) => {
      if (selectedDevices.includes(event.device_id)) {
        if (!paths[event.device_id]) paths[event.device_id] = [];
        paths[event.device_id].push([event.latitude, event.longitude]);
      }
    });
    return paths;
};
  