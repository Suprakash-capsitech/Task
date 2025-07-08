import type { ReactNode } from "react";
import {
  IDropdownOption,
  IDropdownStyles,
  DropdownChangeEvent,
} from "@fluentui/react";


export interface CustomInputProps {
  name: string;
  type: string;
  classname?: string;
  placeholder?: string;
  value?: string;
  onChange: (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => void;

  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
      Element
    >
  ) => void;
}
export interface CustomSelectProps {
  label: string;
  selectedKey: string | number | undefined;
  onChange: (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption,
    index?: number
  ) => void;
  onBlur?: (
    event: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  options: IDropdownOption[];
  styles?: Partial<IDropdownStyles>;
}
export interface ButtonProps {
  icon: ReactNode;
  color: string,
  type: "button" | "submit" | "reset";
  onclick?: () => void;
  label: string;
}
export interface CustomFormprops {
  OpenForm: (isOpen: boolean) => void;
  RefreshList: () => void;
}