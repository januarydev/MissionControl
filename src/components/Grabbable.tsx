import { PropsWithChildren, useContext, useEffect, useId, useState } from "react";
import { GrabbableHoverEnterEvent, GrabbableHoverLeaveEvent, GrabStartEvent, WindowContext } from "../types/Window";

interface GrabbableProps {
  onUpdateRelativePosition: (dx: number, dy: number) => void;
  onApplyRelativePosition: (dx: number, dy: number) => void;
}

export function Grabbable(props: PropsWithChildren<GrabbableProps>) {
  const windowState = useContext(WindowContext);
  const id = useId();
  const [isGrabbing, setIsGrabbing] = useState(false);

  useEffect(() => {
    let animationFrame: number | null;
    if (windowState.grabId === id && windowState.isLeftMouseDragging) {
      const dX = windowState.currentX - windowState.dragLeftMouseStartX;
      const dY = windowState.currentY - windowState.dragLeftMouseStartY;
      animationFrame = requestAnimationFrame(() => {
        setIsGrabbing(true);
        props.onUpdateRelativePosition(dX, dY);
      });
    }
    else if (isGrabbing) {
      const dX = windowState.currentX - windowState.dragLeftMouseStartX;
      const dY = windowState.currentY - windowState.dragLeftMouseStartY;
      animationFrame = requestAnimationFrame(() => {
        setIsGrabbing(false);
        props.onApplyRelativePosition(dX, dY);
      });
    }
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [
    isGrabbing,
    windowState.grabId,
    windowState.isLeftMouseDragging,
    windowState.dragLeftMouseStartX,
    windowState.dragLeftMouseStartY,
    windowState.currentX,
    windowState.currentY,
    props.onUpdateRelativePosition,
    props.onApplyRelativePosition
  ]);

  return (
    <div
      style={{display: "contents"}}
      onMouseEnter={() => window.dispatchEvent(GrabbableHoverEnterEvent)}
      onMouseLeave={() => window.dispatchEvent(GrabbableHoverLeaveEvent)}
      onMouseDown={ev => {
        if (ev.button === 0) {
          window.dispatchEvent(new GrabStartEvent(id))
        }
      }}
    >
      {props.children}
    </div>
  );
}
