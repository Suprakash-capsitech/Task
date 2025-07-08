import type React from "react";
import type { CustomInputProps } from "../../types/props";
import { TextField } from "@fluentui/react";

const Custominput: React.FC<CustomInputProps> = ({
  name,
  type,
  classname,
  placeholder,
  value,
  onChange,
  onBlur,
}) => {
  return (
      <TextField
        label={name.charAt(0).toUpperCase() + name.slice(1)}
        autoComplete="true"
        canRevealPassword={true}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`inputbox ${classname}`}
        
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
  );
};

export default Custominput;
