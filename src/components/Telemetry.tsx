import { useContext } from "react";
import { TelemetryPoints, TelemetryPresets, TelemetryState } from "../types/TelemetryTypes"
import { IconButton } from "./IconButton";
import { SimulationContext } from "../types/SimulationState";

interface TelemetryProps {
  telemetryState: TelemetryState;
  addToRowArrayCallback: (point: TelemetryPoints) => void;
  removeFromRowArrayCallback: (id: number) => void;
  updatePresetCallback: (state: string) => void;
}

interface RowProps {
  mnemonic: string;
  value: number | string;
  unit: string;
  onClick: () => void;
}

function Row(props: RowProps) {
  return (
    <div className="TelemetryRow">
      <div className="TelemetryData">{props.mnemonic}</div>
      <div className="TelemetryData">{props.value} {props.unit} <IconButton className="CloseRowIcon" id="close-box" onClick={props.onClick} /></div>
    </div>
  );
}

export function Telemetry(props: TelemetryProps) {
  const simulationState = useContext(SimulationContext);

  const createRow = (point: TelemetryPoints, index: number) => {
    switch (point) {
      case TelemetryPoints.ElapsedTime:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Elapsed Time" value={simulationState.elapsedTimeS.toFixed(3)} unit="s" />;
      case TelemetryPoints.PosEciX:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Position ECI X" value={simulationState.spacecraftPositionEciKm.x.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEciY:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Position ECI Y" value={simulationState.spacecraftPositionEciKm.y.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEciZ:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Position ECI Z" value={simulationState.spacecraftPositionEciKm.z.toFixed(3)} unit="km" />;
      case TelemetryPoints.VelEciX:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Velocity ECI X" value={simulationState.spacecraftVelocityEciKmS.x.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEciY:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Velocity ECI Y" value={simulationState.spacecraftVelocityEciKmS.y.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEciZ:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Velocity ECI Z" value={simulationState.spacecraftVelocityEciKmS.z.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.PosEcefX:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Position ECEF X" value={simulationState.spacecraftPositionEcefKm.x.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEcefY:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Position ECEF Y" value={simulationState.spacecraftPositionEcefKm.y.toFixed(3)} unit="km" />;
      case TelemetryPoints.PosEcefZ:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Position ECEF Z" value={simulationState.spacecraftPositionEcefKm.z.toFixed(3)} unit="km" />;
      case TelemetryPoints.VelEcefX:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Velocity ECEF X" value={simulationState.spacecraftVelocityEcefKmS.x.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEcefY:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Velocity ECEF Y" value={simulationState.spacecraftVelocityEcefKmS.y.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.VelEcefZ:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Velocity ECEF Z" value={simulationState.spacecraftVelocityEcefKmS.z.toFixed(3)} unit="km/s" />;
      case TelemetryPoints.RightAscens:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Right Ascension" value={simulationState.spacecraftPositionLla.x.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Declination:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Declination" value={simulationState.spacecraftPositionLla.y.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Elevation:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Elevation" value={simulationState.spacecraftPositionLla.z.toFixed(3)} unit="km" />;
      case TelemetryPoints.SAM:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="SAM" value={simulationState.spacecraftSpecificAngularMomentumKm2S.toFixed(3)} unit="km2/s" />;
      case TelemetryPoints.Inclination:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Inclination" value={simulationState.spacecraftInclinationDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.RAAN:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="RAAN" value={simulationState.spacecraftRightAscensionAscendingNodeDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Eccentricity:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Eccentricity" value={simulationState.spacecraftEccentricity.toFixed(3)} unit="" />;
      case TelemetryPoints.AoP:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Argument of Perigee" value={simulationState.spacecraftArgumentOfPerigeeDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.TrueAnom:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="True Anomaly" value={simulationState.spacecraftTrueAnomalyDeg.toFixed(3)} unit="deg" />;
      case TelemetryPoints.Periapsis:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Periapsis Altitude" value={simulationState.spacecraftPeriapsisAltitudeKm.toFixed(3)} unit="km" />;
      case TelemetryPoints.Apoapsis:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Apoapsis Altitude" value={simulationState.spacecraftApoapsisAltitudeKm.toFixed(3)} unit="km" />;
      case TelemetryPoints.Period:
        return <Row key={index} onClick={() => props.removeFromRowArrayCallback(index)} mnemonic="Orbit Period" value={simulationState.spacecraftOrbitPeriodHr.toFixed(3)} unit="hr" />;
    }
  }

  return (
    <div className="TelemetryContainer">
      <label className="TelemetrySelect">
        Select preset:
        <select value={props.telemetryState.preset} onChange={selected => props.updatePresetCallback(selected.target.value)}>
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
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.ElapsedTime)}>Elapsed Time (s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.PosEciX)}>Position ECI X (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.PosEciY)}>Position ECI Y (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.PosEciZ)}>Position ECI Z (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.VelEciX)}>Velocity ECI X (km/s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.VelEciY)}>Velocity ECI Y (km/s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.VelEciZ)}>Velocity ECI Z (km/s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.PosEcefX)}>Position ECEF X (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.PosEcefY)}>Position ECEF Y (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.PosEcefZ)}>Position ECEF Z (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.VelEcefX)}>Velocity ECEF X (km/s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.VelEcefY)}>Velocity ECEF Y (km/s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.VelEcefZ)}>Velocity ECEF Z (km/s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.RightAscens)}>Right Ascension (deg)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.Declination)}>Declination (deg)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.Elevation)}>Elevation (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.SAM)}>SAM (km2/s)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.Inclination)}>Inclination (deg)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.RAAN)}>RAAN (deg)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.Eccentricity)}>Eccentricity</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.AoP)}>Argument of Perigee (deg)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.TrueAnom)}>True Anomaly (deg)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.Periapsis)}>Periapsis Altitude (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.Apoapsis)}>Apoapsis Altitude (km)</option>
          <option onClick={() => props.addToRowArrayCallback(TelemetryPoints.Period)}>Orbit Period (hr)</option>
        </select>
      </label>
      <div className="TelemetryTable">
        <div className="TelemetryRow">
          <div className="TelemetryHeader">Mnemonic</div>
          <div className="TelemetryHeader">Value (Unit)</div>
        </div>
        {props.telemetryState.rowTypes.map((point, index) => createRow(point, index))}
      </div>
    </div>
  );
}

