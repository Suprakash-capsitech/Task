import {
  CommandBar,
  type ICommandBarItemProps,
} from "@fluentui/react";

interface CustomCommandBarProps {
  OpenForm: (isOpen: boolean) => void;
  RefreshList: () => void;
}

const CustomCommandBar = ({ OpenForm, RefreshList }: CustomCommandBarProps) => {
  const _items: ICommandBarItemProps[] = [
    {
      key: "newItem",
      text: "New",
      iconProps: { iconName: "Add" },
      onClick: () => OpenForm(true),
    },
    {
      key: "Reload",
      text: "Reload",
      iconProps: { iconName: "Refresh" },
      onClick: () => RefreshList(),
    },
  ];
  

  return (
    <CommandBar
      items={_items}
      ariaLabel="Inbox actions"
      primaryGroupAriaLabel="Email actions"
      farItemsGroupAriaLabel="More actions"
    />
  );
};

export default CustomCommandBar;
