import { useContext } from "react";
import { rowDetailsFromType, TelemetryPoints, TelemetryPresets, TelemetryState } from "../types/TelemetryTypes"
import { IconButton } from "./IconButton";
import { SimulationContext } from "../types/Simulation";
import { Dropdown } from "./Dropdown";
import { Constants } from "../types/Constants";

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
        <IconButton
          className="CloseRowIcon"
          id="close-box"
          onClick={props.onClick}
          hoverFill={Constants.exitButtonHoverFill}
        />
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
      <Dropdown
        label="Select preset:"
        selected={props.telemetryState.preset}
        onChange={selected => props.updatePresetCallback(selected as TelemetryPresets)}
        options={[
          { value: TelemetryPresets.Custom, text: "Custom" },
          { value: TelemetryPresets.Preset1, text: "All Telemetry" },
          { value: TelemetryPresets.Preset2, text: "ECI Coordinates" },
          { value: TelemetryPresets.Preset3, text: "ECEF Coordinates" },
          { value: TelemetryPresets.Preset4, text: "Orbital Elements" }
        ]}
      />
      <Dropdown
        label="Add to table:"
        selected="select"
        options={[
          { value: "select", text: "Select..." },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.ElapsedTime), text: "Elapsed Time" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.PosEciX), text: "Position ECI X" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.PosEciY), text: "Position ECI Y" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.PosEciZ), text: "Position ECI Z" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.VelEciX), text: "Velocity ECI X" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.VelEciY), text: "Velocity ECI Y" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.VelEciZ), text: "Velocity ECI Z" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.PosEcefX), text: "Position ECEF X" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.PosEcefY), text: "Position ECEF Y" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.PosEcefZ), text: "Position ECEF Z" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.VelEcefX), text: "Velocity ECEF X" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.VelEcefY), text: "Velocity ECEF Y" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.VelEcefZ), text: "Velocity ECEF Z" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.RightAscens), text: "Right Ascension" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.Declination), text: "Declination" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.Elevation), text: "Elevation" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.SAM), text: "SAM" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.Inclination), text: "Inclination" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.RAAN), text: "RAAN" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.Eccentricity), text: "Eccentricity" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.AoP), text: "Argument of Perigee" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.TrueAnom), text: "True Anomaly" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.Periapsis), text: "Periapsis Altitude" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.Apoapsis), text: "Apoapsis Altitude" },
          { onClick: () => props.addToRowArrayCallback(TelemetryPoints.Period), text: "Orbit Period" }
        ]}
      />
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

