import React from "react";
import type { CustomSelectProps } from "../../types/props";
import { Dropdown } from "@fluentui/react";

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  selectedKey,
  onChange,
  //   onBlur,
  options,
  styles,
}) => {
  return (
    <Dropdown
      label={label.charAt(0).toUpperCase() + label.slice(1)}
      selectedKey={selectedKey}
      onChange={onChange}
      //   onBlur={onBlur}
      className="inputbox"
      placeholder="Select an option"
      options={options}
      styles={styles}
    />
  );
};

export default CustomSelect;
