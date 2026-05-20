import api from "../utils/api";

export const fetchAppointments = () => api.get("/appointments");
export const addAppointment = (data) => api.post("/appointments", data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const removeAppointment = (id) => api.delete(`/appointments/${id}`);