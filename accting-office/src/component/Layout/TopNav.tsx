import {
  Callout,
  DirectionalHint,
  IconButton,
  Persona,
  PersonaPresence,
  PersonaSize,
  Stack,
  Text,
} from "@fluentui/react";
import { useRef, useState } from "react";
import { BiSearch, BiUser } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
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
    root: { color: "white" },
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
      console.log(error);
    }
  };
  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      styles={{
        root: {
          padding: "4px 4px 4px 26px",
          backgroundColor: "#0078D4",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
          width: "100%",
        },
      }}
    >
      <Text
        variant="large"
        styles={{ root: { fontWeight: 600, color: "white" } }}
      >
        Acting Office - Dev
      </Text>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <Stack
          horizontal
          verticalAlign="center"
          styles={{
            root: {
              background: "white",
              borderRadius: 4,
              padding: "4px 8px",
              height: 32,
              width: 250,
            },
          }}
        >
          <BiSearch size={18} style={{ color: "#666", marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              fontSize: 14,
            }}
          />
        </Stack>
        
        <IconButton
          title="Settings"
          ariaLabel="Settings"
          styles={iconButtonStyle}
        >
          <CiSettings size={18} />
        </IconButton>

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
