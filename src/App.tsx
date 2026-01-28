import { JSX, useRef, useState } from "react";
import "./App.css";
import { Panel } from "./components/Panel";
import { Commanding } from "./components/Commanding";
import { Telemetry } from "./components/Telemetry";
import { rowsFromPreset, TelemetryPresets, TelemetryState } from "./types/TelemetryTypes.ts";
import { Graphing } from "./components/Graphing";
import { Mapping } from "./components/Mapping";
import { OrbitVis } from "./components/OrbitVis";
import { AttitudeVis } from "./components/AttitudeVis";
import { SimulationContext, useSimulation } from "./types/Simulation.ts";
import { GetCursorStyleFromWindow, useWindow, WindowContext } from "./types/Window";
import { CameraContext, CameraState, CreateCameraState } from "./types/CameraContext";
import { Pannable } from "./components/Pannable";
import { Nole } from "./components/Nole";
import { ToolBar } from "./components/ToolBar.tsx";
import { PanelType } from "./types/Panel.ts";
import { TimeControls } from "./components/TimeControls.tsx";

type BodyData = TelemetryState;

interface PanelData {
  panelType: PanelType;
  bodyData?: BodyData;
  zindex: number;
  position: [number, number];
  positionRelative: [number, number];
}

interface PanelInfo {
  panelType: PanelType;
  iconId: string;
  title: string;
  onRender: (index: number, body?: BodyData) => JSX.Element;
  allowsClosing: boolean;
}

function App() {
  const [cameraState, setCameraState] = useState<CameraState>(CreateCameraState());
  const [horizontalThumbStart, setHorizontalThumbStart] = useState<number>(0);
  const [horizontalRelativeThumbStart, setHorizontalRelativeThumbStart] = useState<number>(0);
  const [verticalThumbStart, setVerticalThumbStart] = useState<number>(0);
  const [verticalRelativeThumbStart, setVerticalRelativeThumbStart] = useState<number>(0);
  const displayAreaRef = useRef<HTMLDivElement>(null);

  const [panelArray, setPanelArray] = useState<PanelData[]>([{
    panelType: PanelType.NolePanel,
    zindex: 0,
    position: [0, 0],
    positionRelative: [0, 0]
  }]);

  const getMaxZIndex = (panelArray: PanelData[]) => {
    return panelArray.map(p => p.zindex).reduce((prev, curr) => Math.max(prev, curr), 0);
  };

  const addToPanelArray = (panelType: PanelType, bodyData?: TelemetryState) => {
    const displayArea = displayAreaRef.current;
    if (displayArea) {
      const children = displayArea.children;
      for (var i = 0; i < children.length; i++) {
        const child = children[i];
        console.log(child.getBoundingClientRect())
      }
    }
    setPanelArray(arr => {
      const newArray = structuredClone(arr);
      newArray.push({
        panelType: panelType,
        bodyData: bodyData,
        zindex: 1 + getMaxZIndex(newArray),
        position: [0, 0],
        positionRelative: [0, 0]
      });
      return newArray;
    });
  };
  const removeFromPanelArray = (index: number) => {
    setPanelArray(arr => structuredClone(arr.filter((_, i) => i !== index)));
  };

  const windowState = useWindow();
  const { mapCoordinates, simulationState } = useSimulation(windowState);

  const panelInfo: PanelInfo[] = [
    {
      panelType: PanelType.CommandingPanel,
      title: "Commanding",
      iconId: "satellite-uplink",
      onRender: () => <Commanding />,
      allowsClosing: true
    },
    {
      panelType: PanelType.TelemetryPanel,
      title: "Telemetry",
      iconId: "table",
      onRender: (index, bodyData) => <Telemetry
        telemetryState={bodyData!}
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
        }} />,
      allowsClosing: true
    },
    {
      panelType: PanelType.GraphingPanel,
      title: "Graphing",
      iconId: "chart-line",
      onRender: () => <Graphing />,
      allowsClosing: true
    },
    {
      panelType: PanelType.MappingPanel,
      title: "Mapping",
      iconId: "map",
      onRender: () => <Mapping data={mapCoordinates} />,
      allowsClosing: true
    },
    {
      panelType: PanelType.OrbitVisPanel,
      title: "OrbitVis",
      iconId: "earth",
      onRender: () => <OrbitVis data={mapCoordinates} />,
      allowsClosing: true
    },
    {
      panelType: PanelType.AttitudeVisPanel,
      title: "AttitudeVis",
      iconId: "target",
      onRender: () => <AttitudeVis />,
      allowsClosing: true
    },
    {
      panelType: PanelType.NolePanel,
      title: "Nole.exe",
      iconId: "skull-scan",
      onRender: () => <Nole text="I have you now!!" />,
      allowsClosing: false
    }
  ];

  const panelInfoByType = new Map<PanelType, PanelInfo>(panelInfo.map(panel => [panel.panelType, panel]));

  return (
    <main className="container" style={{cursor: GetCursorStyleFromWindow(windowState)}}>
      <ToolBar onPanelRequested={(panelType) => {
        switch (panelType) {
          case PanelType.TelemetryPanel:
            addToPanelArray(panelType, { preset: TelemetryPresets.Custom, rowTypes: [] });
            break;
          case PanelType.CommandingPanel:
          case PanelType.GraphingPanel:
          case PanelType.MappingPanel:
          case PanelType.OrbitVisPanel:
          case PanelType.AttitudeVisPanel:
          default:
            addToPanelArray(panelType);
            break;
        }
      }}/>
      <SimulationContext value={simulationState}>
        <div className="WorkArea">
          <div className="WorkAreaMenuBar">
            <div className="RunState">
              {simulationState?.paused ? "Status: Paused" : `Status: Running (${simulationState?.timeMultiplier}x)`}
            </div>
            <TimeControls/>
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
                    const setToTop = (panel: PanelData, panelArray: PanelData[]) => {
                      const maxIndex = getMaxZIndex(panelArray);
                      if (panel.zindex < maxIndex) {
                        panel.zindex = maxIndex + 1;
                      }
                    };
                    const panelInfo = panelInfoByType.get(panelData.panelType)!;
                    return (
                      <Panel
                        key={index}
                        iconId={panelInfo.iconId}
                        title={panelInfo.title}
                        onClose={() => {
                          if (panelInfo.allowsClosing) {
                            removeFromPanelArray(index)}
                          }
                        }
                        zindex={panelData.zindex}
                        onGrabMove={(dx, dy) => {
                          setPanelArray(arr => {
                            const newArray = structuredClone(arr);
                            const panel = newArray[index];
                            panel.positionRelative = [dx, dy];
                            setToTop(panel, newArray);
                            return newArray;
                          });
                        }}
                        onGrabApply={(dx, dy) => {
                          setPanelArray(arr => {
                            const newArray = structuredClone(arr);
                            const panel = newArray[index];
                            panel.position = [panel.position[0] + dx, panel.position[1] + dy];
                            panel.positionRelative = [0, 0];
                            return newArray;
                          });
                        }}
                        position={panelData.position}
                        positionRelative={panelData.positionRelative}
                        onInteract={() => {
                          setPanelArray(arr => {
                            const newArray = structuredClone(arr);
                            const panel = newArray[index];
                            if (panel) {
                              setToTop(panel, newArray);
                            }
                            return newArray;
                          });
                        }}
                      >
                        {panelInfo.onRender(index, panelData.bodyData)}
                      </Panel>
                    );
                  })}
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
