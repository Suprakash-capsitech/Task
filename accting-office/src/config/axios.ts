import axios from "axios";
import config from ".";

export const axiosPrivate = axios.create({
  baseURL: config.BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
