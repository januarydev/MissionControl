import { createContext } from "react";

export interface WindowState {
  isMouseDown: boolean;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
  currentX: number;
  currentY: number;
  isClickableHovered: boolean;
  isGrabbableHovered: boolean;
  isResizableHovered: boolean;
  isGrabbing: boolean;
  isResizing: boolean;
};

export function CreateWindowState() {
  const rv: WindowState = {
    isMouseDown: false,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    currentX: 0,
    currentY: 0,
    isClickableHovered: false,
    isGrabbableHovered: false,
    isResizableHovered: false,
    isGrabbing: false,
    isResizing: false
  };
  return rv;
}

export const WindowContext = createContext<WindowState>(CreateWindowState());

export const ClickableHoverEnterEvent = new Event("clickablehoverenter");
export const ClickableHoverLeaveEvent = new Event("clickablehoverleave");
export const GrabbableHoverEnterEvent = new Event("grabbablehoverenter");
export const GrabbableHoverLeaveEvent = new Event("grabbablehoverleave");
export const GrabStartEvent = new Event("grabstart");
export const GrabEndEvent = new Event("grabend");
export const ResizableHoverEnterEvent = new Event("resizablehoverenter");
export const ResizableHoverLeaveEvent = new Event("resizablehoverleave");
export const ResizeStartEvent = new Event("resizestart");
export const ResizeEndEvent = new Event("resizeend");
