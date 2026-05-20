import api from "../utils/api";

export const searchDoctorByEmail = (email) => api.get(`/connections/search?email=${email}`);
export const sendConnectionRequest = (doctorId) => api.post("/connections/request", { doctorId });
export const getConnections = () => api.get("/connections");
export const respondToConnection = (id, status) => api.put(`/connections/${id}/respond`, { status });