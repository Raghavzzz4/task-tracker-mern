import http from "./http";

export const registerUser = (data) => http.post("/auth/register", data);
export const loginUser = (data) => http.post("/auth/login", data);
