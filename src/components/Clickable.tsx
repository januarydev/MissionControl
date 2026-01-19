import { PropsWithChildren } from "react";
import { ClickableHoverEnterEvent, ClickableHoverLeaveEvent } from "../types/Window";

export function Clickable(props: PropsWithChildren) {
  return (
    <div
      onMouseEnter={() => window.dispatchEvent(ClickableHoverEnterEvent)}
      onMouseLeave={() => window.dispatchEvent(ClickableHoverLeaveEvent)}
      style={{display: 'contents'}}
    >
      {props.children}
    </div>
  );
}
