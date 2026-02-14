import { SimulationState } from "./Simulation";

export enum TelemetryPresets {
  Custom = "custom",
  Preset1 = "preset1",
  Preset2 = "preset2",
  Preset3 = "preset3",
  Preset4 = "preset4",
  Preset5 = "preset5"
}

export enum TelemetryPoints {
  ElapsedTime,
  PosEciX,
  PosEciY,
  PosEciZ,
  VelEciX,
  VelEciY,
  VelEciZ,
  PosEcefX,
  PosEcefY,
  PosEcefZ,
  VelEcefX,
  VelEcefY,
  VelEcefZ,
  RightAscens,
  Declination,
  Elevation,
  SAM,
  Inclination,
  RAAN,
  Eccentricity,
  AoP,
  TrueAnom,
  Periapsis,
  Apoapsis,
  Period,
  AttQ1,
  AttQ2,
  AttQ3,
  AttQ4,
  OmegaX,
  OmegaY,
  OmegaZ,
  AxisErr
}

export interface TelemetryState {
  preset: TelemetryPresets;
  rowTypes: TelemetryPoints[];
}

export const Preset1: TelemetryPoints[] = [
  TelemetryPoints.ElapsedTime,
  TelemetryPoints.PosEciX,
  TelemetryPoints.PosEciY,
  TelemetryPoints.PosEciZ,
  TelemetryPoints.VelEciX,
  TelemetryPoints.VelEciY,
  TelemetryPoints.VelEciZ,
  TelemetryPoints.PosEcefX,
  TelemetryPoints.PosEcefY,
  TelemetryPoints.PosEcefZ,
  TelemetryPoints.VelEcefX,
  TelemetryPoints.VelEcefY,
  TelemetryPoints.VelEcefZ,
  TelemetryPoints.RightAscens,
  TelemetryPoints.Declination,
  TelemetryPoints.Elevation,
  TelemetryPoints.SAM,
  TelemetryPoints.Inclination,
  TelemetryPoints.RAAN,
  TelemetryPoints.Eccentricity,
  TelemetryPoints.AoP,
  TelemetryPoints.TrueAnom,
  TelemetryPoints.Periapsis,
  TelemetryPoints.Apoapsis,
  TelemetryPoints.Period,
  TelemetryPoints.AttQ1,
  TelemetryPoints.AttQ2,
  TelemetryPoints.AttQ3,
  TelemetryPoints.AttQ4,
  TelemetryPoints.OmegaX,
  TelemetryPoints.OmegaY,
  TelemetryPoints.OmegaZ,
  TelemetryPoints.AxisErr
];

export const Preset2: TelemetryPoints[] = [
  TelemetryPoints.PosEciX,
  TelemetryPoints.PosEciY,
  TelemetryPoints.PosEciZ,
  TelemetryPoints.VelEciX,
  TelemetryPoints.VelEciY,
  TelemetryPoints.VelEciZ
];

export const Preset3: TelemetryPoints[] = [
  TelemetryPoints.PosEcefX,
  TelemetryPoints.PosEcefY,
  TelemetryPoints.PosEcefZ,
  TelemetryPoints.VelEcefX,
  TelemetryPoints.VelEcefY,
  TelemetryPoints.VelEcefZ
];

export const Preset4: TelemetryPoints[] = [
  TelemetryPoints.RightAscens,
  TelemetryPoints.Declination,
  TelemetryPoints.Elevation,
  TelemetryPoints.SAM,
  TelemetryPoints.Inclination,
  TelemetryPoints.RAAN,
  TelemetryPoints.Eccentricity,
  TelemetryPoints.AoP,
  TelemetryPoints.TrueAnom,
  TelemetryPoints.Periapsis,
  TelemetryPoints.Apoapsis,
  TelemetryPoints.Period
];

export const Preset5: TelemetryPoints[] = [
  TelemetryPoints.AttQ1,
  TelemetryPoints.AttQ2,
  TelemetryPoints.AttQ3,
  TelemetryPoints.AttQ4,
  TelemetryPoints.OmegaX,
  TelemetryPoints.OmegaY,
  TelemetryPoints.OmegaZ,
  TelemetryPoints.AxisErr
]

