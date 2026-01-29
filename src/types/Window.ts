import { createContext, useCallback, useEffect, useState } from "react";

export interface WindowState {
  isLeftMouseDown: boolean;
  isMiddleMouseDown: boolean;
  isLeftMouseDragging: boolean;
  isMiddleMouseDragging: boolean;
  dragLeftMouseStartX: number;
  dragLeftMouseStartY: number;
  dragMiddleMouseStartX: number;
  dragMiddleMouseStartY: number;
  currentX: number;
  currentY: number;
  isClickableHovered: boolean;
  isGrabbableHovered: boolean;
  isResizableHovered: boolean;
  isGrabbing: boolean;
  isResizing: boolean;
  grabId: string | null;
  resizeId: string | null;
  isPanning: boolean;
};

export function CreateWindowState() {
  const rv: WindowState = {
    isLeftMouseDown: false,
    isMiddleMouseDown: false,
    isLeftMouseDragging: false,
    isMiddleMouseDragging: false,
    dragLeftMouseStartX: 0,
    dragLeftMouseStartY: 0,
    dragMiddleMouseStartX: 0,
    dragMiddleMouseStartY: 0,
    currentX: 0,
    currentY: 0,
    isClickableHovered: false,
    isGrabbableHovered: false,
    isResizableHovered: false,
    isGrabbing: false,
    isResizing: false,
    grabId: null,
    resizeId: null,
    isPanning: false
  };
  return rv;
}

export class GrabStartEvent extends Event {
  _id: string;

  constructor(id: string) {
    super("grabstart");
    this._id = id;
  }

  get id() {
    return this._id;
  }
};

export const WindowContext = createContext<WindowState>(CreateWindowState());

export const ClickableHoverEnterEvent = new Event("clickablehoverenter");
export const ClickableHoverLeaveEvent = new Event("clickablehoverleave");
export const GrabbableHoverEnterEvent = new Event("grabbablehoverenter");
export const GrabbableHoverLeaveEvent = new Event("grabbablehoverleave");
export const PanStartEvent = new Event("panstart");

