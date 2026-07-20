import axios from "axios";

const TASK_API = "https://flowstack-j9is.onrender.com/api/tasks";
const AI_API = "https://flowstack-j9is.onrender.com/api/ai";

const getToken = () => {
  return localStorage.getItem("token");
};

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getTasks = async () => {
  const response = await axios.get(TASK_API, authHeader());
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(TASK_API, taskData, authHeader());
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(
    `${TASK_API}/${id}`,
    taskData,
    authHeader()
  );
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(
    `${TASK_API}/${id}`,
    authHeader()
  );
  return response.data;
};

// =======================
// AI Task Suggestions
// =======================

export const generateTaskSuggestions = async (taskTitle) => {
  const response = await axios.post(
    `${AI_API}/suggestions`,
    { taskTitle },
    authHeader()
  );

  return response.data;
};