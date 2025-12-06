// client/src/api/tasks.js
import http from "./http";

export const fetchTasks = (status) =>
  http.get("/tasks", { params: status ? { status } : {} });

export const createTask = (data) => http.post("/tasks", data);

export const updateTask = (id, data) => http.put(`/tasks/${id}`, data);

export const deleteTask = (id) => http.delete(`/tasks/${id}`);

export const toggleTask = (id) => http.patch(`/tasks/${id}/toggle`);
