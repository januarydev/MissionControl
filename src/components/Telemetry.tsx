import { SimulationState } from "../types/SimulationState";

interface TelemetryProps {
  telemetryState?: SimulationState;
}

interface RowProps {
  mnemonic: string;
  value?: number | string;
  unit: string;
}

function Row(props: RowProps) {
  return (
    <tr>
      <td>{props.mnemonic}</td>
      <td>{props.value} {props.unit}</td>
    </tr>
  );
}

export function Telemetry(props: TelemetryProps) {
  return(
    <div className="TelemetryContainer">
      <table>
        <thead>
          <tr>
            <th>Mnemonic</th>
            <th>Value (Unit)</th>
          </tr>
        </thead>
        <tbody>
          <Row mnemonic="Elapsed Time" value={props.telemetryState?.elapsedTimeMs} unit="ms" />
          {props.telemetryState?.orbits.filter(body => body.name !== "Earth").flatMap((orbit, index) => [
            <Row key={index * 2 + 0} mnemonic={`${orbit.name} Position ECI`} value={
              [orbit.positionEciKm.x.toExponential(3), orbit.positionEciKm.y.toExponential(3), orbit.positionEciKm.z.toExponential(3)].toString()
            } unit="km" />,
            <Row key={index * 2 + 1} mnemonic={`${orbit.name} Velocity ECI`} value={
              [orbit.positionEciKm.x.toExponential(3), orbit.positionEciKm.y.toExponential(3), orbit.positionEciKm.z.toExponential(3)].toString()
            } unit="km/s" />,
          ])}
        </tbody>
      </table>
    </div>
  );
}
