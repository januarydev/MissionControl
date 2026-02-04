import { listen, Event as TauriEvent } from "@tauri-apps/api/event";
import { createContext, useCallback, useEffect, useState } from "react";
import { WindowState } from "./Window";

export type Vec3 = {
  x: number,
  y: number,
  z: number
};

export type OrbitState = {
  name: string,
  positionEciKm: Vec3,
  velocityEciKmS: Vec3
};

// Should match exactly with backend SimulationState object
//  (members camelCase-ified)
export type SimulationState = {
  paused: boolean,
  timeMultiplier: number,
  elapsedTimeS: number,
  simulatedTimeDays: number,
  simulatedTimeSeconds: number,
  orbits: OrbitState[],
  spacecraftPositionEciKm: Vec3,
  spacecraftVelocityEciKmS: Vec3,
  spacecraftPositionEcefKm: Vec3,
  spacecraftVelocityEcefKmS: Vec3,
  spacecraftPositionLla: Vec3,
  spacecraftSpecificAngularMomentumKm2S: number,
  spacecraftInclinationDeg: number,
  spacecraftRightAscensionAscendingNodeDeg: number,
  spacecraftEccentricity: number,
  spacecraftArgumentOfPerigeeDeg: number,
  spacecraftTrueAnomalyDeg: number,
  spacecraftPeriapsisAltitudeKm: number,
  spacecraftApoapsisAltitudeKm: number,
  spacecraftOrbitPeriodHr: number
};

export function createSimulationState() {
  const rv: SimulationState = {
    paused: false,
    timeMultiplier: 1,
    elapsedTimeS: 0,
    simulatedTimeDays: 0,
    simulatedTimeSeconds: 0,
    orbits: [],
    spacecraftPositionEciKm: { x: 0, y: 0, z: 0 },
    spacecraftVelocityEciKmS: { x: 0, y: 0, z: 0 },
    spacecraftPositionEcefKm: { x: 0, y: 0, z: 0 },
    spacecraftVelocityEcefKmS: { x: 0, y: 0, z: 0 },
    spacecraftPositionLla: { x: 0, y: 0, z: 0 },
    spacecraftSpecificAngularMomentumKm2S: 0,
    spacecraftInclinationDeg: 0,
    spacecraftRightAscensionAscendingNodeDeg: 0,
    spacecraftEccentricity: 0,
    spacecraftArgumentOfPerigeeDeg: 0,
    spacecraftTrueAnomalyDeg: 0,
    spacecraftPeriapsisAltitudeKm: 0,
    spacecraftApoapsisAltitudeKm: 0,
    spacecraftOrbitPeriodHr: 0
  }
  return rv;
}

export const SimulationContext = createContext<SimulationState>(createSimulationState());

export interface UseSimulationReturnValue {
  mapCoordinates: [number, number, number][];
  simulationState: SimulationState;
}

export function useSimulation(windowState: WindowState): UseSimulationReturnValue {
  const [simulationState, setSimulationState] = useState<SimulationState>(createSimulationState());
  const [currentMapCoordinates, setCurrentMapCoordinates] = useState<[number, number, number][]>([]);
  const [mapCoordinates, setMapCoordinates] = useState<[number, number, number][]>([]);

  const handleSimulationUpdate = useCallback((event: TauriEvent<SimulationState>) => {
    setSimulationState(event.payload);
    const llaPosition: [number, number, number] = [
      event.payload.spacecraftPositionLla.x - 180,
      event.payload.spacecraftPositionLla.y,
      event.payload.spacecraftPositionLla.z * 1000
    ];
    if (mapCoordinates.length === 0) {
      setMapCoordinates([llaPosition]);
      return;
    }
    if (Math.sqrt(
      Math.pow(mapCoordinates[mapCoordinates.length - 1][0] - llaPosition[0], 2) +
      Math.pow(mapCoordinates[mapCoordinates.length - 1][1] - llaPosition[1], 2)
    ) > 0.5) {
      setMapCoordinates(mapCoordinates.slice(-1499).concat([llaPosition]));
    }
  }, [mapCoordinates]);
  
  useEffect(() => {
    const unlistenPromise = listen<SimulationState>("update", handleSimulationUpdate);
    return () => {
      unlistenPromise.then(unlisten => unlisten());
    }
  }, [handleSimulationUpdate]);

  useEffect(() => {
    if (!windowState.isGrabbing && !windowState.isPanning) {
      setCurrentMapCoordinates(mapCoordinates);
    }
  }, [windowState.isGrabbing, windowState.isPanning, mapCoordinates]);

  return {
    mapCoordinates: currentMapCoordinates,
    simulationState: simulationState
  };
}
