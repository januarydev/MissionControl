<script lang="ts">

  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/core"
  import { listen } from "@tauri-apps/api/event";

  import type { SimulationState, OrbitState } from "./SimulationState.ts"

  let elapsedTimeMsArr: number[] = $state([]);
  let simulatedTimeDays: number = $state(0.0);
  let simulatedTimeSeconds: number = $state(0.0);
  let orbits: OrbitState[] = $state([]);

  listen<SimulationState>('update', (event) => {
    elapsedTimeMsArr.push(event.payload.elapsedTimeMs);
    if (elapsedTimeMsArr.length > 60) { elapsedTimeMsArr.shift(); }
    simulatedTimeDays = event.payload.simulatedTimeDays;
    simulatedTimeSeconds = event.payload.simulatedTimeSeconds;
    orbits = event.payload.orbits;
  });

  onMount(() => { invoke("start_simulation"); });

</script>

<main class="container">

  <div class="ToolBar">
    <div class="Title">MissionControl</div>
    <div class="TitleSeparator"></div>
    <div class="ButtonPanel">
      <button class="ToolButton">Commanding</button>
      <button class="ToolButton">Telemetry</button>
      <button class="ToolButton">Graphing</button>
      <button class="ToolButton">Mapping</button>
      <button class="ToolButton">AttitudeVis</button>
    </div>
  </div>
  <div class="WorkArea">
    <div class="WorkAreaMenuBar">
      <div class="TimeControls">
        <button class="TimeControlButton">Pause</button>
        <button class="TimeControlButton">1x</button>
        <button class="TimeControlButton">2x</button>
        <button class="TimeControlButton">4x</button>
        <button class="TimeControlButton">8x</button>
      </div>
    </div>
    <div class="DisplayArea"></div>
  </div>

</main>

<style>

  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    color: #0f0f0f;
    background-color: #f6f6f6;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  .container {
    display: flex;
    flex-direction: row;
    min-width: 100vw;
    min-height: 100vh;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color: #f6f6f6;
      background-color: #2f2f2f;
    }
  }

  .ToolBar {
    display: flex;
    flex-direction: column;
    margin: 0.1em;
    border-color: white;
    border-style: solid;
    border-width: 2px;
    border-radius: 5px;
    padding: 0.25em;
  }

  .Title {

  }

  .TitleSeparator {
    background-color: white;
    height: 2px;
    margin: 0.1em 0;
  }

  .ButtonPanel {
    display: flex;
    flex-direction: column;
  }

  .ToolButton {

  }

  .WorkArea {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0.1em;
    border-color: white;
    border-style: solid;
    border-width: 2px;
    border-radius: 5px;
    padding: 0.25em;
  }

  .WorkAreaMenuBar {
    display: flex;
    justify-content: flex-end;
  }

  .TimeControls {
    display: flex;
  }

  .TimeControlButton {

  }

  .DisplayArea {
    display: flex;
    flex-grow: 1;
  }

</style>
