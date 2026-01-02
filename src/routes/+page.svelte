<script lang="ts">

  import { onMount, onDestroy } from "svelte";
  import { invoke } from "@tauri-apps/api/core"
  import { listen } from "@tauri-apps/api/event";

  import LinePlot from "./LinePlot.svelte";

  type SimulationState = {
    elapsedTimeMs: number
  };

  let elapsedTimeMsArr: number[] = $state([]);

  listen<SimulationState>('update', (event) => {
    elapsedTimeMsArr.push(event.payload.elapsedTimeMs);
    if (elapsedTimeMsArr.length > 100) { elapsedTimeMsArr.shift(); }
  });

  onMount(() => { invoke("start_simulation"); });
  onDestroy(() => { invoke("stop_simulation"); })

</script>

<main class="container">

  <h1>MissionControl</h1>
  <LinePlot data = {elapsedTimeMsArr}/>
  <p>Current elapsed time: {elapsedTimeMsArr.at(-1)} ms</p>

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
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }
}

</style>
