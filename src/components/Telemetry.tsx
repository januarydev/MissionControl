import { useState } from "react";
import { SimulationState } from "../types/SimulationState";
import { IconButton } from "./IconButton";

interface TelemetryProps {
  state?: SimulationState;
}

enum TelemetryPoints {
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

enum TelemetryPresets {
  Custom = "custom",
  Preset1 = "preset1",
  Preset2 = "preset2",
  Preset3 = "preset3",
  Preset4 = "preset4"
}

const Preset1: TelemetryPoints[] = [
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

const Preset2: TelemetryPoints[] = [
  TelemetryPoints.PosEciX,
  TelemetryPoints.PosEciY,
  TelemetryPoints.PosEciZ,
  TelemetryPoints.VelEciX,
  TelemetryPoints.VelEciY,
  TelemetryPoints.VelEciZ
];

const Preset3: TelemetryPoints[] = [
  TelemetryPoints.PosEcefX,
  TelemetryPoints.PosEcefY,
  TelemetryPoints.PosEcefZ,
  TelemetryPoints.VelEcefX,
  TelemetryPoints.VelEcefY,
  TelemetryPoints.VelEcefZ
];

const Preset4: TelemetryPoints[] = [
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

interface RowProps {
  mnemonic: string;
  value?: number | string;
  unit: string;
  onClick: () => void;
}

function Row(props: RowProps) {
  return (
    <tr>
      <td>{props.mnemonic}</td>
      <td>{props.value} {props.unit} <IconButton id="close-box" onClick={props.onClick} /></td>
    </tr>
  );
}

interface RowDetails {
  id: number;
  type: TelemetryPoints;
}

export function Telemetry(props: TelemetryProps) {
  const [rowArray, setRowArray] = useState<RowDetails[]>([]);
  const [lastRowId, setlastRowId] = useState<number>(0);
  const addToRowArray = (type: TelemetryPoints) => {
    setRowArray(arr => arr.concat({id: lastRowId, type: type}));
    setlastRowId(id => id + 1);
  };
  const rowsToPreset = (preset: TelemetryPoints[]) => {
    setRowArray([]);
    preset.map((type, index) => { setRowArray(arr => arr.concat({id: index, type: type})); });
    setlastRowId(preset.length);
  };
  const removeFromRowArray = (id: number) => { setRowArray(arr => arr.filter(row => row.id != id)); }

  const [preset, setPreset] = useState<string>(TelemetryPresets.Custom);
  const updatePreset = (state: string) => {
    setPreset(state);
    switch (state) {
      case TelemetryPresets.Preset1:
        rowsToPreset(Preset1);
        break;
      case TelemetryPresets.Preset2:
        rowsToPreset(Preset2);
        break;
      case TelemetryPresets.Preset3:
        rowsToPreset(Preset3);
        break;
      case TelemetryPresets.Preset4:
        rowsToPreset(Preset4);
        break;
      default:
    }
  }

  const createRow = (point: RowDetails, index: number) => {
    switch (point.type) {
      case TelemetryPoints.ElapsedTime:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Elapsed Time" value={props.state?.elapsedTimeS.toFixed(3)} unit="s" />;
      case TelemetryPoints.PosEciX:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Position ECI X" value={props.state?.spacecraftPositionEciKm.x.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEciY:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Position ECI Y" value={props.state?.spacecraftPositionEciKm.y.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEciZ:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Position ECI Z" value={props.state?.spacecraftPositionEciKm.z.toFixed(3)} unit="km" />;
      case TelemetryPoints.VelEciX:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Velocity ECI X" value={props.state?.spacecraftVelocityEciKmS.x.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEciY:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Velocity ECI Y" value={props.state?.spacecraftVelocityEciKmS.y.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEciZ:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Velocity ECI Z" value={props.state?.spacecraftVelocityEciKmS.z.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.PosEcefX:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Position ECEF X" value={props.state?.spacecraftPositionEcefKm.x.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEcefY:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Position ECEF Y" value={props.state?.spacecraftPositionEcefKm.y.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEcefZ:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Position ECEF Z" value={props.state?.spacecraftPositionEcefKm.z.toFixed(3)} unit="km" />;
      case TelemetryPoints.VelEcefX:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Velocity ECEF X" value={props.state?.spacecraftVelocityEcefKmS.x.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEcefY:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Velocity ECEF Y" value={props.state?.spacecraftVelocityEcefKmS.y.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEcefZ:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Velocity ECEF Z" value={props.state?.spacecraftVelocityEcefKmS.z.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.RightAscens:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Right Ascension" value={props.state?.spacecraftPositionLla.x.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Declination:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Declination" value={props.state?.spacecraftPositionLla.y.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Elevation:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Elevation" value={props.state?.spacecraftPositionLla.z.toFixed(3)} unit="km" />;
      case TelemetryPoints.SAM:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="SAM" value={props.state?.spacecraftSpecificAngularMomentumKm2S.toFixed(3)} unit="km2/s" />;
      case TelemetryPoints.Inclination:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Inclination" value={props.state?.spacecraftInclinationDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.RAAN:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="RAAN" value={props.state?.spacecraftRightAscensionAscendingNodeDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Eccentricity:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Eccentricity" value={props.state?.spacecraftEccentricity.toFixed(3)} unit="" />;
      case TelemetryPoints.AoP:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Argument of Perigee" value={props.state?.spacecraftArgumentOfPerigeeDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.TrueAnom:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="True Anomaly" value={props.state?.spacecraftTrueAnomalyDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Periapsis:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Periapsis Altitude" value={props.state?.spacecraftPeriapsisAltitudeKm.toFixed(3)} unit="km" />;
      case TelemetryPoints.Apoapsis:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Apoapsis Altitude" value={props.state?.spacecraftApoapsisAltitudeKm.toFixed(3)} unit="km" />;
      case TelemetryPoints.Period:
        return <Row key={index} onClick={() => removeFromRowArray(point.id)} mnemonic="Orbit Period" value={props.state?.spacecraftOrbitPeriodHr.toFixed(3)} unit="hr" />;
    }
  }

  return (
    <div className="TelemetryContainer">
      <label className="TelemetrySelect">
        Select preset:
        <select value={preset} onChange={selected => updatePreset(selected.target.value)}>
          <option value={TelemetryPresets.Custom}>Custom</option>
          <option value={TelemetryPresets.Preset1}>All Telemetry</option>
          <option value={TelemetryPresets.Preset2}>ECI Coordinates</option>
          <option value={TelemetryPresets.Preset3}>ECEF Coordinates</option>
          <option value={TelemetryPresets.Preset4}>Orbital Elements</option>
        </select>
      </label>
      <label className="TelemetrySelect">
        Add to table:
        <select onChange={ev => ev.preventDefault()} value="select">
          <option value="select">Select...</option>
          <option onClick={() => addToRowArray(TelemetryPoints.ElapsedTime)}>Elapsed Time (s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.PosEciX)}>Position ECI X (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.PosEciY)}>Position ECI Y (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.PosEciZ)}>Position ECI Z (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.VelEciX)}>Velocity ECI X (km/s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.VelEciY)}>Velocity ECI Y (km/s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.VelEciZ)}>Velocity ECI Z (km/s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.PosEcefX)}>Position ECEF X (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.PosEcefY)}>Position ECEF Y (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.PosEcefZ)}>Position ECEF Z (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.VelEcefX)}>Velocity ECEF X (km/s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.VelEcefY)}>Velocity ECEF Y (km/s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.VelEcefZ)}>Velocity ECEF Z (km/s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.RightAscens)}>Right Ascension (deg)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.Declination)}>Declination (deg)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.Elevation)}>Elevation (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.SAM)}>SAM (km2/s)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.Inclination)}>Inclination (deg)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.RAAN)}>RAAN (deg)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.Eccentricity)}>Eccentricity</option>
          <option onClick={() => addToRowArray(TelemetryPoints.AoP)}>Argument of Perigee (deg)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.TrueAnom)}>True Anomaly (deg)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.Periapsis)}>Periapsis Altitude (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.Apoapsis)}>Apoapsis Altitude (km)</option>
          <option onClick={() => addToRowArray(TelemetryPoints.Period)}>Orbit Period (hr)</option>
        </select>
      </label>
      <table className="TelemetryTable">
        <thead>
          <tr>
            <th>Mnemonic</th>
            <th>Value (Unit)</th>
          </tr>
        </thead>
        <tbody>
          {rowArray.map((point, index) => createRow(point, index))}
        </tbody>
      </table>
    </div>
  );
}
