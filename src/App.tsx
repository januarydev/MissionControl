import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import "./App.css";
import { Panel } from "./components/Panel";
import { Telemetry } from "./components/Telemetry";
import { SimulationState } from "./types/SimulationState";

let lastPanelId: number = 0;

enum PanelType {
  TelemetryPanel
}

interface PanelData {
  id: number;
  panelType: PanelType;
}

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState | undefined>(undefined);
  listen<SimulationState>("update", (event) => { setSimulationState(event.payload); });

  const [panelArray, setPanelArray] = useState<PanelData[]>([]);
  const addToPanelArray = (panelType: PanelType) => setPanelArray(panelArray.concat({
    id: lastPanelId++,
    panelType: panelType
  }));
  const removeFromPanelArray = (id: number) => setPanelArray(panelArray.filter(panel => panel.id !== id))

  return (
    <main className="container">
      <div className="ToolBar">
        <div className="ToolBarTitle">MissionControl</div>
        <div className="ToolBarButtons">
          <button className="ToolButton">Commanding</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.TelemetryPanel)}>Telemetry</button>
          <button className="ToolButton">Graphing</button>
          <button className="ToolButton">Mapping</button>
          <button className="ToolButton">AttitudeVis</button>
        </div>
      </div>
      <div className="WorkArea">
        <div className="WorkAreaMenuBar">
          <div className="RunState">
            {simulationState?.paused ? "Paused" :  `Running (${simulationState?.timeMultiplier}x)`}
          </div>
          <div className="TimeControls">
            <button className="TimeControlButton" onClick={() => invoke("pause_time")}>Pause</button>
            <button className="TimeControlButton" onClick={() => invoke("run_time", { timeMultiplier: 1.0 })}>1x</button>
            <button className="TimeControlButton" onClick={() => invoke("run_time", { timeMultiplier: 2.0 })}>2x</button>
            <button className="TimeControlButton" onClick={() => invoke("run_time", { timeMultiplier: 4.0 })}>4x</button>
            <button className="TimeControlButton" onClick={() => invoke("run_time", { timeMultiplier: 8.0 })}>8x</button>
          </div>
        </div>
        <div className="DisplayArea">
          {panelArray.map((panelData, index) => {
            switch (panelData.panelType) {
              case PanelType.TelemetryPanel:
                return(
                  <Panel key={index} title="Telemetry" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Telemetry telemetryState={simulationState} />
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
