<script lang="ts">

  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/core"
  import { listen } from "@tauri-apps/api/event";

  import type { SimulationState, OrbitState } from "./SimulationState.ts"
  import LinePlot from "./LinePlot.svelte";

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

  <h1>MissionControl</h1>
  <!-- <LinePlot data = {elapsedTimeMsArr}/> -->
  <p>
    Current elapsed time: {elapsedTimeMsArr.at(-1)} ms<br>
    Current simulated time: {simulatedTimeDays} days, {simulatedTimeSeconds.toFixed(2)} seconds
  </p>
  <h2>Orbits:</h2>
{#each orbits as orbit}
  <p>
    {orbit.name}:<br>
    Position: [{orbit.positionEciKm.x.toFixed(2)}, {orbit.positionEciKm.y.toFixed(2)}, {orbit.positionEciKm.z.toFixed(2)}] km<br>
    Velocity: [{orbit.velocityEciKmS.x.toFixed(3)}, {orbit.velocityEciKmS.y.toFixed(3)}, {orbit.velocityEciKmS.z.toFixed(3)}] km/s
  </p>
{/each}

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
