import { Outlet } from "react-router-dom";
import TopNav from "../common/TopNav";
import { Stack } from "@fluentui/react";

const ViewLayout = () => {
  return (
   <Stack verticalFill={true} style={{overflow:"hidden", width:"100%",maxWidth:"100%" }}>

      <TopNav />
      <Outlet />
   </Stack>
    
  );
};

export default ViewLayout;
