import axiosClient from "./axiosClient";

export const getAllProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axiosClient.get(`/products${query ? `?${query}` : ""}`);
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

export const updateProductAvailability = async (id, isAvailable) => {
  const response = await axiosClient.patch(`/products/${id}/availability`, {
    is_available_for_sale: isAvailable,
  });
  return response.data;
};