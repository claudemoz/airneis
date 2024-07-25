import axios from "../configs/axios";

export const getMaterials = async () => {
  const { data } = await axios.get("/material/get-materials");
  return data;
};
