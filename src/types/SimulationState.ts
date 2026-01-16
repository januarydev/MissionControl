import { createContext } from "react";

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

