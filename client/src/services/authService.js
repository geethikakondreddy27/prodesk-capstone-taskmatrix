import axios from "axios";

const api = axios.create({
  baseURL: "https://flowstack-j9is.onrender.com/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/login", userData);
  return response.data;
};

export default api;