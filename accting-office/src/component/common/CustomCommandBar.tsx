import {
  CommandBar,
  TextField,
  type ICommandBarItemProps,
} from "@fluentui/react";

interface CustomCommandBarProps {
  OpenForm: (isOpen: boolean) => void;
  RefreshList: () => void;
  handleSubmit: () => void;
  SetSearch: (value: string) => void;
}

const CustomCommandBar = ({
  OpenForm,
  RefreshList,
  SetSearch,handleSubmit
}: CustomCommandBarProps) => {
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
        <TextField
          placeholder="Search"
          type="text"
          iconProps={{ iconName: "Search" }}
          onChange={(e) => SetSearch(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); 
              handleSubmit();
            }
          }}
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