export function useWindow() {
  const [windowState, setWindowState] = useState<WindowState>(CreateWindowState());

  const handleMouseDown = useCallback((ev: MouseEvent) => {
    const button0 = ev.button === 0;
    const button1 = ev.button === 1;
    const isLeftMouseDown = button0 ? true : windowState.isLeftMouseDown;
    const isMiddleMouseDown = button1 ? true : windowState.isMiddleMouseDown;
    if (button0 || button1) {
      ev.preventDefault();
      setWindowState(windowState => ({
        ...windowState,
        isLeftMouseDown: isLeftMouseDown,
        isMiddleMouseDown: isMiddleMouseDown,
        isLeftMouseDragging: button0 ? false : windowState.isLeftMouseDragging,
        isMiddleMouseDragging: button0 ? false : windowState.isMiddleMouseDragging,
        dragLeftMouseStartX: button0 ? ev.x : windowState.dragLeftMouseStartX,
        dragLeftMouseStartY: button0 ? ev.y : windowState.dragLeftMouseStartY,
        dragMiddleMouseStartX: button1 ? ev.x : windowState.dragMiddleMouseStartX,
        dragMiddleMouseStartY: button1 ? ev.y : windowState.dragMiddleMouseStartY,
        currentX: ev.x,
        currentY: ev.y
      }));
    }
  }, [windowState]);

  const handleMouseUp = useCallback((ev: MouseEvent) => {
    const button0 = ev.button === 0;
    const button1 = ev.button === 1;
    const isLeftMouseDown = button0 ? false : windowState.isLeftMouseDown;
    const isMiddleMouseDown = button1 ? false : windowState.isMiddleMouseDown;
    if (button0 || button1) {
      setWindowState(windowState => ({
        ...windowState,
        isLeftMouseDown: isLeftMouseDown,
        isMiddleMouseDown: isMiddleMouseDown,
        isLeftMouseDragging: button0 ? false : windowState.isLeftMouseDragging,
        isMiddleMouseDragging: button1 ? false : windowState.isMiddleMouseDragging,
        currentX: ev.x,
        currentY: ev.y,
        isGrabbing: button0 ? false : windowState.isGrabbing,
        grabId: null,
        isPanning: button1 ? false : windowState.isPanning
      }));
    }
  }, [windowState]);

  const dragThreshold = 10;

  const handleMouseMove = useCallback((ev: MouseEvent) => {
    const isLeftMouseDragging = windowState.isLeftMouseDragging || (
      windowState.isLeftMouseDown &&
      (
        Math.abs(ev.x - windowState.dragLeftMouseStartX) > dragThreshold ||
        Math.abs(ev.y - windowState.dragLeftMouseStartY) > dragThreshold
      )
    );
    const isMiddleMouseDragging = windowState.isMiddleMouseDragging || (
      windowState.isMiddleMouseDown &&
      (
        Math.abs(ev.x - windowState.dragMiddleMouseStartX) > dragThreshold ||
        Math.abs(ev.y - windowState.dragMiddleMouseStartY) > dragThreshold
      )
    );
    setWindowState(windowState => ({
      ...windowState,
      isLeftMouseDragging: isLeftMouseDragging,
      isMiddleMouseDragging: isMiddleMouseDragging,
      currentX: ev.x,
      currentY: ev.y
    }));
  }, [windowState]);

  const handleClickableHoverEnter = useCallback(() => {
    setWindowState(windowState => ({
      ...windowState,
      isClickableHovered: true
    }));
  }, [windowState]);

  const handleClickableHoverLeave = useCallback(() => {
    setWindowState(windowState => ({
      ...windowState,
      isClickableHovered: false
    }));
  }, [windowState]);

  const handleGrabbableHoverEnter = useCallback(() => {
    setWindowState(windowState => ({
      ...windowState,
      isGrabbableHovered: true
    }));
  }, [windowState]);

  const handleGrabbableHoverLeave = useCallback(() => {
    setWindowState(windowState => ({
      ...windowState,
      isGrabbableHovered: false
    }));
  }, [windowState]);

  const handleGrabStart = useCallback((ev: Event) => {
    const id = (ev as GrabStartEvent).id;
    setWindowState(windowState => ({
      ...windowState,
      isGrabbing: true,
      grabId: id
    }));
  }, [windowState]);

  const handlePanStart = useCallback(() => {
    setWindowState(windowState => ({
      ...windowState,
      isPanning: true
    }));
  }, [windowState]);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("clickablehoverenter", handleClickableHoverEnter);
    window.addEventListener("clickablehoverleave", handleClickableHoverLeave);
    window.addEventListener("grabbablehoverenter", handleGrabbableHoverEnter);
    window.addEventListener("grabbablehoverleave", handleGrabbableHoverLeave);
    window.addEventListener("grabstart", handleGrabStart);
    window.addEventListener("panstart", handlePanStart);

    return () => {
      window.removeEventListener("panstart", handlePanStart);
      window.removeEventListener("grabstart", handleGrabStart);
      window.removeEventListener("grabbablehoverleave", handleGrabbableHoverLeave);
      window.removeEventListener("grabbablehoverenter", handleGrabbableHoverEnter);
      window.removeEventListener("clickablehoverleave", handleClickableHoverLeave);
      window.removeEventListener("clickablehoverenter", handleClickableHoverEnter);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleClickableHoverEnter,
    handleClickableHoverLeave,
    handleGrabbableHoverEnter,
    handleGrabbableHoverLeave,
    handleGrabStart,
    handlePanStart
  ]);

  return windowState;
};

export function GetCursorStyleFromWindow(windowState: WindowState) {
  if (windowState.isGrabbing) {
    return "grabbing";
  }
  if (windowState.isResizing) {
    return "se-resize";
  }
  if (windowState.isPanning) {
    return "move";
  }
  if (windowState.isClickableHovered) {
    return "pointer";
  }
  if (windowState.isGrabbableHovered) {
    return "grab";
  }
  if (windowState.isResizableHovered) {
    return "se-resize";
  }
  return "default";
};
