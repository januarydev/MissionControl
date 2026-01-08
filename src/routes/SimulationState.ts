export type Vec3 = {
  x: number,
  y: number,
  z: number
}

export type OrbitState = {
  name: string,
  positionEciKm: Vec3,
  velocityEciKmS: Vec3
};

// Should match exactly with backend SimulationState object
//  (members camelCase-ified)
export type SimulationState = {
  elapsedTimeMs: number,
  simulatedTimeDays: number,
  simulatedTimeSeconds: number,
  orbits: OrbitState[]
};
