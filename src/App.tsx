import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
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
import { Constants } from "./types/Constants";

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
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.CommandingPanel)}>Commanding</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.TelemetryPanel)}>Telemetry</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.GraphingPanel)}>Graphing</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.MappingPanel)}>Mapping</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.OrbitVisPanel)}>OrbitVis</button>
          <button className="ToolButton" onClick={() => addToPanelArray(PanelType.AttitudeVisPanel)}>AttitudeVis</button>
        </div>
      </div>
      <div className="WorkArea">
        <div className="WorkAreaMenuBar">
          <div className="RunState">
            {simulationState?.paused ? "Status: Paused" :  `Status: Running (${simulationState?.timeMultiplier}x)`}
          </div>
          <div className="TimeControls">
            <IconButton id="pause" fill={Constants.iconButtonFill} hoverFill={Constants.iconButtonHoverFill} onClick={() => invoke("pause_time")} />
            <IconButton id="play" fill={Constants.iconButtonFill} hoverFill={Constants.iconButtonHoverFill} onClick={() => invoke("run_time", { timeMultiplier: 1.0 })} />
            <IconButton id="fast-forward" fill={Constants.iconButtonFill} hoverFill={Constants.iconButtonHoverFill} onClick={() => invoke("run_time", { timeMultiplier: 2.0 })} />
            <IconButton id="fast-forward" fill={Constants.iconButtonFill} hoverFill={Constants.iconButtonHoverFill} onClick={() => invoke("run_time", { timeMultiplier: 4.0 })} />
            <IconButton id="fast-forward" fill={Constants.iconButtonFill} hoverFill={Constants.iconButtonHoverFill} onClick={() => invoke("run_time", { timeMultiplier: 8.0 })} />
          </div>
        </div>
        <div className="DisplayArea">
          {panelArray.map((panelData, index) => {
            switch (panelData.panelType) {
              case PanelType.CommandingPanel:
                return(
                  <Panel key={index} title="Commanding" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Commanding state={simulationState} />
                  </Panel>
                );
              case PanelType.TelemetryPanel:
                return(
                  <Panel key={index} title="Telemetry" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Telemetry state={simulationState} />
                  </Panel>
                );
              case PanelType.GraphingPanel:
                return(
                  <Panel key={index} title="Graphing" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Graphing state={simulationState} />
                  </Panel>
                );
              case PanelType.MappingPanel:
                return(
                  <Panel key={index} title="Mapping" onClose={() => removeFromPanelArray(panelData.id)}>
                    <Mapping state={simulationState} />
                  </Panel>
                );
              case PanelType.OrbitVisPanel:
                return(
                  <Panel key={index} title="OrbitVis" onClose={() => removeFromPanelArray(panelData.id)}>
                    <OrbitVis state={simulationState} />
                  </Panel>
                );
              case PanelType.AttitudeVisPanel:
                return(
                  <Panel key={index} title="AttitudeVis" onClose={() => removeFromPanelArray(panelData.id)}>
                    <AttitudeVis state={simulationState} />
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
