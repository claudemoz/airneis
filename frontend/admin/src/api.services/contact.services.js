import axios from "../configs/axios";

export const getContacts = async () => {
  const { data } = await axios.get("/contact/get-contacts");
  return data;
};
export const getAllContactsbyId = async (contactId) => {
  const { data } = await axios.get(`/contact/get-many-contact/${contactId}`);
  return data;
};
export const removeContact = async (item) => {
  const { data } = await axios.delete(
    `/contact/delete-contact/${item.contactId}`,
    item.formData
  );
  return data;
};
export const removeMultipleContacts = async (item) => {
  const { data } = await axios.post(`/contact/delete-many-contacts`, item);
  return data;
};
export const addContact = async (item) => {
  const { data } = await axios.post(`/contact/add-contact`, item);
  return data;
};
