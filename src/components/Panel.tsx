import { memo, PropsWithChildren, useContext } from "react";
import { IconButton } from "./IconButton"
import { Constants } from "../types/Constants";
import { Grabbable } from "./Grabbable";
import { CameraContext } from "../types/CameraContext";
import { SvgIcon } from "./SvgIcon";

interface PanelProps {
  iconId: string;
  title: string;
  onClose: () => void;
  zindex: number;
  position: [number, number];
  positionRelative: [number, number];
  onGrabMove: (dx: number, dy: number) => void;
  onGrabApply: (dx: number, dy: number) => void;
  onInteract: () => void;
}

export const Panel = memo((props: PropsWithChildren<PanelProps>) => {
  const cameraState = useContext(CameraContext);
  const transformX = props.position[0] + props.positionRelative[0] - (cameraState.x + cameraState.relativeX);
  const transformY = props.position[1] + props.positionRelative[1] - (cameraState.y + cameraState.relativeY);

  return (
    <div className="Panel" style={{
        transform: `translate(${transformX}px, ${transformY}px)`,
        zIndex: props.zindex
      }}
      onClick={props.onInteract}
    >
      <div className="PanelTitleBar">
        <Grabbable
          onGrabStart={() => props.onInteract()}
          onUpdateRelativePosition={(dx, dy) => props.onGrabMove(dx, dy)}
          onApplyRelativePosition={(dx, dy) => props.onGrabApply(dx, dy)}
        >
          <div className="PanelTitle">{SvgIcon(props.iconId)}{props.title}</div>
        </Grabbable>
        <IconButton id="close-box" hoverFill={Constants.exitButtonHoverFill} onClick={() => props.onClose()} />
      </div>
      <div className="PanelArea">{props.children}</div>
    </div>
  );
});
