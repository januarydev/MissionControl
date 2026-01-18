import { useState } from "react";
import { SvgIcon } from "./SvgIcon";

interface DropdownOptionProps {
  text: string;
  value?: string;
  onClick?: () => void;
}

interface DropdownProps {
  label: string;
  options: DropdownOptionProps[];
  selected?: string;
  onChange?: (selected: string) => void;
}

export function Dropdown(props: DropdownProps) {
  const [hide, setHide] = useState<boolean>(true);

  return (
    <label className="DropdownLabel">
      {props.label}
      <div className="DropdownSelect" onClick={() => setHide(!hide)}>
        {props.options.find(option => option.value === props.selected)!.text}
        <div className="DropdownIcon">{SvgIcon("chevron-down")}</div>
        <div className="DropdownOptionsContainer">
          {!hide &&
            props.options.map((option, index) =>
              <div
                key={index}
                className="DropdownOption"
                onClick={() => {
                  if (props.onChange && option.value) {
                    props.onChange(option.value);
                  } else if (option.onClick) {
                    option.onClick();
                  }
                }}
              >{option.text}</div>
            )
          }
        </div>
      </div>
    </label>
  );
}

