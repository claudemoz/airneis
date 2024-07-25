import axios from "../configs/axios";

export const getCategories = async () => {
  const { data } = await axios.get("/category/get-categories");
  return data;
};

//ça fonction!!
// export const getAllProductCategorybyId = async (categoryId) => { 
//   const { data } = await axios.get(`/product/get-product-by-category/${categoryId}`);
//   return data;
// };
