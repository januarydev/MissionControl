import { createContext } from "react";

export interface CameraState {
  x: number;
  y: number;
  relativeX: number;
  relativeY: number;
  scale: number;
};

export function CreateCameraState() {
  const rv: CameraState = {
    x: 0,
    y: 0,
    relativeX: 0,
    relativeY: 0,
    scale: 1
  };
  return rv;
};

export const CameraContext = createContext<CameraState>(CreateCameraState());
