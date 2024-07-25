import axios from "../configs/axios";

export const addContact = async (item) => {
  const { data } = await axios.post(`/contact/add-contact`, item);
  return data;
};
