import type { ButtonProps } from "../../types/props";
import { ActionButton } from "@fluentui/react";

const Buttoninput = ({ icon, type, label, color, onclick }: ButtonProps) => {
  return (
    <ActionButton
      type={type}
      onClick={onclick}
      className={`btn btn-${color} text-center d-flex`}
    >
      {icon}
      {label}
    </ActionButton>
  );
};

export default Buttoninput;
