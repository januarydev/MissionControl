import React from "react";
import ReactDOM from "react-dom/client";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import App from "./App";

import type { SimulationState } from "./SimulationState.ts"

invoke("start_simulation");

listen<SimulationState>("update", (event) => {
  console.log(event.payload);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
