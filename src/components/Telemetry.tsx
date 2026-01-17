import { useContext } from "react";
import { rowDetailsFromType, TelemetryPoints, TelemetryPresets, TelemetryState } from "../types/TelemetryTypes"
import { IconButton } from "./IconButton";
import { SimulationContext } from "../types/SimulationState";

interface TelemetryProps {
  telemetryState: TelemetryState;
  addToRowArrayCallback: (point: TelemetryPoints) => void;
  removeFromRowArrayCallback: (id: number) => void;
  updatePresetCallback: (state: TelemetryPresets) => void;
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
      <div className="TelemetryData">
        {props.value}
        {props.unit}
        <IconButton className="CloseRowIcon" id="close-box" onClick={props.onClick} />
      </div>
    </div>
  );
}

export function Telemetry(props: TelemetryProps) {
  const simulationState = useContext(SimulationContext);

  const createRow = (point: TelemetryPoints, index: number) => {
    const rowDetails = rowDetailsFromType(point, simulationState);
    return (
      <Row
        key={index}
        onClick={() => props.removeFromRowArrayCallback(index)}
        mnemonic={rowDetails.mnemonic}
        value={rowDetails.value}
        unit={rowDetails.unit}
      />
    );
  }

  return (
    <div className="TelemetryContainer">
      <label className="TelemetrySelect">
        Select preset:
        <select value={props.telemetryState.preset} onChange={selected => props.updatePresetCallback(selected.target.value as TelemetryPresets)}>
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

