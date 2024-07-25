import axios from "../configs/axios";

export const getProducts = async () => {
  const { data } = await axios.get("/product/get-products");
  return data;
};

export const createProduct = async (item) => {
  const { data } = await axios.post("/product/add-product", item);
  return data;
};

export const editProduct = async (item) => {
  const { data } = await axios.put(`/product/update-product/${item.productId}`, item.formData);
  return data;
};

export const removeProduct = async (productId) => {
  const { data } = await axios.delete(`/product/delete-product/${productId}`);
  return data;
};
export const removeMultipleProducts = async (item) => {
  const { data } = await axios.post(`/product/delete-many-products`, item);
  return data;
};


// export const getProductbyId = async (id) => {
//   try {
//     const { data } = await axios.get("/product/get-products");
//     return data;
//   } catch (error) {
//     throw new Error("Problème de récupération des données");
//   }
// };
