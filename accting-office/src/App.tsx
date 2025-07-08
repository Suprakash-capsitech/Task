import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Leads from "./pages/Leads";
import ProtectedRoutes from "./router/ProtectedRoutes";
import Clients from "./pages/Clients";
import SingleClient from "./pages/SingleClient";
import SingleLead from "./pages/SingleLead";
import MainLayout from "./component/Layout/MainLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<MainLayout />}>
            <Route element={<ProtectedRoutes />}>
              <Route index element={<Home />} />
              <Route path="/client" element={<Clients />} />
              <Route path="/client/:id" element={<SingleClient />} />
              <Route path="/lead" element={<Leads />} />
              <Route path="/lead/:id" element={<SingleLead />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
