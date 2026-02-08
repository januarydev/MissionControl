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
  value: number | string;
  unit: string;
}

export function rowDetailsFromType(type: TelemetryPoints, state: SimulationState): RowDetails {
  switch (type) {
    case TelemetryPoints.ElapsedTime:
      return {
        mnemonic: "Elapsed Time",
        value: state.elapsedTimeS.toFixed(3),
        unit: "s"
      };
    case TelemetryPoints.PosEciX:
      return {
        mnemonic: "Position ECI X",
        value: state.spacecraftPositionEciKm.x.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.PosEciY:
      return {
        mnemonic: "Position ECI Y",
        value: state.spacecraftPositionEciKm.y.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.PosEciZ:
      return {
        mnemonic: "Position ECI Z",
        value: state.spacecraftPositionEciKm.z.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.VelEciX:
      return {
        mnemonic: "Velocity ECI X",
        value: state.spacecraftVelocityEciKmS.x.toFixed(3),
        unit: "km/s"
      };
    case TelemetryPoints.VelEciY:
      return {
        mnemonic: "Velocity ECI Y",
        value: state.spacecraftVelocityEciKmS.y.toFixed(3),
        unit: "km/s"
      };
    case TelemetryPoints.VelEciZ:
      return {
        mnemonic: "Velocity ECI Z",
        value: state.spacecraftVelocityEciKmS.z.toFixed(3),
        unit: "km/s"
      };
    case TelemetryPoints.PosEcefX:
      return {
        mnemonic: "Position ECEF X",
        value: state.spacecraftPositionEcefKm.x.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.PosEcefY:
      return {
        mnemonic: "Position ECEF Y",
        value: state.spacecraftPositionEcefKm.y.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.PosEcefZ:
      return {
        mnemonic: "Position ECEF Z",
        value: state.spacecraftPositionEcefKm.z.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.VelEcefX:
      return {
        mnemonic: "Velocity ECEF X",
        value: state.spacecraftVelocityEcefKmS.x.toFixed(3),
        unit: "km/s"
      };
    case TelemetryPoints.VelEcefY:
      return {
        mnemonic: "Velocity ECEF Y",
        value: state.spacecraftVelocityEcefKmS.y.toFixed(3),
        unit: "km/s"
      };
    case TelemetryPoints.VelEcefZ:
      return {
        mnemonic: "Velocity ECEF Z",
        value: state.spacecraftVelocityEcefKmS.z.toFixed(3),
        unit: "km/s"
      };
    case TelemetryPoints.RightAscens:
      return {
        mnemonic: "Right Ascension",
        value: state.spacecraftPositionLla.x.toFixed(3),
        unit: "deg"
      };
    case TelemetryPoints.Declination:
      return {
        mnemonic: "Declination",
        value: state.spacecraftPositionLla.y.toFixed(3),
        unit: "deg"
      };
    case TelemetryPoints.Elevation:
      return {
        mnemonic: "Elevation",
        value: state.spacecraftPositionLla.z.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.SAM:
      return {
        mnemonic: "SAM",
        value: state.spacecraftSpecificAngularMomentumKm2S.toFixed(3),
        unit: "km2/s"
      };
    case TelemetryPoints.Inclination:
      return {
        mnemonic: "Inclination",
        value: state.spacecraftInclinationDeg.toFixed(3),
        unit: "deg"
      };
    case TelemetryPoints.RAAN:
      return {
        mnemonic: "RAAN",
        value: state.spacecraftRightAscensionAscendingNodeDeg.toFixed(3),
        unit: "deg"
      };
    case TelemetryPoints.Eccentricity:
      return {
        mnemonic: "Eccentricity",
        value: state.spacecraftEccentricity.toFixed(3),
        unit: ""
      };
    case TelemetryPoints.AoP:
      return {
        mnemonic: "Argument of Perigee",
        value: state.spacecraftArgumentOfPerigeeDeg.toFixed(3),
        unit: "deg"
      };
    case TelemetryPoints.TrueAnom:
      return {
        mnemonic: "True Anomaly",
        value: state.spacecraftTrueAnomalyDeg.toFixed(3),
        unit: "deg"
      };
    case TelemetryPoints.Periapsis:
      return {
        mnemonic: "Periapsis Altitude",
        value: state.spacecraftPeriapsisAltitudeKm.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.Apoapsis:
      return {
        mnemonic: "Apoapsis Altitude",
        value: state.spacecraftApoapsisAltitudeKm.toFixed(3),
        unit: "km"
      };
    case TelemetryPoints.Period:
      return {
        mnemonic: "Orbit Period",
        value: state.spacecraftOrbitPeriodHr.toFixed(3),
        unit: "hr"
      };
    case TelemetryPoints.AttQ1:
      return {
        mnemonic: "Attitude Q1",
        value: state.spacecraftAttitude.x.toFixed(3),
        unit: ""
      };
    case TelemetryPoints.AttQ2:
      return {
        mnemonic: "Attitude Q2",
        value: state.spacecraftAttitude.y.toFixed(3),
        unit: ""
      };
    case TelemetryPoints.AttQ3:
      return {
        mnemonic: "Attitude Q3",
        value: state.spacecraftAttitude.z.toFixed(3),
        unit: ""
      };
    case TelemetryPoints.AttQ4:
      return {
        mnemonic: "Attitude Q4",
        value: state.spacecraftAttitude.w.toFixed(3),
        unit: ""
      };
    case TelemetryPoints.OmegaX:
      return {
        mnemonic: "Angular Inertial Rate X",
        value: state.spacecraftAngularRateRadS.x.toFixed(3),
        unit: "rad/s"
      };
    case TelemetryPoints.OmegaY:
      return {
        mnemonic: "Angular Inertial Rate Y",
        value: state.spacecraftAngularRateRadS.y.toFixed(3),
        unit: "rad/s"
      };
    case TelemetryPoints.OmegaZ:
      return {
        mnemonic: "Angular Inertial Rate Z",
        value: state.spacecraftAngularRateRadS.z.toFixed(3),
        unit: "rad/s"
      };
    case TelemetryPoints.AxisErr:
      return {
        mnemonic: "Inertial Axis Error",
        value: (state.inertialAxisAngularErrorRad * 180 / Math.PI).toFixed(3),
        unit: "deg"
      }
    default:
      return {
        mnemonic: "",
        value: 0,
        unit: ""
      }
  }
}

