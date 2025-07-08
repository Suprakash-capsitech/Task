
import {
  initializeIcons,
  Nav,
  type INavLinkGroup,
  type INavStyles,
  IconButton,
  Stack,
  Label,
} from "@fluentui/react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

initializeIcons();

const SideBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const navLinkGroups: { label: string; links: INavLinkGroup["links"] }[] = [
    {
      label: "",
      links: [{ name: "Dashboard", url: "/", icon: "Tiles", key: "dashboard" }],
    },
    {
      label: "Operation",
      links: [
        { name: "Clients", url: "/client", icon: "Suitcase", key: "client" },
        { name: "Tasks", url: "/", icon: "TaskManager", key: "tasks" },
        {
          name: "E-signatures",
          url: "/",
          icon: "ContactCard",
          key: "esignatures",
        },
        { name: "Deadlines", url: "/", icon: "Calendar", key: "deadlines" },
      ],
    },
    {
      label: "Sales",
      links: [
        { name: "Leads", url: "/lead", icon: "UserGauge", key: "lead" },
        { name: "Quotes", url: "/", icon: "Document", key: "quotes" },
        { name: "Letters", url: "/", icon: "Mail", key: "letters" },
        { name: "Chats", url: "/", icon: "Chat", key: "chats" },
      ],
    },
    {
      label: "Premium",
      links: [
        { name: "Timesheet", url: "/", icon: "Calendar", key: "timesheet" },
        { name: "Documents", url: "/", icon: "Page", key: "documents" },
      ],
    },
    {
      label: "Marketing",
      links: [
        {
          name: "Lead Sources",
          key: "leadsource",
          icon: "UserEvent",
          url: null,

          onClick: () => toggleExpand("leadsources"),
          isExpanded: expandedKeys.includes("leadsources"),
          links: [
            { name: "Sources", url: "/", key: "sources" },
            { name: "Unsubscribed", url: "/", key: "unsubscribed" },
          ],
        },
      ],
    },
    {
      label: "Reports",
      links: [
        { name: "Manual timesheet", url: "/", icon: "Calendar", key: "manual" },
        { name: "Teams", url: "/", icon: "People", key: "teams" },
        { name: "Reports", url: "/", icon: "ReportDocument", key: "reports" },
        { name: "Resources", url: "/", icon: "Send", key: "resources" },
      ],
    },
  ];

  const navStyles: Partial<INavStyles> = {
    root: {
      width: collapsed ? 60 : 240,
      minHeight: "100%",
      overflowY: "hidden",
      overflowX: "hidden",
      transition: "width 0.2s ease",
      paddingLeft: 5,
    },
    linkText: {
      display: collapsed ? "none" : "inline",
      paddingLeft: 5,
    },
    groupContent: {
      marginBottom: 0,
    },
  };

  return (
    <Stack
      style={{
        minHeight: "100vh",
        maxHeight: "100%",
        borderRight: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Stack horizontal verticalAlign="center">
        <IconButton
          iconProps={{ iconName: "GlobalNavButton" }}
          ariaLabel="Toggle menu"
          onClick={() => setCollapsed(!collapsed)}
          styles={{ root: { margin: "8px" } }}
        />
      </Stack>

      <Stack style={{ overflowY: "auto", scrollbarWidth: "none" }}>
        {navLinkGroups.map((group, index) => (
          <Stack key={index} style={{ margin: 0 }}>
            {!collapsed && group.label && (
              <Label styles={{ root: { fontWeight: 600, paddingLeft: 5 } }}>
                {group.label}
              </Label>
            )}

            <Nav
              groups={[{ links: group.links }]}
              styles={navStyles}
              selectedKey={path ? path : "dashboard"}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default SideBar;
