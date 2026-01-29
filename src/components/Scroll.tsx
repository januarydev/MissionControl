import { useRef } from "react";
import { Grabbable } from "./Grabbable";

interface ScrollProps {
  MinValue: number;
  MaxValue: number;
  ThumbStart: number;
  ThumbLength: number;
  IsVisible: boolean;
  OnRelativeThumbStartUpdate: (delta: number) => void;
  OnRelativeThumbStartApply: (delta: number) => void;
  ScrollDirection: "vertical" | "horizontal";
}

export function Scroll(props: ScrollProps) {
  const isVertical = props.ScrollDirection === "vertical";
  const range = props.MaxValue - props.MinValue;
  const thumbLengthPercent = props.ThumbLength / range * 100;
  const thumbStartPercent = (props.ThumbStart - props.MinValue) / range * 100;
  const trackRef = useRef<HTMLDivElement>(null);

  const getDelta = (dx: number, dy: number) => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }
    const deltaPx = isVertical ? dy : dx;
    const lengthPx = isVertical ? track.clientHeight : track.clientWidth;
    const delta = deltaPx / lengthPx;
    return delta;
  };

  return (
    <div
      className={isVertical ? "ScrollVertical" : "ScrollHorizontal"}
      style={{opacity: props.IsVisible ? 1 : 0}}
    >
      <div
        className={isVertical ? "ScrollVerticalTrack" : "ScrollHorizontalTrack"}
        ref={trackRef}
      >
        <Grabbable
          onUpdateRelativePosition={(dx, dy) => {
            const delta = getDelta(dx, dy);
            if (delta) {
              props.OnRelativeThumbStartUpdate(delta);
            }
          }}
          onApplyRelativePosition={(dx, dy) => {
            const delta = getDelta(dx, dy);
            if (delta) {
              props.OnRelativeThumbStartApply(delta);
            }
          }}
        >
          <div
            className={isVertical ? "ScrollVerticalThumb" : "ScrollHorizontalThumb"}
            style={isVertical ? 
              {
                height: `${thumbLengthPercent}%`,
                top: `${thumbStartPercent}%`
              } :
              {
                width: `${thumbLengthPercent}%`,
                left: `${thumbStartPercent}%`
              }
            }
          >
          </div>
        </Grabbable>
      </div>
    </div>
  );
};
