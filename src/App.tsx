import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, Event as TauriEvent } from "@tauri-apps/api/event";
import "./App.css";
import { Panel } from "./components/Panel";
import { Commanding } from "./components/Commanding";
import { Telemetry } from "./components/Telemetry";
import { rowsFromPreset, TelemetryPresets, TelemetryState } from "./types/TelemetryTypes.ts";
import { Graphing } from "./components/Graphing";
import { Mapping } from "./components/Mapping";
import { OrbitVis } from "./components/OrbitVis";
import { AttitudeVis } from "./components/AttitudeVis";
import { createSimulationState, SimulationContext, SimulationState } from "./types/SimulationState";
import { IconButton } from "./components/IconButton";
import { GetCursorStyleFromWindow, useWindow, WindowContext } from "./types/Window";
import { Clickable } from "./components/Clickable";
import { CameraContext, CameraState, CreateCameraState } from "./types/CameraContext";
import { Pannable } from "./components/Pannable";
import { Scroll } from "./components/Scroll";
import { Limit } from "./types/Math";
import { SvgIcon } from "./components/SvgIcon";
import { Nole } from "./components/Nole";

enum PanelType {
  CommandingPanel,
  TelemetryPanel,
  GraphingPanel,
  MappingPanel,
  OrbitVisPanel,
  AttitudeVisPanel
}

type BodyData = undefined | TelemetryState;

