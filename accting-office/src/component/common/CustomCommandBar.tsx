import {
  CommandBar,
  Dropdown,
  TextField,
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
  const _faritems: ICommandBarItemProps[] = [
    {
      key: "search",
      text: "Search",
      onRender: () => (
        <TextField placeholder="Search" type="text"  iconProps={{ iconName: "Search" }} />
      ),
    },
    {
      key: "filter",
      onRender: () => (
        <Dropdown
          placeholder="Filter status"
          options={[
            { key: "active", text: "Active" },
            { key: "inactive", text: "In-Active" },
          ]}
        />
      ),
    },
  ];

  return (
    <CommandBar
      items={_items}
      farItems={_faritems}

      ariaLabel="Inbox actions"
      primaryGroupAriaLabel="Email actions"
      farItemsGroupAriaLabel="More actions"
    />
  );
};

export default CustomCommandBar;
