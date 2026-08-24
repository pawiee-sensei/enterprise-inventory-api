import axiosClient from "./axiosClient";

export const createStockRequest = async (requestData) => {
  const response = await axiosClient.post("/stock-requests", requestData);
  return response.data;
};

export const getAllStockRequests = async (status = "") => {
  const url = status ? `/stock-requests?status=${status}` : "/stock-requests";
  const response = await axiosClient.get(url);
  return response.data;
};

export const approveStockRequest = async (id) => {
  const response = await axiosClient.put(`/stock-requests/${id}/approve`);
  return response.data;
};

export const rejectStockRequest = async (id) => {
  const response = await axiosClient.put(`/stock-requests/${id}/reject`);
  return response.data;
};