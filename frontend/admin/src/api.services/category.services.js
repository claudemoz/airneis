import axios from "../configs/axios";

export const getCategories = async () => {
  const { data } = await axios.get("/category/get-categories");
  return data;
};

export const createCategory = async (item) => {
  const { data } = await axios.post("/category/add-category", item);
  return data;
};

export const editCategory = async (item) => {
  const { data } = await axios.put(`/category/update-category/${item.categoryId}`, item.formData);
  return data;
};

export const removeCategory = async (categoryId) => {
  const { data } = await axios.delete(`/category/delete-category/${categoryId}`);
  return data;
};
export const removeMultipleCategories = async (item) => {
  const { data } = await axios.post(`/category/delete-many-categories`, item);
  return data;
};

export const getAllProductCategorybyId = async (categoryId) => { 
  const { data } = await axios.get(`/product/get-product-by-category/${categoryId}`);
  return data;
};