interface PanelData {
  id: number;
  panelType: PanelType;
  bodyData: BodyData;
}

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>(createSimulationState());
  const [mapCoordinates, setMapCoordinates] = useState<[number, number, number][]>([]);
  const [cameraState, setCameraState] = useState<CameraState>(CreateCameraState());
  const [lastPanelId, setLastPanelId] = useState<number>(0);
  const [horizontalThumbStart, setHorizontalThumbStart] = useState<number>(0);
  const [horizontalRelativeThumbStart, setHorizontalRelativeThumbStart] = useState<number>(0);
  const [verticalThumbStart, setVerticalThumbStart] = useState<number>(0);
  const [verticalRelativeThumbStart, setVerticalRelativeThumbStart] = useState<number>(0);
  const displayAreaRef = useRef<HTMLDivElement>(null);

  const handleSimulationUpdate = useCallback((event: TauriEvent<SimulationState>) => {
    setSimulationState(event.payload);
    const llaPosition: [number, number, number] = [
      event.payload.spacecraftPositionLla.x - 180,
      event.payload.spacecraftPositionLla.y,
      event.payload.spacecraftPositionLla.z * 1000
    ];
    if (mapCoordinates.length === 0) {
      setMapCoordinates([llaPosition]);
      return;
    }
    if (Math.sqrt(
      Math.pow(mapCoordinates[mapCoordinates.length - 1][0] - llaPosition[0], 2) +
      Math.pow(mapCoordinates[mapCoordinates.length - 1][1] - llaPosition[1], 2)
    ) > 0.5) {
      setMapCoordinates(mapCoordinates.slice(-1499).concat([llaPosition]));
    }
  }, [mapCoordinates]);

  useEffect(() => {
    const unlistenPromise = listen<SimulationState>("update", handleSimulationUpdate);
    return () => {
      unlistenPromise.then(unlisten => unlisten());
    }
  }, [handleSimulationUpdate]);

  const [panelArray, setPanelArray] = useState<PanelData[]>([]);
  const addToPanelArray = (panelType: PanelType, bodyData?: TelemetryState) => {
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
      bodyData: bodyData
    }));
    setLastPanelId(id => id + 1);
  };
  const removeFromPanelArray = (id: number) => setPanelArray(panelArray.filter(panel => panel.id !== id));
  const windowState = useWindow();

  return (
    <main className="container" style={{cursor: GetCursorStyleFromWindow(windowState)}}>
      <div className="ToolBar">
        <div className="ToolBarTitle">MissionControl</div>
        <div className="ToolBarButtons">
          <Clickable>
            <button className="ToolButton" onClick={() => addToPanelArray(PanelType.CommandingPanel)}>
              Commanding {SvgIcon("satellite-uplink")}
            </button>
          </Clickable>
          <Clickable>
            <button
              className="ToolButton"
              onClick={() => addToPanelArray(PanelType.TelemetryPanel, { preset: TelemetryPresets.Custom, rowTypes: [] })}>
              Telemetry {SvgIcon("table")}
            </button>
          </Clickable>
          <Clickable>
            <button className="ToolButton" onClick={() => addToPanelArray(PanelType.GraphingPanel)}>
              Graphing {SvgIcon("chart-line")}
            </button>
          </Clickable>
          <Clickable>
            <button className="ToolButton" onClick={() => addToPanelArray(PanelType.MappingPanel)}>
              Mapping {SvgIcon("map")}
            </button>
          </Clickable>
          <Clickable>
            <button className="ToolButton" onClick={() => addToPanelArray(PanelType.OrbitVisPanel)}>
              OrbitVis {SvgIcon("earth")}
            </button>
          </Clickable>
          <Clickable>
            <button className="ToolButton" onClick={() => addToPanelArray(PanelType.AttitudeVisPanel)}>
              AttitudeVis {SvgIcon("target")}
            </button>
          </Clickable>
        </div>
      </div>
      <SimulationContext value={simulationState}>
        <div className="WorkArea">
          <div className="WorkAreaMenuBar">
            <div className="RunState">
              {simulationState?.paused ? "Status: Paused" : `Status: Running (${simulationState?.timeMultiplier}x)`}
            </div>
            <div className="TimeControls">
              <IconButton id="pause" onClick={() => invoke("pause_time")} />
              <IconButton id="play" onClick={() => invoke("run_time", { timeMultiplier: 1.0 })} />
              <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 2.0 })} />
              <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 4.0 })} />
              <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 8.0 })} />
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
                        return (
                          <Panel key={index} iconId="satellite-uplink" title="Commanding" onClose={() => removeFromPanelArray(panelData.id)}>
                            <Commanding />
                          </Panel>
                        );
                      case PanelType.TelemetryPanel:
                        return (
                          <Panel key={index} iconId="table" title="Telemetry" onClose={() => removeFromPanelArray(panelData.id)}>
                            <Telemetry
                              telemetryState={panelData.bodyData!}
                              addToRowArrayCallback={point => {
                                const panels = structuredClone(panelArray);
                                panels[index].bodyData!.rowTypes.push(point);
                                setPanelArray(panels);
                              }}
                              removeFromRowArrayCallback={id => {
                                const panels = structuredClone(panelArray);
                                panels[index].bodyData!.rowTypes.splice(id, 1);
                                setPanelArray(panels);
                              }}
                              updatePresetCallback={state => {
                                const panels = structuredClone(panelArray);
                                const bodyData = panels[index].bodyData!;
                                bodyData.rowTypes = rowsFromPreset(state)!;
                                bodyData.preset = state;
                                setPanelArray(panels);
                              }} />
                          </Panel>
                        );
                      case PanelType.GraphingPanel:
                        return (
                          <Panel key={index} iconId="chart-line" title="Graphing" onClose={() => removeFromPanelArray(panelData.id)}>
                            <Graphing />
                          </Panel>
                        );
                      case PanelType.MappingPanel:
                        return (
                          <Panel key={index} iconId="map" title="Mapping" onClose={() => removeFromPanelArray(panelData.id)}>
                            <Mapping data={mapCoordinates} />
                          </Panel>
                        );
                      case PanelType.OrbitVisPanel:
                        return (
                          <Panel key={index} iconId="earth" title="OrbitVis" onClose={() => removeFromPanelArray(panelData.id)}>
                            <OrbitVis data={mapCoordinates} />
                          </Panel>
                        );
                      case PanelType.AttitudeVisPanel:
                        return (
                          <Panel key={index} iconId="target" title="AttitudeVis" onClose={() => removeFromPanelArray(panelData.id)}>
                            <AttitudeVis />
                          </Panel>
                        );
                      default:
                        return undefined
                    }
                  })}
                  <Panel iconId="skull-scan" title="Nole.exe" onClose={() => { }}>
                    <Nole text="I have you now!!" />
                  </Panel>
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
      </SimulationContext>
    </main>
  );
}

export default App;
