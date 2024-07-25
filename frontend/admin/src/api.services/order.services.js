import axios from "../configs/axios";

export const getOrders = async () => {
  const { data } = await axios.get("/order/get-orders");
  console.log(data)
  return data;
};


export const removeOrder = async (orderId) => {
  const { data } = await axios.delete(`/order/delete-order/${orderId}`);
  return data;
};

export const updateOrderService = async (item) => {
  const { data } = await axios.put(`/order/update-order/${item.orderId}`, {status:item.status});
  return data;
};

export const removeMultipleOrders = async (item) => {
  const { data } = await axios.post(`/order/delete-many-orders`, item);
  return data;
};

