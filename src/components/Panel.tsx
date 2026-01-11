import { PropsWithChildren } from "react";
import { IconButton } from "./IconButton"
import { DrawIcon } from "./DrawIcon";

interface PanelProps {
  iconId: string;
  title: string;
  onClose: () => void;
}

export function Panel(props: PropsWithChildren<PanelProps>) {
  return (
    <div className="PanelContainer">
      <div className="Panel">
        <div className="PanelTitleBar">
          <div className="PanelTitle">{DrawIcon(props.iconId)}{props.title}</div>
          <IconButton id="close-box" onClick={() => props.onClose()} />
        </div>
        <div className="PanelArea">{props.children}</div>
      </div>
    </div>
  );
}
