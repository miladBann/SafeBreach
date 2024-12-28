import L from "leaflet";
import { getDeviceColor } from "../utils/colorUtils";

export const createMarkerIcon = (event, isActive) => {
  return L.divIcon({
    html: `<div style="background-color: ${getDeviceColor(event.device_id)}; width: ${isActive ? "32px" : "25px"}; height: ${isActive ? "32px" : "25px"}; border-radius: 50%; border: 2px solid white; transform: translate(-50%, -50%); margin-left: 5px; margin-top: 5px;"></div>`,
  });
};
