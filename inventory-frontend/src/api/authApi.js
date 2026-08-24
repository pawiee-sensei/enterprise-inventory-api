import axiosClient from "./axiosClient";

export const registerUser = async (formData) => {
  const response = await axiosClient.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axiosClient.post("/auth/login", { email, password });
  return response.data;
};



