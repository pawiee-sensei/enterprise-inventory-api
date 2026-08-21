import axiosClient from "./axiosClient";

export const getAllSales = async () => {
  const response = await axiosClient.get("/sales");
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await axiosClient.get(`/sales/${id}`);
  return response.data;
};

export const createSale = async (saleData) => {
  const response = await axiosClient.post("/sales", saleData);
  return response.data;
};

export const createSaleReturn = async (saleId, returnData) => {
  const response = await axiosClient.post(`/sale-returns/${saleId}`, returnData);
  return response.data;
};