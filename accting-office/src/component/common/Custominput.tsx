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
      autoComplete="on"
      canRevealPassword={type === "password"}
      type={type}
      name={name}
      placeholder={placeholder}
      className={`${classname}`}
      styles={{
        fieldGroup: { padding:5, borderRadius: 5 , outline: "none" , border:"1px solid rgba(0,0,0,.4)" },
      }}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default Custominput;