export function rowsFromPreset(preset: TelemetryPresets) {
  switch (preset) {
    case TelemetryPresets.Custom:
      return [];
    case TelemetryPresets.Preset1:
      return Preset1;
    case TelemetryPresets.Preset2:
      return Preset2;
    case TelemetryPresets.Preset3:
      return Preset3;
    case TelemetryPresets.Preset4:
      return Preset4;
    case TelemetryPresets.Preset5:
      return Preset5;
    default:
  }
}

export interface RowDetails {
  mnemonic: string;
  unit: string;
}

export function rowDetailsFromType(type: TelemetryPoints): RowDetails {
  switch (type) {
    case TelemetryPoints.ElapsedTime:
      return {
        mnemonic: "Elapsed Time",
        unit: "s"
      };
    case TelemetryPoints.PosEciX:
      return {
        mnemonic: "Position ECI X",
        unit: "km"
      };
    case TelemetryPoints.PosEciY:
      return {
        mnemonic: "Position ECI Y",
        unit: "km"
      };
    case TelemetryPoints.PosEciZ:
      return {
        mnemonic: "Position ECI Z",
        unit: "km"
      };
    case TelemetryPoints.VelEciX:
      return {
        mnemonic: "Velocity ECI X",
        unit: "km/s"
      };
    case TelemetryPoints.VelEciY:
      return {
        mnemonic: "Velocity ECI Y",
        unit: "km/s"
      };
    case TelemetryPoints.VelEciZ:
      return {
        mnemonic: "Velocity ECI Z",
        unit: "km/s"
      };
    case TelemetryPoints.PosEcefX:
      return {
        mnemonic: "Position ECEF X",
        unit: "km"
      };
    case TelemetryPoints.PosEcefY:
      return {
        mnemonic: "Position ECEF Y",
        unit: "km"
      };
    case TelemetryPoints.PosEcefZ:
      return {
        mnemonic: "Position ECEF Z",
        unit: "km"
      };
    case TelemetryPoints.VelEcefX:
      return {
        mnemonic: "Velocity ECEF X",
        unit: "km/s"
      };
    case TelemetryPoints.VelEcefY:
      return {
        mnemonic: "Velocity ECEF Y",
        unit: "km/s"
      };
    case TelemetryPoints.VelEcefZ:
      return {
        mnemonic: "Velocity ECEF Z",
        unit: "km/s"
      };
    case TelemetryPoints.RightAscens:
      return {
        mnemonic: "Right Ascension",
        unit: "deg"
      };
    case TelemetryPoints.Declination:
      return {
        mnemonic: "Declination",
        unit: "deg"
      };
    case TelemetryPoints.Elevation:
      return {
        mnemonic: "Elevation",
        unit: "km"
      };
    case TelemetryPoints.SAM:
      return {
        mnemonic: "SAM",
        unit: "km2/s"
      };
    case TelemetryPoints.Inclination:
      return {
        mnemonic: "Inclination",
        unit: "deg"
      };
    case TelemetryPoints.RAAN:
      return {
        mnemonic: "RAAN",
        unit: "deg"
      };
    case TelemetryPoints.Eccentricity:
      return {
        mnemonic: "Eccentricity",
        unit: ""
      };
    case TelemetryPoints.AoP:
      return {
        mnemonic: "Argument of Perigee",
        unit: "deg"
      };
    case TelemetryPoints.TrueAnom:
      return {
        mnemonic: "True Anomaly",
        unit: "deg"
      };
    case TelemetryPoints.Periapsis:
      return {
        mnemonic: "Periapsis Altitude",
        unit: "km"
      };
    case TelemetryPoints.Apoapsis:
      return {
        mnemonic: "Apoapsis Altitude",
        unit: "km"
      };
    case TelemetryPoints.Period:
      return {
        mnemonic: "Orbit Period",
        unit: "hr"
      };
    case TelemetryPoints.AttQ1:
      return {
        mnemonic: "Attitude Q1",
        unit: ""
      };
    case TelemetryPoints.AttQ2:
      return {
        mnemonic: "Attitude Q2",
        unit: ""
      };
    case TelemetryPoints.AttQ3:
      return {
        mnemonic: "Attitude Q3",
        unit: ""
      };
    case TelemetryPoints.AttQ4:
      return {
        mnemonic: "Attitude Q4",
        unit: ""
      };
    case TelemetryPoints.OmegaX:
      return {
        mnemonic: "Angular Inertial Rate X",
        unit: "rad/s"
      };
    case TelemetryPoints.OmegaY:
      return {
        mnemonic: "Angular Inertial Rate Y",
        unit: "rad/s"
      };
    case TelemetryPoints.OmegaZ:
      return {
        mnemonic: "Angular Inertial Rate Z",
        unit: "rad/s"
      };
    case TelemetryPoints.AxisErr:
      return {
        mnemonic: "Inertial Axis Error",
        unit: "deg"
      }
    default:
      return {
        mnemonic: "",
        unit: ""
      }
  }
}

