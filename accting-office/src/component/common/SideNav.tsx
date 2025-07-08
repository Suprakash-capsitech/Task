import { IconButton, Stack, Text } from "@fluentui/react";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { FaClipboardList, FaUserSecret } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideNav = () => {
  const [toggleCollapse, setToggleCollapse] = useState<boolean>(false);
  const navigate = useNavigate();
  const links = [
    {
      key: "client",
      name: "Client",
      icon: <FaUserSecret size={18} />,
      route: "/client",
    },
    {
      key: "Leads",
      name: "Lead",
      icon: <FaClipboardList size={18} />,
      route: "/lead",
    },
  ];
  return (
    <Stack
      verticalAlign="start"
      styles={{
        root: {
          width: toggleCollapse ? 60 : 250,
          zIndex: 1000,
          backgroundColor: "#FFFFFF",
          height: "100vh",
          transition: "width 0.3s ease",
          borderRight: "1px solid #ccc",
          position: toggleCollapse ? "static" : "absolute",
        },
      }}
    >
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
        styles={{ root: { padding: 12 } }}
      >
        <IconButton
          onClick={() => setToggleCollapse((prev) => !prev)}
          styles={{
            root: {
              color: "black",
              padding: 4,
              selectors: {
                ":hover": {
                  backgroundColor: "#F3F2F1",
                },
              },
            },
          }}
        >
          <BiMenu size={20} />
        </IconButton>
      </Stack>
      <Stack
        tokens={{ childrenGap: 4 }}
        styles={{
          root: {
            paddingLeft: 8,
            paddingRight: 8,
          },
        }}
      >
        {links.map((link) => (
          <Stack
            key={link.key}
            horizontal
            verticalAlign="center"
            onClick={() => navigate(link.route)}
            styles={{
              root: {
                padding: 8,
                borderRadius: 4,
                cursor: "pointer",
                transition: "background 0.2s ease",
                color: "#000",
                selectors: {
                  ":hover": {
                    background: "#F3F2F1",
                  },
                },
                justifyContent: toggleCollapse ? "center" : "flex-start",
              },
            }}
          >
            {link.icon}
            {!toggleCollapse && (
              <Text
                variant="medium"
                styles={{ root: { marginLeft: 10, fontSize: "18px" } }}
              >
                {link.name}
              </Text>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
export default SideNav;
