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
import { Constants } from "./types/Constants";
import { CreateWindowState, WindowContext, WindowState } from "./types/WindowContext";
import { Clickable } from "./components/Clickable";

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

function generateTestData() {
  const data: [number, number, number][] = [];
  for (let pt = 0; pt < 1000; ++pt) {
    data.push([(pt / 1000.0) * 720 - 180, 15 * Math.cos((pt / 1000.0) * Math.PI * 2), (pt / 1000.0) * 2000000]);
  }
  return data;
}

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState | undefined>(undefined);
  const [windowState, setWindowState] = useState<WindowState>(CreateWindowState());

  const handleMouseDown = useCallback((ev: MouseEvent) => {
    if (ev.button === 0) {
      ev.preventDefault();
      setWindowState(windowState => ({
        isMouseDown: true,
        isDragging: false,
        dragStartX: ev.x,
        dragStartY: ev.y,
        currentX: ev.x,
        currentY: ev.y,
        isClickableHovered: windowState.isClickableHovered,
        isGrabbableHovered: windowState.isGrabbableHovered,
        isResizableHovered: windowState.isResizableHovered,
        isGrabbing: windowState.isGrabbing,
        isResizing: windowState.isResizing
      }));
    }
  }, [windowState]);

  const handleMouseUp = useCallback((ev: MouseEvent) => {
    if (ev.button === 0) {
      setWindowState(windowState => ({
        isMouseDown: false,
        isDragging: false,
        dragStartX: windowState.dragStartX,
        dragStartY: windowState.dragStartY,
        currentX: ev.x,
        currentY: ev.y,
        isClickableHovered: windowState.isClickableHovered,
        isGrabbableHovered: windowState.isGrabbableHovered,
        isResizableHovered: windowState.isResizableHovered,
        isGrabbing: windowState.isGrabbing,
        isResizing: windowState.isResizing
      }));
    }
  }, [windowState]);

  const dragThreshold = 10;

  const handleMouseMove = useCallback((ev: MouseEvent) => {
    const isDragging = windowState.isDragging || (
      windowState.isMouseDown &&
      (
        Math.abs(ev.x - windowState.dragStartX) > dragThreshold ||
        Math.abs(ev.y - windowState.dragStartY) > dragThreshold
      )
    );
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: ev.x,
      currentY: ev.y,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: windowState.isGrabbing,
      isResizing: windowState.isResizing
    }));
  }, [windowState]);

  const handleClickableHoverEnter = useCallback(() => {
    console.log('enter')
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: true,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: windowState.isGrabbing,
      isResizing: windowState.isResizing
    }));
    console.log(windowState)
  }, [windowState]);

  const handleClickableHoverLeave = useCallback(() => {
    console.log('leave')
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: false,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: windowState.isGrabbing,
      isResizing: windowState.isResizing
    }));
    console.log(windowState)
  }, [windowState]);

  const handleGrabbableHoverEnter = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: true,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: windowState.isGrabbing,
      isResizing: windowState.isResizing
    }));
  }, [windowState]);

  const handleGrabbableHoverLeave = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: false,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: windowState.isGrabbing,
      isResizing: windowState.isResizing
    }));
  }, [windowState]);

  const handleGrabStart = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: true,
      isResizing: windowState.isResizing
    }));
  }, [windowState]);

  const handleGrabEnd = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: false,
      isResizing: windowState.isResizing
    }));
  }, [windowState]);

  const handleResizableHoverEnter = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: true,
      isGrabbing: windowState.isGrabbing,
      isResizing: windowState.isResizing
    }));
  }, [windowState]);

  const handleResizableHoverLeave = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: false,
      isGrabbing: windowState.isGrabbing,
      isResizing: windowState.isResizing
    }));
  }, [windowState]);

  const handleResizeStart = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: windowState.isGrabbing,
      isResizing: true
    }));
  }, [windowState]);

  const handleResizeEnd = useCallback(() => {
    setWindowState(windowState => ({
      isMouseDown: windowState.isMouseDown,
      isDragging: windowState.isDragging,
      dragStartX: windowState.dragStartX,
      dragStartY: windowState.dragStartY,
      isClickableHovered: windowState.isClickableHovered,
      currentX: windowState.currentX,
      currentY: windowState.currentY,
      isGrabbableHovered: windowState.isGrabbableHovered,
      isResizableHovered: windowState.isResizableHovered,
      isGrabbing: windowState.isGrabbing,
      isResizing: false
    }));
  }, [windowState]);

  const handleSimulationUpdate = useCallback((ev: TauriEvent<SimulationState>) => {
    setSimulationState(ev.payload);
  }, []);

  useEffect(() => {
    const unlistenPromise = listen<SimulationState>("update", handleSimulationUpdate);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("clickablehoverenter", handleClickableHoverEnter);
    window.addEventListener("clickablehoverleave", handleClickableHoverLeave);
    window.addEventListener("grabbablehoverenter", handleGrabbableHoverEnter);
    window.addEventListener("grabbablehoverleave", handleGrabbableHoverLeave);
    window.addEventListener("grabstart", handleGrabStart);
    window.addEventListener("grabend", handleGrabEnd);
    window.addEventListener("resizablehoverenter", handleResizableHoverEnter);
    window.addEventListener("resizablehoverleave", handleResizableHoverLeave);
    window.addEventListener("resizestart", handleResizeStart);
    window.addEventListener("resizeend", handleResizeEnd);

    return () => {
      window.removeEventListener("resizeend", handleResizeEnd);
      window.removeEventListener("resizestart", handleResizeStart);
      window.removeEventListener("resizablehoverleave", handleResizableHoverLeave);
      window.removeEventListener("resizablehoverenter", handleResizableHoverEnter);
      window.removeEventListener("grabend", handleGrabEnd);
      window.removeEventListener("grabstart", handleGrabStart);
      window.removeEventListener("grabbablehoverleave", handleGrabbableHoverLeave);
      window.removeEventListener("grabbablehoverenter", handleGrabbableHoverEnter);
      window.removeEventListener("clickablehoverleave", handleClickableHoverLeave);
      window.removeEventListener("clickablehoverenter", handleClickableHoverEnter);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
      unlistenPromise.then(unlisten => unlisten());
    };
  }, [
    handleSimulationUpdate,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleClickableHoverEnter,
    handleClickableHoverLeave,
    handleGrabbableHoverEnter,
    handleGrabbableHoverLeave,
    handleGrabStart,
    handleGrabEnd,
    handleResizableHoverEnter,
    handleResizableHoverLeave,
    handleResizeStart,
    handleResizeEnd
  ]);

  const [panelArray, setPanelArray] = useState<PanelData[]>([]);
  const addToPanelArray = (panelType: PanelType) => setPanelArray(panelArray.concat({
    id: lastPanelId++,
    panelType: panelType
  }));
  const removeFromPanelArray = (id: number) => setPanelArray(panelArray.filter(panel => panel.id !== id))
  const testData = generateTestData();

  const getCursor = (windowState: WindowState) => {
    if (windowState.isGrabbing) {
      return "grabbing";
    }
    if (windowState.isResizing) {
      return "se-resize";
    }
    if (windowState.isClickableHovered) {
      return "pointer";
    }
    if (windowState.isGrabbableHovered) {
      return "grab";
    }
    if (windowState.isResizableHovered) {
      return "se-resize";
    }
    return "default";
  };

  return (
    <main className="container" style={{cursor: getCursor(windowState)}}>
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
          <div>
            {getCursor(windowState)}
            {JSON.stringify(windowState)}
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
          </div>
        </WindowContext>
      </div>
    </main>
  );
}

export default App;
