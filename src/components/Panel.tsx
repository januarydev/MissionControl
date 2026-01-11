import { PropsWithChildren } from "react";
import { IconButton } from "./IconButton"
import { Constants } from "../types/Constants";

interface PanelProps {
  title: string;
  onClose: () => void;
}

export function Panel(props: PropsWithChildren<PanelProps>) {
  return (
    <div className="PanelContainer">
      <div className="Panel">
        <div className="PanelTitleBar">
          <div className="PanelTitle">{props.title}</div>
          <IconButton id="close-box" fill={Constants.iconButtonFill} hoverFill={Constants.exitButtonHoverFill} onClick={() => props.onClose()} />
        </div>
        <div className="PanelArea">{props.children}</div>
      </div>
    </div>
  );
}
