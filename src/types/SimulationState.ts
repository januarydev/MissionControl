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
  elapsedTimeMs: number,
  simulatedTimeDays: number,
  simulatedTimeSeconds: number,
  orbits: OrbitState[],
  spacecraftPositionEciKm: Vec3,
  spacecraftVelocityEciKmS: Vec3,
  spacecraftPositionEcefKm: Vec3,
  spacecraftVelocityEcefKmS: Vec3,
  spacecraftPositionLla: Vec3
};
