import api from "./api.js";

export const getAllUsers = (params = {}) =>
    api.get("/admin/users", { params });

export const updateUserRole = (id, role) =>
    api.put(`/admin/users/${id}/role`, { role });

export const updateUser = (id, data) =>
    api.put(`/admin/users/${id}`, data);

export const deleteUser = (id) =>
    api.delete(`/admin/users/${id}`);

export const createUser = (data) =>
    api.post("/admin/users", data);