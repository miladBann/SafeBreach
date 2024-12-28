import { useState } from "react";

const usePlaybackControls = (filteredEvents, setCurrentIndex) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndexState, setCurrentIndexState] = useState(0);

  const onPlay = () => {
    try {
      setIsPlaying(true);
    } catch (error) {
      console.error("Error in onPlay:", error.message);
    }
  };

  const onPause = () => {
    try {
      setIsPlaying(false);
    } catch (error) {
      console.error("Error in onPause:", error.message);
    }
  };

  const onNext = () => {
    try {
      if (!Array.isArray(filteredEvents)) {
        throw new Error("Invalid filteredEvents: Expected an array.");
      }

      if (currentIndexState < filteredEvents.length - 1) {
        setCurrentIndexState((prev) => prev + 1);
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error in onNext:", error.message);
    }
  };

  const onPrevious = () => {
    try {
      if (!Array.isArray(filteredEvents)) {
        throw new Error("Invalid filteredEvents: Expected an array.");
      }

      if (currentIndexState > 0) {
        setCurrentIndexState((prev) => prev - 1);
        setCurrentIndex((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error in onPrevious:", error.message);
    }
  };

  return {
    isPlaying,
    onPlay,
    onPause,
    onNext,
    onPrevious,
    currentIndexState,
  };
};

export default usePlaybackControls;
