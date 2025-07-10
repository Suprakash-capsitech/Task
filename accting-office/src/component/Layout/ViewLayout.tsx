import { Outlet } from "react-router-dom";
import { Stack } from "@fluentui/react";
import TopNav from "./TopNav";

const ViewLayout = () => {
  return (
    <Stack
      verticalFill={true}
      style={{ overflow: "auto", width: "100%", maxWidth: "100%" }}
    >
      <TopNav />
      <Outlet />
    </Stack>
  );
};

export default ViewLayout;
