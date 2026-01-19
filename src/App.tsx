import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Constants } from "./types/Constants";
import { GetCursorStyleFromWindow, useWindow, WindowContext } from "./types/Window";
import { Clickable } from "./components/Clickable";
import { CameraContext, CameraState, CreateCameraState } from "./types/CameraContext";
import { Pannable } from "./components/Pannable";
import { Scroll } from "./components/Scroll";
import { Limit } from "./types/Math";

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
  startPosition: [number, number];
}

function generateTestData() {
  const data: [number, number, number][] = [];
  for (let pt = 0; pt < 100; ++pt) {
    data.push([(pt / 100.0) * 720 - 180, 15 * Math.cos((pt / 100.0) * Math.PI * 2), (pt / 100.0) * 2000000]);
  }
  return data;
}

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState | undefined>(undefined);
  const [cameraState, setCameraState] = useState<CameraState>(CreateCameraState());
  const [lastPanelId, setLastPanelId] = useState<number>(0);
  const [horizontalThumbStart, setHorizontalThumbStart] = useState<number>(0);
  const [horizontalRelativeThumbStart, setHorizontalRelativeThumbStart] = useState<number>(0);
  const [verticalThumbStart, setVerticalThumbStart] = useState<number>(0);
  const [verticalRelativeThumbStart, setVerticalRelativeThumbStart] = useState<number>(0);
  const displayAreaRef = useRef<HTMLDivElement>(null);

  const handleSimulationUpdate = useCallback((ev: TauriEvent<SimulationState>) => {
    setSimulationState(ev.payload);
  }, []);

  useEffect(() => {
    const unlistenPromise = listen<SimulationState>("update", handleSimulationUpdate);
    return () => {
      unlistenPromise.then(unlisten => unlisten());
    }
  }, [handleSimulationUpdate]);

  const [panelArray, setPanelArray] = useState<PanelData[]>([]);
  const addToPanelArray = (panelType: PanelType) => {
    const displayArea = displayAreaRef.current;
    if (displayArea) {
      const children = displayArea.children;
      for (var i = 0; i < children.length; i++) {
        const child = children[i];
        console.log(child.getBoundingClientRect())
      }
    }
    setPanelArray(arr => arr.concat({
      id: lastPanelId,
      panelType: panelType,
      startPosition: [0, 0]
    }));
    setLastPanelId(id => id + 1);
  };
  const removeFromPanelArray = (id: number) => setPanelArray(panelArray.filter(panel => panel.id !== id))
  const testData = useMemo(() => generateTestData(), []);

  const windowState = useWindow();

  return (
    <main className="container" style={{cursor: GetCursorStyleFromWindow(windowState)}}>
      <div className="ToolBar">
        <div className="ToolBarTitle">MissionControl</div>
        <div className="ToolBarButtons">
          <Clickable><button className="ToolButton" onClick={() => addToPanelArray(PanelType.CommandingPanel)}>Commanding</button></Clickable>
          <Clickable><button className="ToolButton" onClick={() => addToPanelArray(PanelType.TelemetryPanel)}>Telemetry</button></Clickable>
          <Clickable><button className="ToolButton" onClick={() => addToPanelArray(PanelType.GraphingPanel)}>Graphing</button></Clickable>
          <Clickable><button className="ToolButton" onClick={() => addToPanelArray(PanelType.MappingPanel)}>Mapping</button></Clickable>
          <Clickable><button className="ToolButton" onClick={() => addToPanelArray(PanelType.OrbitVisPanel)}>OrbitVis</button></Clickable>
          <Clickable><button className="ToolButton" onClick={() => addToPanelArray(PanelType.AttitudeVisPanel)}>AttitudeVis</button></Clickable>
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
        <WindowContext value={windowState}>
          <Pannable
            onUpdateRelativeCameraPosition={(dx, dy) => {
              setCameraState((st: CameraState) => {
                return {
                  x: st.x,
                  y: st.y,
                  relativeX: dx,
                  relativeY: dy,
                  scale: st.scale
              }});
            }}

            onApplyRelativeCameraPosition={(dx, dy) => {
              setCameraState((st: CameraState) => {
                return {
                  x: st.x + dx,
                  y: st.y + dy,
                  relativeX: 0,
                  relativeY: 0,
                  scale: st.scale
              }});
            }}
          >
            <div ref={displayAreaRef} className="DisplayArea">
              <CameraContext value={cameraState}>
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
                          <Mapping data={testData} />
                        </Panel>
                      );
                    case PanelType.OrbitVisPanel:
                      return(
                        <Panel key={index} title="OrbitVis" onClose={() => removeFromPanelArray(panelData.id)}>
                          <OrbitVis data={testData} />
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
                <Scroll
                  IsVisible={true}
                  ScrollDirection="horizontal"
                  MinValue={0}
                  MaxValue={1}
                  ThumbStart={Limit(0, 0.8, horizontalThumbStart + horizontalRelativeThumbStart)}
                  ThumbLength={0.2}
                  OnRelativeThumbStartUpdate={delta => setHorizontalRelativeThumbStart(delta)}
                  OnRelativeThumbStartApply={delta => {
                    setHorizontalThumbStart(Limit(0, 0.8, horizontalThumbStart + delta));
                    setHorizontalRelativeThumbStart(0);
                  }}
                />
                <Scroll
                  IsVisible={true}
                  ScrollDirection="vertical"
                  MinValue={0}
                  MaxValue={1}
                  ThumbStart={Limit(0, 0.8, verticalThumbStart + verticalRelativeThumbStart)}
                  ThumbLength={0.2}
                  OnRelativeThumbStartUpdate={delta => setVerticalRelativeThumbStart(delta)}
                  OnRelativeThumbStartApply={delta => {
                    setVerticalThumbStart(Limit(0, 0.8, verticalThumbStart + delta));
                    setVerticalRelativeThumbStart(0);
                  }}
                />
              </CameraContext>
            </div>
          </Pannable>
        </WindowContext>
      </div>
    </main>
  );
}

export default App;
