import { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, Event as TauriEvent } from "@tauri-apps/api/event";
import "./App.css";
import { Panel } from "./components/Panel";
import { Commanding } from "./components/Commanding";
import { Telemetry } from "./components/Telemetry";
import { Graphing } from "./components/Graphing";
import { Mapping } from "./components/Mapping";
import { OrbitVis } from "./components/OrbitVis";
import { AttitudeVis } from "./components/AttitudeVis";
import { SimulationState } from "./types/SimulationState";
import { IconButton } from "./components/IconButton";
import { SvgIcon } from "./components/SvgIcon";

let lastPanelId: number = 0;

enum PanelType {
  CommandingPanel,
  TelemetryPanel,
  GraphingPanel,
  MappingPanel,
  OrbitVisPanel,
  AttitudeVisPanel
}

interface PanelData {
  id: number;
  panelType: PanelType;
}

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState | undefined>(undefined);
  const [mapCoordinates, setMapCoordinates] = useState<[number, number, number][]>([]);

  const handleSimulationUpdate = useCallback((event: TauriEvent<SimulationState>) => {
    setSimulationState(event.payload);

    const llaPosition: [number, number, number] = [event.payload.spacecraftPositionLla.x - 180, event.payload.spacecraftPositionLla.y, event.payload.spacecraftPositionLla.z * 1000];
    if (mapCoordinates.length === 0) {
      setMapCoordinates([llaPosition]);
      return;
    }
    if (Math.sqrt(Math.pow(mapCoordinates[mapCoordinates.length - 1][0] - llaPosition[0], 2) + Math.pow(mapCoordinates[mapCoordinates.length - 1][1] - llaPosition[1], 2)) > 0.5) {
      setMapCoordinates(mapCoordinates.concat([llaPosition]));
    }
  }, [mapCoordinates]);

  useEffect(() => {
    const unlistenPromise = listen<SimulationState>("update", handleSimulationUpdate);
    return () => { unlistenPromise.then(unlisten => unlisten()); };
  }, [handleSimulationUpdate]);

  const [panelArray, setPanelArray] = useState<PanelData[]>([]);
  const addToPanelArray = (panelType: PanelType) => setPanelArray(panelArray.concat({
    id: lastPanelId++,
    panelType: panelType
  }));
  const removeFromPanelArray = (id: number) => setPanelArray(panelArray.filter(panel => panel.id !== id));

  return (
    <main className="container">
      <div className="ToolBar">
        <div className="ToolBarTitle">MissionControl</div>
        <div className="ToolBarButtons">
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.CommandingPanel)}>Commanding {SvgIcon("satellite-uplink")}</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.TelemetryPanel)}>Telemetry {SvgIcon("table")}</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.GraphingPanel)}>Graphing {SvgIcon("chart-line")}</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.MappingPanel)}>Mapping {SvgIcon("map")}</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.OrbitVisPanel)}>OrbitVis {SvgIcon("earth")}</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.AttitudeVisPanel)}>AttitudeVis {SvgIcon("target")}</button>
        </div>
      </div>
      <div className="WorkArea">
        <div className="WorkAreaMenuBar">
          <div className="RunState">
            {simulationState?.paused ? "Status: Paused" :  `Status: Running (${simulationState?.timeMultiplier}x)`}
          </div>
          <div className="TimeControls">
            <IconButton id="pause" onClick={() => invoke("pause_time")} />
            <IconButton id="play" onClick={() => invoke("run_time", { timeMultiplier: 1.0 })} />
            <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 2.0 })} />
            <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 4.0 })} />
            <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 8.0 })} />
          </div>
        </div>
        <div className="DisplayArea">
          {panelArray.map((panelData, index) => {
            switch (panelData.panelType) {
              case PanelType.CommandingPanel:
                return(
                  <Panel key={index} iconId="satellite-uplink" title="Commanding" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Commanding />
                  </Panel>
                );
              case PanelType.TelemetryPanel:
                return(
                  <Panel key={index} iconId="table" title="Telemetry" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Telemetry state={simulationState} />
                  </Panel>
                );
              case PanelType.GraphingPanel:
                return(
                  <Panel key={index} iconId="chart-line" title="Graphing" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Graphing />
                  </Panel>
                );
              case PanelType.MappingPanel:
                return(
                  <Panel key={index} iconId="map" title="Mapping" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Mapping data={mapCoordinates} />
                  </Panel>
                );
              case PanelType.OrbitVisPanel:
                return(
                  <Panel key={index} iconId="earth" title="OrbitVis" onClose={() => removeFromPanelArray(panelData.id)}>
                    <OrbitVis data={mapCoordinates} />
                  </Panel>
                );
              case PanelType.AttitudeVisPanel:
                return(
                  <Panel key={index} iconId="target" title="AttitudeVis" onClose={() => removeFromPanelArray(panelData.id)}>
                    <AttitudeVis />
                  </Panel>
                );
              default:
                return undefined
            }
          })}
        </div>
      </div>
    </main>
  );
}

export default App;
