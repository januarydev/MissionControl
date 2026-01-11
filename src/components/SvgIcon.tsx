import { Constants } from "../types/Constants";
import SvgPaths from "../assets/svg-paths.json";

export function SvgIcon(iconId: string) {
  return (
    <svg className="SvgIcon" xmlns="http://www.w3.org/2000/svg" id={iconId} viewBox="0 0 24 24">
      <path d={SvgPaths.paths.find(obj => obj.id === iconId)?.path} fill={Constants.iconButtonFill} />
    </svg>
  );
}
