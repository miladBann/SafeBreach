import React, { useMemo, useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useAtom } from "jotai";
import {
  currentIndexAtom,
  isPlayingAtom,
  playbackSpeedAtom,
  selectedDevicesAtom,
} from "../../state/appAtoms";
import EventPopup from "../event popup/EventPopup";
import PlaybackControls from "../playback controls/PlaybackControls";
import { groupEventsByDevice } from "../../utils/groupEventsByDevice";
import { createMarkerIcon } from "../../utils/createMarkerIcon";
import { getDeviceColor } from "../../utils/colorUtils";

const Map = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [playbackSpeed] = useAtom(playbackSpeedAtom);
  const [selectedDevices] = useAtom(selectedDevicesAtom);

  const [animationIndex, setAnimationIndex] = useState(currentIndex);

  const devicePaths = useMemo(() => groupEventsByDevice(events, selectedDevices), [events, selectedDevices]);

  useEffect(() => {
    setAnimationIndex(currentIndex);
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, events.length - 1));
  };

  const renderPolylines = () => {
    return Object.entries(devicePaths).map(([deviceId, path]) => {
      const pathUpToCurrentIndex = path.slice(0, animationIndex + 1);
      if (pathUpToCurrentIndex.length > 1) {
        return (
          <Polyline
            key={deviceId}
            positions={pathUpToCurrentIndex}
            color={getDeviceColor(deviceId)}
            weight={4}
          />
        );
      }
      return null;
    });
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAnimationIndex((prevIndex) => Math.min(prevIndex + 1, events.length - 1));
      }, 1000 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, events.length]);

  return (
    <div>
      <MapContainer
        className="map-container"
        center={[32.0722, 34.8297]}
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {renderPolylines()}

        {events.map((event, index) => {
          const isActive = animationIndex === index;
          const icon = createMarkerIcon(event, isActive);
          return (
            <Marker
              key={`${event.device_id}_${event.timestamp}`}
              position={[event.latitude, event.longitude]}
              icon={icon}
            >
              <Popup>
                <EventPopup event={event} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <PlaybackControls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={() => {}} // Add speed adjustment logic if needed
      />
    </div>
  );
};

export default Map;
