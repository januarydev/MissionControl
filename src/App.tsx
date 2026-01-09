// import { useEffect, useState } from "react";
import "./App.css";

function App() {

  return (
    <main className="container">
      <div className="ToolBar">
        <div className="Title">MissionControl</div>
        <div className="TitleSeparator"></div>
        <div className="ButtonPanel">
          <button className="ToolButton">Commanding</button>
          <button className="ToolButton">Telemetry</button>
          <button className="ToolButton">Graphing</button>
          <button className="ToolButton">Mapping</button>
          <button className="ToolButton">AttitudeVis</button>
        </div>
      </div>
      <div className="WorkArea">
        <div className="WorkAreaMenuBar">
          <div className="TimeControls">
            <button className="TimeControlButton">Pause</button>
            <button className="TimeControlButton">1x</button>
            <button className="TimeControlButton">2x</button>
            <button className="TimeControlButton">4x</button>
            <button className="TimeControlButton">8x</button>
          </div>
        </div>
        <div className="DisplayArea"></div>
      </div>
    </main>
  );
}

export default App;
