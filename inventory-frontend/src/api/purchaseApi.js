import axiosClient from "./axiosClient";

export const getAllPurchases = async () => {
  const response = await axiosClient.get("/purchases");
  return response.data;
};

export const getPurchaseById = async (id) => {
  const response = await axiosClient.get(`/purchases/${id}`);
  return response.data;
};

export const createPurchase = async (purchaseData) => {
  const response = await axiosClient.post("/purchases", purchaseData);
  return response.data;
};

export const getProductsPurchasedFromSupplier = async (supplierId) => {
  const response = await axiosClient.get(`/purchases/supplier/${supplierId}/products`);
  return response.data;
};