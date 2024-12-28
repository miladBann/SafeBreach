import React from "react";
import { Box, Checkbox, FormControlLabel, Radio, RadioGroup, FormControl, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { timeFilterAtom } from "../../state/appAtoms";

const Sidebar = ({ devices, selectedDevices, setSelectedDevices, setTimeFilter }) => {
  const [timeFilterValue, setTimeFilterValue] = useAtom(timeFilterAtom);

  const handleToggle = (deviceId) => {
    if (selectedDevices.length >= 1 && !selectedDevices.includes(deviceId)) {
      return; // Prevent selecting more than one device
    }

    setSelectedDevices((prev) =>
      prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]
    );
  };

  const handleTimeFilterChange = (e) => {
    const newTimeFilter = e.target.value;
    setTimeFilter(newTimeFilter); // Update the time filter in the global state
    setTimeFilterValue(newTimeFilter); // Update the local time filter value to sync radio buttons
  };

  return (
    <Box padding={2}>
      <Typography variant="h6">Device Filter</Typography>
      {devices.map((device) => (
        <FormControlLabel
          key={device}
          control={<Checkbox checked={selectedDevices.includes(device)} onChange={() => handleToggle(device)} />}
          label={device}
        />
      ))}

      <FormControl component="fieldset" margin="normal">
        <Typography variant="h6">Time Filter</Typography>
        <RadioGroup value={timeFilterValue} onChange={handleTimeFilterChange}>
          <FormControlLabel value="all" control={<Radio />} label="All" />
          <FormControlLabel value="lastWeek" control={<Radio />} label="Last Week" />
          <FormControlLabel value="lastMonth" control={<Radio />} label="Last Month" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Sidebar;
