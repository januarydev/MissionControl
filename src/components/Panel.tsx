import { PropsWithChildren } from "react";

interface PanelProps {
  title: string;
  onClose: () => void;
}

export function Panel(props: PropsWithChildren<PanelProps>) {
  return(
    <div className="PanelContainer">
      <div className="Panel">
        <div className="PanelTitleBar">
          <div className="PanelTitle">{props.title}</div>
          <button className="PanelCloseButton" onClick={() => props.onClose()}>X</button>
        </div>
        <div className="PanelArea">{props.children}</div>
      </div>
    </div>
  );
}
