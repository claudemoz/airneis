import axios from "../configs/axios";

export const getProducts = async (filters=null) => {
  console.log("filters services", filters);
  const query = new URLSearchParams();
  if(filters.searchKey){
    query.append('searchKey', filters.searchKey);
  }
  if(filters.categories && Array.isArray(filters.categories)){
    query.append('categories', filters.categories);
  }
  if(filters.materials && Array.isArray(filters.materials)){
    query.append('materials', filters.materials);
  }
  if(filters.price?.min){
    query.append('minPrice', filters.price.min);
  }
  if(filters.price?.max){
    query.append('maxPrice', filters.price.max);
  }
  const { data } = await axios.get(`/product/get-products?${query}`);
  return data;
};

export const getProduct = async (productId) => { 
  const { data } = await axios.get(`/product/get-product/${productId}`);
  return data;
};

export const getProductsByCategoryId = async (categoryId) => { 
  const { data } = await axios.get(`/product/get-product-by-category/${categoryId}`);
  return data;
};
