import {  Outlet } from "react-router-dom";
import Home from "../pages/Home";

const AdminRotues = () => {
    
  const role = localStorage.getItem("role");
  return (
    role == "Admin" ? <Outlet/> : <Home  />
  )
}

export default AdminRotues