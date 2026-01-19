import { memo, PropsWithChildren, useContext, useState } from "react";
import { IconButton } from "./IconButton"
import { Constants } from "../types/Constants";
import { Grabbable } from "./Grabbable";
import { CameraContext } from "../types/CameraContext";
import { SvgIcon } from "./SvgIcon";

interface PanelProps {
  iconId: string;
  title: string;
  onClose: () => void;
}

export const Panel = memo((props: PropsWithChildren<PanelProps>) => {
  const [relativePosition, setRelativePosition] = useState<[number, number]>([0, 0]);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const cameraState = useContext(CameraContext);
  const transformX = position[0] + relativePosition[0] - (cameraState.x + cameraState.relativeX);
  const transformY = position[1] + relativePosition[1] - (cameraState.y + cameraState.relativeY);

  return (
    <div className="Panel" style={{
        transform: `translate(${transformX}px, ${transformY}px)`
      }}
    >
      <div className="PanelTitleBar">
        <Grabbable
          onUpdateRelativePosition={(dx, dy) => setRelativePosition([dx, dy])}
          onApplyRelativePosition={(dx, dy) => {
            setPosition([position[0] + dx, position[1] + dy]);
            setRelativePosition([0, 0]);
          }}
        >
          <div className="PanelTitle">{SvgIcon(props.iconId)}{props.title}</div>
        </Grabbable>
        <IconButton id="close-box" hoverFill={Constants.exitButtonHoverFill} onClick={() => props.onClose()} />
      </div>
      <div className="PanelArea">{props.children}</div>
    </div>
  );
});
