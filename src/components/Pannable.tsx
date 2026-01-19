import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { PanStartEvent, WindowContext } from "../types/Window";

interface PannableProps {
  onUpdateRelativeCameraPosition: (dx: number, dy: number) => void;
  onApplyRelativeCameraPosition: (dx: number, dy: number) => void;
}

export function Pannable(props: PropsWithChildren<PannableProps>) {
  const windowState = useContext(WindowContext);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    let animationFrame: number | null;
    if (windowState.isPanning && windowState.isMiddleMouseDragging) {
      const dX = -(windowState.currentX - windowState.dragMiddleMouseStartX);
      const dY = -(windowState.currentY - windowState.dragMiddleMouseStartY);
      animationFrame = requestAnimationFrame(() => {
        setIsPanning(true);
        props.onUpdateRelativeCameraPosition(dX, dY);
      });
    }
    else if (isPanning) {
      const dX = -(windowState.currentX - windowState.dragMiddleMouseStartX);
      const dY = -(windowState.currentY - windowState.dragMiddleMouseStartY);
      animationFrame = requestAnimationFrame(() => {
        setIsPanning(false);
        props.onApplyRelativeCameraPosition(dX, dY);
      });
    }
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    isPanning,
    windowState.isMiddleMouseDragging,
    windowState.dragMiddleMouseStartX,
    windowState.dragMiddleMouseStartY,
    windowState.currentX,
    windowState.currentY,
    props.onUpdateRelativeCameraPosition,
    props.onApplyRelativeCameraPosition
  ]);

  return (
    <div
      style={{display: "contents"}}
      onMouseDown={ev => {
        if (ev.button === 1) {
          window.dispatchEvent(PanStartEvent);
        }
      }}
    >
      {props.children}
    </div>
  );
}
