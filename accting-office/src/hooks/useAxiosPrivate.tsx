import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../config/axios";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const Token = localStorage.getItem("token");
  const Navigate = useNavigate();
  const refresh = async () => {
    try {
      const response = await axiosPrivate.get("/User/refresh");

      localStorage.setItem("token", response.data);
      return response.data;
    } catch (error) {
      alert("Login in Again please");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      Navigate("/login");
    }
  };

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${Token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);
  return axiosPrivate;
};

export default useAxiosPrivate;
