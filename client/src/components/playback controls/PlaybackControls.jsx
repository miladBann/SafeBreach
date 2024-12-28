import React from "react";
import { Box, IconButton, Typography, Slider, Snackbar, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { useAtom } from "jotai";
import { selectedDevicesAtom, isPlayingAtom } from "../../state/appAtoms";

const PlaybackControls = ({
  onPlay,
  onPause,
  onNext,
  onPrevious,
  playbackSpeed,
  setPlaybackSpeed,
}) => {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [selectedDevices] = useAtom(selectedDevicesAtom);
  const [alertVisible, setAlertVisible] = React.useState(false);

  const handlePlayPause = () => {
    if (selectedDevices.length !== 1) {
      setAlertVisible(true); // Show alert if more than one device is selected
      setIsPlaying(false);  // Ensure the animation doesn't continue
      return;
    }
    setAlertVisible(false);
    setIsPlaying((prev) => !prev);
    isPlaying ? onPause() : onPlay(); // Toggle between play and pause
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding={2}
      margin="0 auto"
      width="100%"
    >
      {/* Previous Button */}
      <IconButton onClick={onPrevious}>
        <SkipPreviousIcon />
      </IconButton>

      {/* Play/Pause Button */}
      <IconButton onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      {/* Next Button */}
      <IconButton onClick={onNext}>
        <SkipNextIcon />
      </IconButton>

      {/* Playback Speed Slider */}
      <Box display="flex" alignItems="center">
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          Speed:
        </Typography>
        <Slider
          value={playbackSpeed}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(e, newValue) => setPlaybackSpeed(newValue)}
          sx={{ width: 100 }}
        />
      </Box>

      {/* Snackbar Alert */}
      <Snackbar
        open={alertVisible}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity="warning" sx={{ width: "100%" }}>
          Please select only one device to view the path animation.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlaybackControls;
