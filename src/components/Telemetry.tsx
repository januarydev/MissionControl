import { SimulationState } from "../types/SimulationState";

interface TelemetryProps {
  state?: SimulationState;
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
  return (
    <div className="TelemetryContainer">
      <table>
        <thead>
          <tr>
            <th>Mnemonic</th>
            <th>Value (Unit)</th>
          </tr>
        </thead>
        <tbody>
          <Row mnemonic="Elapsed Time" value={props.state?.elapsedTimeMs} unit="ms" />
          <Row mnemonic="Position ECI X" value={props.state?.spacecraftPositionEciKm.x.toFixed(3)} unit="km" />
          <Row mnemonic="Position ECI Y" value={props.state?.spacecraftPositionEciKm.y.toFixed(3)} unit="km" />
          <Row mnemonic="Position ECI Z" value={props.state?.spacecraftPositionEciKm.z.toFixed(3)} unit="km" />
          <Row mnemonic="Velocity ECI X" value={props.state?.spacecraftVelocityEciKmS.x.toFixed(3)} unit="km/s" />
          <Row mnemonic="Velocity ECI Y" value={props.state?.spacecraftVelocityEciKmS.y.toFixed(3)} unit="km/s" />
          <Row mnemonic="Velocity ECI Z" value={props.state?.spacecraftVelocityEciKmS.z.toFixed(3)} unit="km/s" />
          <Row mnemonic="Position ECEF X" value={props.state?.spacecraftPositionEcefKm.x.toFixed(3)} unit="km" />
          <Row mnemonic="Position ECEF Y" value={props.state?.spacecraftPositionEcefKm.y.toFixed(3)} unit="km" />
          <Row mnemonic="Position ECEF Z" value={props.state?.spacecraftPositionEcefKm.z.toFixed(3)} unit="km" />
          <Row mnemonic="Velocity ECEF X" value={props.state?.spacecraftVelocityEcefKmS.x.toFixed(3)} unit="km/s" />
          <Row mnemonic="Velocity ECEF Y" value={props.state?.spacecraftVelocityEcefKmS.y.toFixed(3)} unit="km/s" />
          <Row mnemonic="Velocity ECEF Z" value={props.state?.spacecraftVelocityEcefKmS.z.toFixed(3)} unit="km/s" />
          <Row mnemonic="Right Ascension" value={props.state?.spacecraftPositionLla.x.toFixed(3)} unit="deg" />
          <Row mnemonic="Declination" value={props.state?.spacecraftPositionLla.y.toFixed(3)} unit="deg" />
          <Row mnemonic="Elevation" value={props.state?.spacecraftPositionLla.z.toFixed(3)} unit="km" />
        </tbody>
      </table>
    </div>
  );
}
