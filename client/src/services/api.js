import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const login = async (data) => {
    try {
      const response = await API.post("/auth/login", data);
      return response;
    } catch (error) {
      console.error("Login API error:", error.response?.data || error.message);
      throw error;
    }
  };

  export const fetchUserTasks = async (userId) => {
    if (!userId) {
      console.error(" Error: fetchUserTasks was called without a userId!");
      return;
    }
    return await API.get(`/tasks/user/${userId}`);
  };
export const fetchTasks = () => API.get("/tasks");
export const addTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const register = (data) => API.post("/auth/register", data);
export const fetchUsers = () => API.get("/users");