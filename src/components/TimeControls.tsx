import { invoke } from "@tauri-apps/api/core";
import { IconButton } from "./IconButton";

export function TimeControls() {
  return (
    <div className="TimeControls">
      <IconButton id="pause" onClick={() => invoke("pause_time")} />
      <IconButton id="play" onClick={() => invoke("run_time", { timeMultiplier: 1.0 })} />
      <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 2.0 })} />
      <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 4.0 })} />
      <IconButton id="fast-forward" onClick={() => invoke("run_time", { timeMultiplier: 8.0 })} />
    </div>
  );
}
