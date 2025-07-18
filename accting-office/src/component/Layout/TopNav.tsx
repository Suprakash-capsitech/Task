import {
  Callout,
  DirectionalHint,
  IconButton,
  Persona,
  PersonaPresence,
  PersonaSize,
  SearchBox,
  Stack,
  Text,
} from "@fluentui/react";
import { useRef, useState } from "react";
import { BiUser } from "react-icons/bi";
import Buttoninput from "../common/Buttoninput";
import { LuLogOut } from "react-icons/lu";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const TopNav = () => {
  const [isCalloutVisible, setIsCalloutVisible] = useState<boolean>(false);
  const profileButtonRef = useRef<HTMLImageElement | null>(null);
  const name = localStorage.getItem("name") || "Dev User";
  const role = localStorage.getItem("role") || "Dev User";
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const iconButtonStyle = {
    root: { color:"white"},
    icon: { fontSize: 17 },
    rootHovered: { backgroundColor: "#106EBE" },
  };
  const LogoutFunction = async () => {
    try {
      const response = await axiosPrivate.post("/User/logout");
      if (response) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      styles={{
        root: {
          padding: 4,
          paddingLeft: 12,
          backgroundColor: "rgb(66, 133, 244)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
          width: "100%",
        },
      }}
    >
      <Stack>

      <Text
        variant="medium"
        styles={{ root: { fontWeight: 600, color: "white" } }}
      >
        Acting Office - Dev
      </Text>
      </Stack>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }} >
        <SearchBox
          name="search"
          placeholder="Search"
          type="text"
          iconProps={{ iconName: "Search" }}
          styles={{
            root: {
              outline: "none",
              borderRadius: 5,
              border: "1px solid rgb(208, 208, 208)",
              alignItems: "center",
            },
          }}
        />

        <IconButton
          title="Modules"
          ariaLabel="Modules"
          styles={iconButtonStyle}
          iconProps={{ iconName: "Waffle" }}
        />
        <IconButton
          title="Tickets"
          ariaLabel="Tickets"
          styles={iconButtonStyle}
          iconProps={{ iconName: "ReportLibraryMirrored" }}
        />
        <IconButton
          title="What's New"
          ariaLabel="What's New"
          styles={iconButtonStyle}
          iconProps={{ iconName: "Megaphone" }}
        />
        <IconButton
          title="Live calls and chats"
          ariaLabel="Live calls and chats"
          styles={iconButtonStyle}
          iconProps={{ iconName: "Headset" }}
        />
        <IconButton
          title="Sticky Notes"
          ariaLabel="Sticky Notes"
          styles={iconButtonStyle}
          iconProps={{ iconName: "QuickNote" }}
        />

        <img
          ref={profileButtonRef}
          src="/image.png"
          alt="profile"
          className="profile-img"
          id="profile-btn"
          onClick={() => setIsCalloutVisible((prev) => !prev)}
        />
        {isCalloutVisible && (
          <Callout
            target={profileButtonRef.current}
            onDismiss={() => setIsCalloutVisible(false)}
            gapSpace={0}
            directionalHint={DirectionalHint.bottomRightEdge}
            style={{
              width: 320,
              maxWidth: "90%",
              padding: "20px 24px",
            }}
          >
            <Stack tokens={{ childrenGap: 5 }}>
              <Persona
                imageUrl={"image.png"}
                imageInitials={name[0]}
                text={name}
                secondaryText={role}
                showSecondaryText
                size={PersonaSize.size40}
                presence={PersonaPresence.online}
                imageAlt="profile"
              />
              <Stack horizontal horizontalAlign="space-between">
                <Buttoninput
                  color=""
                  icon={<BiUser />}
                  type={"submit"}
                  label={"Profile"}
                  onclick={() => navigate("/")}
                />
                <Buttoninput
                  color=""
                  icon={<LuLogOut />}
                  type={"submit"}
                  label={"Logout"}
                  onclick={LogoutFunction}
                />
              </Stack>
            </Stack>
          </Callout>
        )}
      </Stack>
    </Stack>
  );
};

export default TopNav;
