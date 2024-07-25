import axios from "../configs/axios";

export const getMaterials = async () => {
  const { data } = await axios.get("/material/get-materials");
  return data;
};

export const createMaterial = async (item) => {
  const { data } = await axios.post("/material/create-material", item);
  return data;
};

export const editMaterial = async (item) => {
  console.log("item form data from sercvices", item.values)
  const { data } = await axios.put(`/material/update-material/${item.materialId}`, item.values);
  console.log ('DATA', data)
  return data;
};

export const removeMaterial = async (materialId) => {
  const { data } = await axios.delete(`/material/delete-material/${materialId}`);
  return data;
};
export const removeMultipleMaterials = async (item) => {
  const { data } = await axios.post(`/material/delete-many-materials/`, item);
  return data;
};

