export enum TelemetryPresets {
  Custom = "custom",
  Preset1 = "preset1",
  Preset2 = "preset2",
  Preset3 = "preset3",
  Preset4 = "preset4"
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
  Period
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
    default:
  }
}

