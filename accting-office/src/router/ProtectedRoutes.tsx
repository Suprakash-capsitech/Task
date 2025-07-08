import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoutes = () => {
  const accessToken = localStorage.getItem("token");

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet/>;
}

export default ProtectedRoutes