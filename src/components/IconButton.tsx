import { useState } from "react";
import { Constants } from "../types/Constants";
import SvgPaths from "../assets/svg-paths.json";

interface IconButtonProps {
  id: string;
  className?: string;
  onClick: () => void;
}

export function IconButton(props: IconButtonProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="IconButtonContainer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => props.onClick()}>
      <svg
        className={props.className ? props.className : "IconButton"}
        xmlns="http://www.w3.org/2000/svg"
        id={props.id}
        viewBox="0 0 24 24">
        <path
          d={SvgPaths.paths.find(obj => obj.id === props.id)?.path}
          fill={isHovered ? (props.id === "close-box" ? Constants.exitButtonHoverFill : Constants.iconButtonHoverFill) : Constants.iconButtonFill} />
      </svg>
    </div>
  );
}
