import { PanelType } from "../types/Panel";
import { Clickable } from "./Clickable";
import { SvgIcon } from "./SvgIcon";

interface ToolButtonProps {
  text: string;
  onClick: () => void;
  svgIconId: string;
}

function ToolButton(props: ToolButtonProps) {
  return (
    <Clickable>
      <button className="ToolButton" onClick={props.onClick}>
        {props.text} {SvgIcon(props.svgIconId)}
      </button>
    </Clickable>
  );
}

interface ToolBarProps {
  onPanelRequested: (panelType: PanelType) => void;
}

interface ToolButton {
  text: string;
  svgIconId: string;
  panelType: PanelType;
}

const buttons: ToolButton[] = [
  {
    text: "Commanding",
    svgIconId: "satellite-uplink",
    panelType: PanelType.CommandingPanel
  },
  {
    text: "Telemetry",
    svgIconId: "table",
    panelType: PanelType.TelemetryPanel
  },
  {
    text: "Graphing",
    svgIconId: "chart-line",
    panelType: PanelType.GraphingPanel
  },
  {
    text: "Scripting",
    svgIconId: "console",
    panelType: PanelType.ScriptingPanel
  },
  {
    text: "Mapping",
    svgIconId: "map",
    panelType: PanelType.MappingPanel
  },
  {
    text: "OrbitVis",
    svgIconId: "earth",
    panelType: PanelType.OrbitVisPanel
  },
  {
    text: "AttitudeVis",
    svgIconId: "target",
    panelType: PanelType.AttitudeVisPanel
  }
];

export function ToolBar(props: ToolBarProps) {
  return (
    <div className="ToolBar">
      <div className="ToolBarTitle">MissionControl</div>
      <div className="ToolBarButtons">
        {buttons.map((button, index) =>
          <ToolButton
            key={index}
            text={button.text}
            svgIconId={button.svgIconId}
            onClick={() => props.onPanelRequested(button.panelType)}
          />
        )}
      </div>
    </div>
  );
}
