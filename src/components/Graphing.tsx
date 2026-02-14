import { useContext } from "react";
import { rowDetailsFromType, rowValueFromType, TelemetryPoints } from "../types/TelemetryTypes";
import { Dropdown } from "./Dropdown";
import { SimulationContext } from "../types/Simulation";

interface Plot {
  mnemonic: string;
  unit: string;
  data: [number, number][];
  onClick: () => void;
}

export interface GraphingState {
  types: TelemetryPoints[];
  plots: Plot[];
}

interface GraphingProps {
  graphingState: GraphingState;
  addToPlotArrayCallback: (point: TelemetryPoints) => void;
  removeFromPlotArrayCallback: (id: number) => void;
}

export function Graphing(props: GraphingProps) {
  const simulationState = useContext(SimulationContext);

  const plotsLength = props.graphingState.plots.length;
  if (props.graphingState.types.length != plotsLength) {
    const details = rowDetailsFromType(props.graphingState.types[plotsLength]);
    props.graphingState.plots.push({
      mnemonic: details.mnemonic,
      unit: details.unit,
      data: [],
      onClick: () => props.removeFromPlotArrayCallback(plotsLength),
    });
  }

  props.graphingState.plots.map((plot, index) => {
    plot.data.push([simulationState.elapsedTimeS, rowValueFromType(props.graphingState.types[index], simulationState)]);
  });

  return (
    <div className="GraphingContainer">
      <Dropdown
        label="Add to graph:"
        selected="select"
        options={[
          { value: "select", text: "Select..." },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.ElapsedTime), text: "Elapsed Time" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.PosEciX), text: "Position ECI X" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.PosEciY), text: "Position ECI Y" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.PosEciZ), text: "Position ECI Z" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.VelEciX), text: "Velocity ECI X" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.VelEciY), text: "Velocity ECI Y" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.VelEciZ), text: "Velocity ECI Z" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.PosEcefX), text: "Position ECEF X" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.PosEcefY), text: "Position ECEF Y" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.PosEcefZ), text: "Position ECEF Z" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.VelEcefX), text: "Velocity ECEF X" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.VelEcefY), text: "Velocity ECEF Y" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.VelEcefZ), text: "Velocity ECEF Z" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.RightAscens), text: "Right Ascension" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.Declination), text: "Declination" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.Elevation), text: "Elevation" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.SAM), text: "SAM" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.Inclination), text: "Inclination" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.RAAN), text: "RAAN" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.Eccentricity), text: "Eccentricity" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.AoP), text: "Argument of Perigee" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.TrueAnom), text: "True Anomaly" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.Periapsis), text: "Periapsis Altitude" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.Apoapsis), text: "Apoapsis Altitude" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.Period), text: "Orbit Period" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.AttQ1), text: "Attitude Q1" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.AttQ2), text: "Attitude Q2" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.AttQ3), text: "Attitude Q3" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.AttQ4), text: "Attitude Q4" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.OmegaX), text: "Angular Inertial Rate X" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.OmegaY), text: "Angular Inertial Rate Y" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.OmegaZ), text: "Angular Inertial Rate Z" },
          { onClick: () => props.addToPlotArrayCallback(TelemetryPoints.AxisErr), text: "Inertial Axis Error" }
        ]}
      />
    </div>
  );
}
