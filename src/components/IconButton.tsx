import { useState } from "react";
import { Constants } from "../types/Constants";
import SvgPaths from "../assets/svg-paths.json";
import { Clickable } from "./Clickable";

interface IconButtonProps {
  id: string;
  className?: string;
  onClick: () => void;
  hoverFill?: string;
  fill?: string;
}

export function IconButton(props: IconButtonProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const hoverFill = props.hoverFill ? props.hoverFill : Constants.iconButtonHoverFill;
  const fill = props.fill ? props.fill : Constants.iconButtonFill;

  return (
    <Clickable>
      <div
        className="IconButtonContainer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => props.onClick()}
      >
        <svg
          className="IconButton"
          id={props.id}
          viewBox="0 0 24 24"
        >
          <path
            d={SvgPaths.paths.find(obj => obj.id === props.id)?.path}
            fill={isHovered ? hoverFill : fill}
          />
        </svg>
      </div>
    </Clickable>
  );
}
