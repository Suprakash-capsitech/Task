import SideBar from "../common/SideBar";
import ViewLayout from "./ViewLayout";

const MainLayout = () => {
  return (
    <>
    <div style={{maxHeight: "100vh"  , display:"flex" ,minWidth:"100vw"}}>

      <SideBar />
      <ViewLayout />
    </div>
    </>
  );
};

export default MainLayout;
