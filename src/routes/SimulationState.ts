// Should match exactly with backend SimulationState object
//  (members camelCase-ified)
export type SimulationState = {
  elapsedTimeMs: number,
  simulatedTimeDays: number,
  simulatedTimeSeconds: number
};
