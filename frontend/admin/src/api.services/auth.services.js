import axios from "../configs/axios";

export const getCurrentUserService = async () => {
  const { data } = await axios.get("/auth/user");
  return data;
};

export const loginService = async (authData) => {
  const { data } = await axios.post("/auth/authenticate", authData);
  return data;
};

export const logoutService = async () => {
  const { data } = await axios.post("/auth/logout");
  return data;
};
