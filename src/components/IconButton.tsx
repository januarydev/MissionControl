import { useState } from "react";
import SvgPaths from "../assets/svg-paths.json";
import { Clickable } from "./Clickable";

interface IconButtonProps {
  id: string;
  fill: string;
  hoverFill: string;
  onClick: () => void;
}

export function IconButton(props: IconButtonProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <Clickable>
      <div
        className="IconButtonContainer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => props.onClick()}
      ><svg
          className="IconButton"
          xmlns="http://www.w3.org/2000/svg"
          id={props.id}
          viewBox="0 0 24 24"
        ><path d={SvgPaths.paths.find(obj => obj.id === props.id)?.path} fill={isHovered ? props.hoverFill : props.fill} /></svg>
      </div>
    </Clickable>
  );
}
