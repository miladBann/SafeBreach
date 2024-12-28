import React, { useEffect, useState } from "react";
import { Box, CssBaseline, IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Map from "./components/map/Map";
import Sidebar from "./components/side bar/Sidebar";
import LoadingIndicator from "./components/loading/LoadingIndicator";
import ConnectionStatus from "./components/connection status/ConnectionStatus";
import PlaybackControls from "./components/playback controls/PlaybackControls";
import useWebSocket from "./hooks/useWebSocket";
import usePlaybackControls from "./hooks/usePlaybackControls";
import useDevices from "./hooks/useDevices";
import useFilteredEvents from "./hooks/useFilteredEvents";
import useSidebar from "./hooks/useSidebar";
import { useAtom } from "jotai";
import { selectedDevicesAtom, playbackSpeedAtom, currentIndexAtom, isPlayingAtom } from "./state/appAtoms";

const App = () => {
  const { events, connectionStatus } = useWebSocket();
  const [selectedDevices, setSelectedDevices] = useAtom(selectedDevicesAtom);
  const [playbackSpeed, setPlaybackSpeed] = useAtom(playbackSpeedAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);

  const devices = useDevices(events);
  const [timeFilter, setTimeFilter] = useState("all");

  const filteredEvents = useFilteredEvents(events, selectedDevices, timeFilter);
  const { sidebarOpen, toggleSidebar } = useSidebar();

  const {
    onPlay,
    onPause,
    onNext,
    onPrevious,
  } = usePlaybackControls(filteredEvents, setCurrentIndex);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <CssBaseline />
      <ConnectionStatus isConnected={connectionStatus === "connected"} />

      <Box display="flex" flex="1" position="relative">
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: 16,
            left: 60,
            zIndex: 1200,
            backgroundColor: "white",
            color: "black",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={toggleSidebar}
          variant="temporary"
          sx={{ "& .MuiDrawer-paper": { width: 240 } }}
        >
          <Sidebar
            devices={devices}
            selectedDevices={selectedDevices}
            setSelectedDevices={setSelectedDevices}
            setTimeFilter={setTimeFilter}
          />
        </Drawer>

        <Box
          sx={{
            flex: 1,
            height: "100%",
            marginLeft: sidebarOpen ? "240px" : 0,
            transition: "margin-left 0.3s ease",
          }}
        >
          {!events.length ? (
            <LoadingIndicator />
          ) : (
            <Map events={filteredEvents} />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          width: "40%",
          padding: "0 16px",
          zIndex: "1200",
          backgroundColor: "white",
          borderRadius: "10px",
          display: "flex",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PlaybackControls
          onPlay={onPlay}
          onPause={onPause}
          onNext={onNext}
          onPrevious={onPrevious}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
        />
      </Box>
    </Box>
  );
};

export default App;
