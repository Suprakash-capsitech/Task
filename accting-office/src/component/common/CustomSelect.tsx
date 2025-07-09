import React from "react";
import type { CustomSelectProps } from "../../types/props";
import { Dropdown } from "@fluentui/react";

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  selectedKey,
  onChange,
  // onBlur,
  options,
}) => {
  return (
    <Dropdown
      label={label ? label.charAt(0).toUpperCase() + label.slice(1) : ""}
      selectedKey={selectedKey}
      onChange={onChange}
      // onBlur={onBlur}
      placeholder="Select an option"
      options={options}
      styles={{
        title:{
          border: "1px solid rgba(0,0,0,.2)",
          borderRadius: 6
        },
        callout:{
          borderRadius: 5,
          },
        dropdown: {
          border:"none",
          outline: "none",
        },

        
      }}
    />
  );
};

export default CustomSelect;
