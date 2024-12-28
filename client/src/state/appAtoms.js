import { atom } from "jotai";

export const timeFilterAtom = atom("all"); // Default time filter is "all"
export const playbackSpeedAtom = atom(1.0); // Default playback speed
export const currentIndexAtom = atom(0); // Index for playback
export const isPlayingAtom = atom(false); // Playback state
export const selectedDevicesAtom = atom([]); // Selected devices from the sidebar
export const filteredEventsAtom = atom([]); // filtered events based on time
