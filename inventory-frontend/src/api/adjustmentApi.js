import axiosClient from "./axiosClient";

export const createInventoryAdjustment = async (adjustmentData) => {
  const response = await axiosClient.post("/inventory-adjustments", adjustmentData);
  return response.data;
};