export function rowValueFromType(type: TelemetryPoints, state: SimulationState): number {
  switch (type) {
    case TelemetryPoints.ElapsedTime:
      return state.elapsedTimeS;
    case TelemetryPoints.PosEciX:
      return state.spacecraftPositionEciKm.x;
    case TelemetryPoints.PosEciY:
      return state.spacecraftPositionEciKm.y;
    case TelemetryPoints.PosEciZ:
      return state.spacecraftPositionEciKm.z;
    case TelemetryPoints.VelEciX:
      return state.spacecraftVelocityEciKmS.x;
    case TelemetryPoints.VelEciY:
      return state.spacecraftVelocityEciKmS.y;
    case TelemetryPoints.VelEciZ:
      return state.spacecraftVelocityEciKmS.z;
    case TelemetryPoints.PosEcefX:
      return state.spacecraftPositionEcefKm.x;
    case TelemetryPoints.PosEcefY:
      return state.spacecraftPositionEcefKm.y;
    case TelemetryPoints.PosEcefZ:
      return state.spacecraftPositionEcefKm.z;
    case TelemetryPoints.VelEcefX:
      return state.spacecraftVelocityEcefKmS.x;
    case TelemetryPoints.VelEcefY:
      return state.spacecraftVelocityEcefKmS.y;
    case TelemetryPoints.VelEcefZ:
      return state.spacecraftVelocityEcefKmS.z;
    case TelemetryPoints.RightAscens:
      return state.spacecraftPositionLla.x;
    case TelemetryPoints.Declination:
      return state.spacecraftPositionLla.y;
    case TelemetryPoints.Elevation:
      return state.spacecraftPositionLla.z;
    case TelemetryPoints.SAM:
      return state.spacecraftSpecificAngularMomentumKm2S;
    case TelemetryPoints.Inclination:
      return state.spacecraftInclinationDeg;
    case TelemetryPoints.RAAN:
      return state.spacecraftRightAscensionAscendingNodeDeg;
    case TelemetryPoints.Eccentricity:
      return state.spacecraftEccentricity;
    case TelemetryPoints.AoP:
      return state.spacecraftArgumentOfPerigeeDeg;
    case TelemetryPoints.TrueAnom:
      return state.spacecraftTrueAnomalyDeg;
    case TelemetryPoints.Periapsis:
      return state.spacecraftPeriapsisAltitudeKm;
    case TelemetryPoints.Apoapsis:
      return state.spacecraftApoapsisAltitudeKm;
    case TelemetryPoints.Period:
      return state.spacecraftOrbitPeriodHr;
    case TelemetryPoints.AttQ1:
      return state.spacecraftAttitude.x;
    case TelemetryPoints.AttQ2:
      return state.spacecraftAttitude.y;
    case TelemetryPoints.AttQ3:
      return state.spacecraftAttitude.z;
    case TelemetryPoints.AttQ4:
      return state.spacecraftAttitude.w;
    case TelemetryPoints.OmegaX:
      return state.spacecraftAngularRateRadS.x;
    case TelemetryPoints.OmegaY:
      return state.spacecraftAngularRateRadS.y;
    case TelemetryPoints.OmegaZ:
      return state.spacecraftAngularRateRadS.z;
    case TelemetryPoints.AxisErr:
      return state.inertialAxisAngularErrorRad * 180 / Math.PI;
    default:
      return 0;
  }
}
