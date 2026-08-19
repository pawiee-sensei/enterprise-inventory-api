import axiosClient from "./axiosClient";

export const getAllCategories = async () => {
  const response = await axiosClient.get("/categories");
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await axiosClient.post("/categories", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await axiosClient.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosClient.delete(`/categories/${id}`);
  return response.data;
};

