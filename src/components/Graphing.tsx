import { useContext, useEffect, useRef } from "react";
import { rowValueFromType, TelemetryPoints } from "../types/TelemetryTypes";
import { Dropdown } from "./Dropdown";
import { SimulationContext } from "../types/Simulation";
import * as d3 from "d3";

interface Plot {
  mnemonic: string;
  unit: string;
  data: [number, number][];
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

  props.graphingState.plots.map((plot, index) => {
    plot.data.push([simulationState.elapsedTimeS, rowValueFromType(props.graphingState.types[index], simulationState)]);
  });

  const width = 640;
  const height = 400;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 50;
  const marginLeft = 50;
  const labelMarginBottom = 7;
  const transition = 250;
  const lineColors = [
    "#d55948",
    "#42c87f",
    "#583586",
    "#91b23e",
    "#6d71d8",
    "#caa331",
    "#5e8bd5",
    "#c57429",
    "#bd73ca",
    "#6fb95c",
    "#872762",
    "#43c8ac",
    "#ce5183",
    "#62ac6a",
    "#d471b2",
    "#537022",
    "#be4a5b",
    "#b7a650",
    "#8b351d",
    "#c2814c"
  ];

  const numPlots = props.graphingState.plots.length;
  var xDomain = numPlots == 0 ? [0, 0] : [Infinity, -Infinity];
  var yDomain = numPlots == 0 ? [0, 0] : [Infinity, -Infinity];
  props.graphingState.plots.map((plot) => {
    const xVals = plot.data.map((tuple) => tuple[0]);
    const yVals = plot.data.map((tuple) => tuple[1]);
    const xMin = Math.min(...xVals);
    const xMax = Math.max(...xVals);
    if (xMin < xDomain[0]) { xDomain[0] = xMin; }
    if (xMax > xDomain[1]) { xDomain[1] = xMax; }
    const yMin = Math.min(...yVals);
    const yMax = Math.max(...yVals);
    if (yMin < yDomain[0]) { yDomain[0] = yMin; }
    if (yMax > yDomain[1]) { yDomain[1] = yMax; }
  });

  const gx = useRef<SVGSVGElement>(null);
  const gy = useRef<SVGSVGElement>(null);
  const x = d3.scaleLinear().domain(xDomain).range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear().domain(yDomain).range([height - marginBottom, marginTop]);
  useEffect(() => void d3.select(gx.current!).transition().duration(transition).call(d3.axisBottom(x)), [gx, x]);
  useEffect(() => void d3.select(gy.current!).transition().duration(transition).call(d3.axisLeft(y)), [gy, y]);
  const lineGenerator = d3.line((data) => x(data[0]), (data) => y(data[1])).curve(d3.curveCatmullRom.alpha(0.5));

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
      <svg className="GraphingPlot" width={width} height={height}>
        <rect className="GraphingPlotBackground" x={marginLeft} y={marginTop} width={width - marginLeft - marginRight} height={height - marginTop - marginBottom} />
        <g ref={gx} transform={`translate(0, ${height - marginBottom})`} />
        <g ref={gy} transform={`translate(${marginLeft}, 0)`} />
        <text textAnchor="middle" x={(width + marginLeft) / 2} y={height - labelMarginBottom} fill="white">Elapsed Time (s)</text>
        {props.graphingState.plots.map((plot, index) => <path key={index} fill="none" stroke={lineColors[index]} strokeWidth="1.25" d={lineGenerator(plot.data)!} />)}
      </svg>
    </div >
  );
}
