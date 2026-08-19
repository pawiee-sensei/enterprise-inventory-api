import axiosClient from "./axiosClient";

export const getAllProducts = async () => {
  const response = await axiosClient.get("/products");
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosClient.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosClient.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosClient.delete(`/products/${id}`);
  return response.data;
};