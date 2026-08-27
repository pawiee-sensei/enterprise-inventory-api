import axiosClient from "./axiosClient";

export const getAllInventory = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axiosClient.get(`/inventory${query ? `?${query}` : ""}`);
  return response.data;
};

export const getLowStockInventory = async () => {
  const response = await axiosClient.get("/inventory/low-stock");
  return response.data;
};

export const getInventorySummary = async () => {
  const response = await axiosClient.get("/inventory/summary");
  return response.data;
};

export const getInventoryLogsByProductId = async (productId) => {
  const response = await axiosClient.get(`/inventory/${productId}/logs`);
  return response.data;
};

export const getAllInventoryLogs = async ({ page = 1, limit = 10, productId = "" } = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (productId) params.append("productId", productId);

  const response = await axiosClient.get(`/inventory/logs?${params.toString()}`);
  return response.data;
};

