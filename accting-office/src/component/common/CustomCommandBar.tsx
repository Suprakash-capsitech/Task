import {
  Callout,
  DefaultButton,
  DirectionalHint,
  Stack,
  CommandBar,
  SearchBox,
  type ICommandBarItemProps,
  type IDropdownOption,
} from "@fluentui/react";

import { useRef, useState } from "react";
import CustomSelect from "./CustomSelect";
import { useLocation } from "react-router-dom";
interface CustomCommandBarProps {
  OpenForm: (isOpen: boolean) => void;
  showFilter: boolean;
  RefreshList: () => void;
  handleSubmit: () => void;
  SetSearch: (value: string) => void;
  setFilterType?: (value: string) => void;
  setFilterValue?: (value: string) => void;
}

const CustomCommandBar = ({
  OpenForm,
  RefreshList,
  SetSearch,
  handleSubmit,
  setFilterType,
  setFilterValue,
  showFilter,
}: CustomCommandBarProps) => {
  const [filteroption, setfilteroption] = useState<string>("");
  const [value, setvalue] = useState<string>("");
  const [isCalloutVisible, setIsCalloutVisible] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const Cretriaitems: IDropdownOption[] = [
    { key: "Status", text: "Status" },
    { key: "Type", text: "Type" },
  ];
  const LeadCretriaitems: IDropdownOption[] = [
    { key: "Status", text: "Status" },
  ];
  const valueitems: Record<string, IDropdownOption[]> = {
    Status: [
      { key: "active", text: "Active" },
      {
        key: "inactive",
        text: "In-Active",
      },
    ],
    Type: [
      { key: "limited", text: "limited" },
      {
        key: "individual",
        text: "individual",
      },
      {
        key: "LLP",
        text: "LLP",
      },
      {
        key: "Partnersihp",
        text: "Partnersihp",
      },
    ],
  };
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
        <SearchBox
          placeholder="Search"
          type="text"
          iconProps={{ iconName: "Search" }}
          onChange={(_e, newvalue) => SetSearch(newvalue as string)}
          onSearch={(_e) => {
            handleSubmit();
          }}
          styles={{
            root: {
              outline: "none",
              borderRadius: 5,
              border: "1px solid rgb(208, 208, 208)",
              alignItems: "center",
            },
          }}
        />
      ),
    },
    {
      key: "filter",
      text: "filter",
      onRender: () =>
        showFilter && setFilterType && setFilterValue ? (
          <Stack horizontal tokens={{childrenGap:2}}>
            {filteroption && value && (
              <Stack>
                <DefaultButton
                  onClick={() => {
                    setFilterType("");
                    setFilterValue("");
                    setfilteroption("");
                    setvalue("");
                  }}
                  iconProps={{ iconName: "Cancel" }}
                  styles={{
                    icon: {
                      color: " rgb(0, 120, 212)",
                    },
                    label: { fontSize: "11px", fontWeight: "thin" },
                    root: {
                      height: "24px",

                      border: "none",
                    },
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgb(199, 224, 244)",
                    borderRadius: 20,
                  }}
                >
                  {filteroption} = {value}
                </DefaultButton>
              </Stack>
            )}
            <Stack>
              <div ref={filterRef}>
                <DefaultButton
                  iconProps={{ iconName: "PageListFilter" }}
                  onClick={() => setIsCalloutVisible((prev) => !prev)}
                  styles={{
                    icon: {
                      color: " rgb(0, 120, 212)",
                    },
                    label: { fontSize: "11px", fontWeight: "thin" },
                    root: {
                      height: "24px",

                      border: "none",
                    },
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgb(199, 224, 244)",
                    borderRadius: 20,
                  }}
                >
                  Add Filter
                </DefaultButton>
              </div>

              {isCalloutVisible && (
                <Callout
                  role="Status"
                  target={filterRef.current}
                  onDismiss={() => setIsCalloutVisible(false)}
                  gapSpace={0}
                  directionalHint={DirectionalHint.bottomRightEdge}
                  style={{
                    width: 320,
                    maxWidth: "100%",
                    padding: "10px 14px",
                  }}
                >
                  <Stack>
                    <CustomSelect
                      label="Cretria"
                      selectedKey={filteroption}
                      options={path == "lead" ? LeadCretriaitems : Cretriaitems}
                      onChange={(_e, option) => {
                        setFilterType(option?.key as string);
                        setvalue("");
                        setfilteroption(option?.key as string);
                      }}
                    />
                    {filteroption && (
                      <CustomSelect
                        label="Value"
                        selectedKey={value}
                        options={valueitems[filteroption]}
                        onChange={(_e, option) => {
                          setFilterValue(option?.key as string);
                          setvalue(option?.key as string);
                        }}
                      />
                    )}
                    <Stack
                      tokens={{ childrenGap: 6, padding: 5 }}
                      horizontal
                      horizontalAlign="end"
                    >
                      <DefaultButton
                        type="reset"
                        onClick={() => {
                          setFilterType("");
                          setFilterValue("");
                          setfilteroption("");
                          setvalue("");
                          setIsCalloutVisible(false);
                        }}
                        styles={{
                          root: {
                            fontSize: 12,
                            borderRadius: 5,
                          },
                          label: {
                            fontWeight: "thin",
                          },
                        }}
                      >
                        Clear Filter
                      </DefaultButton>
                      {/* <PrimaryButton
                      type="submit"
                      onClick={() => RefreshList()}
                      styles={{
                        root: {
                          fontSize: 12,
                          borderRadius: 5,
                        },
                        label: {
                          fontWeight: "thin",
                        },
                      }}
                    >
                      Apply{" "}
                    </PrimaryButton> */}
                    </Stack>
                  </Stack>
                </Callout>
              )}
            </Stack>
          </Stack>
        ) : (
          <Stack></Stack>
        ),
    },
  ];

  return (
    <CommandBar
      items={_items}
      farItems={_faritems}
      styles={{
        root: {
          padding: 0,
          paddingLeft: 5,
          paddingRight: 5,
          margin: 0,
        },
        primarySet: {},
        secondarySet: {
          alignItems: "center",
          gridGap: "5px",
        },
      }}
      ariaLabel="Inbox actions"
      primaryGroupAriaLabel="Email actions"
      farItemsGroupAriaLabel="More actions"
    />
  );
};

export default CustomCommandBar;
