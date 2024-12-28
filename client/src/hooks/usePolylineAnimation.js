import { useEffect, useState } from "react";

const usePolylineAnimation = (
  events,
  currentIndex,
  playbackSpeed,
  isPlaying,
  setCurrentIndex,
  selectedDevices
) => {
  const [animatedPaths, setAnimatedPaths] = useState({}); // Animated paths for each device
  const [isAnimating, setIsAnimating] = useState(false); // Tracks whether animation is running

  useEffect(() => {
    if (!isPlaying || selectedDevices.length !== 1) return;

    const deviceId = selectedDevices[0];
    const deviceEvents = events.filter((e) => e.device_id === deviceId);

    if (deviceEvents.length < 2) return;

    let animationFrame;
    let startIndex = currentIndex; // Start from the current index

    const animate = () => {
      if (startIndex >= deviceEvents.length - 1) {
        setCurrentIndex(deviceEvents.length - 1); // End animation
        setIsAnimating(false); // Stop animating
        cancelAnimationFrame(animationFrame);
        return;
      }

      const start = deviceEvents[startIndex];
      const end = deviceEvents[startIndex + 1];

      // Ensure both start and end have valid latitude and longitude
      if (
        !start ||
        !end ||
        typeof start.latitude !== "number" ||
        typeof start.longitude !== "number" ||
        typeof end.latitude !== "number" ||
        typeof end.longitude !== "number"
      ) {
        console.error("Invalid event data for animation.");
        setIsAnimating(false);
        cancelAnimationFrame(animationFrame);
        return;
      }

      const duration = 1000 / playbackSpeed; // Duration based on playback speed
      const startTime = performance.now();

      setIsAnimating(true); // Animation in progress

      const step = () => {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1); // Clamp t between 0 and 1

        const interpolatedLat = start.latitude + (end.latitude - start.latitude) * t;
        const interpolatedLng = start.longitude + (end.longitude - start.longitude) * t;

        // Update animated path with the interpolated point
        setAnimatedPaths((prev) => ({
          ...prev,
          [deviceId]: [
            ...(prev[deviceId] || deviceEvents.slice(0, startIndex + 1).map((e) => [e.latitude, e.longitude])),
            [interpolatedLat, interpolatedLng],
          ],
        }));

        if (t < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          startIndex++;
          setCurrentIndex(startIndex); // Move to the next segment
          animate(); // Start next animation step
        }
      };

      step();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      setIsAnimating(false); // Stop animation on cleanup
    };
  }, [events, currentIndex, playbackSpeed, isPlaying, selectedDevices, setCurrentIndex]);

  // Update static paths when animation is not playing
  useEffect(() => {
    if (isAnimating || selectedDevices.length !== 1) return;

    const deviceId = selectedDevices[0];
    const deviceEvents = events.filter((e) => e.device_id === deviceId);

    // Ensure the device events contain valid latitude and longitude
    if (
      !deviceEvents.every(
        (e) => typeof e.latitude === "number" && typeof e.longitude === "number"
      )
    ) {
      console.error("Invalid event data in static path update.");
      return;
    }

    setAnimatedPaths((prev) => ({
      ...prev,
      [deviceId]: deviceEvents.slice(0, currentIndex + 1).map((e) => [e.latitude, e.longitude]),
    }));
  }, [currentIndex, events, selectedDevices, isAnimating]);

  return animatedPaths;
};

export default usePolylineAnimation;
