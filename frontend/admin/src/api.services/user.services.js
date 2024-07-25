import axios from "../configs/axios";

export const getCustomers = async () => {
  const { data } = await axios.get("/user/get-customers");
  return data;
};

export const getUsersAdmin = async () => {
  const { data } = await axios.get("/user/get-users-admin");
  return data;
};

export const createUser = async (item) => {
  const { data } = await axios.post("/user/add-user", item);
  return data;
};

export const editUser = async (item) => {
  const { data } = await axios.put(`/user/update-user/${item.userId}`, item.formData);
  return data;
};

export const getUser = async (userId) => {
  const { data } = await axios.get(`/user/get-user/${userId}`);
  return data;
};
export const removeUser = async (item) => {
  const { data } = await axios.delete(
    `/user/delete-user/${item.userId}`,
    item.formData
  );
  return data;
};
export const removeMultipleUsers = async (item) => {
  const { data } = await axios.post(`/user/delete-Many-users`, item);
  return data;
};
export const addContact = async (item) => {
  const { data } = await axios.post(`/contact/add-contact`, item);
  return data;
};
