import axios from "../configs/axios";

export const getCurrentUserService = async () => {
  const { data } = await axios.get("/auth/user");
  return data;
};


export const updateUserService = async (userId, userData) => {
  const { data } = await axios.put(`/auth/update-user/${userId}`, userData);
  return data;
};


export const updatePasswordService = async (passwordData) => {
  const { data } = await axios.post("/auth/update-password", passwordData);
  return data;
};

export const loginService = async (authData) => {
  const { data } = await axios.post("/auth/login", authData);
  return data;
};

export const logoutService = async () => {
  const { data } = await axios.post("/auth/logout");
  return data;
};

export const registerService = async (userData) => {
  const { data } = await axios.post("/auth/register", userData);
  return data;
};
export const verifyEmailService = async (userData) => {
  const { data } = await axios.post("/auth/verify-email", userData);
  return data;
};
export const reverifyEmailService = async (userData) => {
  const { data } = await axios.post("/auth/re-verify-email", userData);
  return data;
};

export const generateForgetPasswordlinkService = async (userData) => {
  const { data } = await axios.post("/auth/forgot-password", userData);
  return data;
};

export const resetPasswordService = async (userData) => {
  console.log("userData ", userData);
  const { data } = await axios.post("/auth/reset-password", userData);
  return data;
};