import axiosClient from "./axiosClient";

export const getAllSuppliers = async () => {
  const response = await axiosClient.get("/suppliers");
  return response.data;
};

export const createSupplier = async (supplierData) => {
  const response = await axiosClient.post("/suppliers", supplierData);
  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await axiosClient.put(`/suppliers/${id}`, supplierData);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await axiosClient.delete(`/suppliers/${id}`);
  return response.data;
};